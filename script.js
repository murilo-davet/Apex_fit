function escolherPlano(plano, valor) {
  const cadastro = {
    nome: document.getElementById("nome")?.value.trim() || "",
    cpf: document.getElementById("cpf")?.value.trim() || "",
    cep: document.getElementById("cep")?.value.trim() || "",
    nascimento: document.getElementById("nascimento")?.value || "",
    email: document.getElementById("email")?.value.trim() || "",
    telefone: document.getElementById("telefone")?.value.trim() || "",
    plano: plano,
    valorPlano: valor,
  };

  if (!cadastro.nome || !cadastro.cpf || !cadastro.email) {
    alert("Por favor, preencha os campos obrigatórios antes de prosseguir.");
    return;
  }
  // Guarda temporariamente até chegar na tela de pagamento
  localStorage.setItem("apex_fit_temp_cadastro", JSON.stringify(cadastro));
  localStorage.setItem("nomePlano", plano);
  localStorage.setItem("valorPlano", valor);

  window.location.href = "pagamento.html";
}

const nomePlano = document.getElementById("nome-plano");
const valorPlano = document.getElementById("valor-plano");

if (nomePlano && valorPlano) {
  nomePlano.textContent =
    localStorage.getItem("nomePlano") || "Nenhum plano selecionado";

  valorPlano.textContent =
    "R$ " + (localStorage.getItem("valorPlano") || "0,00");
}

if (document.getElementById("nome-plano")) {
  document.getElementById("nome-plano").textContent =
    localStorage.getItem("nomePlano");

  document.getElementById("valor-plano").textContent =
    `R$ ${localStorage.getItem("valorPlano")}`;
}

function finalizarPagamento() {
  // 1. Recupera os dados da pessoa salvos na primeira etapa
  const dadosCadastroRaw = localStorage.getItem("apex_fit_temp_cadastro");

  if (!dadosCadastroRaw) {
    alert(
      "Dados de cadastro não encontrados. Por favor, preencha o formulário inicial.",
    );
    window.location.href = "cadastro.html"; // Ajuste para a sua página inicial
    return;
  }

  const pessoa = JSON.parse(dadosCadastroRaw);

  // 2. Captura os dados do cartão inseridos na página atual
  const dadosCartao = {
    cartao: document.getElementById("cartao")?.value.trim() || "",
    nomeCartao: document.getElementById("nomeCartao")?.value.trim() || "",
    validade: document.getElementById("validade")?.value.trim() || "",
    cvv: document.getElementById("cvv")?.value.trim() || "",
  };

  if (!dadosCartao.cartao || !dadosCartao.nomeCartao) {
    alert("Por favor, preencha os dados do cartão.");
    return;
  }

  // 3. Unifica os dados da pessoa, do cartão e a data do registro
  const novoRegistro = {
    ...pessoa,
    ...dadosCartao,
    dataRegistro: new Date().toLocaleDateString("pt-BR"),
  };

  // 4. Busca os cadastros anteriores guardados no navegador (ou inicia uma lista vazia)
  const historicoCadastros = JSON.parse(
    localStorage.getItem("apex_fit_base_csv") || "[]",
  );

  // Adiciona o novo cadastro à lista acumulada
  historicoCadastros.push(novoRegistro);

  // Atualiza o histórico no localStorage
  localStorage.setItem("apex_fit_base_csv", JSON.stringify(historicoCadastros));

  // 5. Baixa automaticamente o CSV atualizado contendo TODOS os cadastros até aqui
  baixarCSVConsolidado(historicoCadastros);

  // 6. Limpa os dados temporários e os campos do formulário para o próximo uso
  localStorage.removeItem("apex_fit_temp_cadastro");
  document.querySelector("form")?.reset();

  alert(
    "Cadastro finalizado com sucesso! O arquivo CSV acumulado foi baixado.",
  );

  // Opcional: Redireciona de volta para a primeira página para o próximo cadastro
  // window.location.href = 'cadastro.html';
}

function baixarCSVConsolidado(listaDeCadastros) {
  // Definindo todas as colunas (Pessoa + Cartão)
  const cabecalhos = [
    "Nome",
    "CPF",
    "CEP",
    "Data Nascimento",
    "Email",
    "Telefone",
    "Plano",
    "Valor",
    "Cartão",
    "Nome no Cartão",
    "Validade",
    "CVV",
    "Data Cadastro",
  ];

  const sanitizar = (txt) => `"${String(txt || "").replace(/"/g, '""')}"`;

  // Transforma cada cadastro acumulado em uma linha do CSV
  const linhas = listaDeCadastros.map((item) =>
    [
      sanitizar(item.nome),
      sanitizar(item.cpf),
      sanitizar(item.cep),
      sanitizar(item.nascimento),
      sanitizar(item.email),
      sanitizar(item.telefone),
      sanitizar(item.plano),
      sanitizar(item.valorPlano),
      sanitizar(item.cartao),
      sanitizar(item.nomeCartao),
      sanitizar(item.validade),
      sanitizar(item.cvv),
      sanitizar(item.dataRegistro),
    ].join(","),
  );

  // Cria a estrutura final do arquivo CSV
  const conteudoCSV =
    "\uFEFF" + cabecalhos.join(",") + "\n" + linhas.join("\n") + "\n";

  // Dispara o download automático do arquivo acumulado
  const blob = new Blob([conteudoCSV], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", "cadastros_apex_fit.csv");

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function selecionarUnidade(nomeUnidade) {
  alert(
    "APEX FIT\n\n" +
      "Unidade selecionada:\n" +
      nomeUnidade +
      "\n\nEm breve você poderá ver todos os detalhes desta unidade.",
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

    const nome = document.getElementById("nome").value;
    const email = document.getElementById("email").value;
    const mensagem = document.getElementById("mensagem").value;
    alert(
      "APEX FIT\n\n" +
        "Obrigado(a), " +
        nome +
        "!\n\n" +
        "Sua mensagem foi enviada com sucesso.\n" +
        "Responderemos através do e-mail:\n" +
        email,
    );

    formulario.reset();
  });
}
function irParaPlanos() {
  document.getElementById("planos").scrollIntoView({
    behavior: "smooth",
  });
}
