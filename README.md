# BlockProof — Blockchain-Based File Integrity Verification

**Course:** Blockchain Technology Laboratory, Semester V  
**Student:** Rishvin Reddy  
**Programme:** B.Tech Computer Science and Engineering  
**Specialization:** Blockchain, IoT and Cybersecurity  
**Faculty:** Asst. Prof. Dr. Rajkumar Kalimuthu  
**Academic year:** 2026–2027

## What it does

BlockProof computes a SHA-256 digest of a file in a Node.js server, registers the digest in a Solidity smart contract on a local Ethereum-compatible development network, and checks whether a later file has a matching registered digest. The file itself is not stored on-chain or persisted by the server.

## Three lab concepts integrated

1. **SHA-256 hashing (Node.js `crypto`)** — file fingerprint generation.
2. **Solidity smart contract** — registration and retrieval of hash records.
3. **Web3.js** — server-side contract calls against the local JSON-RPC endpoint.

Hardhat is the local development-chain tool used to execute the contract.

## Requirements

- Node.js 18 or newer and npm
- Internet access for the first `npm install`
- A terminal
- No MetaMask account is needed; the demo uses the first unlocked local Hardhat account.

## Run locally

Open a terminal in this `project` folder.

**Terminal 1 — install dependencies and start the local chain**
```bash
npm install
npm run chain
```
Keep this terminal running. The Hardhat node uses chain ID `31337` and prints development accounts.

**Terminal 2 — compile and deploy**
```bash
cd path/to/BlockProof_Submission/project
npm install
npm run compile
npm run deploy:local
```
The deploy script writes the deployed address and ABI to `deployment/local.json` (this generated local file is intentionally excluded from the ZIP).

**Terminal 3 — start the application**
```bash
cd path/to/BlockProof_Submission/project
npm start
```
Open `http://localhost:3000`.

## Run automated tests

```bash
npm test
```

The Node.js test suite covers SHA-256 digest format, repeatability, changed-content detection, the empty-file digest, and static checks for the contract's expected functions and guardrails. It does not replace running a full EVM integration test after installing dependencies.

## Demonstration procedure

1. Create a text file containing `BlockProof demo version 1`.
2. Register it in the app; save the displayed digest and transaction hash.
3. Verify the unchanged file; expect **MATCH**.
4. Change the text to `BlockProof demo version 2`.
5. Verify the changed file; expect **NO MATCHING RECORD**.
6. Refresh the registrations table to show the on-chain record.

## API

- `GET /api/status` — JSON-RPC and deployment status.
- `POST /api/hash` — multipart upload field `file`; returns SHA-256 digest.
- `POST /api/register` — multipart upload field `file`; hashes and registers it.
- `POST /api/verify` — multipart upload field `file`; checks the digest on-chain.
- `GET /api/records` — returns up to the most recent 100 registry records.

## Security and scope

- Uploads are held in memory only; maximum size is 10 MB.
- The application does not store file contents on disk.
- This is a local educational demo, not a production evidence-management system.
- Do not expose the development RPC node or use its pre-funded accounts on a public network.
- SHA-256 matching establishes content equality with a recorded digest; it does not establish who authored a file or whether the original registration was truthful.
- A changed file is reported as not registered. The system cannot infer intent or prove that a modification was malicious.

## Project structure

```text
project/
├── contracts/FileIntegrityRegistry.sol
├── scripts/deploy.js
├── test/hash.test.js
├── test/contract-source.test.js
├── public/index.html
├── public/styles.css
├── public/app.js
├── server.js
├── hardhat.config.js
├── package.json
└── README.md
```
