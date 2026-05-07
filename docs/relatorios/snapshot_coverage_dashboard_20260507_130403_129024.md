# Dashboard de Conformidade de Snapshots por Release

Gerado em: 07/05/2026 13:04:03
Modo: multiambiente
Strict: no

## Resumo Executivo

- Ambientes analisados: 2
- Ambientes indisponiveis: 1
- Releases analisadas: 5
- Itens aplicados analisados: 1
- Itens com snapshot obrigatorio: 1
- Itens com snapshot coberto: 1
- Itens com snapshot faltante: 0
- Avisos de manifesto: 0
- Releases com drift entre ambientes: 0
- Conformidade geral consolidada: 100.00%

## Ambientes Avaliados

| Ambiente | Ativo | Host | Database | Status |
| --- | --- | --- | --- | --- |
| online | no | localhost | nosfirquotia | UNAVAILABLE - Falha ao conectar no banco: SQLSTATE[HY000] [1045] Access denied for user 'quotia_app'@'localhost' (using password: YES) |
| local | yes | localhost | nosfirquotia | OK |

## Resumo por Ambiente

| Ambiente | Releases | Required | Covered | Missing | Warnings | Conformidade |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| online | 0 | 0 | 0 | 0 | 0 | n/a |
| local | 5 | 1 | 1 | 0 | 0 | 100.00% |

## Baseline de Drift Entre Ambientes

- Comparativo nao aplicavel (apenas um ambiente disponivel).

## Detalhamento por Release

### Ambiente online
- Ambiente indisponivel para consulta: Falha ao conectar no banco: SQLSTATE[HY000] [1045] Access denied for user 'quotia_app'@'localhost' (using password: YES)

### Ambiente local (ativo)
| Release | Run | Status | Aplicadas/Planejadas | Backup | Snapshot obrig. | Cobertos | Faltantes | Conformidade |
| --- | --- | --- | --- | --- | ---: | ---: | ---: | ---: |
| 06/05/2026 | `d0024270-5ee2-4983-8a3c-32f3957efeae` | SUCCESS | 0/0 | ref=backup-local-test-v2 @2026-05-06 18:38:42 | 0 | 0 | 0 | 100.00% |
| 06/05/2026 | `54477367-a2ee-477e-ae0c-e8e355602971` | SUCCESS | 0/0 | ref=backup-local-test @2026-05-06 21:37:44 | 0 | 0 | 0 | 100.00% |
| 06/05/2026 | `6240eab9-c8cf-49fc-afa6-83bbaf6dcd06` | SUCCESS | 1/1 | n/a | 1 | 1 | 0 | 100.00% |
| 06/05/2026 | `feda7cc0-720c-48fd-ac6f-2ab75dee36a0` | SUCCESS | 0/0 | n/a | 0 | 0 | 0 | 100.00% |
| 06/05/2026 | `fc596fef-7508-4d58-8f77-7935d5eca151` | SUCCESS | 0/0 | n/a | 0 | 0 | 0 | 100.00% |

## Pendencias por Release

- Nenhuma pendencia critica identificada.

## Acoes Recomendadas

1. Para cada item com `snapshot_missing`, executar `composer db:migrate:snapshot-backfill -- --run-id=<run_id>`.
2. Reexecutar `composer db:migrate:snapshot-coverage-audit:strict` no ambiente afetado.
3. Publicar este artefato junto da evidencia da release (change log/chamado de deploy).
