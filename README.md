# BlockProof — Blockchain-Based File Integrity Verification System

**Verify file integrity. Detect changes. Preserve a verifiable record of file fingerprints.**

> **Course:** Blockchain Technology Laboratory (Semester V, 2026–2027)  
> **Student:** Rishvin Reddy (`24WU0103006`, BIC - TIGERS)  
> **Faculty Guide:** Dr. Rajkumar Kalimuthu  
> **Designation:** Associate Professor & Head of the Department (HoD)  
> **Institution:** School of Technology, Woxsen University  

BlockProof is a blockchain-based application that helps determine whether a file's contents have changed since its fingerprint was registered. It generates a SHA-256 cryptographic hash for a file and records that hash on a local Ethereum-compatible blockchain using a Solidity smart contract.

When the file needs to be verified, BlockProof calculates its SHA-256 hash again and checks it against the previously registered fingerprint. If the content is unchanged and a matching record exists, the application reports a match. If the content differs, the hash will normally differ as well, and the application reports that no matching record was found.

The application demonstrates how cryptographic hashing, smart contracts, and blockchain interaction can work together to support file integrity verification.

---

## Table of Contents

- [Project Overview](#project-overview)
- [The Problem](#the-problem)
- [Our Solution](#our-solution)
- [Project Objectives](#project-objectives)
- [Key Features](#key-features)
- [How BlockProof Works](#how-blockproof-works)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Three Blockchain Laboratory Concepts](#three-blockchain-laboratory-concepts)
- [Getting Started](#getting-started)
- [Running the Application](#running-the-application)
- [Using BlockProof](#using-blockproof)
- [Application API](#application-api)
- [Smart Contract](#smart-contract)
- [Testing and Validation](#testing-and-validation)
- [Security Considerations](#security-considerations)
- [Project Structure](#project-structure)
- [Troubleshooting](#troubleshooting)
- [Limitations](#limitations)
- [Future Enhancements](#future-enhancements)
- [Academic Information](#academic-information)
- [License](#license)
- [Author](#author)

---

## Project Overview

| Attribute | Details |
|---|---|
| Project Name | BlockProof |
| Project Type | Blockchain-Based File Integrity Verification System |
| Academic Course | Blockchain Technology Laboratory |
| Semester | V |
| Programme | B.Tech Computer Science and Engineering |
| Specialization | Blockchain, IoT and Cybersecurity |
| Student | Rishvin Reddy (Roll No: 24WU0103006) |
| Faculty Guide | Dr. Rajkumar Kalimuthu |
| Designation | Associate Professor & Head of the Department (HoD) |
| Institution | Woxsen University, School of Technology |
| Blockchain Platform | Local Ethereum-compatible development network |
| Smart Contract Language | Solidity |
| Blockchain Development Tool | Hardhat |
| Cryptographic Algorithm | SHA-256 |
| Blockchain Interaction | Web3.js |
| Backend | Node.js |
| Academic Year | 2026–2027 |

### What does BlockProof do?

BlockProof creates a digital fingerprint for a file and registers that fingerprint on a blockchain.

For example, consider a document containing:

`BlockProof demonstration version 1`

BlockProof calculates a SHA-256 digest for that content and records it through a smart contract.

Later, the same file can be submitted for verification. If its contents are identical, the calculated digest matches the registered digest.

If someone changes the document to:

`BlockProof demonstration version 2`

the calculated digest will differ, so the modified file will not match the original registration.

**Important:** BlockProof verifies content equality against a registered fingerprint. It does not independently establish who created the file, whether the original registration was truthful, or whether a modification was malicious.

---

## The Problem

Digital files can be modified, intentionally or accidentally, without making every change immediately obvious.

Examples include:

- A document being edited after approval.
- A report being modified before submission.
- A configuration file being changed after its original version was recorded.
- A downloaded file differing from the version against which it should be checked.
- Two files having the same filename but different contents.

A filename, timestamp, or file extension cannot reliably establish that two files contain identical data.

A mechanism is therefore needed to calculate a reproducible fingerprint of file contents and compare it against a previously recorded reference.

### Why use blockchain?

A conventional application can calculate and store file hashes in a database. However, if the same administrator can freely modify both the files and their reference records, the records may be altered without an independently verifiable history.

A blockchain-based registry provides a different approach: registered fingerprints are recorded as blockchain transactions and maintained in the chain's ledger.

In this educational implementation, the registry runs on a local Hardhat development network. This demonstrates the architecture and workflow without requiring a public blockchain or cryptocurrency.

Blockchain does not automatically guarantee that every registered fingerprint is trustworthy. Trust still depends on how the registration is performed, who controls the system, and the security of the surrounding infrastructure.

---

## Our Solution

BlockProof combines cryptographic hashing with a Solidity smart contract.

The application follows five main steps:

1. **Receive the file:** The user selects a file through the web interface.
2. **Calculate its fingerprint:** The Node.js backend computes the file's SHA-256 digest.
3. **Register the fingerprint:** The backend uses Web3.js to submit the digest to the deployed smart contract.
4. **Verify the file:** When the file is submitted again, its fingerprint is calculated and checked against the registry.
5. **Display the result:** The application indicates whether a matching registered fingerprint was found.

The original file is processed in memory. Its contents are not stored on the blockchain or persisted to disk by the application.

Only the file's fingerprint and the registry information maintained by the smart contract are used for the on-chain verification workflow.

### Design principle

**Store the fingerprint on-chain, not the file itself.**

This keeps the demonstration focused on integrity verification while avoiding the need to store potentially large files directly on a blockchain.

---

## Project Objectives

The primary objectives of BlockProof are:

- To understand SHA-256 cryptographic hashing.
- To generate file fingerprints using Node.js.
- To develop a Solidity smart contract for file-hash registration and retrieval.
- To interact with a blockchain through Web3.js.
- To deploy and execute a smart contract using a local Hardhat network.
- To verify file contents against previously registered fingerprints.
- To demonstrate how blockchain records can support integrity verification.
- To integrate concepts from multiple Blockchain Technology Laboratory exercises into one application.
- To understand the limitations of hashing and blockchain-based verification.

---

## Key Features

### 1. SHA-256 File Fingerprinting

BlockProof calculates a SHA-256 digest from the uploaded file's contents.

SHA-256 produces a 256-bit digest, conventionally represented as a 64-character hexadecimal string.

The same input produces the same digest, while even a small content change will normally produce a different digest.

### 2. Blockchain-Based Registration

The application registers a file's fingerprint through a Solidity smart contract deployed on a local Ethereum-compatible network.

The transaction is executed using Web3.js.

### 3. File Integrity Verification

Users can submit a file for verification.

BlockProof calculates its current fingerprint and checks whether a corresponding record exists in the registry.

### 4. Registration History

The application provides access to recent registry records through its records interface and API.

The API exposes up to the 100 most recent registry records.

### 5. Web-Based Interface

Users can interact with the application through a browser rather than calling backend functions manually.

The interface supports the file-registration and verification workflow.

### 6. Local Blockchain Execution

The project uses Hardhat to run a local Ethereum-compatible development network.

This allows smart-contract development and testing without deploying the demonstration contract to a public network.

### 7. Automated Tests

The project includes tests for SHA-256 behavior and static checks for expected smart-contract functions and guardrails.

These tests provide useful validation but do not replace a complete blockchain integration test.

---

## How BlockProof Works

### File Registration Workflow

1. The user selects a file.
2. The browser sends the file to the Node.js backend.
3. The backend calculates its SHA-256 digest.
4. Web3.js communicates with the local blockchain node.
5. The smart contract registers the digest.
6. The application returns the registration result to the user.

### File Verification Workflow

1. The user submits a file for verification.
2. The backend calculates its SHA-256 digest again.
3. The application checks the digest against the blockchain registry.
4. A matching record indicates that the submitted content matches a registered fingerprint.
5. If no matching record exists, the application reports that no matching record was found.

### Example

| Operation | File content | Expected result |
|---|---|---|
| Register | `BlockProof version 1` | Fingerprint registered |
| Verify | `BlockProof version 1` | Match |
| Verify | `BlockProof version 2` | No matching record |
| Verify | Another file with identical bytes | Match, if the fingerprint is registered |

The final example illustrates an important property: the fingerprint depends on file contents, not the filename.

Two files with different names can produce the same SHA-256 digest if their contents are identical.

---

## System Architecture

BlockProof uses a browser-based frontend, a Node.js backend, a cryptographic hashing component, and a Solidity smart contract.

```text
┌──────────────────────────────────────────┐
│               USER / BROWSER             │
│                                          │
│       Register File / Verify File        │
└────────────────────┬─────────────────────┘
                     │
                     │ HTTP Request
                     ▼
┌──────────────────────────────────────────┐
│            NODE.JS BACKEND               │
│                                          │
│  Express Server                          │
│  Upload Handling                         │
│  API Endpoints                           │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│          SHA-256 HASH GENERATION         │
│                                          │
│  Read File Contents                      │
│  Calculate Cryptographic Digest          │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│             WEB3.JS LAYER                │
│                                          │
│  JSON-RPC Communication                  │
│  Smart Contract Interaction              │
└────────────────────┬─────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────┐
│       LOCAL HARDHAT BLOCKCHAIN           │
│                                          │
│       FileIntegrityRegistry.sol          │
│                                          │
│  Register and Retrieve File Hashes       │
└──────────────────────────────────────────┘
```

### Architecture Components

| Component | Responsibility |
|---|---|
| Browser frontend | Accepts user input and displays results |
| Node.js | Runs the application backend |
| Express | Handles HTTP requests and API routes |
| Node.js `crypto` | Generates SHA-256 fingerprints |
| Web3.js | Communicates with the smart contract |
| Solidity | Defines the file-integrity registry logic |
| Hardhat | Runs the local blockchain and supports contract development |
| Local JSON-RPC endpoint | Connects the backend to the development network |

### Data Storage

| Data | Location |
|---|---|
| Original uploaded file | Processed in memory |
| SHA-256 fingerprint | Registered through the smart contract |
| Blockchain transaction information | Available through the blockchain and application response |
| Contract address and ABI | Generated locally in `deployment/local.json` |
| Recent registration records | Maintained by the smart contract and exposed through the application |

The deployment metadata file is generated during deployment and is intentionally excluded from the distributed project archive.

---

## Technology Stack

### Backend

**Node.js**

Runs the backend application and processes incoming requests.

**Express**

Provides HTTP routes for file hashing, registration, verification, and status checks.

**Node.js Crypto Module**

Calculates SHA-256 digests from file contents.

### Blockchain

**Solidity**

Defines the smart contract responsible for registering and retrieving file fingerprints.

**Web3.js**

Connects the backend to the local blockchain and enables smart-contract interaction.

**Hardhat**

Provides the local development blockchain, contract compilation, deployment workflow, and development accounts.

### Frontend

**HTML**

Defines the web interface structure.

**CSS**

Provides the visual styling.

**JavaScript**

Handles browser-side interaction with the backend API.

### Testing

**Node.js Test Runner**

Executes the project's automated tests through the `npm test` command.

---

## Three Blockchain Laboratory Concepts

BlockProof integrates three concepts from the Blockchain Technology Laboratory into one working application.

### Experiment 1: SHA-256 Hashing Using Node.js

The application calculates SHA-256 fingerprints using Node.js's built-in `crypto` module.

This demonstrates:

- Cryptographic digest generation.
- Deterministic hashing.
- Digest-length validation.
- Detection of changes through digest comparison.

### Experiment 2: Solidity Smart Contracts

The `FileIntegrityRegistry.sol` contract provides the blockchain-based registry used by the application.

This demonstrates:

- Smart-contract development.
- Contract compilation.
- Contract deployment.
- Recording information on a blockchain.
- Retrieving registered information.

### Experiment 3: Web3.js Blockchain Interaction

Web3.js connects the backend to the local Ethereum-compatible network through JSON-RPC.

This demonstrates:

- Blockchain connectivity.
- Contract initialization.
- Smart-contract function calls.
- Transaction submission.
- Reading registry information.

### Integration Summary

| Concept | Implementation | Purpose |
|---|---|---|
| Cryptographic hashing | Node.js `crypto` | Generate file fingerprints |
| Smart contracts | Solidity | Register and retrieve fingerprints |
| Blockchain interaction | Web3.js | Communicate with the registry |
| Local blockchain | Hardhat | Execute the demonstration network |

The application brings these concepts together into a single file-integrity verification workflow.

---

## Getting Started

### Prerequisites

Install the following tools before running the application.

| Requirement | Purpose |
|---|---|
| Node.js 18 or newer | Runs the backend and development scripts |
| npm | Installs project dependencies and runs scripts |
| Terminal | Executes commands |
| Internet connection | Required for the initial dependency installation |

A MetaMask account is not required for the documented local demonstration. The application uses the first unlocked account supplied by the local Hardhat development network.

> **Security warning:** Hardhat development accounts are intended for local testing. Never use their private keys or pre-funded accounts on a public blockchain.

### Step 1: Clone the Repository

Replace `<your-github-username>` with your actual GitHub username.

```bash
git clone https://github.com/<your-github-username>/blockchain-file-integrity-verification.git
```

Move into the project directory:

```bash
cd blockchain-file-integrity-verification
```

If you have already downloaded the project, open a terminal in the directory containing `package.json`.

### Step 2: Install Dependencies

Run:

```bash
npm install
```

Wait for the installation to finish before continuing.

### Step 3: Start the Local Blockchain

In the project directory, run:

```bash
npm run chain
```

Keep this terminal open while using the application.

The local Hardhat network uses chain ID `31337` and displays development accounts in the terminal.

### Step 4: Compile the Smart Contract

Open a second terminal and navigate to the same project directory.

Run:

```bash
npm run compile
```

This compiles the Solidity contract.

### Step 5: Deploy the Smart Contract

In the second terminal, run:

```bash
npm run deploy:local
```

The deployment script deploys the registry to the local network and writes its address and ABI to:

```text
deployment/local.json
```

This file is generated locally and is intentionally excluded from the project archive.

Keep the blockchain terminal running. Restarting the local chain creates a fresh development-chain state, so you must deploy the contract again before using the application.

### Step 6: Start the Application

From the project directory, run:

```bash
npm start
```

Open the application in your browser:

**http://localhost:3000**

The application depends on the local blockchain and the generated deployment metadata. If either is unavailable, resolve that issue before attempting registration or verification.

---

## Running the Application

### Recommended Terminal Layout

Run the following commands from the project root.

**Terminal 1 — Local blockchain**

```bash
npm run chain
```

**Terminal 2 — Compilation and deployment**

```bash
npm run compile
npm run deploy:local
```

**Terminal 3 — Application server**

```bash
npm start
```

Install dependencies before starting these processes:

```bash
npm install
```

Keep all three processes running during the demonstration.

---

## Using BlockProof

### Demonstration: Register and Verify a File

This procedure demonstrates both successful verification and change detection.

#### Step 1: Create a Test File

Create a text file named:

```text
sample.txt
```

Add the following content:

```text
BlockProof demonstration version 1
```

Save the file.

#### Step 2: Register the File

1. Open the BlockProof web application.
2. Select the test file.
3. Choose the registration action.
4. Wait for the registration result.
5. Record the displayed SHA-256 digest and transaction hash, if provided by the interface.

The fingerprint is registered through the smart contract on the local blockchain.

#### Step 3: Verify the Original File

Submit the unchanged `sample.txt` file for verification.

**Expected result:** A matching registered fingerprint is found.

#### Step 4: Modify the File

Change its contents to:

```text
BlockProof demonstration version 2
```

Save the changes.

#### Step 5: Verify the Modified File

Submit the modified file.

**Expected result:** No matching record is found for its new fingerprint, assuming that the modified content has not been registered separately.

#### Step 6: Review the Registry

Refresh the registration table or retrieve the recent records through the API.

The original registration should remain in the local blockchain's registry.

### Expected Demonstration Results

| Test | Expected outcome |
|---|---|
| Register a new file | Registration submitted successfully |
| Verify the unchanged file | Match |
| Verify a modified file | No matching record |
| Verify another file with identical contents | Match, if that fingerprint is registered |
| Retrieve recent registrations | Registry records returned, subject to endpoint availability |

These are expected outcomes based on the application's intended workflow, not a claim that every environment has already been tested end to end.

---

## Application API

BlockProof exposes HTTP endpoints for checking the application status, generating fingerprints, registering files, verifying files, and retrieving registry records.

The routes below describe the project's documented API.

### 1. Check Application Status

**Endpoint**

```http
GET /api/status
```

**Purpose**

Checks application status, including the JSON-RPC connection and deployment status.

**Example**

```bash
curl http://localhost:3000/api/status
```

Inspect the returned JSON to determine whether the required services and deployment information are available.

### 2. Calculate a File Hash

**Endpoint**

```http
POST /api/hash
```

**Request type:** `multipart/form-data`

**Required field:** `file`

**Purpose**

Calculates the SHA-256 digest of an uploaded file.

**Example**

```bash
curl -X POST \
  -F "file=@sample.txt" \
  http://localhost:3000/api/hash
```

The endpoint returns the calculated digest.

### 3. Register a File

**Endpoint**

```http
POST /api/register
```

**Request type:** `multipart/form-data`

**Required field:** `file`

**Purpose**

Calculates the uploaded file's SHA-256 digest and registers it through the smart contract.

**Example**

```bash
curl -X POST \
  -F "file=@sample.txt" \
  http://localhost:3000/api/register
```

Inspect the response for the registration result and any transaction information returned by the application.

### 4. Verify a File

**Endpoint**

```http
POST /api/verify
```

**Request type:** `multipart/form-data`

**Required field:** `file`

**Purpose**

Calculates the uploaded file's digest and checks the registry for a matching fingerprint.

**Example**

```bash
curl -X POST \
  -F "file=@sample.txt" \
  http://localhost:3000/api/verify
```

The application determines whether a matching registered fingerprint exists.

### 5. Retrieve Recent Records

**Endpoint**

```http
GET /api/records
```

**Purpose**

Retrieves up to the 100 most recent registry records.

**Example**

```bash
curl http://localhost:3000/api/records
```

The endpoint depends on the local blockchain connection and successful contract deployment.

### API Summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/status` | Check application, JSON-RPC, and deployment status |
| POST | `/api/hash` | Calculate a file's SHA-256 digest |
| POST | `/api/register` | Calculate and register a file fingerprint |
| POST | `/api/verify` | Check a fingerprint against the registry |
| GET | `/api/records` | Retrieve recent registry records |

**Note:** These examples illustrate request formats. Exact response fields, status codes, and error formats should be confirmed from `server.js` and the application's actual responses.

---

## Smart Contract

The project's Solidity contract is:

```text
contracts/FileIntegrityRegistry.sol
```

The contract implements the blockchain registry used by BlockProof.

Its role is to register file fingerprints and make registry information available for later verification.

### Why Use a Smart Contract?

A smart contract defines how registry operations are performed on the blockchain.

Instead of relying solely on a conventional application database, BlockProof uses a deployed contract as the registry for file fingerprints.

The backend communicates with the contract through Web3.js.

### Contract Lifecycle

1. Write the Solidity contract.
2. Compile it using Hardhat.
3. Start the local development blockchain.
4. Deploy the contract.
5. Save the generated contract address and ABI.
6. Initialize the application using the generated deployment metadata.
7. Register and verify file fingerprints.

### Deployment Metadata

The deployment script writes the generated address and ABI to:

```text
deployment/local.json
```

The file is generated for the local development environment.

If the blockchain is restarted or the contract is redeployed, ensure that the application uses the corresponding deployment metadata.

The contract's exact function signatures and storage layout should be read from `FileIntegrityRegistry.sol`; they are not duplicated here to avoid documenting an interface that may differ from the implementation.

---

## Testing and Validation

BlockProof includes an automated test suite.

Run the tests from the project root:

```bash
npm test
```

### Existing Test Coverage

The documented test suite includes checks for SHA-256 behavior and static checks against the smart-contract source.

| Test area | What it checks |
|---|---|
| Digest format | SHA-256 output has the expected hexadecimal representation |
| Repeatability | Identical content produces the same digest |
| Changed-content detection | Different content produces a different digest in the tested cases |
| Empty-file digest | Hashing an empty file produces the expected SHA-256 digest |
| Contract source | Expected functions and guardrails are present in the contract source |

### Important Testing Distinction

The existing tests do not replace a full end-to-end integration test against a running blockchain.

For a complete practical demonstration, verify all of the following:

- [ ] Dependencies install successfully.
- [ ] The local Hardhat node starts.
- [ ] The smart contract compiles.
- [ ] Contract deployment succeeds.
- [ ] The deployment metadata is generated.
- [ ] The backend starts successfully.
- [ ] The status endpoint reports the expected service state.
- [ ] File hashing works through the HTTP API.
- [ ] File registration works against the deployed contract.
- [ ] Verification of an unchanged file finds a match.
- [ ] Verification of a modified file finds no matching record.
- [ ] Recent registration records can be retrieved.

Only mark these checks as passed after executing them in the target environment.

---

## Security Considerations

BlockProof demonstrates several security concepts, but it should not be treated as a production-grade digital forensics or evidence-management platform.

### 1. SHA-256 Fingerprinting

SHA-256 is used to generate a fingerprint of file contents.

A digest match provides evidence that the submitted contents match the contents represented by the registered digest, subject to the security properties of SHA-256 and the integrity of the verification process.

It does not prove the identity of the file's author.

### 2. File Storage

Uploaded files are processed in memory only.

The application does not persist uploaded file contents to disk or store the original files on-chain.

The documented upload-size limit is 10 MB.

### 3. Blockchain Records

The local blockchain maintains registry records according to the deployed contract's behavior.

Blockchain storage does not automatically establish that the original registration was accurate or authorized.

### 4. Development Accounts

The application uses a development account supplied by the local Hardhat network.

These accounts are for testing only.

Do not reuse their private keys or pre-funded balances on a public blockchain.

### 5. Local JSON-RPC Endpoint

The local blockchain RPC endpoint is intended for development.

Do not expose the development node to an untrusted network or the public internet.

### 6. File Upload Validation

File-upload endpoints must be treated as untrusted input.

The documented implementation limits uploads to 10 MB and processes uploaded content in memory. The upload handler should continue to enforce size limits and appropriate request validation.

### 7. Confidentiality

A file's SHA-256 digest does not normally reveal its complete contents directly, but hashes of predictable or publicly known files can be compared against known values.

Do not assume that publishing a hash makes all information about a file confidential.

### 8. Integrity Is Not Authenticity

BlockProof checks for a matching registered digest.

It does not independently establish:

- Who created the file.
- Who authorized its registration.
- Whether the original file was trustworthy.
- Whether a modification was intentional.
- Whether the person submitting a file has permission to access it.

### 9. Local Network Limitations

The demonstration uses a local Hardhat chain. Its records are not automatically available to other users or computers.

A fresh development-chain instance has a separate blockchain state and requires a corresponding contract deployment.

---

## Project Structure

The principal project files are organized as follows:

```text
blockchain-file-integrity-verification/
│
├── contracts/
│   └── FileIntegrityRegistry.sol
│
├── scripts/
│   └── deploy.js
│
├── test/
│   ├── hash.test.js
│   └── contract-source.test.js
│
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
│
├── server.js
├── hardhat.config.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md
```

### Directory Responsibilities

| File or directory | Responsibility |
|---|---|
| `contracts/` | Solidity smart contracts |
| `scripts/` | Contract deployment scripts |
| `test/` | Automated tests |
| `public/` | Browser interface and frontend assets |
| `server.js` | Backend application and API endpoints |
| `hardhat.config.js` | Hardhat development configuration |
| `package.json` | Dependencies and npm scripts |
| `package-lock.json` | Records the resolved npm dependency tree |
| `.gitignore` | Excludes files that should not be committed |
| `README.md` | Project documentation |

The generated `deployment/local.json` file is created during local deployment and is intentionally excluded from the distributed project archive.

If your actual repository differs from this structure, update this section to reflect the committed files.

---

## Troubleshooting

### Problem: `npm install` fails

**Possible causes**

- Network connectivity issues.
- An incompatible Node.js version.
- Dependency installation errors.

**What to do**

Check the installed versions:

```bash
node --version
npm --version
```

Ensure Node.js 18 or newer is installed, then retry:

```bash
npm install
```

### Problem: The application cannot connect to the blockchain

**Possible causes**

- The Hardhat node is not running.
- The RPC endpoint is unavailable.
- The local network was restarted.
- Deployment metadata is missing or outdated.

**What to do**

1. Confirm that `npm run chain` is still running.
2. Confirm that the configured RPC endpoint matches the local node.
3. Run the deployment script again if the local chain was reset.
4. Check the application status endpoint.

```bash
curl http://localhost:3000/api/status
```

### Problem: Contract deployment fails

**What to do**

1. Start the local blockchain.
2. Confirm that compilation succeeds.
3. Check the deployment command and terminal output.
4. Ensure that the deployment script targets the running local network.

```bash
npm run compile
npm run deploy:local
```

### Problem: File verification reports no match

**Possible causes**

- The submitted file has changed.
- The file was never registered.
- The local blockchain was reset.
- The contract was redeployed to a fresh chain.
- The application is using outdated deployment metadata.

**What to do**

1. Check that the file's contents are unchanged.
2. Confirm that the original fingerprint is present in the active registry.
3. Verify that the application is connected to the correct local chain.
4. Re-register the file if a new local blockchain was intentionally created.

### Problem: Port 3000 is already in use

Another application may already be using the port.

Stop the conflicting process or configure the application to use a different port, provided the server supports that configuration.

---

## Limitations

The current implementation is an educational demonstration with a deliberately limited scope.

- It uses a local development blockchain rather than a public production network.
- It does not provide a production identity or access-control system.
- It does not prove file authorship or establish the truthfulness of an original registration.
- It does not establish whether a detected change was malicious.
- It processes uploaded files in memory and imposes a 10 MB upload limit.
- It does not store the original file for later recovery.
- The documented automated tests do not constitute full blockchain integration testing.
- Local blockchain records are tied to the local chain state.
- It is not a complete digital forensics evidence-management solution.

These limitations define the project's current scope and identify areas for future development.

---

## Future Enhancements

Potential improvements include the following.

### 1. Public Testnet Deployment

Deploy the registry to an Ethereum-compatible public testnet to demonstrate contract interaction beyond a local development environment.

### 2. User Authentication

Introduce authentication and authorization to control who can register or verify files.

### 3. File Metadata

Record additional metadata, such as a descriptive label or registration timestamp, where appropriate and without unnecessarily exposing sensitive information.

### 4. Stronger Automated Integration Tests

Add tests that start or connect to a local blockchain, deploy the contract, register a file, and verify both matching and modified files.

### 5. Improved Error Handling

Provide clearer messages for unavailable blockchain nodes, missing deployment metadata, rejected transactions, invalid uploads, and failed verification requests.

### 6. Registration Receipts

Provide a structured registration receipt containing relevant information, such as the digest, transaction hash, contract address, and registration result, where available.

### 7. Multiple File Support

Extend the interface to support batch registration and verification while preserving upload limits and resource controls.

### 8. Advanced Evidence Management

For a larger digital-forensics application, add controlled evidence acquisition, audit trails, identity verification, access control, and documented chain-of-custody procedures.

These are proposed enhancements, not claims about functionality already implemented in the current version.

---

## Academic Information

**Project:** BlockProof — Blockchain-Based File Integrity Verification System

**Course:** Blockchain Technology Laboratory

**Semester:** V

**Academic Year:** 2026–2027

**Student:** Rishvin Reddy

**Roll Number:** 24WU0103006

**Section:** BIC - TIGERS

**Programme:** B.Tech Computer Science and Engineering

**Specialization:** Blockchain, IoT and Cybersecurity

**Institution:** Woxsen University, School of Technology

**Faculty:** Dr. Rajkumar Kalimuthu

**Designation:** Associate Professor & Head of the Department (HoD)

### Academic Purpose

This project demonstrates the integration of cryptographic hashing, Solidity smart contracts, and Web3.js blockchain interaction in a file-integrity verification application.

It is intended for educational use as part of the Blockchain Technology Laboratory.

---

## License

No license has been specified for this project.

Unless a license is added to the repository, do not assume that others have permission to redistribute or modify the code under an open-source license.

If you intend to publish the project as open source, choose an appropriate license and add a corresponding `LICENSE` file.

---

## Author

**Rishvin Reddy**

B.Tech Computer Science and Engineering  
Specialization in Blockchain, IoT and Cybersecurity  
Woxsen University, School of Technology

**Project:** BlockProof

**Repository:** `blockchain-file-integrity-verification`

---

## Final Note

BlockProof demonstrates a practical application of three foundational blockchain-development concepts:

- Cryptographic hashing with SHA-256.
- Smart-contract development using Solidity.
- Blockchain interaction through Web3.js.

By combining these components, the project illustrates how a blockchain registry can provide a reference for checking whether file contents match a previously registered fingerprint.

**The core principle is simple: calculate the fingerprint, register it, and verify it again when needed.**
