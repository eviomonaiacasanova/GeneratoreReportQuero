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

### 5.3.10 – 2025-10-06
- **Aggiunto:** reintroduzione del logo grande centrato nei PDF, ora gestito automaticamente anche su report multipagina.  
- **Aggiunto:** visualizzazione della **versione corrente** sia nel testo generato che nel PDF, per facilitare il tracciamento dei feedback.  
- **Cambiato:** migliorato allineamento del campo anomalia e ottimizzata la distribuzione dei pulsanti nella sezione finale.  
- **Risolto:** errore di formattazione nei PDF generati su browser mobile e su stampa diretta.  

### 5.3.8 – 2025-10-06
- **Aggiunto:** pulsante per allegare fino a 3 foto al report, incluse automaticamente nei PDF multipagina.
- **Cambiato:** il campo anomalia è stato esteso per mantenere la scritta “(tocca per selezionare/deselezionare)” su una sola riga.
- **Risolto:** compatibilità della condivisione PDF su Android e desktop.

### 5.3.6 – 2025-10-04
- **Aggiunto:** campo versione nel testo generato e nel PDF per facilitare i feedback.
- **Cambiato:** migliorata la formattazione del testo del report per la stampa.
- **Risolto:** duplicazione di intestazioni nei PDF generati in sequenza.

### 5.3.3 – 2025-10-01
- **Aggiunto:** auto-wipe giornaliero dei dati salvati in locale dopo 24 ore.
- **Cambiato:** migliorato comportamento del pulsante “Nuovo report” all’apertura.
- **Risolto:** testo non aggiornato dopo il reset automatico.

### 5.3.2 – 2025-09-30
- **Aggiunto:** messaggio di conferma prima del reset del report.
- **Cambiato:** tema grafico aggiornato per maggiore leggibilità in ambienti scuri.
- **Risolto:** errori casuali nel rendering del testo durante l’anteprima.

### 5.3.1 – 2025-09-29
- **Aggiunto:** controllo automatico della versione al caricamento.
- **Cambiato:** struttura del PDF con separatore visivo tra sezioni.
- **Risolto:** bug minore nella gestione del logo.

### 5.2.0 – 2025-09-20
- **Aggiunto:** nuova struttura del changelog per versioni future.
- **Cambiato:** uniformato stile e naming dei pulsanti principali.
- **Risolto:** piccoli bug di persistenza dati tra sessioni.

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
