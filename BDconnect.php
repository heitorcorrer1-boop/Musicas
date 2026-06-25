<?php
// BDconnect.php

// O Railway injeta essas variáveis automaticamente no servidor.
// Se elas não existirem (como no seu PC local), ele usa os valores padrão (localhost, root, etc).
$host     = getenv('MYSQLHOST')     ?: 'localhost';
$username = getenv('MYSQLUSER')     ?: 'root';
$password = getenv('MYSQLPASSWORD') ?: '';
$database = getenv('MYSQLDATABASE') ?: 'biblioteca_musicas';
$port     = getenv('MYSQLPORT')     ?: '3306';

// Cria a conexão incluindo a porta (obrigatório para o Railway)
$BDconnect = mysqli_connect($host, $username, $password, $database, $port);

// Verifica se houve erro na conexão
if (!$BDconnect) {
    die("Falha na conexão com o banco de dados: " . mysqli_connect_error());
}

// Define o charset para não quebrar acentos das músicas
mysqli_set_charset($BDconnect, "utf8mb4");
?>