<?php
// BDconnect.php

// No Railway, as variáveis oficiais geralmente vêm com estes nomes:
$host     = isset($_ENV['MYSQLHOST']) ? $_ENV['MYSQLHOST'] : (isset($_ENV['MYSQL_HOST']) ? $_ENV['MYSQL_HOST'] : 'localhost');
$usuario  = isset($_ENV['MYSQLUSER']) ? $_ENV['MYSQLUSER'] : (isset($_ENV['MYSQL_USER']) ? $_ENV['MYSQL_USER'] : 'root');
$senha    = isset($_ENV['MYSQLPASSWORD']) ? $_ENV['MYSQLPASSWORD'] : (isset($_ENV['MYSQL_PASSWORD']) ? $_ENV['MYSQL_PASSWORD'] : '');
$banco    = isset($_ENV['MYSQLDATABASE']) ? $_ENV['MYSQLDATABASE'] : (isset($_ENV['MYSQL_DATABASE']) ? $_ENV['MYSQL_DATABASE'] : 'sua_database');
$porta    = isset($_ENV['MYSQLPORT']) ? $_ENV['MYSQLPORT'] : (isset($_ENV['MYSQL_PORT']) ? $_ENV['MYSQL_PORT'] : '3306');

// Tenta conectar
$BDconnect = mysqli_connect($host, $usuario, $senha, $banco, $porta);

// Se falhar, exibe o erro exato e para a execução (evita o Erro 500 genérico)
if (!$BDconnect) {
    header('Content-Type: application/json', true, 500);
    echo json_encode([
        "erro" => "Falha na conexão com o Banco de Dados",
        "detalhes" => mysqli_connect_error()
    ]);
    exit;
}

mysqli_set_charset($BDconnect, "utf8");
?>
