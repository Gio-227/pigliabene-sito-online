<?php
// Cowork v1.0 | Feel Good srl | Statistiche delle visite di www.pigliabene.it — ricevitore | v1.0 | 2026-11-02 | sessione lancio preordini Smokin'
// Ogni pagina aperta manda qui (da /s/s.js) una riga: pagina, etichetta del link (?da=), sito di provenienza (solo il nome), telefono/computer.
// NON registra indirizzo IP, non usa cookie, non riconosce chi visita. Esclusi robot, anteprime e precaricamenti.
date_default_timezone_set('Europe/Rome');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('X-Accel-Expires: 0');
header('X-Robots-Tag: noindex');
$ua = isset($_SERVER['HTTP_USER_AGENT']) ? $_SERVER['HTTP_USER_AGENT'] : '';
$pref = (isset($_SERVER['HTTP_PURPOSE']) ? $_SERVER['HTTP_PURPOSE'] : '') . (isset($_SERVER['HTTP_SEC_PURPOSE']) ? $_SERVER['HTTP_SEC_PURPOSE'] : '');
$robot = '/bot|crawl|spider|slurp|preview|facebookexternalhit|whatsapp|telegram|curl|wget|python|java\/|go-http|node-fetch|axios|scrapy|headless|lighthouse|pingdom|uptime|monitor/i';
if ($ua === '' || preg_match($robot, $ua) || stripos($pref, 'prefetch') !== false) { http_response_code(204); exit; }
$v = function ($k) { return isset($_REQUEST[$k]) ? (string)$_REQUEST[$k] : ''; };
$p = substr($v('p'), 0, 200);
if ($p === '' || $p[0] !== '/') { http_response_code(204); exit; }
$p = preg_replace('/[\t\r\n]/', ' ', $p);
$da = strtolower(substr(preg_replace('/[^A-Za-z0-9_-]/', '', $v('da')), 0, 30));
$r = strtolower(substr(preg_replace('/[^A-Za-z0-9.-]/', '', $v('r')), 0, 100));
if ($r === 'www.pigliabene.it' || $r === 'pigliabene.it') { $r = ''; }
$disp = preg_match('/Mobi|Android|iPhone|iPad|iPod/i', $ua) ? 'telefono' : 'computer';
$dir = __DIR__ . '/_dati';
if (!is_dir($dir)) { @mkdir($dir, 0750, true); }
@file_put_contents($dir . '/visite-' . date('Y-m') . '.tsv', date('Y-m-d H:i:s') . "\t$p\t$da\t$r\t$disp\n", FILE_APPEND | LOCK_EX);
http_response_code(204);
