"use strict";

const express = require("express");
const multer = require("multer");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { Web3 } = require("web3");

const app = express();
const PORT = Number(process.env.PORT || 3000);
const RPC_URL = process.env.RPC_URL || "http://127.0.0.1:8545";
const DEPLOYMENT_FILE = path.join(__dirname, "deployment", "local.json");
const MAX_FILE_BYTES = 10 * 1024 * 1024;

app.disable("x-powered-by");
app.use(express.json({ limit: "16kb" }));
app.use(express.static(path.join(__dirname, "public")));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_BYTES, files: 1 },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname || file.originalname.length > 180) {
      return cb(new Error("Filename must be between 1 and 180 characters."));
    }
    cb(null, true);
  }
});

const web3 = new Web3(RPC_URL);

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

function asBytes32(hexDigest) {
  if (!/^[0-9a-f]{64}$/i.test(hexDigest)) {
    const err = new Error("Invalid SHA-256 digest.");
    err.status = 400;
    throw err;
  }
  return `0x${hexDigest.toLowerCase()}`;
}

function loadContract() {
  if (!fs.existsSync(DEPLOYMENT_FILE)) {
    const err = new Error("Contract deployment not found. Run npm run compile and npm run deploy:local first.");
    err.status = 503;
    throw err;
  }
  const deployment = JSON.parse(fs.readFileSync(DEPLOYMENT_FILE, "utf8"));
  if (!deployment.address || !Array.isArray(deployment.abi)) {
    const err = new Error("Deployment metadata is invalid. Redeploy the contract.");
    err.status = 503;
    throw err;
  }
  return new web3.eth.Contract(deployment.abi, deployment.address);
}

async function getSender() {
  const accounts = await web3.eth.getAccounts();
  if (!accounts.length) {
    const err = new Error("No unlocked account available from the local RPC node.");
    err.status = 503;
    throw err;
  }
  return accounts[0];
}

app.get("/api/status", async (_req, res) => {
  try {
    const chainId = Number(await web3.eth.getChainId());
    const accounts = await web3.eth.getAccounts();
    const deployed = fs.existsSync(DEPLOYMENT_FILE);
    res.json({
      ok: true,
      service: "BlockProof",
      chainId,
      expectedChainId: 31337,
      rpcConnected: true,
      accountAvailable: accounts.length > 0,
      contractDeployed: deployed
    });
  } catch (_error) {
    res.status(503).json({ ok: false, service: "BlockProof", rpcConnected: false, contractDeployed: fs.existsSync(DEPLOYMENT_FILE) });
  }
});

app.post("/api/hash", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "Select a file first." });
  res.json({
    filename: path.basename(req.file.originalname),
    sizeBytes: req.file.size,
    algorithm: "SHA-256",
    hash: sha256(req.file.buffer)
  });
});

app.post("/api/register", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Select a file first." });
    const digest = sha256(req.file.buffer);
    const contract = loadContract();
    const sender = await getSender();
    const receipt = await contract.methods.registerFile(asBytes32(digest)).send({ from: sender, gas: 250000 });
    res.status(201).json({
      result: "registered",
      filename: path.basename(req.file.originalname),
      sizeBytes: req.file.size,
      algorithm: "SHA-256",
      hash: digest,
      registeredBy: sender,
      transactionHash: receipt.transactionHash,
      blockNumber: Number(receipt.blockNumber)
    });
  } catch (error) { next(error); }
});

app.post("/api/verify", upload.single("file"), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Select a file first." });
    const digest = sha256(req.file.buffer);
    const contract = loadContract();
    const result = await contract.methods.getRecord(asBytes32(digest)).call();
    const exists = Boolean(result[3]);
    res.json({
      result: exists ? "match" : "not_registered",
      filename: path.basename(req.file.originalname),
      sizeBytes: req.file.size,
      algorithm: "SHA-256",
      hash: digest,
      registered: exists,
      registeredBy: exists ? result[1] : null,
      timestamp: exists ? String(result[2]) : null,
      explanation: exists
        ? "The file's SHA-256 digest matches a record in the registry."
        : "No record exists for this file's SHA-256 digest. It may be new or different from a registered file."
    });
  } catch (error) { next(error); }
});

app.get("/api/records", async (_req, res, next) => {
  try {
    const contract = loadContract();
    const count = Number(await contract.methods.getRecordCount().call());
    const records = [];
    // Bound the response to keep this demo endpoint predictable.
    const start = Math.max(0, count - 100);
    for (let i = count - 1; i >= start; i--) {
      const item = await contract.methods.getRecordAt(i).call();
      records.push({
        hash: String(item[0]).replace(/^0x/, ""),
        registeredBy: item[1],
        timestamp: String(item[2]),
        exists: Boolean(item[3])
      });
    }
    res.json({ total: count, records });
  } catch (error) { next(error); }
});

app.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
    return res.status(status).json({ error: error.code === "LIMIT_FILE_SIZE" ? "File exceeds the 10 MB limit." : "Invalid upload." });
  }
  const status = Number(error.status) || 500;
  res.status(status).json({ error: status >= 500 ? error.message : error.message });
});

app.listen(PORT, () => {
  console.log(`BlockProof running at http://localhost:${PORT}`);
  console.log(`RPC endpoint: ${RPC_URL}`);
});
