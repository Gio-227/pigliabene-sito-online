<?php
// Cowork v1.0 | Feel Good srl | Statistiche delle visite + scansioni dei QR — pagina per Gio | v1.0 | 2026-11-02 | sessione lancio preordini Smokin'
// Si apre con www.pigliabene.it/s/conta.php?k=<chiave> (la stessa chiave dei QR: qr/_conteggi/chiave.txt). ?g=1|7|30|0 = oggi, 7, 30 giorni, tutto.
// Aprendola, il dispositivo smette di essere contato (localStorage «pb-noconta»): così non contiamo noi stessi.
date_default_timezone_set('Europe/Rome');
header('Cache-Control: no-store, max-age=0');
header('X-Accel-Expires: 0');
header('X-Robots-Tag: noindex');
$chiave = @trim(@file_get_contents(__DIR__ . '/../qr/_conteggi/chiave.txt'));
$k = isset($_GET['k']) ? (string)$_GET['k'] : '';
if ($chiave === '' || !hash_equals($chiave, $k)) { http_response_code(404); exit; }
$g = isset($_GET['g']) ? (int)$_GET['g'] : 30;
if (!in_array($g, array(0, 1, 7, 30), true)) { $g = 30; }
$oggi = date('Y-m-d');
$dal = $g === 0 ? '0000-00-00' : date('Y-m-d', strtotime('-' . ($g - 1) . ' days'));

