const arquivoCSV = document.getElementById("arquivoCSV");
const btnImportar = document.getElementById("btnImportar");

const mensagem = document.getElementById("mensagem");
const pesquisa = document.getElementById("pesquisa");

const cabecalhoTabela = document.getElementById("cabecalhoTabela");
const corpoTabela = document.getElementById("corpoTabela");

const totalCadastros = document.getElementById("totalCadastros");
const totalPro = document.getElementById("totalPro");
const totalPremium = document.getElementById("totalPremium");
const totalBasic = document.getElementById("totalBasic");

const resultadoPesquisa = document.getElementById("resultadoPesquisa");

let cadastros = [];
let colunas = [];

// Lê o conteúdo de uma linha CSV, respeitando campos entre aspas.
function separarLinhaCSV(linha, delimitador) {
  const resultado = [];

  let campo = "";
  let dentroDeAspas = false;

  for (let i = 0; i < linha.length; i++) {
    const caractere = linha[i];

    if (caractere === '"') {
      if (dentroDeAspas && linha[i + 1] === '"') {
        campo += '"';
        i++;
      } else {
        dentroDeAspas = !dentroDeAspas;
      }
    } else if (caractere === delimitador && !dentroDeAspas) {
      resultado.push(campo);
      campo = "";
    } else {
      campo += caractere;
    }
  }

  if (dentroDeAspas) {
    throw new Error("O CSV contém aspas não fechadas.");
  }

  resultado.push(campo);

  return resultado;
}

// Detecta se o arquivo utiliza vírgula ou ponto e vírgula.
function detectarDelimitador(linha) {
  const virgulas = separarLinhaCSV(linha, ",").length;
  const pontosEVirgulas = separarLinhaCSV(linha, ";").length;

  return pontosEVirgulas > virgulas ? ";" : ",";
}

// Lê um CSV, incluindo campos entre aspas e quebras de linha.
function analisarCSV(texto, delimitador) {
  const linhas = [];

  let linha = [];
  let campo = "";
  let dentroDeAspas = false;

  for (let i = 0; i < texto.length; i++) {
    const caractere = texto[i];

    if (caractere === '"') {
      if (dentroDeAspas && texto[i + 1] === '"') {
        campo += '"';
        i++;
      } else {
        dentroDeAspas = !dentroDeAspas;
      }
    } else if (caractere === delimitador && !dentroDeAspas) {
      linha.push(campo);
      campo = "";
    } else if ((caractere === "\n" || caractere === "\r") && !dentroDeAspas) {
      if (caractere === "\r" && texto[i + 1] === "\n") {
        i++;
      }

      linha.push(campo);

      if (linha.some((valor) => valor.trim() !== "")) {
        linhas.push(linha);
      }

      linha = [];
      campo = "";
    } else {
      campo += caractere;
    }
  }

  if (dentroDeAspas) {
    throw new Error("O CSV contém aspas não fechadas.");
  }

  if (campo !== "" || linha.length > 0) {
    linha.push(campo);

    if (linha.some((valor) => valor.trim() !== "")) {
      linhas.push(linha);
    }
  }

  return linhas;
}

