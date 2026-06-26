<?php
// BDconnect.php

// O $_ENV tenta pegar os dados do servidor do Railway automaticamente.
// Se não encontrar (caso você rode no PC), ele usa o 'localhost' como padrão.
$host     = isset($_ENV['MYSQLHOST']) ? $_ENV['MYSQLHOST'] : 'localhost';
$usuario  = isset($_ENV['MYSQLUSER']) ? $_ENV['MYSQLUSER'] : 'root';
$senha    = isset($_ENV['MYSQLPASSWORD']) ? $_ENV['MYSQLPASSWORD'] : '';
$banco    = isset($_ENV['MYSQLDATABASE']) ? $_ENV['MYSQLDATABASE'] : 'sua_database_local';
$porta    = isset($_ENV['MYSQLPORT']) ? $_ENV['MYSQLPORT'] : '3306';

// Cria a conexão incluindo a porta
$BDconnect = mysqli_connect($host, $usuario, $senha, $banco, $porta);

if (!$BDconnect) {
    die("Falha na conexão com o banco de dados: " . mysqli_connect_error());
}

// Garante que o banco aceite acentos corretamente (UTF-8)
mysqli_set_charset($BDconnect, "utf8");
?>