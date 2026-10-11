"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

test("SHA-256 output is 64 lowercase hexadecimal characters", () => {
  const digest = sha256(Buffer.from("BlockProof sample"));
  assert.match(digest, /^[0-9a-f]{64}$/);
});

test("identical bytes produce identical hashes", () => {
  assert.equal(sha256(Buffer.from("same file")), sha256(Buffer.from("same file")));
});

test("a one-byte change produces a different hash", () => {
  assert.notEqual(sha256(Buffer.from("document-v1")), sha256(Buffer.from("document-v2")));
});

test("empty input is hashed deterministically", () => {
  assert.equal(
    sha256(Buffer.alloc(0)),
    "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
  );
});
