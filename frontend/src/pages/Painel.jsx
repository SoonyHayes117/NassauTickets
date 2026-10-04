import { ultimasChamadas, useFila } from "../services/fila.js";

export default function Painel() {
  const { s, erro } = useFila();
  const [atual, ...anteriores] = ultimasChamadas(s);

  return (
    <>
      <h1>Painel de chamadas</h1>
      {erro && <p className="erro" role="alert">Sem atualização do sistema. Exibindo a última chamada conhecida.</p>}
      {!atual ? (
        <p>Nenhuma senha chamada ainda. Quando o atendente chamar, ela aparece aqui.</p>
      ) : (
        <>
          <section className={`atual tipo-${atual.tipo}`} aria-live="polite">
            <p>Chamando agora</p>
            <div className="num">{atual.numero}</div>
            <p className="guiche">Guichê {atual.guiche}</p>
          </section>
          {anteriores.length > 0 && (
            <>
              <h2>Últimas chamadas</h2>
              <ul className="hist">
                {anteriores.map((t) => (
                  <li key={t.numero} className={`tipo-${t.tipo}`}>
                    <span className="num">{t.numero}</span>
                    <span>Guichê {t.guiche}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </>
  );
}
