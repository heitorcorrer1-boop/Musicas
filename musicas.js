// musicas.js
const input = document.getElementById("busca");
const container = document.getElementById("container");

function carregarMusicas(busca = "") {
    fetch("api_musicas.php?busca=" + encodeURIComponent(busca))
        .then(res => res.json())
        .then(data => {
            container.innerHTML = "";

            if (data.length === 0) {
                container.innerHTML = "<div class='vazio'>Nenhuma música encontrada ;-;</div>";
                return;
            }

            data.forEach(musica => {
                // Convertemos o objeto da música em texto para conseguir passar por parâmetro no HTML
                const dadosMusica = JSON.stringify(musica).replace(/"/g, '&quot;');

                container.innerHTML += `
                    <div class="card" onclick="abrirModalEditar('${dadosMusica}')" style="cursor: pointer;">
                        <img src="${musica.foto}">
                        <div class="card-content">
                            <div id="nome">${musica.nome}</div>
                            <div id="artista">${musica.artista}</div>
                            <div>Álbum: ${musica.album}</div>
                            <div>Ano: ${musica.ano}</div>
                        </div>
                    </div>
                `;
            });
        });
}

// Inicialização e Eventos
carregarMusicas();
input.addEventListener("keyup", () => {
    carregarMusicas(input.value);
});

// Elementos do Modal
const modal = document.getElementById("meuModal");
const btnAbrir = document.getElementById("btnAbrirModal");
const btnFechar = document.querySelector(".fechar");
const formMusica = document.getElementById("formMusica");

// Abrir Modal
btnAbrir.onclick = () => modal.style.display = "block";

// Fechar Modal ao clicar no X
btnFechar.onclick = () => modal.style.display = "none";

// Fechar Modal ao clicar fora dele
window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
}

// Envio do formulário via AJAX/Fetch
formMusica.addEventListener("submit", (e) => {
    e.preventDefault(); // Impede a página de recarregar

    // Prepara os dados para enviar no formato FormData (que o PHP aceita no $_POST)
    const dados = new FormData();
    dados.append("nome", document.getElementById("nome_form").value);
    dados.append("artista", document.getElementById("artista_form").value);
    dados.append("album", document.getElementById("album_form").value);
    dados.append("ano", document.getElementById("ano_form").value);
    dados.append("foto", document.getElementById("foto_form").value);

    fetch("api_inserir.php", {
        method: "POST",
        body: dados
    })
    .then(res => {
        if (!res.ok) throw new Error("Erro na requisição");
        return res.json();
    })
    .then(data => {
        alert(data.mensagem); // Mensagem de sucesso vinda do PHP
        formMusica.reset();   // Limpa os campos do formulário
        modal.style.display = "none"; // Fecha o modal
        carregarMusicas();    // Atualiza a lista na tela sem dar F5!
    })
    .catch(erro => {
        alert("Deu ruim ao salvar a música.");
        console.error(erro);
    });
});

// Elementos do Modal de Edição
const modalEditar = document.getElementById("modalEditar");
const btnFecharEditar = document.getElementById("fecharEditar");

// Função acionada ao clicar em qualquer Card
function abrirModalEditar(musicaTexto) {
    // Transforma o texto de volta em um objeto JavaScript
    const musica = JSON.parse(musicaTexto);

    // Preenche os campos do formulário com os dados atuais da música
    document.getElementById("edit_id").value = musica.id;
    document.getElementById("edit_nome").value = musica.nome;
    document.getElementById("edit_artista").value = musica.artista;
    document.getElementById("edit_album").value = musica.album;
    document.getElementById("edit_ano").value = musica.ano;
    document.getElementById("edit_foto").value = musica.foto;

    // Exibe o modal na tela
    modalEditar.style.display = "block";
}

// Fechar o modal de edição
btnFecharEditar.onclick = () => modalEditar.style.display = "none";

// Modificar o clique na janela para fechar qualquer um dos modais se clicar fora
window.onclick = (event) => {
    const modalInserir = document.getElementById("meuModal");
    if (event.target == modalInserir) modalInserir.style.display = "none";
    if (event.target == modalEditar) modalEditar.style.display = "none";
}