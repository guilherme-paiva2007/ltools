<?php
$connection_config = [
    'hostname' => 'localhost',
    'username' => 'root',
    'password' => '',
    'database' => 'ltools_db'
];

if (!isset($setup)) {
    $actual_dir = "./php";
    include './setup.php';
}

if (isset($localconfigs['connection'])) {
    isset($localconfigs['connection']['hostname']) ? $connection_config['hostname'] = $localconfigs['connection']['hostname'] : null;
    isset($localconfigs['connection']['username']) ? $connection_config['username'] = $localconfigs['connection']['username'] : null;
    isset($localconfigs['connection']['password']) ? $connection_config['password'] = $localconfigs['connection']['password'] : null;
    isset($localconfigs['connection']['database']) ? $connection_config['database'] = $localconfigs['connection']['database'] : null;
}

$connection = new mysqli(
    $connection_config['hostname'],
    $connection_config['username'],
    $connection_config['password'],
    $connection_config['database']
);

if ($connection->error) {
    die("Erro de conexão: " . $connection->error);
}