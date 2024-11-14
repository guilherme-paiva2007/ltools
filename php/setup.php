<?php
$localconfigs_file = "./localconfig.json";

if (isset($actual_dir)) {
    $localconfigs_file = '.' . $localconfigs_file;
}

if (!isset($localconfigs)) $localconfigs = json_decode(file_get_contents($localconfigs_file), true);

isset($localconfigs['host']) ? $host = $localconfigs['host'] : $host = $_SERVER['HTTP_HOST'];
isset($localconfigs['base_dir']) ? $base_dir = $localconfigs['base_dir'] : $base_dir = "";

$base = $host . $base_dir;
$setup = true;

function generateLink($href) {
    global $base_dir;
    $link = $base_dir . $href;
    echo $link;
}