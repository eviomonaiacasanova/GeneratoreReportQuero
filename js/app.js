const VERSION = "v6.0.0";
const PLANTS_URL = "data/plants.json";
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

const safeArray = (value) => Array.isArray(value) ? value : [];

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

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsDataURL(file);
  });
}

document.addEventListener("alpine:init", () => {
  Alpine.data("reportApp", () => ({
    version: VERSION,
    plants: [],
    plant: "",
    date: "",
    time: "",
    operator: "",
    zones: ZONES,
    selectedZones: [],
    anomalies: ANOMALIES,
    anomaly: "",
    desc: "",
    ops: "",
    photos: [null, null, null],
    status: "",

    init() {
      this.setDefaults();
      this.exposeReportApp();
      this.loadPlants();
    },

    setDefaults() {
      this.date = todayStr();
      this.time = nowHM();
    },

    showStatus(text) {
      this.status = text || "";
      if (!text) return;
      setTimeout(() => {
        if (this.status === text) {
          this.status = "";
        }
      }, 1400);
    },

    exposeReportApp() {
      const self = this;
      window.ReportApp = {
        getReportValues: () => self.getReportValues(),
        showStatus: (text) => self.showStatus(text),
        getPhotos: () => self.photos,
        getLogoPath: () => LOGO_PATH,
        getVersion: () => self.version,
        getDateValue: () => self.date
      };
    },

    async loadPlants() {
      try {
        const res = await fetch(PLANTS_URL, { cache: "no-store" });
        if (!res.ok) throw new Error("Plants fetch failed");
        const data = await res.json();
        if (!Array.isArray(data)) throw new Error("Invalid plants JSON");
        this.plants = data;
      } catch (err) {
        console.warn(err);
        this.plants = DEFAULT_PLANTS;
        this.showStatus("Lista impianti di fallback.");
      }
    },

    toggleZone(zone) {
      const list = safeArray(this.selectedZones);
      if (list.includes(zone)) {
        this.selectedZones = list.filter((item) => item !== zone);
      } else {
        this.selectedZones = [...list, zone];
      }
    },

    isZoneSelected(zone) {
      return safeArray(this.selectedZones).includes(zone);
    },

    selectAnomaly(anomaly) {
      this.anomaly = anomaly;
    },

    getReportValues() {
      return {
        plant: this.plant || "—",
        date: this.date || "—",
        time: this.time || "—",
        operator: this.operator.trim() || "—",
        zones: this.selectedZones.length ? this.selectedZones.join(", ") : "—",
        anomaly: this.anomaly || "—",
        desc: this.desc.trim() || "—",
        ops: this.ops.trim() || "—"
      };
    },

    reportText() {
      const v = this.getReportValues();
      return [
        `IMPIANTO: ${v.plant}`,
        `DATA: ${v.date}`,
        `ORA: ${v.time}`,
        `OPERATORE: ${v.operator}`,
        `ZONA: ${v.zones}`,
        `ANOMALIA: ${v.anomaly}`,
        "",
        "DESCRIZIONE ANOMALIA:",
        v.desc,
        "",
        "OPERAZIONI EFFETTUATE:",
        v.ops,
        "",
        `VERSIONE: ${this.version}`
      ].join("\n");
    },

    async onPhotoChange(event, index) {
      const file = event.target.files && event.target.files[0];
      if (!file || !file.type.startsWith("image/")) return;
      try {
        const dataUrl = await readAsDataUrl(file);
        this.photos = this.photos.map((item, idx) => {
          if (idx !== index) return item;
          return {
            dataUrl,
            name: file.name,
            type: file.type
          };
        });
      } catch (err) {
        console.error(err);
        this.showStatus("Errore lettura immagine.");
      }
    },

    pickPhoto(index) {
      const ref = this.$refs[`photoInput${index}`];
      if (ref) ref.click();
    },

    removePhoto(index) {
      this.photos = this.photos.map((item, idx) => (idx === index ? null : item));
      const ref = this.$refs[`photoInput${index}`];
      if (ref) ref.value = "";
    },

    photoLabel(index) {
      const photo = this.photos[index];
      if (!photo) return `Foto ${index + 1}: nessun file`;
      return photo.name || `Foto ${index + 1}`;
    },

    copyToClipboard() {
      if (window.ReportShare && typeof window.ReportShare.copyToClipboard === "function") {
        window.ReportShare.copyToClipboard();
        return;
      }
      this.showStatus("Condivisione non disponibile.");
    },

    printPdf() {
      if (window.ReportShare && typeof window.ReportShare.printPdf === "function") {
        window.ReportShare.printPdf();
        return;
      }
      this.showStatus("PDF non disponibile.");
    },

    downloadPdf() {
      if (window.ReportShare && typeof window.ReportShare.downloadPdf === "function") {
        window.ReportShare.downloadPdf();
        return;
      }
      this.showStatus("PDF non disponibile.");
    },

    sendMail() {
      if (window.ReportShare && typeof window.ReportShare.sendMail === "function") {
        window.ReportShare.sendMail();
        return;
      }
      this.showStatus("Mail non disponibile.");
    },

    resetAll() {
      this.plant = "";
      this.date = todayStr();
      this.time = nowHM();
      this.operator = "";
      this.desc = "";
      this.ops = "";
      this.selectedZones = [];
      this.anomaly = "";
      this.photos = [null, null, null];
      for (let i = 0; i < 3; i++) {
        const ref = this.$refs[`photoInput${i}`];
        if (ref) ref.value = "";
      }
    }
  }));
});