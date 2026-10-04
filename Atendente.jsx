import { useState } from "react";
import {
  aguardando, anuncio, atendimentoDoGuiche, chamarNovamente, chamarProxima,
  encerrar, falar, iniciar, naoCompareceu, useFila,
} from "../services/fila.js";

const SESSAO = "nassauTickets:sessao";
const lerSessao = () => {
  try { return JSON.parse(sessionStorage.getItem(SESSAO)); } catch { return null; }
};

function Login({ onEntrar }) {
  const [erro, setErro] = useState("");
  const enviar = (e) => {
    e.preventDefault();
    const f = new FormData(e.target);
    if (f.get("usuario") !== "atendente" || f.get("senha") !== "nassau123") {
      setErro("Usuário ou senha incorretos. Confira os dados e tente de novo.");
      return;
    }
    const sessao = { usuario: "atendente", perfis: ["ATENDENTE", "GESTOR"], guiche: Number(f.get("guiche")) };
    sessionStorage.setItem(SESSAO, JSON.stringify(sessao));
    onEntrar(sessao);
  };
  return (
    <form className="login" onSubmit={enviar}>
      <h1>Entrar no guichê</h1>
      <label>Usuário <input name="usuario" autoComplete="username" required /></label>
      <label>Senha <input name="senha" type="password" autoComplete="current-password" required /></label>
      <label>Guichê
        <select name="guiche">{[1, 2, 3, 4].map((n) => <option key={n}>{n}</option>)}</select>
      </label>
      {erro && <p className="erro" role="alert">{erro}</p>}
      <button className="acao">Entrar</button>
    </form>
  );
}

export default function Atendente() {
  const [sessao, setSessao] = useState(lerSessao);
  const [erro, setErro] = useState("");
  const { s } = useFila();
  if (!sessao) return <Login onEntrar={setSessao} />;

  const atual = atendimentoDoGuiche(s, sessao.guiche);
  const estado = atual?.estado;
  const run = async (fn, voz) => {
    try {
      setErro("");
      const t = await fn();
      if (t && voz) falar(anuncio(t, voz === "ultima"));
    } catch (e) { setErro(e.message); }
  };
  const proxima = () => chamarProxima(sessao.guiche, sessao.usuario);
  const sair = () => { sessionStorage.removeItem(SESSAO); setSessao(null); };

  return (
    <>
      <h1>Guichê {sessao.guiche}</h1>
      <p>Atendente logado. <button className="link" onClick={sair}>Sair</button></p>
      <p>Aguardando: {aguardando(s, "SP")} prioritárias, {aguardando(s, "SE")} exames, {aguardando(s, "SG")} gerais.</p>
      {atual ? (
        <section className={`ticket tipo-${atual.tipo}`} aria-live="polite">
          <div className="num">{atual.numero}</div>
          <p>{estado.replaceAll("_", " ").toLowerCase()}</p>
        </section>
      ) : <p>Nenhuma senha em atendimento neste guichê.</p>}
      {erro && <p className="erro" role="alert">{erro}</p>}
      <div className="botoes">
        <button className="acao" disabled={!!atual} onClick={() => run(proxima, "chamada")}>Chamar próxima</button>
        <button className="acao" disabled={estado !== "CHAMADA"} onClick={() => run(() => chamarNovamente(atual.numero), "ultima")}>Chamar novamente</button>
        <button className="acao" disabled={!["CHAMADA", "CHAMADA_NOVAMENTE"].includes(estado)} onClick={() => run(() => iniciar(atual.numero))}>Iniciar atendimento</button>
        <button className="acao" disabled={estado !== "EM_ATENDIMENTO"} onClick={() => run(() => encerrar(atual.numero))}>Encerrar atendimento</button>
        <button className="acao perigo" disabled={estado !== "CHAMADA_NOVAMENTE"} onClick={() => run(async () => { await naoCompareceu(atual.numero); return proxima(); }, "chamada")}>Cliente não compareceu</button>
      </div>
    </>
  );
}
