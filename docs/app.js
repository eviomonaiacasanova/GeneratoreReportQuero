// ==============================
// CONFIG (modifica qui nomi/elenchi)
// ==============================
const VERSION = "v5.4.1";
const PLANTS = ["ALTANON","ANZU","ARCADE","BUSCHE DMV","BUSCHE SBARRAMENTO","CAERANO","CASTELVIERO","CROCE DEL GALLO","FONDERIA","PEDEROBBA","POMPE SONNA","PONTE PIETRA","PONTE SAN MARTINO","PRIULA","QUERO","SPEEDY","SPRESIANO","TAVARAN"];
const ZONE = ["GRUPPO 1","GRUPPO 2","SGRIGLIATORE","ALTRO"];
const ANOMALIE = ["ALLARME","BLOCCO","ALTRO"];

// ==============================
// DOM HELPERS + STATE
// ==============================
const $ = s => document.querySelector(s);

const el = {
  // form
  plant: $("#impianto"), date: $("#data"), time: $("#ora"), oper: $("#operatore"),
  zoneWrap: $("#zone"), anomWrap: $("#anomalia"),
  descr: $("#descr"), ops: $("#ops"), note: $("#note"),
  out: $("#out"), msg: $("#msg"),
  copy: $("#copy"), btnPrint: $("#btnPrint"), btnDownload: $("#btnDownload"), btnMail: $("#btnMail"), reset: $("#reset"),
  f1: $("#file1"), f2: $("#file2"), f3: $("#file3"),
  i1: $("#img1"), i2: $("#img2"), i3: $("#img3"),

  // print view
  pImp: $("#p_impianto"), pData: $("#p_data"), pOra: $("#p_ora"), pOper: $("#p_operatore"),
  pZona: $("#p_zona"), pAnom: $("#p_anomalia"),
  pDescr: $("#p_descr"), pOps: $("#p_ops"), pNote: $("#p_note"), pGal: $("#p_gallery"),
  verTag: $("#verTag"), pVerFoot: $("#p_version_footer")
};

const state = {
  zone: new Set(),
  anomaly: "",
  imgs: {1:null,2:null,3:null},
  lastReportText: ""
};

// ==============================
// DATE + FORMAT UTILS
// ==============================
function todayStr() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,"0");
  const dd = String(d.getDate()).padStart(2,"0");
  return y + "-" + m + "-" + dd;
}

function nowHM() {
  const d = new Date();
  const hh = String(d.getHours()).padStart(2,"0");
  const mm = String(d.getMinutes()).padStart(2,"0");
  return hh + ":" + mm;
}

function dateAsDDMMYYYY(raw) {
  if (!raw || !raw.includes("-")) return "00000000";
  const parts = raw.split("-");
  if (parts.length !== 3) return "00000000";
  const y = parts[0], m = parts[1], d = parts[2];
  return d.padStart(2,"0") + m.padStart(2,"0") + y;
}

// ==============================
// UI BUILDERS (CHIPS + OPTIONS)
// ==============================
function initChoices() {
  // Lista impianti
  const frag = document.createDocumentFragment();
  for (const p of PLANTS) {
    const o = document.createElement("option");
    o.value = p;
    o.textContent = p;
    frag.appendChild(o);
  }
  el.plant.appendChild(frag);

  // Selezione zone (multi-select)
  for (const z of ZONE) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = z;
    b.dataset.value = z;
    b.dataset.on = "0";
    b.addEventListener("click", () => {
      const on = b.dataset.on === "1";
      b.dataset.on = on ? "0" : "1";
      if (on) state.zone.delete(z); else state.zone.add(z);
      buildReport();
    });
    el.zoneWrap.appendChild(b);
  }

  // Selezione anomalia (singola)
  for (const a of ANOMALIE) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    b.textContent = a;
    b.dataset.value = a;
    b.dataset.on = "0";
    b.addEventListener("click", () => {
      state.anomaly = a;
      [...el.anomWrap.children].forEach(x => x.dataset.on = (x.dataset.value === a ? "1" : "0"));
      buildReport();
    });
    el.anomWrap.appendChild(b);
  }
}

// ==============================
// CORE: BUILD REPORT TEXT + PRINT VIEW
// ==============================
function buildReport() {
  const plant = el.plant.value || "—";
  const date = el.date.value || "—";
  const time = el.time.value || "—";
  const oper = el.oper.value.trim() || "—";
  const zones = [...state.zone].join(", ") || "—";
  const anom = state.anomaly || "—";
  const desc = el.descr.value.trim() || "—";
  const ops = el.ops.value.trim() || "—";
  const note = el.note.value.trim() || "—";

  const lines = [
    "IMPIANTO: " + plant,
    "DATA: " + date,
    "ORA: " + time,
    "OPERATORE: " + oper,
    "ZONA: " + zones,
    "ANOMALIA: " + anom,
    "",
    "DESCRIZIONE ANOMALIA:",
    desc,
    "",
    "OPERAZIONI EFFETTUATE:",
    ops,
    "",
    "NOTE OPERATORE:",
    note,
    "",
    "VERSIONE: " + VERSION
  ];

  const text = lines.join("\n");
  state.lastReportText = text;
  el.out.value = text;

  // Aggiorna la versione di stampa
  el.verTag.textContent = "Versione " + VERSION;
  el.pVerFoot.textContent = VERSION;
  el.pImp.textContent = plant;
  el.pData.textContent = date;
  el.pOra.textContent = time;
  el.pOper.textContent = oper;
  el.pZona.textContent = zones;
  el.pAnom.textContent = anom;
  el.pDescr.textContent = desc;
  el.pOps.textContent = ops;
  el.pNote.textContent = note;

  // Galleria in stampa
  el.pGal.innerHTML = "";
  for (const k of [1,2,3]) {
    const src = state.imgs[k];
    if (src) {
      const im = document.createElement("img");
      im.src = src;
      el.pGal.appendChild(im);
    }
  }
}

