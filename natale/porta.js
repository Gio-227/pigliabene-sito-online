/* Cowork v1.0 | Feel Good srl | Script comune delle pagine di Natale (natale/, natale/confezioni/) | v3.1 | 2026-10-11 CEST (v3.1 — verifica notturna 11/10 h04: «Fai il conto» si ricostruisce ogni volta che arrivano i prezzi — prima si costruiva una volta sola, e una copia vecchia o incompleta nel browser lo lasciava con righe mancanti o con un prezzo non più valido; le quantità scritte sopravvivono; quando i prezzi si coprono il conto si svuota) - 2026-10-11 CEST (v3.0 — Gio 10/10 h23:13: il cancello passa ad accesso.js: email verificata con un codice, accesso personale, prezzi dallo script e non dalla pagina; ?aperto=1 non viaggia più fra le porte) - 2026-10-10 17:30 CEST (v2.2 — «giorni alla fine delle promozioni sui canvas»; date di riserva 05/11 e 20/11) - 2026-10-09 CEST (v2.1 — le porte si aprono senza dati; prezzi coperti con l'avviso fisso)
   Fa tre cose: legge da dove arriva chi visita (?da=, link personale), tiene acceso il punto giusto in testata,
   e fa il conto delle confezioni con i prezzi che arrivano da accesso.js (window.PBAccesso).
   Niente chiamate a terzi da qui: lo script di Gio lo chiama solo accesso.js. */
