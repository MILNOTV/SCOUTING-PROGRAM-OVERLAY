const CONFIG = {
  spreadsheetId: "1r5FQ3I-JtViV06_aX6hbYW5ZYZGayIKurYp1QtLchzw",
  sheetGid: "1662725538",
  refreshEveryMs: 5000
};

function csvUrl() {
  return `https://docs.google.com/spreadsheets/d/${CONFIG.spreadsheetId}/gviz/tq?tqx=out:csv&gid=${CONFIG.sheetGid}&t=${Date.now()}`;
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && quoted && next === '"') {
      field += '"';
      i++;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (char === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((char === "\n" || char === "\r") && !quoted) {
      if (char === "\r" && next === "\n") i++;
      row.push(field);
      if (row.some(value => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  row.push(field);
  if (row.some(value => value.trim() !== "")) rows.push(row);
  return rows;
}

function normalizeHeader(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isCurrent(value) {
  const normalized = String(value || "").trim().toLowerCase();
  return ["1", "x", "si", "sí", "actual", "true", "✓", "✅"].includes(normalized);
}

function sheetRowsToPlayers(rows) {
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const col = {
    order: headers.indexOf("orden"),
    name: headers.indexOf("jugador"),
    hits: headers.indexOf("hoy"),
    avg: headers.indexOf("avg"),
    points: headers.indexOf("pts"),
    current: headers.indexOf("actual")
  };

  if (col.name === -1) {
    throw new Error('No encuentro la columna "jugador".');
  }

  return rows.slice(1)
    .map((row, index) => ({
      order: col.order >= 0 ? row[col.order] : index + 1,
      name: row[col.name],
      hits: col.hits >= 0 ? row[col.hits] : "0",
      avg: col.avg >= 0 ? row[col.avg] : "---",
      points: col.points >= 0 ? row[col.points] : "0",
      current: col.current >= 0 ? isCurrent(row[col.current]) : false
    }))
    .filter(player => String(player.name || "").trim() !== "")
    .sort((a, b) => Number(a.order || 999) - Number(b.order || 999));
}

function renderCurrent(player) {
  const selected = player || {
    name: "Marca un 1 en la columna Actual",
    avg: "---",
    hits: "0",
    points: "0"
  };

  document.getElementById("currentName").textContent = selected.name;
  document.getElementById("currentAvg").textContent = selected.avg || "---";
  document.getElementById("currentHits").textContent = selected.hits || "0";
  document.getElementById("currentPoints").textContent = selected.points || "0";
}

function tickerItem(player) {
  return `
    <div class="ticker-item ${player.current ? "current" : ""}">
      <span class="order">${player.order}</span>
      <span class="name">${player.name}</span>
      <span class="stat">AVG <b>${player.avg || "---"}</b></span>
      <span class="stat">H <b>${player.hits || "0"}</b></span>
      <span class="stat">PTS <b>${player.points || "0"}</b></span>
    </div>
  `;
}

function renderTicker(players) {
  const track = document.getElementById("tickerTrack");

  if (!players.length) {
    track.innerHTML = '<div class="ticker-message">Agrega los jugadores en la hoja TICKER.</div>';
    return;
  }

  const items = players.map(tickerItem).join("");
  track.innerHTML = items + items;
}

function setStatus(text, error = false) {
  const status = document.getElementById("status");
  status.textContent = text;
  status.classList.toggle("error", error);
}

async function updateOverlay() {
  try {
    const response = await fetch(csvUrl(), { cache: "no-store" });
    if (!response.ok) throw new Error(`Error ${response.status}`);

    const csv = await response.text();
    const players = sheetRowsToPlayers(parseCsv(csv));
    const current = players.find(player => player.current);

    renderCurrent(current);
    renderTicker(players);
    setStatus("EN VIVO");
  } catch (error) {
    console.error(error);
    setStatus("SIN CONEXIÓN", true);
  }
}

updateOverlay();
setInterval(updateOverlay, CONFIG.refreshEveryMs);
