<?php
// Controller/MusicaController.php

require_once("BDconnect.php");
require_once("MusicaModel.php");

class MusicaController {
    public function listar() {
        global $BDconnect; // Ou passe a conexão via construtor se preferir

        header('Content-Type: application/json');

        // Pega o parâmetro de busca da requisição
        $busca = isset($_GET['busca']) ? $_GET['busca'] : '';

        // Instancia o Model e busca os dados
        $model = new MusicaModel($BDconnect);
        $musicas = $model->buscarMusicas($busca);

        // Retorna o resultado para a View (neste caso, o app cliente)
        echo json_encode($musicas);
    }
}

public function cadastrar() {
    global $BDconnect;
    header('Content-Type: application/json');

    // Verifica se a requisição é do tipo POST
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);
        echo json_encode(["erro" => "Método não permitido"]);
        return;
    }

    // Pega os dados enviados pelo JavaScript
    $nome = isset($_POST['nome']) ? trim($_POST['nome']) : '';
    $artista = isset($_POST['artista']) ? trim($_POST['artista']) : '';
    $album = isset($_POST['album']) ? trim($_POST['album']) : '';
    $ano = isset($_POST['ano']) ? trim($_POST['ano']) : '';
    $foto = isset($_POST['foto']) ? trim($_POST['foto']) : '';

    // Validação básica
    if (empty($nome) || empty($artista)) {
        http_response_code(400);
        echo json_encode(["erro" => "Nome e Artista são obrigatórios."]);
        return;
    }

    $model = new MusicaModel($BDconnect);
    $sucesso = $model->inserirMusica($nome, $artista, $album, $ano, $foto);

    if ($sucesso) {
        echo json_encode(["sucesso" => true, "mensagem" => "Música adicionada com sucesso!"]);
    } else {
        http_response_code(500);
        echo json_encode(["erro" => "Erro ao salvar no banco de dados."]);
    }
}
?>