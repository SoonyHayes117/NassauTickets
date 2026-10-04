import { useState } from "react";
import { BrowserRouter, NavLink, Route, Routes } from "react-router-dom";
import Totem from "./pages/Totem.jsx";
import Painel from "./pages/Painel.jsx";
import Atendente from "./pages/Atendente.jsx";
import { modoDemo } from "./services/fila.js";

function Logo() {
  return (
    <div className="logo">
      <img src="/logo.svg" alt="" width="36" height="36" />
      nassauTickets
    </div>
  );
}

export default function App() {
  const [demo, setDemo] = useState(modoDemo());
  const alternar = (e) => {
    localStorage.setItem("nassauTickets:demo", e.target.checked ? "1" : "0");
    setDemo(e.target.checked);
  };
  return (
    <BrowserRouter>
      <a className="pular" href="#conteudo">Ir para o conteúdo</a>
      <header className="topo">
        <Logo />
        <nav aria-label="Principal">
          <NavLink to="/" end>Totem</NavLink>
          <NavLink to="/painel">Painel</NavLink>
          <NavLink to="/atendente">Atendente</NavLink>
        </nav>
        <label className="demo">
          <input type="checkbox" checked={demo} onChange={alternar} /> Ignorar horário de expediente (demonstração)
        </label>
      </header>
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Totem />} />
          <Route path="/painel" element={<Painel />} />
          <Route path="/atendente" element={<Atendente />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}
