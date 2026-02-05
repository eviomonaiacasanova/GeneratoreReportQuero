# Generatore di Report

Questo progetto è una **pagina web statica** che permette la compilazione guidata e la condivisione di **report di intervento**.  
Il report viene aggiornato automaticamente mentre si compilano i campi e può essere condiviso via email o messaggistica, stampato o esportato in PDF.  
Non richiede backend ed è pensato per un utilizzo interno, sviluppato in **HTML** e **JavaScript**.

## ✨ Funzionalità

- **Compilazione guidata** tramite form (campi testo, menù a tendina, selettori).
- **Generazione automatica** in tempo reale del report finale in sola lettura.
- **NUOVO REPORT** per ripulire la compilazione e ricominciare.
- **Condivisione** del report via:
  - **Email**
  - **PDF**
  - **Appunti**

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
   - Stampare o salvare in **PDF**

## 🔒 Accesso

Il progetto è destinato ad hosting statico.  
Per limitarne l’uso ai soli colleghi può essere protetto tramite autenticazione esterna (es. **Microsoft 365 / Azure AD**, **Cloudflare Access**).

## 📌 Note

- Uso interno.
- Nessun dato viene salvato su server: tutto resta sul dispositivo fino all’invio del report.
- Versionamento a partire da **5.0.16**.

---

## 📜 Changelog
