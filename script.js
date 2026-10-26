
function escolherPlano(nome, valor) {
  localStorage.setItem("nomePlano", nome);
  localStorage.setItem("valorPlano", valor);

  window.location.href = "pagamento.html";
}

// MOSTRAR PLANO ESCOLHIDO
const nomePlano = document.getElementById("nome-plano");
const valorPlano = document.getElementById("valor-plano");

if (nomePlano && valorPlano) {
  nomePlano.textContent =
    localStorage.getItem("nomePlano") || "Nenhum plano selecionado";

  valorPlano.textContent =
    "R$ " + (localStorage.getItem("valorPlano") || "0,00");
}

// SELECIONAR UNIDADE
function selecionarUnidade(nomeUnidade) {
  alert(
    "APEX FIT\n\n" +
    "Unidade selecionada:\n" +
    nomeUnidade +
    "\n\nEm breve você poderá ver todos os detalhes desta unidade."
  );
}

// EFEITO DOS CARDS
const cards = document.querySelectorAll(".card");

cards.forEach(function (card) {
  card.addEventListener("mouseenter", function () {
    card.style.transform = "translateY(-10px)";
  });

  card.addEventListener("mouseleave", function () {
    card.style.transform = "";
  });
});

// FORMULÁRIO DE CONTATO
const formulario = document.getElementById("formContato");

if (formulario) {
  formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    alert(
      "APEX FIT\n\n" +
      "Obrigado(a), " + nome + "!\n\n" +
      "Sua mensagem foi enviada com sucesso.\n" +
      "Responderemos através do e-mail:\n" + email
    );

    formulario.reset();
  });
}

// IR PARA PLANOS
function irParaPlanos() {
  const planos = document.getElementById("planos");

  if (planos) {
    planos.scrollIntoView({ behavior: "smooth" });
  }
}

// BAIXAR ARQUIVO TXT
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

// CADASTRAR CLIENTE
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

  if (!nome || !email || !telefone) {
    alert("Preencha todos os campos.");
    return;
  }

  if (!plano || !valor) {
    alert("Selecione um plano antes de cadastrar o cliente.");
    return;
  }

  let clientes;

  try {
    clientes = JSON.parse(
      localStorage.getItem("clientes") || "[]"
    );

    if (!Array.isArray(clientes)) {
      clientes = [];
    }
  } catch {
    clientes = [];
  }

  const cliente = {
    id: Date.now(),
    nome: nome,
    email: email,
    telefone: telefone,
    plano: plano,
    valor: valor,
    dataCadastro: new Date().toLocaleString("pt-BR")
  };

  clientes.push(cliente);

  try {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  } catch {
    alert("Não foi possível salvar o cadastro no navegador.");
    return;
  }

  const dados =
    "APEX FIT - CADASTRO DE CLIENTE\n\n" +
    "Código: " + cliente.id + "\n" +
    "Nome: " + cliente.nome + "\n" +
    "E-mail: " + cliente.email + "\n" +
    "Telefone: " + cliente.telefone + "\n" +
    "Plano: " + cliente.plano + "\n" +
    "Valor: R$ " + cliente.valor + "\n" +
    "Data do cadastro: " + cliente.dataCadastro + "\n";

  baixarTXT("cliente_" + cliente.id + ".txt", dados);

  alert("Cliente cadastrado com sucesso!");

  document.getElementById("formCadastro").reset();
}

// CONECTAR FORMULÁRIO DE CADASTRO
const formCadastro = document.getElementById("formCadastro");

if (formCadastro) {
  formCadastro.addEventListener("submit", finalizarPagamento);
}

// BAIXAR TODOS OS CLIENTES
function baixarTodosClientes() {
  let clientes;

  try {
    clientes = JSON.parse(
      localStorage.getItem("clientes") || "[]"
    );

    if (!Array.isArray(clientes)) {
      clientes = [];
    }
  } catch {
    clientes = [];
  }

  if (clientes.length === 0) {
    alert("Nenhum cliente cadastrado.");
    return;
  }

  const texto = clientes.map(function (cliente, i) {
    return (
      "CLIENTE " + (i + 1) + "\n" +
      "Código: " + cliente.id + "\n" +
      "Nome: " + cliente.nome + "\n" +
      "E-mail: " + cliente.email + "\n" +
      "Telefone: " + cliente.telefone + "\n" +
      "Plano: " + cliente.plano + "\n" +
      "Valor: R$ " + cliente.valor + "\n" +
      "Data: " + cliente.dataCadastro
    );
  }).join("\n\n-----------------------------\n\n");

  baixarTXT("todos_clientes_apex_fit.txt", texto);
}
