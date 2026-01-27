// ==============================
// PDF GENERATION (CUSTOM)
// ==============================
// Nota: queste funzioni usano variabili globali definite in app.js
// (VERSION, el, state, buildReport). Carica pdf.js prima di app.js.

const A4W = 1654, A4H = 2339, MARGIN = 100;
const pdfState = { logo: undefined };

function loadLogo() {
  return new Promise((resolve) => {
    if (pdfState.logo !== undefined) return resolve(pdfState.logo);
    const img = new Image();
    img.onload = () => { pdfState.logo = img; resolve(img); };
    img.onerror = () => { pdfState.logo = null; resolve(null); };
    img.src = "logo_egp.png";
  });
}

function wrapText(ctx, text, maxW) {
  const words = String(text||"").split(/\s+/);
  const lines = [];
  let line = "";
  for (const w of words) {
    const test = line ? line + " " + w : w;
    if (ctx.measureText(test).width <= maxW) line = test;
    else { if (line) lines.push(line); line = w; }
  }
  if (line) lines.push(line);
  return lines;
}

async function renderPdfPage() {
  const c = document.createElement("canvas");
  c.width = A4W;
  c.height = A4H;
  const ctx = c.getContext("2d");
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,A4W,A4H);

  const logo = await loadLogo();
  const left = MARGIN, right = A4W - MARGIN;
  let y = MARGIN;

  if (logo) {
    const maxLogoW = A4W - MARGIN*2;
    const maxLogoH = 280;
    const sc = Math.min(maxLogoW/logo.width, maxLogoH/logo.height);
    const lw = logo.width * sc, lh = logo.height * sc;
    const lx = (A4W - lw)/2;
    const ly = y;
    ctx.drawImage(logo, lx, ly, lw, lh);
    y = ly + lh + 20;
  }

  ctx.fillStyle = "#000000";
  ctx.textAlign = "center";
  ctx.font = "bold 40px sans-serif";
  ctx.fillText("UT Feltre • OU Quero", A4W/2, y);
  y += 40;
  ctx.font = "600 30px sans-serif";
  ctx.fillText("Scheda Guasto", A4W/2, y);
  ctx.font = "20px sans-serif";
  ctx.textAlign = "right";
  ctx.fillText(VERSION, A4W - MARGIN, y - 30);

  const maxW = right - left;
  y += 40;

  ctx.textAlign = "left";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Impianto:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(el.plant.value || "—", left + 160, y);
  y += 34;

  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Data:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(el.date.value || "—", left + 160, y);
  y += 34;

  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Ora:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(el.time.value || "—", left + 160, y);
  y += 34;

  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Operatore:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(el.oper.value.trim() || "—", left + 160, y);
  y += 34;

  const zones = [...state.zone].join(", ") || "—";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Zona:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(zones, left + 160, y);
  y += 34;

  const anom = state.anomaly || "—";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Anomalia:", left, y);
  ctx.font = "24px sans-serif";
  ctx.fillText(anom, left + 160, y);
  y += 40;

  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Descrizione anomalia", left, y);
  y += 30;
  ctx.font = "24px sans-serif";
  const descLines = wrapText(ctx, el.descr.value.trim() || "—", maxW);
  for (const line of descLines) {
    if (y > A4H - 520) break;
    ctx.fillText(line, left, y);
    y += 30;
  }

  y += 10;
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Operazioni effettuate", left, y);
  y += 30;
  ctx.font = "24px sans-serif";
  const opsLines = wrapText(ctx, el.ops.value.trim() || "—", maxW);
  for (const line of opsLines) {
    if (y > A4H - 520) break;
    ctx.fillText(line, left, y);
    y += 30;
  }

  y += 10;
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Note operatore", left, y);
  y += 30;
  ctx.font = "24px sans-serif";
  const noteLines = wrapText(ctx, el.note.value.trim() || "—", maxW);
  for (const line of noteLines) {
    if (y > A4H - 520) break;
    ctx.fillText(line, left, y);
    y += 30;
  }

  const imgAreaTop = Math.max(y + 20, A4H - 500);
  const imgAreaBottom = A4H - MARGIN - 40;
  const imgAreaH = imgAreaBottom - imgAreaTop;
  const imgAreaW = right - left;
  const urls = [state.imgs[1], state.imgs[2], state.imgs[3]].filter(Boolean);
  if (urls.length > 0 && imgAreaH > 0) {
    const slotH = imgAreaH / urls.length;
    let ySlot = imgAreaTop;
    for (const url of urls) {
      await new Promise((resolve) => {
        const im = new Image();
        im.onload = () => {
          const sc2 = Math.min(imgAreaW/im.width, slotH/im.height);
          const w = im.width * sc2, h = im.height * sc2;
          const x = left + (imgAreaW - w)/2;
          const yy = ySlot + (slotH - h)/2;
          ctx.drawImage(im, x, yy, w, h);
          resolve();
        };
        im.onerror = () => resolve();
        im.src = url;
      });
      ySlot += slotH;
    }
  }

  ctx.font = "18px sans-serif";
  ctx.fillStyle = "#333333";
  ctx.textAlign = "center";
  ctx.fillText("Uso interno Enel Green Power • " + VERSION, A4W/2, A4H - MARGIN);

  return c;
}

