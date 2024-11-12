<?php
$page_configed = true;

$localconfigs = json_decode(file_get_contents("localconfig.json"), true);

isset($localconfigs['host']) ? $host = $localconfigs['host'] : $host = $_SERVER['HTTP_HOST'];
isset($localconfigs['base_dir']) ? $base_dir = $localconfigs['base_dir'] : $base_dir = "";

$base = $host . $base_dir;

function generateLink($href) {
    global $base_dir;
    $link = $base_dir . $href;
    echo $link;
}