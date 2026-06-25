<?php
// api_musicas.php

require_once("MusicaController.php");

$controller = new MusicaController();
$controller->listar();
?>