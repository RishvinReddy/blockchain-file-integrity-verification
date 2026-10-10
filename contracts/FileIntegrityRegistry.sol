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
    bytes32[] private registeredHashes;

    event FileRegistered(
        bytes32 indexed fileHash,
        address indexed registeredBy,
        uint256 timestamp
    );

    error InvalidHash();
    error HashAlreadyRegistered(bytes32 fileHash);

    function registerFile(bytes32 fileHash) external {
        if (fileHash == bytes32(0)) revert InvalidHash();
        if (records[fileHash].exists) revert HashAlreadyRegistered(fileHash);

        records[fileHash] = FileRecord({
            fileHash: fileHash,
            registeredBy: msg.sender,
            timestamp: block.timestamp,
            exists: true
        });
        registeredHashes.push(fileHash);

        emit FileRegistered(fileHash, msg.sender, block.timestamp);
    }

    function getRecord(bytes32 fileHash)
        external
        view
        returns (bytes32, address, uint256, bool)
    {
        FileRecord memory item = records[fileHash];
        return (item.fileHash, item.registeredBy, item.timestamp, item.exists);
    }

    function getRecordCount() external view returns (uint256) {
        return registeredHashes.length;
    }

    function getRecordAt(uint256 index)
        external
        view
        returns (bytes32, address, uint256, bool)
    {
        require(index < registeredHashes.length, "Index out of bounds");
        FileRecord memory item = records[registeredHashes[index]];
        return (item.fileHash, item.registeredBy, item.timestamp, item.exists);
    }
}
