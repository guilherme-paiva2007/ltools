<?php
$page_configed = true;

$base_sufix = "/ltools";
$base = $_SERVER['HTTP_HOST'] . $base_sufix;

function generateLink($href) {
    global $base_sufix;
    $link = $base_sufix . $href;
    echo $link;
}