function canvasToJpegPage(canvas) {
  const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
  const b64 = dataUrl.split(",")[1];
  const bin = atob(b64);
  const len = bin.length;
  const u8 = new Uint8Array(len);
  for (let i = 0; i < len; i++) u8[i] = bin.charCodeAt(i);
  return { bytes: u8, w: canvas.width, h: canvas.height };
}

function makePdf(pages) {
  const enc = new TextEncoder();
  const chunks = [];
  let offset = 0;
  const NL = "\n";
  const pushText = s => { const b = enc.encode(s); chunks.push(b); offset += b.length; };
  const pushBytes = b => { chunks.push(b); offset += b.length; };

  pushText("%PDF-1.3" + NL);
  const rootId = 1, pagesId = 2;
  let nextId = 3;
  const kids = [];
  const objOffsets = [0];

  const writeObj = (id, content) => {
    objOffsets[id] = offset;
    pushText(id + " 0 obj" + NL + content + NL + "endobj" + NL);
  };

  for (const p of pages) {
    const pageId = nextId++;
    const imgId = nextId++;
    const contId = nextId++;
    kids.push(pageId + " 0 R");

    writeObj(imgId, `<< /Type /XObject /Subtype /Image /Width ${p.w} /Height ${p.h} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${p.bytes.length} >>` + NL + "stream" + NL);
    pushBytes(p.bytes);
    pushText(NL + "endstream" + NL);

    const content = `q ${p.w} 0 0 ${p.h} 0 0 cm /Im0 Do Q`;
    const lenContent = enc.encode(content).length + 2;
    writeObj(contId, `<< /Length ${lenContent} >>` + NL + "stream" + NL + content + NL + "endstream");

    writeObj(pageId, `<< /Type /Page /Parent ${pagesId} 0 R /MediaBox [0 0 ${p.w} ${p.h}] /Resources << /XObject << /Im0 ${imgId} 0 R >> >> /Contents ${contId} 0 R >>`);
  }

  writeObj(pagesId, `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`);
  writeObj(rootId, `<< /Type /Catalog /Pages ${pagesId} 0 R >>`);

  const startxref = offset;
  const count = nextId - 1;
  pushText("xref" + NL + "0 " + (count + 1) + NL + "0000000000 65535 f " + NL);
  for (let i = 1; i <= count; i++) {
    const off = String(objOffsets[i] || 0).padStart(10, "0");
    pushText(off + " 00000 n " + NL);
  }
  pushText("trailer" + NL + `<< /Size ${count + 1} /Root ${rootId} 0 R >>` + NL + "startxref" + NL + startxref + NL + "%%EOF");

  let total = 0;
  for (const c of chunks) total += c.length;
  const out = new Uint8Array(total);
  let pos = 0;
  for (const c of chunks) { out.set(c, pos); pos += c.length; }
  return out;
}

async function createPdfBlob() {
  buildReport();
  const c = await renderPdfPage();
  const page = canvasToJpegPage(c);
  const pdfBytes = makePdf([page]);
  return new Blob([pdfBytes], { type: "application/pdf" });
}

async function downloadPdf() {
  try {
    const blob = await createPdfBlob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filenameBase() + ".pdf";
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 1000);
  } catch (e) {
    console.error(e);
    el.msg.textContent = "Errore generazione PDF.";
  }
}
