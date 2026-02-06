const ShareReport = (() => {
  const cache = {
    logoDataUrl: null
  };

  const getApp = () => window.ReportApp || {};

  function dateAsDDMMYYYY(raw) {
    if (!raw || !raw.includes("-")) return "00000000";
    const parts = raw.split("-");
    if (parts.length !== 3) return "00000000";
    const [y, m, d] = parts;
    return `${d.padStart(2, "0")}${m.padStart(2, "0")}${y}`;
  }

  function buildReportText() {
    const app = getApp();
    const getReportValues = app.getReportValues || (() => ({}));
    const getVersion = app.getVersion || (() => "");
    const v = getReportValues();
    return [
      `IMPIANTO: ${v.plant || "—"}`,
      `DATA: ${v.date || "—"}`,
      `ORA: ${v.time || "—"}`,
      `OPERATORE: ${v.operator || "—"}`,
      `ZONA: ${v.zones || "—"}`,
      `ANOMALIA: ${v.anomaly || "—"}`,
      "",
      "DESCRIZIONE ANOMALIA:",
      v.desc || "—",
      "",
      "OPERAZIONI EFFETTUATE:",
      v.ops || "—",
      "",
      "NOTE OPERATORE:",
      v.note || "—",
      "",
      `VERSIONE: ${getVersion()}`
    ].join("\n");
  }

  function copyToClipboard() {
    const app = getApp();
    const showStatus = app.showStatus || (() => {});
    const text = buildReportText();
    if (!text.trim()) {
      showStatus("Niente da copiare.");
      return;
    }
    if (!navigator.clipboard) {
      showStatus("Clipboard non disponibile.");
      return;
    }
    navigator.clipboard.writeText(text)
      .then(() => showStatus("Copiato."))
      .catch(() => showStatus("Errore copia."));
  }

  function buildMailto() {
    const app = getApp();
    const getReportValues = app.getReportValues || (() => ({}));
    const getDateValue = app.getDateValue || (() => "");
    const v = getReportValues();
    const datePart = dateAsDDMMYYYY(getDateValue());
    const subject = `${v.plant || "IMPIANTO"} - ${v.anomaly || "ANOMALIA"} - ${v.time || "ORA"} - ${datePart}`;
    const body = buildReportText();
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  function sendMail() {
    window.location.href = buildMailto();
  }

  function getPdfFileName() {
    const app = getApp();
    const getReportValues = app.getReportValues || (() => ({}));
    const getDateValue = app.getDateValue || (() => "");
    const v = getReportValues();
    const datePart = dateAsDDMMYYYY(getDateValue());
    const safePlant = String(v.plant || "IMPIANTO").replace(/[\\/:*?"<>|]/g, " ");
    const safeAnom = String(v.anomaly || "ANOMALIA").replace(/[\\/:*?"<>|]/g, " ");
    return `${safePlant} - ${safeAnom} - ${datePart}`;
  }

  function readAsDataUrl(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Logo read error"));
      reader.readAsDataURL(blob);
    });
  }

  async function loadLogoDataUrl() {
    if (cache.logoDataUrl) return cache.logoDataUrl;
    const app = getApp();
    const getLogoPath = app.getLogoPath || (() => "");
    const logoPath = getLogoPath();
    if (!logoPath) return null;
    try {
      const res = await fetch(logoPath, { cache: "force-cache" });
      if (!res.ok) return null;
      const blob = await res.blob();
      const dataUrl = await readAsDataUrl(blob);
      cache.logoDataUrl = dataUrl;
      return dataUrl;
    } catch (err) {
      console.warn("Logo load failed", err);
      return null;
    }
  }

  async function buildPdfDoc() {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) {
      throw new Error("jsPDF non disponibile");
    }

    const app = getApp();
    const getReportValues = app.getReportValues || (() => ({}));
    const getVersion = app.getVersion || (() => "");
    const getPhotos = app.getPhotos || (() => []);

    const v = getReportValues();
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 40;
    const contentWidth = pageWidth - margin * 2;
    let y = margin;

    const headerTop = y;
    const headerRightX = pageWidth - margin;

    let logoHeight = 0;
    const logoDataUrl = await loadLogoDataUrl();
    if (logoDataUrl) {
      try {
        const props = doc.getImageProperties(logoDataUrl);
        const maxW = 180;
        const maxH = 60;
        const scale = Math.min(maxW / props.width, maxH / props.height);
        const w = props.width * scale;
        const h = props.height * scale;
        logoHeight = h;
        doc.addImage(logoDataUrl, "PNG", margin, headerTop, w, h);
      } catch (err) {
        console.warn("Logo render failed", err);
      }
    }

    const lineGap = 18;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("UT Feltre • OU Quero", headerRightX, headerTop + 14, { align: "right" });
    doc.setFontSize(13);
    doc.text("Scheda Guasto", headerRightX, headerTop + 14 + lineGap, { align: "right" });

    const headerHeight = Math.max(logoHeight, 14 + lineGap);
    y = headerTop + headerHeight + 16;

    const addLine = (text, size = 12, bold = false, extra = 0) => {
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setFontSize(size);
      doc.text(text, margin, y);
      y += size + extra;
    };

    const addParagraph = (title, text) => {
      addLine(title, 13, true, 4);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(text || "—", contentWidth);
      for (const line of lines) {
        if (y > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += 14;
      }
      y += 8;
    };

    addLine("Scheda Guasto", 16, true, 6);
    addLine(`Impianto: ${v.plant || "—"}`, 12, false, 4);
    addLine(`Data: ${v.date || "—"}`, 12, false, 4);
    addLine(`Ora: ${v.time || "—"}`, 12, false, 4);
    addLine(`Operatore: ${v.operator || "—"}`, 12, false, 4);
    addLine(`Zona: ${v.zones || "—"}`, 12, false, 4);
    addLine(`Anomalia: ${v.anomaly || "—"}`, 12, false, 8);

    addParagraph("Descrizione anomalia", v.desc || "—");
    addParagraph("Operazioni effettuate", v.ops || "—");
    addParagraph("Note operatore", v.note || "—");

    const photos = getPhotos();
    if (photos.some(Boolean)) {
      addLine("Allegati", 13, true, 6);
    }

    for (const photo of photos) {
      if (!photo) continue;
      const props = doc.getImageProperties(photo.dataUrl);
      const maxW = contentWidth;
      const maxH = 220;
      const scale = Math.min(maxW / props.width, maxH / props.height);
      const w = props.width * scale;
      const h = props.height * scale;

      if (y + h > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }

      const format = photo.type === "image/png" ? "PNG" : "JPEG";
      doc.addImage(photo.dataUrl, format, margin, y, w, h);
      y += h + 10;
    }

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Versione: ${getVersion()}`, margin, pageHeight - margin + 12);

    return doc;
  }

  async function printPdf() {
    try {
      const doc = await buildPdfDoc();
      if (typeof doc.autoPrint === "function") {
        doc.autoPrint();
      }
      const url = doc.output("bloburl");
      window.open(url, "_blank");
    } catch (err) {
      console.error(err);
      const app = getApp();
      const showStatus = app.showStatus || (() => {});
      showStatus("Errore stampa PDF.");
    }
  }

  async function downloadPdf() {
    try {
      const doc = await buildPdfDoc();
      doc.save(`${getPdfFileName()}.pdf`);
    } catch (err) {
      console.error(err);
      const app = getApp();
      const showStatus = app.showStatus || (() => {});
      showStatus("Errore download PDF.");
    }
  }

  return {
    buildReportText,
    copyToClipboard,
    sendMail,
    buildMailto,
    getPdfFileName,
    buildPdfDoc,
    printPdf,
    downloadPdf
  };
})();

//Aggiungo l'oggetto SahreReport dentro l'oggeto window
window.ReportShare = ShareReport;
