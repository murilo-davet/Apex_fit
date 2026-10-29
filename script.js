
function escolherPlano(nome, valor) {
    localStorage.setItem("nomePlano", nome);
    localStorage.setItem("valorPlano", valor);
    window.location.href = "pagamento.html";
}

function selecionarUnidade(nomeUnidade) {
    localStorage.setItem("unidadeEscolhida", nomeUnidade);

    // Altere este caminho caso sua página de planos tenha outro nome.
    window.location.href = "../planos.html";
}

function irParaPlanos() {
    const planos = document.getElementById("planos");

    if (planos) {
        planos.scrollIntoView({ behavior: "smooth" });
    } else {
        window.location.href = "../index.html#planos";
    }
}

function baixarTXT(nomeArquivo, conteudo) {
    const arquivo = new Blob(
        [conteudo],
        { type: "text/plain;charset=utf-8" }
    );

    const url = URL.createObjectURL(arquivo);
    const link = document.createElement("a");

    link.href = url;
    link.download = nomeArquivo;

    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(function () {
        URL.revokeObjectURL(url);
    }, 1000);
}

function obterClientes() {
    try {
        const clientes = JSON.parse(
            localStorage.getItem("clientes") || "[]"
        );

        return Array.isArray(clientes) ? clientes : [];
    } catch (erro) {
        return [];
    }
}

function finalizarPagamento(event) {
    if (event) {
        event.preventDefault();
    }

    const campoNome = document.getElementById("nome-cliente");
    const campoEmail = document.getElementById("email-cliente");
    const campoTelefone = document.getElementById("telefone-cliente");

    if (!campoNome || !campoEmail || !campoTelefone) {
        alert("Não foi possível encontrar os campos do cadastro.");
        return;
    }

    const nome = campoNome.value.trim();
    const email = campoEmail.value.trim();
    const telefone = campoTelefone.value.trim();

    const plano = localStorage.getItem("nomePlano");
    const valor = localStorage.getItem("valorPlano");
    const unidade = localStorage.getItem("unidadeEscolhida") || "Não informada";

    if (!nome || !email || !telefone) {
        alert("Preencha todos os campos.");
        return;
    }

    if (!plano || !valor) {
        alert("Selecione um plano antes de continuar.");
        return;
    }

    const clientes = obterClientes();

    const cliente = {
        id: Date.now(),
        nome: nome,
        email: email,
        telefone: telefone,
        unidade: unidade,
        plano: plano,
        valor: valor,
        dataCadastro: new Date().toLocaleString("pt-BR")
    };

    clientes.push(cliente);

    try {
        localStorage.setItem("clientes", JSON.stringify(clientes));
    } catch (erro) {
        alert("Não foi possível salvar o cadastro no navegador.");
        return;
    }

    const conteudo =
        "APEX FIT - CADASTRO DE CLIENTE\n\n" +
        "Código: " + cliente.id + "\n" +
        "Nome: " + cliente.nome + "\n" +
        "E-mail: " + cliente.email + "\n" +
        "Telefone: " + cliente.telefone + "\n" +
        "Unidade: " + cliente.unidade + "\n" +
        "Plano: " + cliente.plano + "\n" +
        "Valor: " + cliente.valor + "\n" +
        "Data: " + cliente.dataCadastro + "\n";

    baixarTXT("cliente_" + cliente.id + ".txt", conteudo);

    alert("Cadastro demonstrativo concluído! O arquivo TXT foi gerado.");

    const formulario = document.getElementById("formCadastro");

    if (formulario) {
        formulario.reset();
    }
}

function baixarTodosClientes() {
    const clientes = obterClientes();

    if (clientes.length === 0) {
        alert("Nenhum cliente cadastrado.");
        return;
    }

    const conteudo = clientes.map(function (cliente, indice) {
        return (
            "CLIENTE " + (indice + 1) + "\n" +
            "Código: " + cliente.id + "\n" +
            "Nome: " + cliente.nome + "\n" +
            "E-mail: " + cliente.email + "\n" +
            "Telefone: " + cliente.telefone + "\n" +
            "Unidade: " + (cliente.unidade || "Não informada") + "\n" +
            "Plano: " + cliente.plano + "\n" +
            "Valor: " + cliente.valor + "\n" +
            "Data: " + cliente.dataCadastro
        );
    }).join("\n\n--------------------------\n\n");

    baixarTXT("todos_clientes_apex_fit.txt", conteudo);
}

