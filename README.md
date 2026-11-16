# Generatore di Report

Questo progetto è una **pagina web statica** che permette la compilazione guidata e la condivisione di un **report di intervento**.  
Il report viene aggiornato automaticamente mentre si compilano i campi e può essere condiviso via email, messaggistica, stampato o esportato in PDF.

## ✨ Funzionalità

- **Compilazione guidata** tramite form (campi testo, menù a tendina, selettori).
- **Generazione automatica** in tempo reale del report finale in sola lettura.
- **Condivisione** del report via:
  - **Email**
  - **PDF**
  - **Appunti**

## ⚙️ Requisiti

- Browser (Chrome, Firefox, Safari, Edge per scaricare uno dei broser precedenti).
- Nessun backend richiesto: tutto gira lato client.

## 🚀 Come usarlo

1. Aprire `index.html` in un browser.
2. Compilare i campi del form.
3. Il report viene aggiornato automaticamente durante la compilazione.
4. Scaricare e inviare report secondo metodo preferito.

### Selezione del reparto

- Quero (predefinito): `https://eviomonaiacasanova.github.io/GeneratoreReportQuero/` oppure `https://eviomonaiacasanova.github.io/GeneratoreReportQuero/?plant=plantQuero`
- Arsiè: `https://eviomonaiacasanova.github.io/GeneratoreReportQuero/?plant=plantArsie`

Il parametro `plant` seleziona la lista degli impianti e aggiorna il reparto mostrato nella pagina e nel PDF.

## 📌 Note

- Nessun dato viene salvato su server: tutto resta sul dispositivo fino all’invio del report.
