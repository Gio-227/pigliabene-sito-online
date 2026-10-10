/* Porta di Natale 2026 — configurazione. Si cambia QUI, non nelle pagine.
   Dopo una modifica: commit + push; GitHub Pages può servire la versione vecchia per qualche minuto.
   Date in formato AAAA-MM-GG. Un campo vuoto = in pagina compare il segnaposto fra [quadre]. */
window.PB_NATALE = {
  // URL dell'App web di Apps Script «Porta di Natale» (finisce con /exec). Dal 11/10/2026 (accesso a codice) è lo script
  // a mandare il codice per email e i prezzi a chi ha fatto l'accesso: vuoto = nessuno vede i prezzi.
  ENDPOINT: "https://script.google.com/macros/s/AKfycbxDaWOgGDVe6nsrJ3ADb3Yogi04Z9Wz3jiydd1Cn8MdLSKaywXZhZ3m4j8v-DvliScyTw/exec",

  // Il catalogo sta in natale/catalogo/, noindex: ce lo porta prepara-main.py dal beta.
  CATALOGO_URL: "https://www.pigliabene.it/natale/catalogo/",
  // La porta 01, le confezioni pronte: pagina sorella della stanza.
  CONFEZIONI_URL: "confezioni/",

  // Non più usato dal 11/10/2026: l'email è sempre obbligatoria e verificata con un codice (Gio, 10/10/2026 h23:2x).
  EMAIL_FACOLTATIVA_CON_LINK: false,

  EMAIL: "bottegapigliabene@gmail.com",
  WHATSAPP: "3905751694910",

  // Condizioni decise da Gio (05/10/2026, 01:45 e 14:04; date spostate il 10/10/2026 h17:22):
  // scaglioni di quantità fino al 05/11 (contano solo le confezioni prese in almeno 25 pezzi uguali),
  // −7 % pagamento anticipato su tutto l'ordine fino al 20/11.
  SCAGLIONI_FINO: "2026-11-05",
  ANTICIPATO_FINO: "2026-11-20",

  // Gio (05/10/2026, 14:1x; 10/10/2026 h17:22 dal 15/11 al 20/11): il 20/11 chiudono le promozioni e gli ordini
  // online, solo aziende; dopo si ordina in bottega, secondo disponibilità. Al cliente: «chiusura promozioni il 20/11».
  CHIUSURA_ORDINI: "2026-11-20",
  PREZZI_VALIDI_FINO: "2026-11-20",

  // Consegna: non ancora decisa. Vuoto = la riga non compare (né sulla pagina né nella scheda PDF).
  CONSEGNA: ""
};