function normalizarTexto(texto) {
    return String(texto || "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

document.addEventListener("DOMContentLoaded", function () {
    // MOSTRAR O PLANO SELECIONADO

    const nomePlano = document.getElementById("nome-plano");
    const valorPlano = document.getElementById("valor-plano");

    if (nomePlano) {
        nomePlano.textContent =
            localStorage.getItem("nomePlano") ||
            "Nenhum plano selecionado";
    }

    if (valorPlano) {
        const valor = localStorage.getItem("valorPlano");

        valorPlano.textContent = valor
            ? (valor.startsWith("R$") ? valor : "R$ " + valor)
            : "R$ 0,00";
    }

    // MOSTRAR UNIDADE SELECIONADA, QUANDO HOUVER O ELEMENTO

    const unidadeEscolhida = document.getElementById("unidade-escolhida");

    if (unidadeEscolhida) {
        unidadeEscolhida.textContent =
            localStorage.getItem("unidadeEscolhida") || "Não selecionada";
    }

    // EFEITOS DOS CARDS

    const cards = document.querySelectorAll(".card");

    cards.forEach(function (card) {
        card.addEventListener("mouseenter", function () {
            card.style.transform = "translateY(-5px)";
        });

        card.addEventListener("mouseleave", function () {
            card.style.transform = "";
        });
    });

    // FORMULÁRIO DE CONTATO

    const formContato = document.getElementById("formContato");

    if (formContato) {
        formContato.addEventListener("submit", function (event) {
            event.preventDefault();

            const campoNome = document.getElementById("nome");
            const campoEmail = document.getElementById("email");
            const campoMensagem = document.getElementById("mensagem");

            const nome = campoNome ? campoNome.value.trim() : "";
            const email = campoEmail ? campoEmail.value.trim() : "";
            const mensagem = campoMensagem
                ? campoMensagem.value.trim()
                : "";

            if (!nome || !email || !mensagem) {
                alert("Preencha todos os campos do formulário.");
                return;
            }

            alert(
                "Obrigado, " + nome + "!\n\n" +
                "Sua mensagem foi recebida.\n" +
                "E-mail: " + email
            );

            formContato.reset();
        });
    }

    // FORMULÁRIO DA PÁGINA DE PAGAMENTO

    const formCadastro = document.getElementById("formCadastro");

    if (formCadastro) {
        formCadastro.addEventListener("submit", finalizarPagamento);
    }

    // FILTRO DE UNIDADES

    const pesquisa = document.getElementById("pesquisa");
    const botaoBuscar = document.getElementById("buscar-unidade");
    const bairro = document.getElementById("bairro");
    const limparFiltros = document.getElementById("limpar-filtros");
    const contador = document.getElementById("contador-unidades");
    const mensagemVazia = document.getElementById("nenhuma-unidade");

    const unidades = document.querySelectorAll(".unidade");

    if (
        pesquisa &&
        botaoBuscar &&
        bairro &&
        limparFiltros &&
        contador &&
        mensagemVazia
    ) {
        function filtrarUnidades() {
            const texto = normalizarTexto(pesquisa.value);
            const bairroSelecionado = normalizarTexto(bairro.value);

            let quantidade = 0;

            unidades.forEach(function (unidade) {
                const titulo = unidade.querySelector("h3");
                const enderecoElemento = unidade.querySelector(".endereco");

                const nome = normalizarTexto(
                    unidade.dataset.nome ||
                    (titulo ? titulo.textContent : "")
                );

                const endereco = normalizarTexto(
                    unidade.dataset.endereco ||
                    (enderecoElemento ? enderecoElemento.textContent : "")
                );

                const bairroUnidade = normalizarTexto(unidade.dataset.bairro);

                const correspondeTexto =
                    texto === "" ||
                    nome.includes(texto) ||
                    endereco.includes(texto);

                const correspondeBairro =
                    bairroSelecionado === "" ||
                    bairroUnidade === bairroSelecionado;

                const mostrar = correspondeTexto && correspondeBairro;

                unidade.hidden = !mostrar;

                if (mostrar) {
                    quantidade++;
                }
            });

            contador.textContent = quantidade === 1
                ? "1 unidade encontrada"
                : quantidade + " unidades encontradas";

            mensagemVazia.hidden = quantidade !== 0;
        }

        botaoBuscar.addEventListener("click", filtrarUnidades);

        pesquisa.addEventListener("input", filtrarUnidades);

        pesquisa.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();
                filtrarUnidades();
            }
        });

        bairro.addEventListener("change", filtrarUnidades);

        limparFiltros.addEventListener("click", function () {
            pesquisa.value = "";
            bairro.value = "";
            filtrarUnidades();
            pesquisa.focus();
        });

        filtrarUnidades();
    }
});
