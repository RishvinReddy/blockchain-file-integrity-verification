const fs = require("node:fs");
const path = require("node:path");
const hre = require("hardhat");

async function main() {
  const Registry = await hre.ethers.getContractFactory("FileIntegrityRegistry");
  const registry = await Registry.deploy();
  await registry.waitForDeployment();

  const address = await registry.getAddress();
  const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "FileIntegrityRegistry.sol", "FileIntegrityRegistry.json");
  const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));
  const deployment = {
    network: "localhost",
    chainId: 31337,
    address,
    abi: artifact.abi,
    deployedAt: new Date().toISOString()
  };

  const outDir = path.join(__dirname, "..", "deployment");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "local.json"), JSON.stringify(deployment, null, 2));
  console.log(`FileIntegrityRegistry deployed at ${address}`);
  console.log(`Deployment metadata written to deployment/local.json`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
