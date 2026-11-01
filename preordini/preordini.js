/* Cowork v1.0 | Feel Good srl | preordini/preordini.js — la griglia dei preordini da campagne.json | v1.0 | 2026-10-31 CET */
(function () {
  var g = document.getElementById('campagne'), n = document.getElementById('nessuno');
  if (!g) return;
  function giorni(ms) { var d = Math.floor(ms / 864e5), h = Math.floor((ms % 864e5) / 36e5); return d ? d + (d === 1 ? ' giorno' : ' giorni') + ' e ' + h + ' ore' : h + ' ore'; }
  function card(c, aperta, ms) {
    var a = document.createElement('a'); a.className = 'card' + (aperta ? '' : ' chiuso'); a.href = c.slug + '/';
    if (!aperta) a.setAttribute('aria-label', c.titolo + ' — preordine chiuso');
    a.innerHTML = '<div class="img"><img src="' + c.immagine + '" alt="" loading="lazy"><span class="badge">' + (aperta ? c.sconto : 'Chiuso') + '</span></div>' +
      '<div class="corpo"><span class="tipo">Preordine ' + c.tipo + ' · ' + c.produttore + '</span><h3>' + c.titolo + '</h3><p class="riass">' + c.riassunto + '</p>' +
      '<div class="meta">' + (aperta ? '<b>Ordini fino a ' + c.chiusuraTxt + '</b> · mancano ' + giorni(ms) : '<b>Chiuso ' + c.chiusuraTxt + '</b>') + '<br>Ritiro in bottega dal ' + c.ritiroDal + '</div>' +
      '<span class="vai">' + (aperta ? 'Apri il preordine →' : 'Vedi →') + '</span></div>';
    return a;
  }
  fetch('campagne.json', { cache: 'no-store' }).then(function (r) { return r.json(); }).then(function (lista) {
    var ora = new Date(), aperte = 0;
    lista.forEach(function (c) {
      var ms = new Date(c.chiusura) - ora, aperta = ms > 0 && new Date(c.apertura) <= ora;
      if (aperta) aperte++;
      if (aperta || c.mostraChiuso) g.appendChild(card(c, aperta, ms));
    });
    if (!aperte) n.hidden = false;
  }).catch(function () { n.hidden = false; });
})();
