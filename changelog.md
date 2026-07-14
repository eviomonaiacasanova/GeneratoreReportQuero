# Changelog

## 6.1.0 - 2026-07-14

- Aggiunta la selezione del reparto tramite il parametro URL `plant`.
- Separate le liste impianti di Quero e Arsiè.
- Aggiornata automaticamente l'intestazione del reparto nella pagina e nei PDF.

## 6.0.0 - 2026-02-06

- ✏️ Migrazione codice su Alpinejs

## 5.5.0 - 2026-02-05

- ✏️ Riscritto e riordinato codice. Adesso è più leggibile
- 🆕 Uso librerie jsPDF
- Passo successivo migrazione a Alpinejs

## 5.4.1 - 2025-11-16

- 🗑️ Rimossi i pulsanti "Carica" dagli slot foto: il caricamento avviene cliccando sul riquadro/icona fotocamera
- ✏️ Pulsante "Elimina" rinominato in "Elimina foto" e visibile solo se è presente un'immagine nello slot
- 🆕 Aggiunto riquadro "Note operatore" (riportato anche in report, PDF e layout stampa)
- ✏️ Titolo del riquadro "Report generato" semplificato, mantenendo la riga finale con la VERSIONE
- ✏️ Migliorata leggibilità dei pulsanti e delle chip (colori più chiari per uso da mobile)
- 🆕 Aggiunta icona predefinita Font Awesome `fa-camera` nei riquadri foto, cliccabile per caricare immagini

## 5.4.0 - 2025-11-14

- Separati i pulsanti di stampa e download PDF
- 🆕 Introdotta generazione PDF diretta da canvas A4 con logo grande e footer versione
- ✏️ Standardizzato il nome file: IMPIANTO - TIPO ALLARME - DDMMYYYY.pdf
- 🆕 Aggiunto pulsante Mail con oggetto IMPIANTO - TIPO ALLARME - ORA - DDMMYYYY e corpo auto-compilato dal report
- 🆕 Aggiornata versione visibile in interfaccia e nel footer di stampa a v5.4.0

## 5.3.10 – 2025-10-06

- 🆕 reintroduzione del logo grande centrato nei PDF, ora gestito automaticamente anche su report multipagina.  
- 🆕 visualizzazione della **versione corrente** sia nel testo generato che nel PDF, per facilitare il tracciamento dei feedback.  
- ✏️ migliorato allineamento del campo anomalia e ottimizzata la distribuzione dei pulsanti nella sezione finale.  
- 🗑️ errore di formattazione nei PDF generati su browser mobile e su stampa diretta.  

## 5.3.8 – 2025-10-06

- 🆕 pulsante per allegare fino a 3 foto al report, incluse automaticamente nei PDF multipagina.
- ✏️ il campo anomalia è stato esteso per mantenere la scritta “(tocca per selezionare/deselezionare)” su una sola riga.
- 🗑️ compatibilità della condivisione PDF su Android e desktop.

## 5.3.6 – 2025-10-04

- 🆕 campo versione nel testo generato e nel PDF per facilitare i feedback.
- ✏️ migliorata la formattazione del testo del report per la stampa.
- 🗑️ duplicazione di intestazioni nei PDF generati in sequenza.

## 5.3.3 – 2025-10-01

- 🆕 auto-wipe giornaliero dei dati salvati in locale dopo 24 ore.
- ✏️ migliorato comportamento del pulsante “Nuovo report” all’apertura.
- 🗑️ testo non aggiornato dopo il reset automatico.

## 5.3.2 – 2025-09-30

- 🆕 messaggio di conferma prima del reset del report.
- ✏️ tema grafico aggiornato per maggiore leggibilità in ambienti scuri.
- 🗑️ errori casuali nel rendering del testo durante l’anteprima.

## 5.3.1 – 2025-09-29

- 🆕 controllo automatico della versione al caricamento.
- ✏️ struttura del PDF con separatore visivo tra sezioni.
- 🗑️ bug minore nella gestione del logo.

## 5.2.0 – 2025-09-20

- 🆕 nuova struttura del changelog per versioni future.
- ✏️ uniformato stile e naming dei pulsanti principali.
- 🗑️ piccoli bug di persistenza dati tra sessioni.

## 5.1.1 – 2025-10-10

- 🆕 migliorata gestione della condivisione PDF con compatibilità desktop/mobile.
- ✏️ campo anomalia reso più ampio e ottimizzato il layout per non spostare i pulsanti.
- 🗑️ apertura pagina bianca su alcuni dispositivi Android alla condivisione PDF.

## 5.1.0 – 2025-10-08

- 🆕 prime accortezze per la **sicurezza** (header anti-tracking, auto-wipe dei dati).
- ✏️ rimozione del pulsante “Cancella dati”, sostituito dal comportamento del pulsante **NUOVO REPORT**.
- 🆕 pulsante **Condividi PDF** accanto a “Stampa PDF”.
- 🆕 opzione **ALTRO** nel campo anomalia.

## 5.0.24 – 2025-10-04

- ✏️ interfaccia più leggibile con tema chiaro/scuro automatico.
- 🗑️ piccoli bug grafici su Firefox.

## 5.0.23 – 2025-10-02

- ✏️ testo del report formattato con etichette più chiare.

## 5.0.22 – 2025-09-30

- 🆕 esportazione diretta in **PDF** dal browser.
- ✏️ formattazione del report ottimizzata per stampa.

## 5.0.21 – 2025-09-28

- ✏️ UI ottimizzata per schermi piccoli.
- 🗑️ duplicazione del testo in alcuni client email.

## 5.0.19 – 2025-09-25

- 🆕 note esplicative accanto ai campi principali del form.
- ✏️ generazione subject email più leggibile (`[REPORT] Impianto – data`).
- 🗑️ margini e spaziatura nel report live.

## 5.0.18 – 2025-09-23

- 🆕 logo, pulsante **NUOVO REPORT**, file di configurazione.
- ✏️ titolo pagina `<title>` impostato a **Generatore**.

## 5.0.17 – 2025-09-22

- 🆕 pulsanti di condivisione per **WhatsApp**, **Telegram** ed **Email**.
- 🆕 generazione automatica del report durante la compilazione.
- ✏️ layout semplificato per mobile.

## 5.0.16 – 2025-09-20

- 🆕 prima versione con form HTML base e pulsante “Genera report”.
