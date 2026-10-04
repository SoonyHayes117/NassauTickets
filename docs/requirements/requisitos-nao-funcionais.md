# Requisitos não funcionais

| ID | Categoria | Requisito |
|----|-----------|-----------|
| RNF01 | Segurança | Apenas atendente/gestor acessa o console; senhas armazenadas com hash no backend. |
| RNF02 | Concorrência | Dois atendentes nunca recebem a mesma senha (bloqueio na fila; no MySQL, transação com `SELECT ... FOR UPDATE SKIP LOCKED`). |
| RNF03 | Disponibilidade | Se o backend cair, o painel mantém a última chamada conhecida e avisa que está sem atualização; o totem informa a falha em vez de emitir senha duplicada. |
| RNF04 | Auditoria | Registro de atendente, guichê, senha e horários de cada chamada e atendimento. |
| RNF05 | Desempenho | Emissão e chamada respondem em menos de 1 s; painel atualiza em até 3 s. |
| RNF06 | LGPD | O totem é anônimo; nenhum dado pessoal do cliente é coletado nas senhas. |
| RNF07 | Acessibilidade | Contraste alto, foco visível, navegação por teclado, `aria-live` no painel, áudio das chamadas e respeito a `prefers-reduced-motion`. |
| RNF08 | Portabilidade | Interface responsiva (totem, painel e guichê). |
