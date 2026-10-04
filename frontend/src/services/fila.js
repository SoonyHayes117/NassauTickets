import { useEffect, useState } from "react";

const KEY = "nassauTickets:v1";
export const NOMES = { SP: "prioritária", SG: "geral", SE: "exames" };
const ATIVOS = ["CHAMADA", "CHAMADA_NOVAMENTE", "EM_ATENDIMENTO"];
const pad = (n, l = 2) => String(n).padStart(l, "0");
const hoje = () => {
  const d = new Date();
  return pad(d.getFullYear() % 100) + pad(d.getMonth() + 1) + pad(d.getDate());
};

export const modoDemo = () => localStorage.getItem("nassauTickets:demo") === "1";
export const dentroDoExpediente = () => {
  const h = new Date().getHours();
  return modoDemo() || (h >= 7 && h < 17);
};

export function ler() {
  let s = null;
  try { s = JSON.parse(localStorage.getItem(KEY)); } catch { s = null; }
  const estadoValido = s && typeof s === "object" && Array.isArray(s.tickets)
    && s.seq && ["SP", "SG", "SE"].every((tipo) => Number.isInteger(s.seq[tipo]));
  if (!estadoValido) s = { dia: hoje(), seq: { SP: 0, SG: 0, SE: 0 }, ultimo: null, tickets: [] };
  if (s.dia !== hoje()) { s.dia = hoje(); s.seq = { SP: 0, SG: 0, SE: 0 }; s.ultimo = null; }
  const fim = new Date().getHours() >= 17 && !modoDemo();
  // RN07: senhas que sobraram no fim do expediente (ou de outro dia) são descartadas
  s.tickets.forEach((t) => {
    if (t.estado === "AGUARDANDO" && (fim || !t.numero.startsWith(hoje()))) t.descartada = true;
  });
  return s;
}

// RNF02: lê, altera e grava dentro de um bloqueio, para dois guichês nunca pegarem a mesma senha
async function transacao(fn) {
  const corpo = () => {
    const s = ler();
    const r = fn(s);
    localStorage.setItem(KEY, JSON.stringify(s));
    window.dispatchEvent(new Event("nassau:mudou"));
    return r;
  };
  return navigator.locks ? navigator.locks.request("nassauTickets", corpo) : corpo();
}

const mudar = (t, estado) => { t.estado = estado; t.hist.push([estado, Date.now()]); };
const fila = (s, tipo) => s.tickets.filter((t) => t.tipo === tipo && t.estado === "AGUARDANDO" && !t.descartada);
export const aguardando = (s, tipo) => fila(s, tipo).length;

// RN02 a RN04: alternância SP -> (SE|SG) -> SP, sem repetir o tipo quando há outro aguardando
export function proximoTipo(s) {
  const ordem = s.ultimo === "SP" ? ["SE", "SG", "SP"] : s.ultimo === "SE" ? ["SP", "SG", "SE"] : ["SP", "SE", "SG"];
  return ordem.find((tipo) => fila(s, tipo).length > 0) || null;
}

export function emitir(tipo) {
  return transacao((s) => {
    if (!dentroDoExpediente()) throw new Error("Fora do expediente. O atendimento funciona das 7h às 17h.");
    s.seq[tipo] += 1;
    const agora = Date.now();
    const t = {
      numero: `${hoje()}-${tipo}${pad(s.seq[tipo], 3)}`,
      tipo,
      estado: "AGUARDANDO",
      emitidaEm: agora,
      chamadas: [],
      hist: [["EMITIDA", agora], ["AGUARDANDO", agora]],
    };
    s.tickets.push(t);
    return t;
  });
}

export const atendimentoDoGuiche = (s, guiche) =>
  s.tickets.find((t) => t.guiche === guiche && ATIVOS.includes(t.estado));

export function chamarProxima(guiche, atendente) {
  return transacao((s) => {
    if (!dentroDoExpediente()) throw new Error("Fora do expediente. O atendimento funciona das 7h às 17h.");
    if (atendimentoDoGuiche(s, guiche)) throw new Error("Encerre o atendimento atual antes de chamar outra senha.");
    const tipo = proximoTipo(s);
    if (!tipo) return null;
    const t = fila(s, tipo)[0];
    t.guiche = guiche;
    t.atendente = atendente;
    t.chamadas.push(Date.now());
    mudar(t, "CHAMADA");
    s.ultimo = tipo;
    return t;
  });
}

function atualizar(numero, de, para, extra) {
  return transacao((s) => {
    const t = s.tickets.find((x) => x.numero === numero);
    if (!t || !de.includes(t.estado)) throw new Error("Essa ação não vale para o estado atual da senha.");
    if (extra) extra(t);
    mudar(t, para);
    return t;
  });
}

export const chamarNovamente = (n) => atualizar(n, ["CHAMADA"], "CHAMADA_NOVAMENTE", (t) => t.chamadas.push(Date.now()));
export const iniciar = (n) => atualizar(n, ["CHAMADA", "CHAMADA_NOVAMENTE"], "EM_ATENDIMENTO", (t) => { t.iniciadoEm = Date.now(); });
export const encerrar = (n) => atualizar(n, ["EM_ATENDIMENTO"], "ATENDIDA", (t) => { t.finalizadoEm = Date.now(); });
export const naoCompareceu = (n) => atualizar(n, ["CHAMADA_NOVAMENTE"], "NÃO_COMPARECEU");

// RN09: o painel mostra só as 5 últimas chamadas
export const ultimasChamadas = (s) =>
  s.tickets.filter((t) => t.chamadas.length).sort((a, b) => b.chamadas.at(-1) - a.chamadas.at(-1)).slice(0, 5);

export const anuncio = (t, ultima) =>
  `${ultima ? "Última chamada. " : ""}Senha ${NOMES[t.tipo]} ${Number(t.numero.slice(-3))}, guichê ${t.guiche}.`;

export function falar(texto) {
  if (!("speechSynthesis" in window)) return;
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = "pt-BR";
  speechSynthesis.cancel();
  speechSynthesis.speak(u);
}

// RNF03: se a leitura falhar, mantém o último estado conhecido e avisa
export function useFila() {
  const [s, setS] = useState(ler);
  const [erro, setErro] = useState(false);
  useEffect(() => {
    const atualizarTela = () => {
      try { setS(ler()); setErro(false); } catch { setErro(true); }
    };
    window.addEventListener("storage", atualizarTela);
    window.addEventListener("nassau:mudou", atualizarTela);
    const timer = setInterval(atualizarTela, 3000);
    return () => {
      window.removeEventListener("storage", atualizarTela);
      window.removeEventListener("nassau:mudou", atualizarTela);
      clearInterval(timer);
    };
  }, []);
  return { s, erro };
}
