"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const source = fs.readFileSync(path.join(__dirname, "..", "contracts", "FileIntegrityRegistry.sol"), "utf8");

test("contract exposes registration and retrieval functions", () => {
  assert.match(source, /function registerFile\(bytes32 fileHash\)/);
  assert.match(source, /function getRecord\(bytes32 fileHash\)/);
  assert.match(source, /function getRecordCount\(\)/);
  assert.match(source, /function getRecordAt\(uint256 index\)/);
});

test("contract rejects zero and duplicate hashes", () => {
  assert.match(source, /if \(fileHash == bytes32\(0\)\) revert InvalidHash\(\)/);
  assert.match(source, /if \(records\[fileHash\]\.exists\) revert HashAlreadyRegistered\(fileHash\)/);
});

test("contract emits registration event and does not store file contents", () => {
  assert.match(source, /event FileRegistered/);
  assert.match(source, /mapping\(bytes32 => FileRecord\) private records/);
  assert.doesNotMatch(source, /string\s+fileContents/);
});
