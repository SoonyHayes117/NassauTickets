# Regras de negócio

- **RN01** SP tem a maior prioridade, SE tem prioridade operacional especial e SG a menor.
- **RN02** A alternância segue `[SP] → [SE|SG] → [SP] → [SE|SG]`: depois de SP vem SE (se houver) ou SG; depois de SE ou SG vem SP (se houver).
- **RN03** Nunca se chama o mesmo tipo duas vezes seguidas se existir outro tipo aguardando.
- **RN04** Se uma fila está vazia, o sistema segue a ordem de prioridade com as demais.
- **RN05** Qualquer guichê atende qualquer tipo de senha.
- **RN06** Duas chamadas sem comparecimento: a senha é abandonada (NÃO_COMPARECEU).
- **RN07** Expediente das 7h às 17h; atendimentos em curso são encerrados pelo atendente; senhas restantes são descartadas.
- **RN08** Numeração `YYMMDD-PPSQ`, sequência com 3 dígitos por tipo, reiniciada por dia.
- **RN09** O painel exibe as 5 últimas chamadas e não exibe a próxima senha.
- **RN10** Tempos médios de referência (TM): SG 5 min ±3, SP 15 min ±5, SE 1 min (95%) ou 5 min (5%).
- **RN11** Um guichê só chama nova senha depois de encerrar o atendimento atual.
