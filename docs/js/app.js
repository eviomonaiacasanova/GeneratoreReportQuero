const VERSION = "v5.5.0";
const PLANTS_URL = "data/plants.json";
// Se non trova il file usa questo elenco come fallback
const DEFAULT_PLANTS = [
  "ALTANON",
  "ANZU",
  "ARCADE",
  "BUSCHE DMV",
  "BUSCHE SBARRAMENTO",
  "CAERANO",
  "CASTELVIERO",
  "CROCE DEL GALLO",
  "FONDERIA",
  "PEDEROBBA",
  "POMPE SONNA",
  "PONTE PIETRA",
  "PONTE SAN MARTINO",
  "PRIULA",
  "QUERO",
  "SPEEDY",
  "SPRESIANO",
  "TAVARAN"
];
const ZONES = ["GRUPPO 1", "GRUPPO 2", "SGRIGLIATORE", "ALTRO"];
const ANOMALIES = ["ALLARME", "BLOCCO", "ALTRO"];
const LOGO_PATH = "assets/img/logo_egp.png";

const dom = {
  plant: document.getElementById("plantSelect"),
  date: document.getElementById("dateInput"),
  time: document.getElementById("timeInput"),
  operator: document.getElementById("operatorInput"),
  zoneWrap: document.getElementById("zoneChips"),
  anomalyWrap: document.getElementById("anomalyChips"),
  desc: document.getElementById("descInput"),
  ops: document.getElementById("opsInput"),
  preview: document.getElementById("previewOutput"),
  status: document.getElementById("statusMsg"),
  versionLabel: document.getElementById("versionLabel"),
  versionFooter: document.getElementById("versionFooter"),
  copyBtn: document.getElementById("copyBtn"),
  printBtn: document.getElementById("printBtn"),
  downloadBtn: document.getElementById("downloadBtn"),
  mailBtn: document.getElementById("mailBtn"),
  resetBtn: document.getElementById("resetBtn"),
  photoCards: Array.from(document.querySelectorAll("[data-photo]"))
};

const state = {
  zones: new Set(),
  anomaly: "",
  photos: [null, null, null]
};

