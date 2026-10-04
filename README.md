# nassauTickets

Sistema de Controle de Atendimento para um Laboratório de Análises Clínicas (UNINASSAU).

## Descrição e objetivo
O cliente retira uma senha no totem, acompanha a chamada no painel e o atendente chama, inicia e encerra o atendimento no guichê. Três tipos de senha: **SP** (prioritária), **SG** (geral) e **SE** (retirada de exames), com a alternância `[SP] → [SE|SG] → [SP] → [SE|SG]`.

## Membros
| Nome | Matrícula | Papel |
|------|-----------|-------|
| _Davi Henrique_ | _24009979_ | Scrum Master |
| _Igor Santos_ | _01815246_ | Documentador |
| _Lucas Jose_ | _01815708_ | Desenvolvedor |
| _Pedro vieira_ | _01679503_ | Testador |

## Tecnologias
- Frontend: React 19, Vite, React Router, CSS puro.
- Backend (fase 2): Node.js LTS 22 + Express com MySQL 8.0 _(justificativa técnica a ser escrita pelo grupo)_.

## Visão geral
Na fase 1 o frontend usa `frontend/src/services/fila.js`, que guarda os dados no navegador (`localStorage`) e usa a Web Locks API para evitar que dois guichês recebam a mesma senha. Na fase 2 esse serviço será trocado por chamadas REST ao backend.

Telas: `/` totem, `/painel` painel de chamadas (5 últimas), `/atendente` login e console do guichê.

## Instalação e execução
```bash
cd frontend
npm install
npm run dev
```
Acesse http://localhost:5173. Para testar com vários guichês, abra `/atendente` em abas diferentes.

## Configuração de demonstração
- Login: usuário `atendente`, senha `nassau123` (perfis atendente e gestor). Provisório, será substituído por autenticação no backend.
- A caixa **Ignorar horário de expediente** no topo libera o sistema fora do horário das 7h às 17h.

## Branches
- `main`: versão estável, recebe merge da `dev`.
- `dev`: desenvolvimento diário.

## Documentação
Em [`docs/`](docs): requisitos, regras de negócio, casos de uso, máquina de estados (UML), MER, branding e mockups.
