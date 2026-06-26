<?php
// Model/MusicaModel.php

class MusicaModel {
    private $db;

    public function __construct($conexao) {
        $this->db = $conexao;
    }

    // Busca todas as músicas ou filtra por termo
    public function buscarMusicas($busca = '') {
        if ($busca != '') {
            $sql = "SELECT * FROM musica 
                    WHERE nome LIKE ? 
                    OR artista LIKE ? 
                    OR album LIKE ?";

            $stmt = mysqli_prepare($this->db, $sql);
            $param = "%" . $busca . "%";
            mysqli_stmt_bind_param($stmt, "sss", $param, $param, $param);
            
            mysqli_stmt_execute($stmt);
            $result = mysqli_stmt_get_result($stmt);
        } else {
            $sql = "SELECT * FROM musica";
            $result = mysqli_query($this->db, $sql);
        }

        $musicas = [];
        while ($row = mysqli_fetch_assoc($result)) {
            $musicas[] = $row;
        }

        return $musicas;
    }

    public function inserirMusica($nome, $artista, $album, $ano, $foto) {
        $sql = "INSERT INTO musica (nome, artista, album, ano, foto) VALUES (?, ?, ?, ?, ?)";
        
        $stmt = mysqli_prepare($this->db, $sql);
        
        // "sssss" significa que são 5 strings. Se "ano" for int no banco, pode usar "ssiss"
        mysqli_stmt_bind_param($stmt, "sssss", $nome, $artista, $album, $ano, $foto);
        
        $resultado = mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
        
        return $resultado; // Retorna true ou false
    }
}
?>