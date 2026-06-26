<?php
// Define o retorno como JSON
header('Content-Type: application/json; charset=utf-8');

// Inclui a conexão com o banco de dados
require_once('BDconnect.php');

// Verifica se a requisição é POST e se o 'id' foi enviado
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = intval($_POST['id']); // Converte para número por segurança

    // Prepara a query de exclusão blindada contra SQL Injection
    $stmt = mysqli_prepare($BDconnect, "DELETE FROM musica WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "i", $id);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "sucesso", 
            "mensagem" => "Música excluída com sucesso!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "erro", 
            "mensagem" => "Erro ao excluir do banco de dados."
        ]);
    }

    mysqli_stmt_close($stmt);
} else {
    http_response_code(400);
    echo json_encode([
        "status" => "erro", 
        "mensagem" => "ID não fornecido ou método inválido."
    ]);
}

mysqli_close($BDconnect);
?>
