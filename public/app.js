"use strict";

const $ = (id) => document.getElementById(id);
const registerFile = $("register-file");
const verifyFile = $("verify-file");
const registerButton = $("register-btn");
const verifyButton = $("verify-btn");

registerFile.addEventListener("change", () => { registerButton.disabled = !registerFile.files.length; });
verifyFile.addEventListener("change", () => { verifyButton.disabled = !verifyFile.files.length; });
registerButton.addEventListener("click", register);
verifyButton.addEventListener("click", verify);
$("refresh-btn").addEventListener("click", loadRecords);

function formFor(file) {
  const form = new FormData();
  form.append("file", file, file.name);
  return form;
}
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
}
function showError(target, message) {
  target.innerHTML = `<div class="result-card"><span class="bad">Request failed</span><p>${escapeHtml(message)}</p></div>`;
}
function renderDigest(data, label, statusClass = "") {
  return `<div class="result-card"><div class="result-label">${escapeHtml(label)}</div><div class="digest">${escapeHtml(data.hash || "")}</div><div>${escapeHtml(data.filename || "")} · ${Number(data.sizeBytes || 0).toLocaleString()} bytes</div>${data.transactionHash ? `<p><span class="result-label">TRANSACTION</span><br><span class="digest">${escapeHtml(data.transactionHash)}</span></p><p>Block ${escapeHtml(data.blockNumber)}</p>` : ""}${data.registeredBy ? `<p class="result-label">REGISTERED BY</p><div>${escapeHtml(data.registeredBy)}</div>` : ""}${data.explanation ? `<p class="${statusClass}">${escapeHtml(data.explanation)}</p>` : ""}</div>`;
}
async function register() {
  const file = registerFile.files[0];
  if (!file) return;
  registerButton.disabled = true;
  registerButton.textContent = "Registering…";
  try {
    const response = await fetch("/api/register", { method: "POST", body: formFor(file) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Registration failed.");
    $("register-result").innerHTML = renderDigest(data, "REGISTERED ON-CHAIN", "ok");
    await loadRecords();
    await updateStatus();
  } catch (error) { showError($("register-result"), error.message); }
  finally { registerButton.disabled = !registerFile.files.length; registerButton.innerHTML = 'Calculate hash &amp; register <span>↗</span>'; }
}
async function verify() {
  const file = verifyFile.files[0];
  if (!file) return;
  verifyButton.disabled = true;
  verifyButton.textContent = "Verifying…";
  try {
    const response = await fetch("/api/verify", { method: "POST", body: formFor(file) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Verification failed.");
    const match = data.result === "match";
    $("verify-result").innerHTML = renderDigest(data, match ? "MATCHING RECORD FOUND" : "NO MATCHING RECORD", match ? "ok" : "bad");
  } catch (error) { showError($("verify-result"), error.message); }
  finally { verifyButton.disabled = !verifyFile.files.length; verifyButton.innerHTML = 'Verify integrity <span>→</span>'; }
}
async function updateStatus() {
  const label = $("network-status");
  try {
    const response = await fetch("/api/status");
    const data = await response.json();
    if (!response.ok || !data.rpcConnected) throw new Error("Local chain unavailable");
    label.textContent = data.contractDeployed ? `LOCAL CHAIN · ${data.chainId} · CONTRACT READY` : `LOCAL CHAIN · ${data.chainId} · DEPLOY CONTRACT`;
    document.querySelector(".pulse").style.background = data.contractDeployed && data.accountAvailable ? "var(--lime)" : "#e0ad59";
  } catch (_error) {
    label.textContent = "LOCAL CHAIN OFFLINE";
    document.querySelector(".pulse").style.background = "var(--red)";
  }
}
async function loadRecords() {
  const body = $("records-body");
  try {
    const response = await fetch("/api/records");
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || "Unable to read records.");
    if (!data.records.length) {
      body.innerHTML = '<tr><td colspan="3" class="empty">No registrations yet. Register a file to create the first record.</td></tr>';
      return;
    }
    body.innerHTML = data.records.map((record) => {
      const date = record.timestamp ? new Date(Number(record.timestamp) * 1000).toLocaleString() : "—";
      return `<tr><td>${escapeHtml(record.hash)}</td><td>${escapeHtml(record.registeredBy)}</td><td>${escapeHtml(date)}</td></tr>`;
    }).join("");
  } catch (_error) {
    body.innerHTML = '<tr><td colspan="3" class="empty">Registry unavailable. Start the local chain and deploy the contract.</td></tr>';
  }
}
updateStatus();
loadRecords();
