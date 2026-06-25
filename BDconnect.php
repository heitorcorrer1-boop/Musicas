<?php
// BDconnect.php

// Pega as variáveis automáticas do Railway
$host     = isset($_ENV['MYSQLHOST']) ? $_ENV['MYSQLHOST'] : (isset($_ENV['MYSQL_HOST']) ? $_ENV['MYSQL_HOST'] : 'localhost');
$usuario  = isset($_ENV['MYSQLUSER']) ? $_ENV['MYSQLUSER'] : (isset($_ENV['MYSQL_USER']) ? $_ENV['MYSQL_USER'] : 'root');
$senha    = isset($_ENV['MYSQLPASSWORD']) ? $_ENV['MYSQLPASSWORD'] : (isset($_ENV['MYSQL_PASSWORD']) ? $_ENV['MYSQL_PASSWORD'] : '');
$banco    = isset($_ENV['MYSQLDATABASE']) ? $_ENV['MYSQLDATABASE'] : (isset($_ENV['MYSQL_DATABASE']) ? $_ENV['MYSQL_DATABASE'] : 'sua_database');
$porta    = isset($_ENV['MYSQLPORT']) ? $_ENV['MYSQLPORT'] : (isset($_ENV['MYSQL_PORT']) ? $_ENV['MYSQL_PORT'] : '3306');

// Tenta conectar
$BDconnect = mysqli_connect($host, $usuario, $senha, $banco, $porta);

if (!$BDconnect) {
    // Força o PHP a responder com um texto claro em vez de quebrar em Erro 500
    header('Content-Type: application/json', true, 200); 
    echo json_encode([
        "status" => "erro_conexao",
        "mensagem" => "Falha na conexão com o Banco de Dados",
        "detalhes" => mysqli_connect_error()
    ]);
    exit;
}

mysqli_set_charset($BDconnect, "utf8");
?>
