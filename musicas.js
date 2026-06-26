const input = document.getElementById("busca");
const container = document.getElementById("container");

// 1. LISTAGEM DE MÚSICAS
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
                // Criamos o elemento do card de forma isolada na memória para não quebrar o HTML
                const card = document.createElement("div");
                card.className = "card";
                card.style.cursor = "pointer";
                
                card.innerHTML = `
                    <img src="${musica.foto}">
                    <div class="card-content">
                        <div class="nome-musica">${musica.nome}</div>
                        <div class="artista-musica">${musica.artista}</div>
                        <div>Álbum: ${musica.album}</div>
                        <div>Ano: ${musica.ano}</div>
                    </div>
                `;

                // Passa estritamente o objeto da música no clique usando o ID único dela como referência
                card.onclick = () => abrirModalEditarObjeto(musica);

                container.appendChild(card);
            });
        });
}

// 2. BUSCA EM TEMPO REAL
carregarMusicas();
input.addEventListener("keyup", () => {
    carregarMusicas(input.value);
});

// 3. CONTROLE DOS MODAIS (ABRIR E FECHAR)
const modal = document.getElementById("meuModal");
const modalEditar = document.getElementById("modalEditar");
const btnAbrir = document.getElementById("btnAbrirModal");
const btnFechar = document.querySelector(".fechar");
const btnFecharEditar = document.getElementById("fecharEditar");
const formMusica = document.getElementById("formMusica");

if (btnAbrir) btnAbrir.onclick = () => modal.style.display = "block";
if (btnFechar) btnFechar.onclick = () => modal.style.display = "none";
if (btnFecharEditar) btnFecharEditar.onclick = () => modalEditar.style.display = "none";

window.onclick = (event) => {
    if (event.target == modal) modal.style.display = "none";
    if (event.target == modalEditar) modalEditar.style.display = "none";
};

// 4. ENVIO DE CADASTRO (INSERIR)
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

function abrirModalEditarObjeto(musica) {
    const modalEditar = document.getElementById("modalEditar");
    
    // Pegamos a referência única do formulário na página
    const formulario = document.getElementById("formEditarMusica");

    if (!formulario) {
        console.error("O formulário 'formEditarMusica' não foi encontrado na página.");
        return;
    }

    // Em vez de buscar por ID solto na página, injetamos direto nos campos pelo índice/name do formulário
    // O próprio formulário gerencia as referências internas dos seus inputs
    formulario.querySelector("#edit_id").value = musica.id;
    formulario.querySelector("#edit_nome").value = musica.nome;
    formulario.querySelector("#edit_artista").value = musica.artista;
    formulario.querySelector("#edit_album").value = musica.album || "";
    formulario.querySelector("#edit_ano").value = musica.ano || "";
    formulario.querySelector("#edit_foto").value = musica.foto || "";

    modalEditar.style.display = "block";
}

// 6. EXCLUIR MÚSICA
const btnExcluir = document.getElementById("btnExcluir");

if (btnExcluir) {
    btnExcluir.addEventListener("click", () => {
        // Pega o ID da música que está no campo oculto do formulário
        const idMusica = document.getElementById("edit_id").value;

        if (!idMusica) return;

        // Confirmação de segurança para o usuário não apagar sem querer
        const confirmar = confirm("Tem certeza que deseja excluir esta música da sua biblioteca?");
        
        if (confirmar) {
            const dados = new FormData();
            dados.append("id", idMusica);

            fetch("api_excluir.php", {
                method: "POST",
                body: dados
            })
            .then(res => {
                if (!res.ok) throw new Error("Erro na resposta do servidor");
                return res.json();
            })
            .then(data => {
                alert(data.mensagem);
                document.getElementById("modalEditar").style.display = "none"; // Fecha o modal
                carregarMusicas(); // Atualiza a lista da tela
            })
            .catch(erro => {
                console.error(erro);
                alert("Erro ao tentar excluir a música.");
            });
        }
    });
}

const formEditarMusica = document.getElementById("formEditarMusica");

if (formEditarMusica) {
    formEditarMusica.addEventListener("submit", (e) => {
        e.preventDefault(); // Impede o reload da página

        // Prepara os dados editados para enviar ao PHP
        const dados = new FormData();
        dados.append("id", document.getElementById("edit_id").value);
        dados.append("nome", document.getElementById("edit_nome").value);
        dados.append("artista", document.getElementById("edit_artista").value);
        dados.append("album", document.getElementById("edit_album").value);
        dados.append("ano", document.getElementById("edit_ano").value);
        dados.append("foto", document.getElementById("edit_foto").value);

        fetch("api_alterar.php", {
            method: "POST",
            body: dados
        })
        .then(res => {
            if (!res.ok) throw new Error("Erro na resposta do servidor");
            return res.json();
        })
        .then(data => {
            alert(data.mensagem);
            document.getElementById("modalEditar").style.display = "none"; // Fecha o modal
            carregarMusicas(); // Atualiza a lista da tela na hora
        })
        .catch(erro => {
            console.error(erro);
            alert("Erro ao tentar salvar as alterações.");
        });
    });
}