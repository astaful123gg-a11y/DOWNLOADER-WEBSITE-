const urlInput = document.getElementById('urlInput');
const statusEl = document.getElementById('status');
const resultEl = document.getElementById('result');

// ---- Load banner announcement (set by admin, no app update needed - this IS the update system) ----
async function loadBanner() {
  try {
    const res = await fetch('/api/broadcast');
    const data = await res.json();
    if (data.broadcast) {
      const b = data.broadcast;
      const el = document.getElementById('banner');
      el.classList.remove('hidden');
      el.innerHTML = `<span>${b.title}${b.message ? ' - ' + b.message : ''}</span>
        <a href="${b.link}" style="background:${b.button_color}">${b.button_text}</a>`;
    }
  } catch (e) {}
}
loadBanner();

// ---- Load platform grid from backend (dynamic - admin adds, shows up here instantly) ----
async function loadPlatforms() {
  try {
    const res = await fetch('/api/downloaders');
    const data = await res.json();
    const grid = document.getElementById('platformGrid');
    grid.innerHTML = (data.downloaders || []).map(d =>
      `<div class="platform-item">${d.icon_base64 ? `<img src="${d.icon_base64}">` : '🔗'}<div>${d.name}</div></div>`
    ).join('') || '<p style="grid-column:1/-1;color:#666">No platforms added yet.</p>';
  } catch (e) {}
}
loadPlatforms();

// ---- Paste button ----
document.getElementById('pasteBtn').addEventListener('click', async () => {
  try {
    const text = await navigator.clipboard.readText();
    urlInput.value = text;
  } catch (e) {
    statusEl.textContent = "Long-press the input box to paste manually.";
  }
});

// ---- Main download flow ----
document.getElementById('downloadBtn').addEventListener('click', async () => {
  const url = urlInput.value.trim();
  if (!url) { statusEl.textContent = "Paste a link first."; return; }

  statusEl.textContent = "Fetching...";
  resultEl.classList.remove('show');

  try {
    const res = await fetch('/api/download', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url })
    });
    if (!res.ok) throw new Error((await res.json()).error || "Server error");
    const data = await res.json();

    statusEl.textContent = "";
    resultEl.classList.add('show');
    resultEl.innerHTML = `
      ${data.thumbnail ? `<img src="${data.thumbnail}">` : ""}
      <div>${data.title || "Ready to download"}</div>
      <a class="dl-link" href="${data.downloadUrl}" target="_blank">⬇ Download</a>
    `;
  } catch (e) {
    statusEl.textContent = "Failed: " + e.message;
  }
});
