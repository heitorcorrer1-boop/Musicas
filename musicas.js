// ==========================================
// 1. CONFIGURAÇÕES INICIAIS E BUSCA
// ==========================================

const input = document.getElementById("busca");
const container = document.getElementById("container");

// Substitua APENAS a função carregarMusicas no seu musicas.js por esta:

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
                // 1. Criamos a caixinha do card na memória do navegador de forma isolada
                const card = document.createElement("div");
                card.className = "card";
                card.style.cursor = "pointer";

                // 2. Injetamos o conteúdo visual interno
                card.innerHTML = `
                    <img src="${musica.foto}">
                    <div class="card-content">
                        <div class="nome-musica">${musica.nome}</div>
                        <div class="artista-musica">${musica.artista}</div>
                        <div>Álbum: ${musica.album}</div>
                        <div>Ano: ${musica.ano}</div>
                    </div>
                `;

                // 3. Atribuímos o clique DIRETO no elemento passando o objeto real, sem converter para texto
                card.addEventListener("click", () => {
                    abrirModalEditarObjeto(musica);
                });

                // 4. Jogamos o card pronto dentro do container na tela
                container.appendChild(card);
            });
        })
        .catch(erro => console.error("Erro ao listar músicas:", erro));
}

// Carrega as músicas assim que abre a página
carregarMusicas();

// Faz a busca em tempo real enquanto digita
input.addEventListener("keyup", () => {
    carregarMusicas(input.value);
});


// ==========================================
// 2. BLINDAGEM CONTRA ERROS DE 'NULL' (DOM)
// ==========================================

// Usamos este evento para garantir que o JS SÓ vai configurar os botões 
// DEPOIS que o navegador carregar todo o esqueleto do HTML.
document.addEventListener("DOMContentLoaded", () => {
    
    // ---- MODAL DE INSERIR (O seu primeiro Modal) ----
    const modal = document.getElementById("meuModal");
    const btnAbrir = document.getElementById("btnAbrirModal");
    const btnFechar = document.querySelector(".fechar");
    const formMusica = document.getElementById("formMusica");

    if (btnAbrir) btnAbrir.onclick = () => modal.style.display = "block";
    if (btnFechar) btnFechar.onclick = () => modal.style.display = "none";

    if (formMusica) {
        formMusica.addEventListener("submit", (e) => {
            e.preventDefault();
            const dados = new FormData();
            dados.append("nome", document.getElementById("nome_form").value);
            dados.append("artista", document.getElementById("artista_form").value);
            dados.append("album", document.getElementById("album_form").value);
            dados.append("ano", document.getElementById("ano_form").value);
            dados.append("foto", document.getElementById("foto_form").value);

            fetch("api_inserir.php", { method: "POST", body: dados })
                .then(res => { if (!res.ok) throw new Error(); return res.json(); })
                .then(data => {
                    alert(data.mensagem);
                    formMusica.reset();
                    modal.style.display = "none";
                    carregarMusicas();
                })
                .catch(() => alert("Deu ruim ao salvar a música."));
        });
    }

    // ---- MODAL DE EDITAR (O novo Modal que criamos) ----
    const modalEditar = document.getElementById("modalEditar");
    const btnFecharEditar = document.getElementById("fecharEditar");

    if (btnFecharEditar) {
        btnFecharEditar.onclick = () => modalEditar.style.display = "none";
    }

    // Fecha qualquer um dos modais se clicar na parte escura da tela
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
        if (event.target == modalEditar) modalEditar.style.display = "none";
    };
});


// Substitua a função abrirModalEditar no final do arquivo por esta:

function abrirModalEditarObjeto(musica) {
    const modalEditar = document.getElementById("modalEditar");
    
    // Preenche cada campo do formulário mapeando os IDs exatos do seu HTML
    document.getElementById("edit_id").value = musica.id;
    document.getElementById("edit_nome").value = musica.nome;
    document.getElementById("edit_artista").value = musica.artista;
    document.getElementById("edit_album").value = musica.album || "";
    document.getElementById("edit_ano").value = musica.ano || "";
    document.getElementById("edit_foto").value = musica.foto || "";

    // Abre a janela de edição de forma limpa
    modalEditar.style.display = "block";
}