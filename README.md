# Generatore di Report

Questo progetto è una **pagina web statica** che permette la compilazione guidata e la condivisione di **report di intervento**.  
Il report viene aggiornato automaticamente mentre si compilano i campi e può essere condiviso via email o messaggistica, stampato o esportato in PDF.  
Non richiede backend ed è pensato per un utilizzo interno, sviluppato in **HTML** e **JavaScript**.

## ✨ Funzionalità
- **Compilazione guidata** tramite form (campi testo, menù a tendina, selettori).
- **Generazione automatica** in tempo reale del report finale in sola lettura.
- **NUOVO REPORT** per ripulire la compilazione e ricominciare.
- **Condivisione** del report via:
  - **Email** (destinatari configurabili).
- **Esportazione PDF** e pulsante **Condividi PDF**.
- **Branding**: titolo pagina “Generatore” e logo `logo_egp.png`.
- **Opzione ALTRO** nel campo anomalia.
- **Donazione volontaria** tramite Satispay.

## ⚙️ Requisiti
- Browser moderno (Chrome, Edge, Firefox, Safari).
- Nessun backend richiesto: tutto gira lato client.
- Opzionale: **localStorage** per ricordare i dati inseriti.

## 🚀 Come usarlo
1. Aprire `index.html` in un browser.
2. Compilare i campi del form.
3. Il report viene aggiornato automaticamente durante la compilazione.
4. Possibilità di:
   - Condividere via **email**
   - Condividere su **WhatsApp** o **Telegram**
   - Stampare o salvare in **PDF**
   - Condividere direttamente in **PDF**
   - Effettuare una **donazione** via Satispay

## 🔒 Accesso
Il progetto è destinato ad hosting statico.  
Per limitarne l’uso ai soli colleghi può essere protetto tramite autenticazione esterna (es. **Microsoft 365 / Azure AD**, **Cloudflare Access**).

## 📌 Note
- Uso interno.
- Nessun dato viene salvato su server: tutto resta sul dispositivo fino all’invio del report.
- Versionamento a partire da **5.0.16**.

---

## 📜 Changelog

### 5.1.1 – 2025-10-10
- **Aggiunto:** migliorata gestione della condivisione PDF con compatibilità desktop/mobile.
- **Cambiato:** campo anomalia reso più ampio e ottimizzato il layout per non spostare i pulsanti.
- **Risolto:** apertura pagina bianca su alcuni dispositivi Android alla condivisione PDF.

### 5.1.0 – 2025-10-08
- **Aggiunto:** prime accortezze per la **sicurezza** (header anti-tracking, auto-wipe dei dati).
- **Cambiato:** rimozione del pulsante “Cancella dati”, sostituito dal comportamento del pulsante **NUOVO REPORT**.
- **Aggiunto:** pulsante **Condividi PDF** accanto a “Stampa PDF”.
- **Aggiunto:** opzione **ALTRO** nel campo anomalia.

### 5.0.24 – 2025-10-04
- **Cambiato:** interfaccia più leggibile con tema chiaro/scuro automatico.
- **Risolto:** piccoli bug grafici su Firefox.

### 5.0.23 – 2025-10-02
- **Cambiato:** testo del report formattato con etichette più chiare.

### 5.0.22 – 2025-09-30
- **Aggiunto:** esportazione diretta in **PDF** dal browser.
- **Cambiato:** formattazione del report ottimizzata per stampa.

### 5.0.21 – 2025-09-28
- **Cambiato:** UI ottimizzata per schermi piccoli.
- **Risolto:** duplicazione del testo in alcuni client email.

### 5.0.19 – 2025-09-25
- **Aggiunto:** note esplicative accanto ai campi principali del form.
- **Cambiato:** generazione subject email più leggibile (`[REPORT] Impianto – data`).
- **Risolto:** margini e spaziatura nel report live.

### 5.0.18 – 2025-09-23
- **Aggiunto:** logo, pulsante **NUOVO REPORT**, file di configurazione.
- **Cambiato:** titolo pagina `<title>` impostato a **Generatore**.

### 5.0.17 – 2025-09-22
- **Aggiunto:** pulsanti di condivisione per **WhatsApp**, **Telegram** ed **Email**.
- **Aggiunto:** generazione automatica del report durante la compilazione.
- **Cambiato:** layout semplificato per mobile.

### 5.0.16 – 2025-09-20
- **Aggiunto:** prima versione con form HTML base e pulsante “Genera report”.
