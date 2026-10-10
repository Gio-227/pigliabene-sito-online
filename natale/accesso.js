/* Cowork v1.0 | Feel Good srl | Accesso ai prezzi di Natale 2026 (natale/confezioni/ e catalogo) | v1.0 | 2026-10-11 CEST
   Gio, 10/10/2026 h23:2x: «la email va inserita obbligatoria e verificata», «non una chiave unica che valga per chiunque:
   un login o molto simile». Quindi: dati → codice di 6 cifre per email → accesso personale (revocabile da Gio nel foglio).
   I prezzi NON stanno nella pagina: li manda lo script di Gio (config.js → ENDPOINT) solo a chi ha un accesso valido.
   ?aperto=1 non apre più niente; il vecchio segno nel browser («pbNatale2026Aperto») si cancella: chi era dentro rifà l'accesso.
   Nel browser restano solo l'accesso (un gettone casuale) e l'ultima copia dei prezzi, per mostrarli subito alla visita dopo. */
(function () {
  'use strict';
  var C = window.PB_NATALE || {};
  var EP = C.ENDPOINT || '';
  var $ = function (id) { return document.getElementById(id); };
  var body = document.body;
  var K_ACC = 'pbNatale2026Accesso', K_PZ = 'pbNatale2026Prezzi';
  var t0 = Date.now();

  function leggi(k) { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch (e) { return null; } }
  function scrivi(k, v) { try { if (v == null) localStorage.removeItem(k); else localStorage.setItem(k, JSON.stringify(v)); } catch (e) { } }
  try { localStorage.removeItem('pbNatale2026Aperto'); } catch (e) { }   // il segno di prima del 11/10/2026 non vale più

  function oggiIso() {
    try { return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date()); }
    catch (e) { return new Date().toISOString().slice(0, 10); }
  }
  var acc = leggi(K_ACC);   // { token, scade, email, nome, azienda }
  if (acc && (!acc.token || (acc.scade && oggiIso() > acc.scade))) { acc = null; scrivi(K_ACC, null); scrivi(K_PZ, null); }

  /* da dove arriva chi compila (lo stesso di porta.js) */
  var q = new URLSearchParams(location.search);
  var per = (q.get('per') || '').replace(/[\u0000-\u001f\u007f<>]/g, '').replace(/-/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 80);
  var da = (q.get('da') || '').toLowerCase(); if (!/^[a-z0-9-]{1,20}$/.test(da)) da = ''; if (per && !da) da = 'link';
  var origine = da || (body.getAttribute('data-pagina') || 'sito');

  /* ---------- lo script di Gio ---------- */
  function chiama(dati) {
    if (!EP) return Promise.reject(new Error('spento'));
    var ctrl = ('AbortController' in window) ? new AbortController() : null;
    var timer = setTimeout(function () { if (ctrl) ctrl.abort(); }, 25000);
    return fetch(EP, { method: 'POST', body: JSON.stringify(dati), headers: { 'Content-Type': 'text/plain;charset=utf-8' }, signal: ctrl ? ctrl.signal : undefined })
      .then(function (r) { clearTimeout(timer); return r.json(); }, function (e) { clearTimeout(timer); throw e; });
  }
  var ERR_RETE = 'Non riusciamo a raggiungere il nostro modulo: riprova fra un minuto o scrivici su WhatsApp.';

  /* ---------- i prezzi in pagina ---------- */
  var prezzi = null, ascolti = [];
  var SEGNA = '··,·· €';
  function riempi(el, et) {
    el.textContent = et;
    if (el.hasAttribute('data-iva') && /\d/.test(et)) { var s = document.createElement('small'); s.textContent = ' + IVA'; el.appendChild(s); }
  }
  function applica(t) {
    prezzi = t || {};
    Array.prototype.forEach.call(document.querySelectorAll('[data-pz]'), function (el) {
      var p = prezzi[el.getAttribute('data-pz')];
      riempi(el, p ? String(p[0]) : '—');
    });
    body.classList.remove('senza-prezzi', 'in-attesa');
    body.classList.add('con-prezzi');
    ascolti.forEach(function (fn) { try { fn(prezzi); } catch (e) { } });
  }
  function copri() {
    prezzi = null;
    Array.prototype.forEach.call(document.querySelectorAll('[data-pz]'), function (el) { riempi(el, SEGNA); });
    body.classList.remove('con-prezzi', 'in-attesa');
    body.classList.add('senza-prezzi');
  }
  function entra(r) {   // risposta di «verifica»
    acc = { token: r.token, scade: r.scade || '', email: r.email || '', nome: r.nome || '', azienda: r.azienda || '' };
    scrivi(K_ACC, acc);
    scrivi(K_PZ, { token: r.token, t: r.prezzi || {}, v: r.versione || '' });
    applica(r.prezzi || {});
  }
  function esci(soloQui) {
    var vecchio = acc;
    acc = null; scrivi(K_ACC, null); scrivi(K_PZ, null); copri();
    if (!soloQui && vecchio && vecchio.token) chiama({ azione: 'esci', token: vecchio.token }).catch(function () { });
  }

  /* all'apertura: prima la copia salvata (subito), poi la conferma dello script */
  if (acc) {
    var salvati = leggi(K_PZ);
    if (salvati && salvati.token === acc.token && salvati.t) applica(salvati.t);
    else { copri(); body.classList.add('in-attesa'); }
    chiama({ azione: 'prezzi', token: acc.token }).then(function (r) {
      if (r && r.ok) {
        var s = leggi(K_PZ);
        scrivi(K_PZ, { token: acc.token, t: r.prezzi, v: r.versione });
        if (!prezzi || !s || s.v !== r.versione) applica(r.prezzi);
      } else if (r && r.esci) { esci(true); }
      else if (!prezzi) copri();
    }, function () { if (!prezzi) copri(); });
  } else {
    copri();
  }

  /* ---------- la finestra: dati → codice → dentro ---------- */
  var cancello = $('cancello');
  var dentro = cancello ? cancello.querySelector('.cancello-dentro') : null;
  var f = $('modulo');
  var titolo = $('cancello-h');
  var perche = cancello ? cancello.querySelector('.perche') : null;
  var TESTI = {
    dati: ['Vedi i prezzi', 'I prezzi sono riservati alle aziende. Lascia i tuoi dati: ti mandiamo un <b>codice per email</b> e con quello si aprono i prezzi, il conto degli sconti e la scheda PDF. Ti ricontattiamo solo per il preventivo.'],
    codice: ['Controlla la posta', ''],
    solo: ['Bentornato', 'Scrivi l’email con cui hai già fatto l’accesso: ti mandiamo un codice nuovo.']
  };
  function el(tag, attr, testo) {
    var e = document.createElement(tag);
    if (attr) Object.keys(attr).forEach(function (k) { if (k === 'class') e.className = attr[k]; else e.setAttribute(k, attr[k]); });
    if (testo) e.textContent = testo;
    return e;
  }
  function bottoneLink(testo, fn) { var b = el('button', { type: 'button', 'class': 'passo-link' }, testo); b.addEventListener('click', fn); return b; }

  var passoCodice, passoSolo, cCodice, cEsito, cInvia, cDove, sEmail, sEsito, sInvia, ultima = null;
  if (dentro && f) {
    var bInvia = $('invia'); if (bInvia) bInvia.textContent = 'Mandami il codice';
    var giaDentro = el('p', { 'class': 'passo-altro' });
    giaDentro.appendChild(document.createTextNode('Hai già fatto l’accesso da un altro dispositivo? '));
    giaDentro.appendChild(bottoneLink('Mandami solo il codice', function () { mostra('solo'); }));
    f.appendChild(giaDentro);

    // passo 2: il codice
    passoCodice = el('form', { id: 'passo-codice', 'class': 'modulo passo', novalidate: '' });
    passoCodice.hidden = true;
    cDove = el('p', { 'class': 'perche' });
    var campoC = el('div', { 'class': 'campo' });
    campoC.appendChild(el('label', { 'for': 'f-codice' }, 'Il codice di 6 cifre'));
    cCodice = el('input', { type: 'text', id: 'f-codice', name: 'codice', inputmode: 'numeric', autocomplete: 'one-time-code', maxlength: '6', pattern: '[0-9]{6}', 'class': 'codice' });
    campoC.appendChild(cCodice);
    passoCodice.appendChild(cDove);
    passoCodice.appendChild(campoC);
    var bc = el('div', { 'class': 'bottoni' }); cInvia = el('button', { type: 'submit', 'class': 'cta pieno invia' }, 'Entra'); bc.appendChild(cInvia);
    passoCodice.appendChild(bc);
    cEsito = el('div', { 'class': 'esito', role: 'status', 'aria-live': 'polite' });
    passoCodice.appendChild(cEsito);
    var altro = el('p', { 'class': 'passo-altro' });
    altro.appendChild(bottoneLink('Mandami un altro codice', function () { if (ultima) manda(ultima, cEsito, null); }));
    altro.appendChild(document.createTextNode(' · '));
    altro.appendChild(bottoneLink('Cambia email', function () { mostra('dati'); }));
    passoCodice.appendChild(altro);
    dentro.appendChild(passoCodice);

    // passo «solo codice»: chi ha già fatto l'accesso
    passoSolo = el('form', { id: 'passo-solo', 'class': 'modulo passo', novalidate: '' });
    passoSolo.hidden = true;
    var campoS = el('div', { 'class': 'campo' });
    campoS.appendChild(el('label', { 'for': 'f-email-solo' }, 'Email'));
    sEmail = el('input', { type: 'email', id: 'f-email-solo', name: 'email', autocomplete: 'email', inputmode: 'email', maxlength: '160' });
    campoS.appendChild(sEmail);
    passoSolo.appendChild(campoS);
    var bs = el('div', { 'class': 'bottoni' }); sInvia = el('button', { type: 'submit', 'class': 'cta pieno invia' }, 'Mandami il codice'); bs.appendChild(sInvia);
    passoSolo.appendChild(bs);
    sEsito = el('div', { 'class': 'esito', role: 'status', 'aria-live': 'polite' });
    passoSolo.appendChild(sEsito);
    var prima = el('p', { 'class': 'passo-altro' });
    prima.appendChild(document.createTextNode('Prima volta? '));
    prima.appendChild(bottoneLink('Compila i dati', function () { mostra('dati'); }));
    passoSolo.appendChild(prima);
    dentro.appendChild(passoSolo);
  }

  function mostra(passo) {
    if (!f) return;
    f.hidden = passo !== 'dati';
    if (passoCodice) passoCodice.hidden = passo !== 'codice';
    if (passoSolo) passoSolo.hidden = passo !== 'solo';
    if (titolo) titolo.textContent = TESTI[passo][0];
    if (perche) { perche.hidden = passo === 'codice'; if (passo !== 'codice') perche.innerHTML = TESTI[passo][1]; }
    var primo = passo === 'codice' ? cCodice : passo === 'solo' ? sEmail : f.querySelector('input:not([type=hidden]):not([type=checkbox]):not([type=radio])');
    if (primo) setTimeout(function () { try { primo.focus(); } catch (e) { } }, 30);
  }
  function apri() {
    if (!cancello) return;
    mostra(ultima && passoCodice ? 'codice' : 'dati');
    if (typeof cancello.showModal === 'function') { if (!cancello.open) cancello.showModal(); }
    else cancello.setAttribute('open', '');
  }
  function chiudi() { if (!cancello) return; if (typeof cancello.close === 'function' && cancello.open) cancello.close(); else cancello.removeAttribute('open'); }
  function scriviEsito(box, testo) { if (box) box.textContent = testo || ''; }

  Array.prototype.forEach.call(document.querySelectorAll('[data-apri-cancello]'), function (b) { b.addEventListener('click', function () { apri(); }); });
  Array.prototype.forEach.call(document.querySelectorAll('[data-chiudi-cancello]'), function (b) { b.addEventListener('click', chiudi); });
  if (cancello) cancello.addEventListener('click', function (e) { if (e.target === cancello) chiudi(); });
  document.addEventListener('click', function (e) {   // un prezzo coperto, se lo tocchi, apre la finestra
    if (!body.classList.contains('senza-prezzi')) return;
    var pz = e.target.closest && e.target.closest('[data-pz], .canvas .prezzo, .pz');
    if (pz) { e.preventDefault(); apri(); }
  });

  /* passo 1: i dati */
  var reMail = /^[^\s@<>()",;:]+@[^\s@<>()",;:]+\.[a-z]{2,}$/i;
  function campo(id) { var x = $(id); return x ? x.closest('.campo') : null; }
  function segna(id, ok) { var c = campo(id); if (c) c.classList.toggle('campo-err', !ok); if ($(id)) $(id).setAttribute('aria-invalid', ok ? 'false' : 'true'); return ok; }
  function valore(id) { return $(id) ? $(id).value.trim() : ''; }
  function datiModulo() {
    var r = f.querySelector('input[name=quantita]:checked');
    return {
      azione: 'iscrivi', nome: valore('f-nome'), azienda: valore('f-azienda'), email: valore('f-email'), telefono: valore('f-tel'),
      quantita: r ? r.value : '', messaggio: valore('f-msg').slice(0, 1000), privacy: !!($('f-privacy') && $('f-privacy').checked),
      aggiornamenti: !!($('f-agg') && $('f-agg').checked), origine: ($('f-origine') && $('f-origine').value) || origine, per: per,
      sito: valore('f-sito'), pagina: location.pathname, ritorno: location.origin + location.pathname, ua: (navigator.userAgent || '').slice(0, 300), t: Date.now() - t0
    };
  }
  function valida(d) {
    var ok = true, primo = null;
    [['f-nome', !!d.nome], ['f-azienda', !!d.azienda], ['f-email', reMail.test(d.email)], ['f-privacy', d.privacy]].forEach(function (x) {
      if (!segna(x[0], x[1])) { ok = false; if (!primo) primo = x[0]; }
    });
    if (primo && $(primo)) $(primo).focus();
    return ok;
  }
  function attesa(b, on, testo) { if (!b) return; if (on) { b.setAttribute('data-testo', b.textContent); b.textContent = 'Un momento…'; } else b.textContent = testo || b.getAttribute('data-testo') || b.textContent; b.disabled = on; }

  function manda(d, box, bottone) {
    scriviEsito(box, '');
    if (!EP) { scriviEsito(box, 'Il modulo non è ancora attivo: per i prezzi scrivici su WhatsApp.'); return; }
    attesa(bottone, true);
    chiama(d).then(function (r) {
      attesa(bottone, false);
      if (r && r.ok) {
        ultima = d;
        if (cDove) { cDove.textContent = ''; cDove.appendChild(document.createTextNode('Ti abbiamo scritto a ')); cDove.appendChild(el('b', null, r.email || 'la tua email'));
          cDove.appendChild(document.createTextNode(': scrivi qui il codice di 6 cifre. Vale ' + (r.minuti || 30) + ' minuti. Se non la vedi, guarda in Spam o Promozioni.')); }
        if (cCodice) cCodice.value = '';
        scriviEsito(cEsito, box === cEsito ? 'Codice nuovo inviato.' : '');
        mostra('codice');
      } else if (r && r.nuovo) {
        if ($('f-email') && sEmail) $('f-email').value = sEmail.value.trim();
        mostra('dati');
        scriviEsito($('esito'), r.errore);
      } else {
        if (r && r.campo) segna({ nome: 'f-nome', azienda: 'f-azienda', email: 'f-email', privacy: 'f-privacy' }[r.campo] || 'f-email', false);
        scriviEsito(box, (r && r.errore) || ERR_RETE);
      }
    }, function () { attesa(bottone, false); scriviEsito(box, ERR_RETE); });
  }

  if (f) {
    if (per && $('f-azienda') && !$('f-azienda').value) $('f-azienda').value = per;
    if ($('f-origine')) $('f-origine').value = origine;
    if (acc && acc.email && $('f-email') && !$('f-email').value) $('f-email').value = acc.email;
    ['f-nome', 'f-azienda', 'f-email', 'f-privacy'].forEach(function (id) {
      if (!$(id)) return;
      $(id).addEventListener(id === 'f-privacy' ? 'change' : 'blur', function () {
        var c = campo(id); if (!c || !c.classList.contains('campo-err')) return;
        segna(id, id === 'f-email' ? reMail.test(valore(id)) : id === 'f-privacy' ? $(id).checked : !!valore(id));
      });
    });
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = datiModulo();
      if (!valida(d)) { scriviEsito($('esito'), 'Mancano dei dati: li trovi segnati sopra.'); return; }
      manda(d, $('esito'), $('invia'));
    });
  }
  if (passoSolo) passoSolo.addEventListener('submit', function (e) {
    e.preventDefault();
    var em = sEmail.value.trim();
    if (!reMail.test(em)) { scriviEsito(sEsito, 'Scrivi un indirizzo email valido.'); sEmail.focus(); return; }
    manda({ azione: 'iscrivi', solo: true, email: em, origine: 'accesso', per: per, pagina: location.pathname, ritorno: location.origin + location.pathname,
      ua: (navigator.userAgent || '').slice(0, 300), t: Date.now() - t0 }, sEsito, sInvia);
  });

  /* passo 2: il codice */
  function verifica(email, codice, box, bottone) {
    scriviEsito(box, '');
    attesa(bottone, true);
    return chiama({ azione: 'verifica', email: email, codice: codice, ua: (navigator.userAgent || '').slice(0, 300) }).then(function (r) {
      attesa(bottone, false);
      if (r && r.ok && r.token) { entra(r); ultima = null; chiudi(); avviso('Fatto: i prezzi sono aperti su questo browser.'); return true; }
      scriviEsito(box, (r && r.errore) || 'Codice non valido.');
      return false;
    }, function () { attesa(bottone, false); scriviEsito(box, ERR_RETE); return false; });
  }
  if (passoCodice) {
    cCodice.addEventListener('input', function () { var v = cCodice.value.replace(/\D/g, '').slice(0, 6); if (v !== cCodice.value) cCodice.value = v; });
    passoCodice.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = cCodice.value.replace(/\D/g, '');
      if (v.length !== 6) { scriviEsito(cEsito, 'Il codice ha 6 cifre.'); cCodice.focus(); return; }
      if (!ultima || !ultima.email) { mostra('dati'); return; }
      verifica(ultima.email, v, cEsito, cInvia);
    });
  }

  /* il link della mail: …#accesso=<email>.<codice> */
  var mh = /^#accesso=([A-Za-z0-9_-]+)\.(\d{6})$/.exec(location.hash || '');
  if (mh) {
    try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { }
    var em = '';
    try {
      var b = mh[1].replace(/-/g, '+').replace(/_/g, '/'); while (b.length % 4) b += '=';
      em = decodeURIComponent(Array.prototype.map.call(atob(b), function (c) { return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2); }).join(''));
    } catch (e) { em = ''; }
    if (reMail.test(em)) {
      ultima = { email: em };
      if (cDove) { cDove.textContent = 'Un momento: controlliamo il codice della mail…'; }
      apri();
      if (cCodice) cCodice.value = mh[2];
      verifica(em, mh[2], cEsito, cInvia).then(function (ok) {
        if (!ok && cDove) cDove.textContent = 'Il link della mail non vale più (i codici durano poco e servono una volta sola). Chiedine uno nuovo: ci vuole un attimo.';
      });
    }
  }

  /* ---------- la scheda PDF: solo con accesso ---------- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-scheda]'), function (a) {
    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!acc) { apri(); return; }
      var testo = a.textContent; a.textContent = 'Un momento…';
      chiama({ azione: 'scheda', token: acc.token }).then(function (r) {
        a.textContent = testo;
        if (r && r.ok && r.base64) {
          var bin = atob(r.base64), n = bin.length, u = new Uint8Array(n);
          for (var i = 0; i < n; i++) u[i] = bin.charCodeAt(i);
          var url = URL.createObjectURL(new Blob([u], { type: r.tipo || 'application/pdf' }));
          var l = document.createElement('a'); l.href = url; l.download = r.nome || 'scheda.pdf'; document.body.appendChild(l); l.click();
          setTimeout(function () { URL.revokeObjectURL(url); l.remove(); }, 4000);
        } else if (r && r.esci) { esci(true); apri(); }
        else avviso((r && r.errore) || ERR_RETE);
      }, function () { a.textContent = testo; avviso(ERR_RETE); });
    });
  });

  /* un avviso breve in basso */
  function avviso(testo) {
    var t = $('pb-avviso');
    if (!t) { t = el('div', { id: 'pb-avviso', 'class': 'pb-avviso', role: 'status', 'aria-live': 'polite' }); document.body.appendChild(t); }
    t.textContent = testo; t.classList.add('vivo');
    clearTimeout(avviso.t); avviso.t = setTimeout(function () { t.classList.remove('vivo'); }, 4500);
  }

  window.PBAccesso = {
    apri: apri,
    esci: function () { esci(false); },
    attivo: function () { return !!acc; },
    prezzi: function () { return prezzi; },
    quando: function (fn) { ascolti.push(fn); if (prezzi) { try { fn(prezzi); } catch (e) { } } }
  };
})();
