// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title FileIntegrityRegistry
/// @notice Stores SHA-256 digests as immutable integrity references.
/// @dev File contents are never stored on-chain; only the digest and metadata are.
contract FileIntegrityRegistry {
    struct FileRecord {
        bytes32 fileHash;
        address registeredBy;
        uint256 timestamp;
        bool exists;
    }

    mapping(bytes32 => FileRecord) private records;

    function registerFile(bytes32 fileHash) external {
        require(fileHash != bytes32(0), "Invalid hash");
        require(!records[fileHash].exists, "Hash already registered");

        records[fileHash] = FileRecord({
            fileHash: fileHash,
            registeredBy: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
    }

    function getRecord(bytes32 fileHash)
        external
        view
        returns (bytes32, address, uint256, bool)
    {
        FileRecord memory item = records[fileHash];
        return (item.fileHash, item.registeredBy, item.timestamp, item.exists);
    }
}
