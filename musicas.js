// ==========================================
// 1. CONFIGURAÇÕES INICIAIS E BUSCA
// ==========================================

const input = document.getElementById("busca");
const container = document.getElementById("container");

// Função que busca as músicas na API e joga na tela
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
                // Transforma o objeto da música em texto limpo para colocar no HTML do card
                const dadosMusica = JSON.stringify(musica).replace(/"/g, '&quot;');

                container.innerHTML += `
                    <div class="card" onclick="abrirModalEditar('${dadosMusica}')" style="cursor: pointer;">
                        <img src="${musica.foto}">
                        <div class="card-content">
                            <div class="nome-musica">${musica.nome}</div>
                            <div class="artista-musica">${musica.artista}</div>
                            <div>Álbum: ${musica.album}</div>
                            <div>Ano: ${musica.ano}</div>
                        </div>
                    </div>
                `;
            });
        });
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


// ==========================================
// 3. AÇÃO DE CLICAR NO CARD
// ==========================================

// Esta função roda quando você clica em uma música. Ela pega o texto gerado,
// transforma de volta em objeto e preenche os campos do modal de edição.
function abrirModalEditar(musicaTexto) {
    const modalEditar = document.getElementById("modalEditar");
    
    if (!modalEditar) {
        console.error("O modalEditar não existe no seu HTML ainda!");
        return;
    }

    const musica = JSON.parse(musicaTexto);

    // Preenche cada campo do formulário de edição com os dados da música clicada
    document.getElementById("edit_id").value = musica.id;
    document.getElementById("edit_nome").value = musica.nome;
    document.getElementById("edit_artista").value = musica.artista;
    document.getElementById("edit_album").value = musica.album;
    document.getElementById("edit_ano").value = musica.ano;
    document.getElementById("edit_foto").value = musica.foto;

    // Abre a janela de edição
    modalEditar.style.display = "block";
}
