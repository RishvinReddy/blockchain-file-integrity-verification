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

app.listen(PORT, () => {
  console.log(`BlockProof running at http://localhost:${PORT}`);
  console.log(`RPC endpoint: ${RPC_URL}`);
});
