<?php
// Define o retorno como JSON
header('Content-Type: application/json; charset=utf-8');

// Inclui a conexão com o banco
require_once('BDconnect.php');

// Verifica se os dados mínimos foram enviados
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id']) && isset($_POST['nome']) && isset($_POST['artista'])) {
    
    $id = intval($_POST['id']);
    $nome = $_POST['nome'];
    $artista = $_POST['artista'];
    $album = isset($_POST['album']) ? $_POST['album'] : '';
    
    // Tratamento para o ano (se vier vazio, salva como NULL ou 0 dependendo do seu banco, aqui forçamos inteiro se tiver valor)
    $ano = !empty($_POST['ano']) ? intval($_POST['ano']) : null; 
    
    $foto = isset($_POST['foto']) ? $_POST['foto'] : '';

    // Prepara a query de UPDATE
    $stmt = mysqli_prepare($BDconnect, "UPDATE musica SET nome = ?, artista = ?, album = ?, ano = ?, foto = ? WHERE id = ?");
    
    // O "ssssii" significa que estamos passando: String, String, String, Integer, String, Integer (o ID)
    mysqli_stmt_bind_param($stmt, "sssssi", $nome, $artista, $album, $ano, $foto, $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "sucesso", 
            "mensagem" => "Música atualizada com sucesso!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "erro", 
            "mensagem" => "Erro ao atualizar no banco de dados."
        ]);
    }

    mysqli_stmt_close($stmt);
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "erro", 
        "mensagem" => "Dados incompletos para a edição."
    ]);
}

mysqli_close($BDconnect);
?>