// Importa o arquivo selecionado.
btnImportar.addEventListener("click", async function () {
  const arquivo = arquivoCSV.files[0];

  if (!arquivo) {
    mensagem.textContent = "Selecione um arquivo CSV primeiro.";
    return;
  }

  if (!arquivo.name.toLowerCase().endsWith(".csv")) {
    mensagem.textContent = "Selecione um arquivo com extensão .csv.";
    return;
  }

  try {
    let texto = await arquivo.text();

    // Remove o BOM, quando presente.
    texto = texto.replace(/^\uFEFF/, "");

    if (!texto.trim()) {
      throw new Error("O arquivo está vazio.");
    }

    const primeiraLinha = texto.split(/\r?\n/, 1)[0];
    const delimitador = detectarDelimitador(primeiraLinha);

    const linhas = analisarCSV(texto, delimitador);

    if (linhas.length < 2) {
      throw new Error(
        "O arquivo precisa ter cabeçalho e pelo menos um cadastro.",
      );
    }

    const novosCabecalhos = linhas[0].map((coluna) => coluna.trim());

    if (novosCabecalhos.some((coluna) => coluna === "")) {
      throw new Error("O arquivo contém uma coluna sem nome.");
    }

    const quantidadeColunas = novosCabecalhos.length;

    if (linhas.slice(1).some((linha) => linha.length !== quantidadeColunas)) {
      throw new Error(
        "Algumas linhas possuem quantidade incorreta de colunas.",
      );
    }

    // Ignora colunas que não devem ser armazenadas ou exibidas.
    const indicesVisiveis = novosCabecalhos
      .map((coluna, indice) => ({
        coluna,
        indice,
      }))
      .filter((item) => {
        const nome = item.coluna
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        return ![
          "cartao",
          "numerocartao",
          "cvv",
          "cvc",
          "codigodeseguranca",
        ].includes(nome);
      });

    colunas = indicesVisiveis.map((item) => item.coluna);

    cadastros = linhas.slice(1).map((linha) => {
      const cadastro = {};

      indicesVisiveis.forEach((item) => {
        cadastro[item.coluna] = linha[item.indice];
      });

      return cadastro;
    });

    atualizarTabela(cadastros);
    atualizarEstatisticas();

    pesquisa.disabled = false;
    pesquisa.value = "";

    mensagem.textContent = `Arquivo importado com sucesso: ${cadastros.length} cadastro(s).`;
  } catch (erro) {
    cadastros = [];
    colunas = [];

    atualizarTabela([]);
    atualizarEstatisticas();

    pesquisa.disabled = true;

    mensagem.textContent = "Erro ao importar: " + erro.message;
  }
});

// Monta a tabela com os registros.
function atualizarTabela(lista) {
  cabecalhoTabela.replaceChildren();
  corpoTabela.replaceChildren();

  if (lista.length === 0) {
    const linha = document.createElement("tr");
    const celula = document.createElement("td");

    celula.colSpan = Math.max(colunas.length, 1);
    celula.className = "csv-empty";
    celula.textContent = "Nenhum cadastro encontrado.";

    linha.appendChild(celula);
    corpoTabela.appendChild(linha);

    resultadoPesquisa.textContent = "0 registros exibidos.";

    return;
  }

  const linhaCabecalho = document.createElement("tr");

  colunas.forEach((coluna) => {
    const th = document.createElement("th");

    th.textContent = coluna;

    linhaCabecalho.appendChild(th);
  });

  cabecalhoTabela.appendChild(linhaCabecalho);

  lista.forEach((cadastro) => {
    const linha = document.createElement("tr");

    colunas.forEach((coluna) => {
      const celula = document.createElement("td");

      // textContent evita interpretar os valores como HTML.
      celula.textContent = cadastro[coluna] || "";

      linha.appendChild(celula);
    });

    corpoTabela.appendChild(linha);
  });

  resultadoPesquisa.textContent = `${lista.length} registro(s) exibido(s).`;
}

// Calcula as estatísticas dos planos.
function atualizarEstatisticas() {
  totalCadastros.textContent = cadastros.length;

  totalBasic.textContent = cadastros.filter((cadastro) =>
    Object.entries(cadastro).some(
      ([chave, valor]) =>
        chave.toLowerCase().includes("plano") &&
        valor.trim().toLowerCase() === "basic",
    ),
  ).length;

  totalPro.textContent = cadastros.filter((cadastro) =>
    Object.entries(cadastro).some(
      ([chave, valor]) =>
        chave.toLowerCase().includes("plano") &&
        valor.trim().toLowerCase() === "pro",
    ),
  ).length;

  totalPremium.textContent = cadastros.filter((cadastro) =>
    Object.entries(cadastro).some(
      ([chave, valor]) =>
        chave.toLowerCase().includes("plano") &&
        valor.trim().toLowerCase() === "premium",
    ),
  ).length;
}

// Pesquisa por nome, CPF ou e-mail.
pesquisa.addEventListener("input", function () {
  const termo = pesquisa.value.trim().toLowerCase();

  const filtrados = cadastros.filter((cadastro) =>
    Object.entries(cadastro).some(([coluna, valor]) => {
      const nomeColuna = coluna.toLowerCase();

      const colunaPesquisavel =
        nomeColuna.includes("nome") ||
        nomeColuna.includes("cpf") ||
        nomeColuna.includes("email") ||
        nomeColuna.includes("e-mail");

      return colunaPesquisavel && valor.toLowerCase().includes(termo);
    }),
  );

  atualizarTabela(filtrados);
});
