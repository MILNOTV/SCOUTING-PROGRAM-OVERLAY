const CONFIG = {
  // OPCIONAL:
  // Pega aquí una URL pública que devuelva JSON con la misma estructura de data.json.
  // Déjalo vacío para usar data.json.
  remoteJsonUrl: "",

  refreshEveryMs: 5000
};

async function loadOverlayData() {
  const source = CONFIG.remoteJsonUrl || "data.json";
  const separator = source.includes("?") ? "&" : "?";
  const url = `${source}${separator}t=${Date.now()}`;

  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`No se pudo cargar ${source}`);
  }
  return response.json();
}

function renderScoreboard(data) {
  document.getElementById("currentName").textContent = data.currentHitter.name;
  document.getElementById("currentAvg").textContent = data.currentHitter.avg;
  document.getElementById("currentHits").textContent = data.currentHitter.hits;
  document.getElementById("currentPoints").textContent = data.currentHitter.points;
}

function createTickerItem(player) {
  return `
    <div class="ticker-item">
      <span class="order">${player.order}</span>
      <span class="name">${player.name}</span>
      <span class="stat">AVG <b>${player.avg}</b></span>
      <span class="stat">H <b>${player.hits}</b></span>
      <span class="stat">PTS <b>${player.points}</b></span>
    </div>
  `;
}

function renderTicker(data) {
  const track = document.getElementById("tickerTrack");
  const items = data.lineup.map(createTickerItem).join("");

  // Duplicamos la lista para lograr un desplazamiento continuo.
  track.innerHTML = items + items;
}

async function updateOverlay() {
  try {
    const data = await loadOverlayData();
    renderScoreboard(data);
    renderTicker(data);
  } catch (error) {
    console.error(error);
  }
}

updateOverlay();
setInterval(updateOverlay, CONFIG.refreshEveryMs);
