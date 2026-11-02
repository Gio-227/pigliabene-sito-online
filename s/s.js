/* Cowork v1.0 | Feel Good srl | Statistiche delle visite: una riga per pagina aperta, senza IP né cookie | v1.0 | 2026-11-02 */
(function () {
  try {
    if (localStorage.getItem('pb-noconta')) return;          /* i dispositivi di Piglia Bene non si contano */
  } catch (e) {}
  try {
    var s = document.currentScript, p = (s && s.getAttribute('data-p')) || location.pathname;
    var da = new URLSearchParams(location.search).get('da') || '', r = '';
    try { r = document.referrer ? new URL(document.referrer).hostname : ''; } catch (e) {}
    if (r === location.hostname) r = '';
    var q = '/s/v.php?p=' + encodeURIComponent(p) + '&da=' + encodeURIComponent(da) + '&r=' + encodeURIComponent(r);
    if (!(navigator.sendBeacon && navigator.sendBeacon(q))) { new Image().src = q; }
  } catch (e) {}
})();