// visite
$vis = array();
foreach (glob(__DIR__ . '/_dati/visite-*.tsv') ?: array() as $f) {
    if ($g !== 0 && substr(basename($f), 7, 7) < substr($dal, 0, 7)) continue;
    foreach (@file($f, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: array() as $riga) {
        $c = explode("\t", $riga);
        if (count($c) < 5 || substr($c[0], 0, 10) < $dal || strpos($c[1], '/_verifica') === 0) continue;
        $vis[] = $c;
    }
}
$nomiDa = array('ig' => 'Instagram (link con etichetta)', 'wa' => 'WhatsApp (link con etichetta)', 'qr' => 'QR manifesti ottobre', 'qr2' => 'QR manifesti novembre',
                'link' => 'Link personali di Natale', 'mail' => 'Email', 'pdf' => 'PDF / scheda', 'fb' => 'Facebook (link con etichetta)');
$prov = function ($da, $r) use ($nomiDa) {
    if ($da !== '') return isset($nomiDa[$da]) ? $nomiDa[$da] : 'etichetta «' . $da . '»';
    if ($r === '') return 'Diretto o app (WhatsApp, indirizzo scritto, preferiti)';
    if (preg_match('/(^|\.)instagram\.com$/', $r)) return 'Instagram';
    if (preg_match('/(^|\.)facebook\.com$|(^|\.)fb\.com$/', $r)) return 'Facebook';
    if (preg_match('/(^|\.)google\./', $r)) return 'Google';
    if (preg_match('/(^|\.)bing\.com$/', $r)) return 'Bing';
    return $r;
};
$tot = count($vis); $perGiorno = array(); $perPagina = array(); $perProv = array(); $perDisp = array('telefono' => 0, 'computer' => 0);
foreach ($vis as $c) {
    $d = substr($c[0], 0, 10);
    $perGiorno[$d] = (isset($perGiorno[$d]) ? $perGiorno[$d] : 0) + 1;
    $perPagina[$c[1]] = (isset($perPagina[$c[1]]) ? $perPagina[$c[1]] : 0) + 1;
    $pv = $prov($c[2], $c[3]); $perProv[$pv] = (isset($perProv[$pv]) ? $perProv[$pv] : 0) + 1;
    $perDisp[$c[4]] = (isset($perDisp[$c[4]]) ? $perDisp[$c[4]] : 0) + 1;
}
// scansioni dei QR
$qr = array(); $qrTot = array();
foreach (@file(__DIR__ . '/../qr/_conteggi/scansioni.tsv', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES) ?: array() as $riga) {
    $c = explode("\t", $riga);
    if (count($c) < 2 || substr($c[0], 0, 10) < $dal) continue;
    $d = substr($c[0], 0, 10);
    $qr[$d][$c[1]] = (isset($qr[$d][$c[1]]) ? $qr[$d][$c[1]] : 0) + 1;
    $qrTot[$c[1]] = (isset($qrTot[$c[1]]) ? $qrTot[$c[1]] : 0) + 1;
}
ksort($qrTot);
$giorni = array_unique(array_merge(array_keys($perGiorno), array_keys($qr))); rsort($giorni);
arsort($perPagina); arsort($perProv);
$h = function ($s) { return htmlspecialchars($s, ENT_QUOTES, 'UTF-8'); };
$nomePag = array('/' => 'Home', '/natale/' => 'Natale (porta)', '/natale/catalogo/' => 'Catalogo di Natale', '/natale/confezioni/' => 'Confezioni pronte',
                 '/preordini/' => 'Preordini (elenco)', '/preordini/smokin-brothers/' => 'Preordine Smokin’ Brothers', '/privacy/' => 'Privacy', '/404' => 'Pagina non trovata (404)');
$etichetta = array(1 => 'Oggi', 7 => '7 giorni', 30 => '30 giorni', 0 => 'Tutto');
?><!DOCTYPE html>
<html lang="it"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>Visite del sito — Piglia Bene</title>
<style>body{background:#F7F4DC;color:#9B0E0E;font-family:system-ui,sans-serif;margin:0 auto;padding:24px 16px 48px;max-width:640px}
h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;margin:30px 0 8px;text-transform:uppercase;letter-spacing:.06em}p{margin:0 0 14px;opacity:.85}
.per a{display:inline-block;margin:0 6px 6px 0;padding:6px 12px;border:1px solid #9B0E0E;border-radius:16px;color:#9B0E0E;text-decoration:none;font-size:14px}
.per a.on{background:#9B0E0E;color:#F7F4DC}.tot{font-size:44px;font-weight:700;margin:10px 0 0;line-height:1}.tot small{font-size:16px;font-weight:400}
table{border-collapse:collapse;width:100%}th,td{text-align:left;padding:7px 6px;border-bottom:1px solid rgba(155,14,14,.2);font-size:15px}
td.n,th.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap}.nota{font-size:13px;opacity:.7;margin-top:28px}</style></head><body>
<h1>Visite del sito</h1>
<p>Pagine aperte su www.pigliabene.it · nessun IP, nessun cookie: si conta, non si riconosce nessuno.</p>
<div class="per"><?php foreach ($etichetta as $n => $t): ?><a class="<?= $g === $n ? 'on' : '' ?>" href="?k=<?= $h($k) ?>&g=<?= $n ?>"><?= $h($t) ?></a><?php endforeach; ?></div>
<div class="tot"><?= $tot ?> <small>visite · <?= $h($etichetta[$g]) ?></small></div>
<p style="margin-top:8px">da telefono <?= (int)$perDisp['telefono'] ?> · da computer <?= (int)$perDisp['computer'] ?></p>
<h2>Scansioni dei QR dei manifesti</h2>
<?php if ($qrTot): foreach ($qrTot as $u => $n): ?><div class="tot" style="font-size:32px"><?= (int)$n ?> <small><?= $h(isset($nomiDa[$u]) ? $nomiDa[$u] : $u) ?></small></div><?php endforeach; else: ?><p>Nessuna scansione nel periodo.</p><?php endif; ?>
<h2>Da dove arrivano</h2>
<table><?php foreach ($perProv as $pv => $n): ?><tr><td><?= $h($pv) ?></td><td class="n"><?= (int)$n ?></td></tr><?php endforeach; ?></table>
<h2>Pagine</h2>
<table><?php foreach ($perPagina as $pg => $n): ?><tr><td><?= $h(isset($nomePag[$pg]) ? $nomePag[$pg] : $pg) ?></td><td class="n"><?= (int)$n ?></td></tr><?php endforeach; ?></table>
<h2>Per giorno</h2>
<table><tr><th>Giorno</th><th class="n">Visite</th><?php foreach ($qrTot as $u => $n): ?><th class="n">QR <?= $h($u) ?></th><?php endforeach; ?></tr>
<?php foreach ($giorni as $d): ?><tr><td><?= $h($d) ?></td><td class="n"><?= isset($perGiorno[$d]) ? (int)$perGiorno[$d] : 0 ?></td><?php foreach ($qrTot as $u => $n): ?><td class="n"><?= isset($qr[$d][$u]) ? (int)$qr[$d][$u] : 0 ?></td><?php endforeach; ?></tr><?php endforeach; ?>
</table>
<p class="nota" id="io">Una visita = una pagina aperta: chi apre due volte conta due. «Diretto o app» comprende quasi tutto WhatsApp, che non dice da dove arriva: per distinguerlo, i link che mandiamo portano un'etichetta (?da=wa, ?da=ig).</p>
<script>try{localStorage.setItem('pb-noconta','1');document.getElementById('io').insertAdjacentHTML('beforeend',' <b>Questo dispositivo non viene contato.</b>');}catch(e){}</script>
</body></html>