(function () {
  'use strict';
  var C = window.PB_NATALE || {};
  var EMAIL = C.EMAIL || 'bottegapigliabene@gmail.com';
  var WA = C.WHATSAPP || '3905751694910';
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body, pagina = body.getAttribute('data-pagina') || 'stanza';
  var q = new URLSearchParams(location.search);
  var t0 = Date.now();

  /* --- il nome dell'azienda nel link: /natale/Rossi-Srl (via 404.html → ?per=Rossi-Srl) oppure ?per=Rossi Srl --- */
  function pulisci(s) { return (s || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/\s+/g, ' ').trim(); }
  var perRaw = pulisci(q.get('per'));
  var per = perRaw.replace(/-/g, ' ').replace(/\s+/g, ' ').trim();
  if (per.length > 80) per = per.slice(0, 79) + '…';
  var da = (q.get('da') || '').toLowerCase();
  if (!/^[a-z0-9-]{1,20}$/.test(da)) da = '';
  if (per && !da) da = 'link';
  var origine = da || 'sito';
  var slug = perRaw ? perRaw.replace(/\s+/g, '-') : '';

  /* la barra dell'indirizzo mostra il link pulito: /natale/Rossi-Srl (la pagina è già caricata, non si ricarica) */
  if (slug && pagina === 'stanza' && history.replaceState) {
    try {
      var baseDir = location.pathname.replace(/[^\/]*$/, '');   // …/natale/
      history.replaceState(null, '', baseDir + encodeURIComponent(slug).replace(/%2D/gi, '-') + location.hash);
    } catch (e) { }
  }

  /* --- testata: il punto in cui sei resta acceso; su telefono scompare scorrendo in giù e torna scorrendo in su --- */
  var testata = document.querySelector('header.testata');
  if (testata) {
    var ultimo = window.pageYOffset || 0, piccolo = window.matchMedia('(max-width:640px)');
    window.addEventListener('scroll', function () {
      var y = window.pageYOffset || 0;
      if (!piccolo.matches) { testata.classList.remove('via'); ultimo = y; return; }
      if (y > ultimo + 6 && y > 120) testata.classList.add('via');
      else if (y < ultimo - 6) testata.classList.remove('via');
      ultimo = y;
    }, { passive: true });
  }

  /* --- WhatsApp: il testo dice da dove arriva chi scrive --- */
  var frasi = {
    qr: 'Ciao, ho visto il manifesto di Natale.',
    mail: 'Ciao, dalla mail del catalogo di Natale.',
    wa: 'Ciao, dal messaggio di Natale su WhatsApp.',
    ig: 'Ciao, da Instagram.',
    pdf: 'Ciao, dalla scheda delle confezioni di Natale.',
    home: 'Ciao, dal sito, pagina di Natale.'
  };
  function fraseWA() {
    if (per) return 'Ciao, sono di ' + per + ': ho aperto la pagina di Natale che ci avete mandato.';
    return frasi[da] || 'Ciao, dalla pagina di Natale per le aziende.';
  }
  function linkWA(testo) { return 'https://wa.me/' + WA + '?text=' + encodeURIComponent(testo); }
  Array.prototype.forEach.call(document.querySelectorAll('.js-wa'), function (a) { a.href = linkWA(fraseWA()); });

  /* --- «Preparato per …»: il nome dell'azienda in testa --- */
  var h1 = document.querySelector('h1');
  if (per) {
    document.title = per + ' · Regali aziendali di Natale 2026 · Piglia Bene';
    var perBox = $('per-box');
    if (perBox) {
      perBox.hidden = false;
      var nome = $('per-nome'); if (nome) nome.textContent = per;
      var h1std = $('h1-standard'); if (h1std) h1std.hidden = true;
      h1 = $('per-nome');
    }
    Array.prototype.forEach.call(document.querySelectorAll('.js-per'), function (e) { e.textContent = per; });
    Array.prototype.forEach.call(document.querySelectorAll('.js-per-frase'), function (e) { e.hidden = false; });
    var fA = $('f-azienda'); if (fA) fA.value = per;
  }
  /* un nome lungo si stringe finché la riga più lunga ci sta (misura vera, non stima) */
  function adatta(el) {
    if (!el) return;
    var fs = parseFloat(getComputedStyle(el).fontSize), largo = el.clientWidth, giri = 0;
    while (el.scrollWidth > largo + 1 && fs > 22 && giri < 40) { fs *= 0.94; el.style.fontSize = fs + 'px'; giri++; }
  }
  if (h1) { adatta(h1); window.addEventListener('resize', function () { h1.style.fontSize = ''; adatta(h1); }); }

  /* --- date: si scrivono in config.js --- */
  var MESI = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
  function parseData(s) { var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s || ''); return m ? Date.UTC(+m[1], +m[2] - 1, +m[3]) : null; }
  function scrivi(d) { var x = new Date(d); return x.getUTCDate() + ' ' + MESI[x.getUTCMonth()]; }
  function oggiRoma() {
    try {
      var p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
      return parseData(p);
    } catch (e) { var n = new Date(); return Date.UTC(n.getFullYear(), n.getMonth(), n.getDate()); }
  }
  var oggi = oggiRoma(), G = 864e5;
  var dSc = parseData(C.SCAGLIONI_FINO || '2026-11-05');
  var dAn = parseData(C.ANTICIPATO_FINO || '2026-11-20');
  var dCh = parseData(C.CHIUSURA_ORDINI);
  Array.prototype.forEach.call(document.querySelectorAll('.js-chiusura'), function (e) { if (dCh) e.textContent = scrivi(dCh); });
  Array.prototype.forEach.call(document.querySelectorAll('.js-scaglioni'), function (e) { if (dSc) e.textContent = scrivi(dSc); });
  Array.prototype.forEach.call(document.querySelectorAll('.js-anticipato'), function (e) { if (dAn) e.textContent = scrivi(dAn); });
  if (C.CONSEGNA && $('cond-consegna')) { $('cond-consegna').textContent = C.CONSEGNA; $('riga-consegna').hidden = false; }

  function giorni(d) { return Math.round((d - oggi) / G); }
  function conto(n, titolo, resto) {
    var nn = $('conto-n'), co = $('conto-cosa'); if (!co) return;
    co.textContent = '';
    var b = document.createElement('b'); b.textContent = titolo; co.appendChild(b);
    co.appendChild(document.createTextNode(resto));
    if (n === null) { nn.hidden = true; $('conto').classList.add('senza-n'); return; }
    nn.textContent = n;
  }
  if ($('conto')) {
    if (dSc !== null && oggi <= dSc) {
      var n1 = giorni(dSc);
      if (n1 === 0) conto(null, 'Oggi è l’ultimo giorno', ' delle promozioni sui canvas.');
      else conto(n1, n1 === 1 ? 'Giorno' : 'Giorni', ' alla fine delle promozioni sui canvas');   // Gio, 10/10/2026 h17:22
    } else if (dAn !== null && oggi <= dAn) {
      var n2 = giorni(dAn), insieme = dCh === dAn;
      if (n2 === 0) conto(null, 'Oggi chiudono le promozioni', insieme ? ' Ultimo giorno per ordinare online e per il −7 % con pagamento anticipato.' : ' Ultimo giorno del −7 % con pagamento anticipato.');
      else conto(n2, n2 === 1 ? 'Giorno' : 'Giorni', ' alla chiusura delle promozioni: −7 % con pagamento anticipato fino al ' + scrivi(dAn) + '.');
    } else if (dCh !== null && oggi <= dCh) {
      var n3 = giorni(dCh);
      if (n3 === 0) conto(null, 'Oggi', ' è l’ultimo giorno per ordinare.');
      else conto(n3, n3 === 1 ? 'Giorno' : 'Giorni', ' all’ultimo giorno per ordinare: ' + scrivi(dCh) + '.');
    } else {
      conto(null, 'Promozioni chiuse', dCh ? ' il ' + scrivi(dCh) + '. Si ordina in bottega, secondo disponibilità.' : '');
    }
  }

  /* --- fai il conto (pagina confezioni): la stessa regola della pagina Ordini del Database (Gio, 05/10/2026).
         I prezzi non stanno nella pagina: arrivano da accesso.js dopo l'accesso (chiave «c:<id canvas>»). --- */
  var quantitaScritte = {};   // chiave → quantità: sopravvive quando il conto si ricostruisce coi prezzi nuovi
  function svuotaConto() {
    var box = $('calcola'), cont = $('calc-righe');
    if (!box) return;
    if (cont) cont.textContent = '';
    if ($('calc-tot')) $('calc-tot').textContent = '';
    if ($('calc-consiglio')) $('calc-consiglio').textContent = '';
    if ($('calc-wa')) $('calc-wa').hidden = true;
    box.hidden = true;
    contoCorrente = null;
  }
  var contoCorrente = null;   // il «calcola» del conto costruito per ultimo: la spunta dell'anticipato chiama sempre quello
  function preparaConto(prezzi) {
    var box = $('calcola'), arts = document.querySelectorAll('article.canvas[data-chiave]');
    if (!box) return;
    Array.prototype.forEach.call(document.querySelectorAll('#calc-righe input'), function (i) { var v = parseInt(i.value, 10); if (v > 0) quantitaScritte[i.getAttribute('data-chiave')] = v; });
    svuotaConto();
    var chiuse = (dAn !== null && oggi > dAn) || (dCh !== null && oggi > dCh);
    if (!arts.length || chiuse) return;
    var entroSc = dSc !== null && oggi <= dSc;
    var righe = [], cont = $('calc-righe');
    function euro(v) { return v.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' €'; }
    Array.prototype.forEach.call(arts, function (a, i) {
      var chiave = a.getAttribute('data-chiave'), p = prezzi[chiave];
      var r = { nome: a.getAttribute('data-nome') || '', prezzo: p && typeof p[1] === 'number' ? p[1] : NaN, q: 0 };
      if (!(r.prezzo > 0)) return;
      var riga = document.createElement('div'); riga.className = 'calc-riga';
      var lab = document.createElement('label'); lab.htmlFor = 'q-' + i;
      var nm = document.createElement('span'); nm.className = 'calc-nome'; nm.textContent = r.nome;
      var pr = document.createElement('span'); pr.className = 'calc-prezzo'; pr.textContent = euro(r.prezzo) + ' a confezione';
      lab.appendChild(nm); lab.appendChild(pr);
      var inp = document.createElement('input'); inp.type = 'number'; inp.id = 'q-' + i; inp.min = '0'; inp.step = '1';
      inp.inputMode = 'numeric'; inp.placeholder = '0'; inp.setAttribute('aria-label', 'Quante «' + r.nome + '»'); inp.setAttribute('data-chiave', chiave);
      if (quantitaScritte[chiave]) inp.value = quantitaScritte[chiave];
      var out = document.createElement('span'); out.className = 'r-esito';
      riga.appendChild(lab); riga.appendChild(out); riga.appendChild(inp);
      cont.appendChild(riga);
      r.inp = inp; r.out = out; righe.push(r);
      inp.addEventListener('input', calcola);
    });
    if (!righe.length) return;
    contoCorrente = calcola;
    var ant = $('calc-ant');
    if (ant && !ant.getAttribute('data-ascolta')) { ant.setAttribute('data-ascolta', '1'); ant.addEventListener('change', function () { if (contoCorrente) contoCorrente(); }); }
    box.hidden = false;
    if (righe.some(function (r) { return r.inp.value; })) calcola();
    function voce(dl, k, v, cls) {
      var d = document.createElement('div'); if (cls) d.className = cls;
      var t = document.createElement('dt'); t.textContent = k; var x = document.createElement('dd'); x.textContent = v;
      d.appendChild(t); d.appendChild(x); dl.appendChild(d);
    }
    function calcola() {
      var ant = $('calc-ant').checked ? 0.93 : 1, qual = 0, tot = 0, lordo = 0, netto = 0;
      righe.forEach(function (r) { var v = parseInt(r.inp.value, 10); r.q = v > 0 ? Math.min(v, 99999) : 0; tot += r.q; if (r.q >= 25) qual += r.q; });
      var tier = !entroSc ? 0 : qual >= 200 ? 10 : qual >= 100 ? 8 : qual >= 50 ? 6 : qual >= 25 ? 4 : 0;
      righe.forEach(function (r) {
        var sc = r.q >= 25 ? tier : 0, l = r.prezzo * r.q, n = l * (1 - sc / 100) * ant;
        lordo += l; netto += n;
        r.out.className = 'r-esito' + (sc || ant < 1 ? ' sconto' : '');
        r.out.textContent = r.q ? (sc ? '−' + sc + ' %' : 'prezzo pieno') + (ant < 1 ? ' · −7 %' : '') + ' · ' + euro(n) : '';
      });
      var dl = $('calc-tot'); dl.textContent = '';
      var cons = $('calc-consiglio'); cons.textContent = '';
      var wa = $('calc-wa');
      if (!tot) { wa.hidden = true; return; }
      voce(dl, 'Confezioni', String(tot));
      voce(dl, 'Sconto di quantità', !entroSc ? 'chiuso il ' + scrivi(dSc) : tier ? '−' + tier + ' % su ' + qual + ' pezzi' : 'nessuno');
      if (ant < 1) voce(dl, 'Pagamento anticipato', '−7 % su tutto');
      if (netto < lordo - 0.004) voce(dl, 'Risparmi', euro(lordo - netto));
      voce(dl, 'Totale, IVA esclusa', euro(netto), 'tot');
      if (entroSc) {
        var vicino = righe.filter(function (r) { return r.q >= 15 && r.q < 25; })[0];
        if (vicino) cons.textContent = 'Con ' + (25 - vicino.q) + ' «' + vicino.nome + '» in più' + (qual ? ', anche quella entra nello sconto di quantità.' : ' arrivi a 25 pezzi uguali: −4 %.');
        else if (!tier) cons.textContent = 'Lo sconto di quantità parte da 25 pezzi della stessa confezione.';
      }
      var testo = ['Ciao' + (per ? ', sono di ' + per : '') + '. Vorrei un preventivo per le confezioni di Natale:'];
      righe.forEach(function (r) { if (r.q) testo.push(r.q + ' × ' + r.nome); });
      testo.push('Pagamento anticipato: ' + (ant < 1 ? 'sì' : 'no'));
      testo.push('Totale indicativo: ' + euro(netto) + ' IVA esclusa (' + origine + ')');
      wa.href = linkWA(testo.join('\n')); wa.hidden = false;
    }
  }

  /* --- le porte: il nome dell'azienda e l'origine viaggiano con chi passa; i prezzi no (accesso.js, dal 11/10/2026) --- */
  var catalogo = (C.CATALOGO_URL || 'https://www.pigliabene.it/natale/catalogo/');
  var confezioni = (C.CONFEZIONI_URL || 'confezioni/');
  function conCoda(url) {
    var p = []; if (slug) p.push('per=' + encodeURIComponent(slug)); if (da) p.push('da=' + encodeURIComponent(da));
    return url + (p.length ? (url.indexOf('?') >= 0 ? '&' : '?') + p.join('&') : '');
  }
  Array.prototype.forEach.call(document.querySelectorAll('[data-porta]'), function (a) {
    var porta = a.getAttribute('data-porta');
    if (porta === 'catalogo') { a.href = conCoda(catalogo); a.target = '_blank'; a.rel = 'noopener'; }
    else if (porta === 'confezioni') a.href = conCoda(confezioni);
  });

  /* --- pagina confezioni: «Fai il conto» quando arrivano i prezzi --- */
  if (pagina === 'confezioni' && window.PBAccesso) {
    window.PBAccesso.quando(preparaConto);
    if (window.PBAccesso.quandoCoperti) window.PBAccesso.quandoCoperti(function () { preparaConto({}); });   // prezzi coperti: il conto si svuota
  }
})();