// ==============================
// IMAGE INPUTS
// ==============================
function bindImages(idx) {
  const file = el["f"+idx];
  const img = el["i"+idx];
  const delBtn = document.querySelector('[data-del="'+idx+'"]');
  const box = document.querySelector('.photo-box[data-photo="'+idx+'"]');

  // Click sulla box = seleziona file
  const triggerUpload = () => file.click();
  box.addEventListener("click", triggerUpload);

  // Cambio file
  file.addEventListener("change", () => {
    const f = file.files && file.files[0];
    if (!f || !f.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = e => {
      img.src = e.target.result;
      state.imgs[idx] = e.target.result;
      box.classList.add("has-image");
      if (delBtn) delBtn.style.display = "inline-block";
      buildReport();
    };
    reader.readAsDataURL(f);
  });

  // Rimuovi foto
  delBtn.addEventListener("click", () => {
    img.removeAttribute("src");
    state.imgs[idx] = null;
    file.value = "";
    box.classList.remove("has-image");
    delBtn.style.display = "none";
    buildReport();
  });
}

// ==============================
// CLIPBOARD + ACTIONS
// ==============================
function copyToClipboard() {
  const t = el.out.value;
  if (!t.trim()) { el.msg.textContent = "Niente da copiare."; return; }
  if (!navigator.clipboard) { el.msg.textContent = "Clipboard non disponibile."; return; }
  navigator.clipboard.writeText(t).then(() => {
    el.msg.textContent = "Copiato.";
    setTimeout(() => el.msg.textContent = "", 1200);
  }).catch(() => { el.msg.textContent = "Errore copia."; });
}

function filenameBase() {
  const plant = (el.plant.value || "IMPIANTO").trim() || "IMPIANTO";
  const anom = state.anomaly || "TIPO ALLARME";
  const rawDate = el.date.value || "";
  const datePart = dateAsDDMMYYYY(rawDate);
  const safePlant = plant.replace(/[\/:*?"<>|]/g, " ");
  const safeAnom = anom.replace(/[\/:*?"<>|]/g, " ");
  return safePlant + " - " + safeAnom + " - " + datePart;
}

function printPdf() {
  const oldTitle = document.title;
  document.title = filenameBase();
  window.print();
  setTimeout(() => { document.title = oldTitle; }, 2000);
}

function sendMail() {
  const plant = (el.plant.value || "IMPIANTO").trim() || "IMPIANTO";
  const anom = state.anomaly || "TIPO ALLARME";
  const time = el.time.value || "ORA";
  const datePart = dateAsDDMMYYYY(el.date.value || "");
  const subj = plant + " - " + anom + " - " + time + " - " + datePart;

  const body = state.lastReportText || "";
  const mailto = "mailto:?subject=" + encodeURIComponent(subj) + "&body=" + encodeURIComponent(body);
  window.location.href = mailto;
}

function resetAll() {
  el.plant.value = "";
  el.date.value = todayStr();
  el.time.value = nowHM();
  el.oper.value = "";
  el.descr.value = "";
  el.ops.value = "";
  el.note.value = "";
  state.zone = new Set();
  state.anomaly = "";
  for (const k of [1,2,3]) {
    state.imgs[k] = null;
    el["i"+k].removeAttribute("src");
    el["f"+k].value = "";
    const box = document.querySelector('.photo-box[data-photo="'+k+'"]');
    const delBtn = document.querySelector('[data-del="'+k+'"]');
    if (box) box.classList.remove("has-image");
    if (delBtn) delBtn.style.display = "none";
  }
  [...el.zoneWrap.children].forEach(b => b.dataset.on = "0");
  [...el.anomWrap.children].forEach(b => b.dataset.on = "0");
  buildReport();
}

// ==============================
// APP INIT + EVENTS
// ==============================
function init() {
  initChoices();
  bindImages(1); bindImages(2); bindImages(3);

  // Valori iniziali
  el.date.value = todayStr();
  el.time.value = nowHM();

  // Aggiorna report mentre l'utente scrive
  el.plant.addEventListener("change", buildReport);
  el.date.addEventListener("change", buildReport);
  el.time.addEventListener("change", buildReport);
  el.oper.addEventListener("input", buildReport);
  el.descr.addEventListener("input", buildReport);
  el.ops.addEventListener("input", buildReport);
  el.note.addEventListener("input", buildReport);

  // Bottoni azione
  el.copy.addEventListener("click", copyToClipboard);
  el.btnPrint.addEventListener("click", printPdf);
  el.btnDownload.addEventListener("click", downloadPdf);
  el.btnMail.addEventListener("click", sendMail);
  el.reset.addEventListener("click", resetAll);

  buildReport();
}

document.addEventListener("DOMContentLoaded", init);
