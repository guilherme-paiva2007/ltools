<?php
if (isset($_GET['search'])) {
    $info = [
        'search' => $_GET['search'],
        'time' => date('Y-m-d H:i:s')
    ];
    $json = json_encode($info);
} else {
    $json = "{}";
}

echo $json;