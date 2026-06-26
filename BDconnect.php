<?php
// BDconnect.php

// Substitua os valores abaixo pelos dados REAIS que aparecem no seu painel do MySQL no Railway:
$host     = 'mysql.railway.internal'; // Ex: mysql.railway.internal ou algo assim
$usuario  = 'root'; // Geralmente é root
$senha    = 'OevJUFSTcKkAMxgYvDfwNqQIWJeqXMBi'; 
$banco    = 'railway'; // Nome do banco que está lá
$porta    = '3306';

// Tenta conectar usando os dados fixos da nuvem
$BDconnect = mysqli_connect($host, $usuario, $senha, $banco, $porta);

if (!$BDconnect) {
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