function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${dd}`;
}

function nowHM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}


function showStatus(text) {
  if (!dom.status) return;
  dom.status.textContent = text;
  if (!text) return;
  setTimeout(() => {
    if (dom.status.textContent === text) {
      dom.status.textContent = "";
    }
  }, 1400);
}

function populatePlants(plants) {
  dom.plant.innerHTML = "";
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = "— seleziona impianto —";
  dom.plant.appendChild(placeholder);

  for (const plant of plants) {
    const option = document.createElement("option");
    option.value = plant;
    option.textContent = plant;
    dom.plant.appendChild(option);
  }
}

async function loadPlants() {
  try {
    const res = await fetch(PLANTS_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("Plants fetch failed");
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error("Invalid plants JSON");
    populatePlants(data);
  } catch (err) {
    console.warn(err);
    populatePlants(DEFAULT_PLANTS);
    showStatus("Lista impianti di fallback.");
  }
}

function makeChip(label, onClick) {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "chip";
  btn.textContent = label;
  btn.addEventListener("click", onClick);
  return btn;
}

function renderZoneChips() {
  dom.zoneWrap.replaceChildren();
  for (const zone of ZONES) {
    const chip = makeChip(zone, () => {
      if (state.zones.has(zone)) {
        state.zones.delete(zone);
        chip.classList.remove("is-active");
      } else {
        state.zones.add(zone);
        chip.classList.add("is-active");
      }
      updatePreview();
    });
    dom.zoneWrap.appendChild(chip);
  }
}

function renderAnomalyChips() {
  dom.anomalyWrap.replaceChildren();
  for (const anomaly of ANOMALIES) {
    const chip = makeChip(anomaly, () => {
      state.anomaly = anomaly;
      [...dom.anomalyWrap.children].forEach((node) => {
        node.classList.toggle("is-active", node.textContent === anomaly);
      });
      updatePreview();
    });
    dom.anomalyWrap.appendChild(chip);
  }
}

function getReportValues() {
  return {
    plant: dom.plant.value || "—",
    date: dom.date.value || "—",
    time: dom.time.value || "—",
    operator: dom.operator.value.trim() || "—",
    zones: state.zones.size ? Array.from(state.zones).join(", ") : "—",
    anomaly: state.anomaly || "—",
    desc: dom.desc.value.trim() || "—",
    ops: dom.ops.value.trim() || "—"
  };
}

function updatePreview() {
  if (!dom.preview) return;
  if (window.ReportShare && typeof window.ReportShare.buildReportText === "function") {
    dom.preview.value = window.ReportShare.buildReportText();
  }
}

function bindInputs() {
  const inputs = [dom.plant, dom.date, dom.time, dom.operator, dom.desc, dom.ops];
  for (const input of inputs) {
    input.addEventListener("input", updatePreview);
    input.addEventListener("change", updatePreview);
  }
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

function updatePhotoCard(card, photo) {
  const img = card.querySelector("[data-photo-img]");
  const name = card.querySelector("[data-photo-name]");
  const removeBtn = card.querySelector("[data-photo-remove]");

  if (photo && img) {
    img.src = photo.dataUrl;
    img.style.display = "block";
    name.textContent = photo.name || "Foto";
    removeBtn.disabled = false;
  } else {
    img.removeAttribute("src");
    img.style.display = "none";
    name.textContent = `Foto ${Number(card.dataset.photo) + 1}: nessun file`;
    removeBtn.disabled = true;
  }
}

function bindPhotoCard(card, index) {
  const input = card.querySelector("[data-photo-input]");
  const pickBtn = card.querySelector("[data-photo-pick]");
  const removeBtn = card.querySelector("[data-photo-remove]");

  pickBtn.addEventListener("click", () => input.click());

  input.addEventListener("change", async () => {
    const file = input.files && input.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    try {
      const dataUrl = await readAsDataUrl(file);
      state.photos[index] = {
        dataUrl,
        name: file.name,
        type: file.type
      };
      updatePhotoCard(card, state.photos[index]);
    } catch (err) {
      console.error(err);
      showStatus("Errore lettura immagine.");
    }
  });

  removeBtn.addEventListener("click", () => {
    state.photos[index] = null;
    input.value = "";
    updatePhotoCard(card, null);
  });

  updatePhotoCard(card, null);
}

function initPhotos() {
  dom.photoCards.forEach((card, idx) => bindPhotoCard(card, idx));
}

function copyToClipboard() {
  if (window.ReportShare && typeof window.ReportShare.copyToClipboard === "function") {
    window.ReportShare.copyToClipboard();
    return;
  }
  showStatus("Condivisione non disponibile.");
}

function printPdf() {
  if (window.ReportShare && typeof window.ReportShare.printPdf === "function") {
    window.ReportShare.printPdf();
    return;
  }
  showStatus("PDF non disponibile.");
}

function downloadPdf() {
  if (window.ReportShare && typeof window.ReportShare.downloadPdf === "function") {
    window.ReportShare.downloadPdf();
    return;
  }
  showStatus("PDF non disponibile.");
}

function sendMail() {
  if (window.ReportShare && typeof window.ReportShare.sendMail === "function") {
    window.ReportShare.sendMail();
    return;
  }
  showStatus("Mail non disponibile.");
}

function resetAll() {
  dom.plant.value = "";
  dom.date.value = todayStr();
  dom.time.value = nowHM();
  dom.operator.value = "";
  dom.desc.value = "";
  dom.ops.value = "";
  state.zones.clear();
  state.anomaly = "";

  [...dom.zoneWrap.children].forEach((chip) => chip.classList.remove("is-active"));
  [...dom.anomalyWrap.children].forEach((chip) => chip.classList.remove("is-active"));

  state.photos = [null, null, null];
  dom.photoCards.forEach((card, idx) => {
    const input = card.querySelector("[data-photo-input]");
    if (input) input.value = "";
    updatePhotoCard(card, null);
  });

  updatePreview();
}

function bindActions() {
  dom.copyBtn.addEventListener("click", copyToClipboard);
  dom.printBtn.addEventListener("click", printPdf);
  dom.downloadBtn.addEventListener("click", downloadPdf);
  dom.mailBtn.addEventListener("click", sendMail);
  dom.resetBtn.addEventListener("click", resetAll);
}

function setDefaults() {
  dom.date.value = todayStr();
  dom.time.value = nowHM();
  dom.versionLabel.textContent = VERSION;
  dom.versionFooter.textContent = VERSION;
}

function exposeAppData() {
  window.ReportApp = {
    getReportValues,
    showStatus,
    getPhotos: () => state.photos,
    getLogoPath: () => LOGO_PATH,
    getVersion: () => VERSION,
    getDateValue: () => dom.date.value
  };
}

function init() {
  exposeAppData();
  setDefaults();
  renderZoneChips();
  renderAnomalyChips();
  initPhotos();
  bindInputs();
  bindActions();
  loadPlants();
  updatePreview();
}

document.addEventListener("DOMContentLoaded", init);
