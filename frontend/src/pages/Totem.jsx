import { useState } from "react";
import { aguardando, emitir, useFila } from "../services/fila.js";

const TIPOS = [
  ["SP", "Atendimento prioritário", "Idosos, gestantes, lactantes e pessoas com deficiência"],
  ["SG", "Atendimento geral", "Cadastro e demais serviços do laboratório"],
  ["SE", "Retirada de exames", "Resultados que já estão prontos"],
];

export default function Totem() {
  const { s } = useFila();
  const [senha, setSenha] = useState(null);
  const [erro, setErro] = useState("");

  const pegar = async (tipo) => {
    try { setErro(""); setSenha(await emitir(tipo)); } catch (e) { setSenha(null); setErro(e.message); }
  };

  return (
    <>
      <h1>Retire sua senha</h1>
      <p>Escolha o tipo de atendimento e aguarde ser chamado no painel.</p>
      <div className="grade">
        {TIPOS.map(([tipo, titulo, ajuda]) => (
          <button key={tipo} className={`tipo tipo-${tipo}`} onClick={() => pegar(tipo)}>
            <strong>{titulo}</strong>
            {ajuda}
            <small className="fila">{aguardando(s, tipo)} aguardando</small>
          </button>
        ))}
      </div>
      {erro && <p className="erro" role="alert">{erro}</p>}
      {senha && (
        <section className={`ticket tipo-${senha.tipo}`} aria-live="polite">
          <p>Sua senha</p>
          <div className="num">{senha.numero}</div>
          <p>Acompanhe a chamada no painel.</p>
        </section>
      )}
    </>
  );
}
