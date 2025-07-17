let nome = "";
let nomeFormatado = "";
let cliques = 0;
let tempo = 15;
let intervalo;
let contagemInicial = 3;

function mostrarTela(id) {
  document.querySelectorAll('.tela').forEach(tela => tela.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

function normalizarNome(nome) {
  return nome.trim().toLowerCase();
}

function irParaContagem() {
  const nomeInput = document.getElementById("nome");
  const entrada = nomeInput.value.trim();

  if (!entrada) {
    alert("Digite seu nome!");
    return;
  }

  nomeFormatado = entrada;
  nome = normalizarNome(entrada);

  const ranking = JSON.parse(localStorage.getItem("rankingEolico")) || [];
  const jogadorExistente = ranking.find(j => j.nomeNormalizado === nome);

  if (jogadorExistente) {
    const confirmar = confirm(`O nome "${jogadorExistente.nomeExibicao}" já está no ranking.\nVocê é essa pessoa e quer tentar bater seu recorde?`);
    if (!confirmar) {
      alert("Escolha outro nome para jogar.");
      return;
    }
  }

  document.getElementById("nomeJogadorContagem").textContent = nomeFormatado;
  mostrarTela("tela-contagem");
  iniciarContagem();
}

function iniciarContagem() {
  contagemInicial = 3;
  document.getElementById("contadorInicial").textContent = contagemInicial;
  const countdown = setInterval(() => {
    contagemInicial--;
    document.getElementById("contadorInicial").textContent = contagemInicial;
    if (contagemInicial === 0) {
      clearInterval(countdown);
      mostrarTela("tela-jogo");
      iniciarJogo();
    }
  }, 1000);
}

function iniciarJogo() {
  cliques = 0;
  tempo = 15;
  document.getElementById("cliques").textContent = cliques;
  document.getElementById("contador").textContent = tempo;
  document.getElementById("nomeJogador").textContent = nomeFormatado;
  document.getElementById("botaoAperto").disabled = false;

  intervalo = setInterval(() => {
    tempo--;
    document.getElementById("contador").textContent = tempo;
    if (tempo === 0) finalizarJogo();
  }, 1000);
}

function contarClique() {
  cliques++;
  document.getElementById("cliques").textContent = cliques;
}

function finalizarJogo() {
  clearInterval(intervalo);
  document.getElementById("botaoAperto").disabled = true;
  salvarRanking(nome, nomeFormatado, cliques);
  setTimeout(() => {
    mostrarTela("tela-ranking");
  }, 1000);
}

function salvarRanking(nomeNormalizado, nomeExibicao, cliques) {
  let ranking = JSON.parse(localStorage.getItem("rankingEolico")) || [];

  const jogadorExistente = ranking.find(j => j.nomeNormalizado === nomeNormalizado);
  if (jogadorExistente) {
    if (cliques > jogadorExistente.cliques) {
      jogadorExistente.cliques = cliques;
    }
  } else {
    ranking.push({ nomeExibicao, nomeNormalizado, cliques });
  }

  ranking.sort((a, b) => b.cliques - a.cliques);
  ranking = ranking.slice(0, 10);
  localStorage.setItem("rankingEolico", JSON.stringify(ranking));
  atualizarRanking();
}

function atualizarRanking() {
  const tabela = document.getElementById("tabelaRanking");
  tabela.innerHTML = "";

  const ranking = JSON.parse(localStorage.getItem("rankingEolico")) || [];
  ranking.forEach(jogador => {
    const item = document.createElement("li");
    item.textContent = `${jogador.nomeExibicao} — ${jogador.cliques} cliques`;
    tabela.appendChild(item);
  });
}

function reiniciar() {
  document.getElementById("nome").value = "";
  mostrarTela("tela-nome");
}

function verRanking() {
  atualizarRanking();
  mostrarTela("tela-ranking");
}

window.onload = () => {
  document.getElementById("btnComecar").addEventListener("click", irParaContagem);
  document.getElementById("botaoAperto").addEventListener("click", contarClique);
  document.getElementById("btnVerRanking").addEventListener("click", verRanking);
  document.getElementById("btnJogarNovamente").addEventListener("click", reiniciar);
  document.getElementById("btnVoltarInicio").addEventListener("click", reiniciar);
  atualizarRanking();
  mostrarTela("tela-nome");
};
