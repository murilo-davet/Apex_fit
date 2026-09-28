function escolherPlano(nome, valor) {
  localStorage.setItem("nomePlano", nome);
  localStorage.setItem("valorPlano", valor);

  window.location.href = "pagamento.html";
}

if (document.getElementById("nome-plano")) {
  document.getElementById("nome-plano").textContent =
    localStorage.getItem("nomePlano");

  document.getElementById("valor-plano").textContent =
    `R$ ${localStorage.getItem("valorPlano")}`;
}

function finalizarPagamento() {}

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
