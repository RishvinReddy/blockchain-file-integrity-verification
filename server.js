"use strict";

const express = require("express");
const multer = require("multer");
const crypto = require("node:crypto");
const path = require("node:path");

const app = express();
const PORT = Number(process.env.PORT || 3000);
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

function sha256(buffer) {
  return crypto.createHash("sha256").update(buffer).digest("hex");
}

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
});
