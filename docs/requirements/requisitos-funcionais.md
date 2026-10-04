# Requisitos funcionais

| ID | Requisito |
|----|-----------|
| RF01 | O cliente emite senha SP, SG ou SE no totem, sem login. |
| RF02 | A senha segue o formato `YYMMDD-PPSQ`, com sequência por tipo e reinício diário. |
| RF03 | O sistema escolhe a próxima senha pelas regras de prioridade (RN01 a RN04). |
| RF04 | O atendente autenticado chama a próxima senha pelo seu guichê. |
| RF05 | O atendente pode "Chamar novamente"; o áudio repete com o aviso "Última chamada". |
| RF06 | O atendente inicia e encerra o atendimento. |
| RF07 | Após duas chamadas sem comparecimento, a senha vira NÃO_COMPARECEU e o sistema chama a próxima. |
| RF08 | O painel mostra as 5 últimas senhas chamadas e o guichê, nunca a próxima. |
| RF09 | Cada chamada emite áudio com prioridade, sequencial e guichê. |
| RF10 | O sistema opera das 7h às 17h; ao fim, senhas na fila são descartadas. |
| RF11 | O gestor consulta relatórios diário e mensal (emitidas, atendidas, por prioridade, detalhado, TM, auditoria). _Fase 2._ |
| RF12 | Cada mudança de estado e chamada é registrada para auditoria. |
