# Schemas Drizzle ORM — Truco Mineiro

Estrutura PostgreSQL com Drizzle ORM, um arquivo por tabela. O modelo separa:

- **Confronto:** disputa de duas duplas dentro do chaveamento.
- **Jogo:** uma partida digital de truco dentro de um confronto (permite melhor de 3, por exemplo).
- **Mão:** rodada de três cartas distribuídas a cada jogador.
- **Vaza:** cada rodada de quatro cartas jogadas.

## Arquivos

Cada tabela possui seu próprio arquivo `.ts` dentro de `schema/`. `enums.ts` centraliza enums PostgreSQL e `types.ts` tipa os JSONB. O arquivo irmão `schema.ts` reexporta todas as tabelas para uso no código da aplicação; ele fica fora da pasta analisada pelo Drizzle Kit para evitar importar os mesmos schemas duas vezes.

Tabelas incluídas:

1. `usuarios`
2. `jogadores`
3. `duplas`
4. `dupla_jogadores`
5. `regras_truco`
6. `cartas`
7. `forca_cartas`
8. `torneios`
9. `torneio_usuarios`
10. `inscricoes`
11. `inscricao_jogadores`
12. `fases`
13. `confrontos`
14. `vagas_confronto`
15. `jogos`
16. `jogo_jogadores`
17. `maos`
18. `cartas_distribuidas`
19. `vazas`
20. `jogadas_cartas`
21. `pedidos_truco`
22. `eventos_pontuacao`
23. `eventos_jogo`
24. `logs_auditoria`

## Instalação

```bash
npm install drizzle-orm pg dotenv
npm install -D drizzle-kit typescript @types/node
```

Configure `DATABASE_URL` no `.env` e copie `schema/` para `src/db/schema/`. Copie também `drizzle.config.ts` para a raiz do projeto.

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

Se preferir sincronizar diretamente em ambiente local descartável, use `npx drizzle-kit push`; para ambientes compartilhados/produção, prefira migrations versionadas.

## Decisões e validações que precisam ficar no serviço

- As tabelas `dupla_jogadores` e `inscricao_jogadores` permitem no máximo duas posições distintas, mas a regra de **exatamente dois jogadores** deve ser validada em uma transação de serviço ou por trigger PostgreSQL.
- `vagas_confronto.slot = 1` é o lado A e `slot = 2` é o lado B. O serviço de chaveamento deve preencher a vaga a partir do resultado do confronto de origem.
- Quatro jogadores por jogo, duas pessoas por inscrição, correspondência entre `inscricao_id` e lado A/B e ordem circular dos assentos precisam ser validadas ao criar o jogo.
- O servidor é a autoridade para embaralhar, distribuir, validar turnos, comparar cartas, determinar vencedores de vazas e calcular pontuação.
- `jogos.pontos_lado_a/b` são caches para leitura rápida. A fonte de auditoria é `eventos_pontuacao`; atualize ambos na mesma transação.
- `versao_estado` em `jogos` deve ser incrementada com atualização condicional (`WHERE versao_estado = versão_lida`) para evitar duas jogadas simultâneas no mesmo turno.
- `cartas_distribuidas` contém informação privada. A API deve retornar apenas as cartas do jogador autenticado. Nunca serialize essa tabela inteira para uma sala WebSocket.
- `eventos_jogo.private_payload` deve permanecer apenas no servidor. Para espectadores e jogadores, gere uma projeção pública autorizada.
- Não permita editar um conjunto de regras que já esteja em uso. Crie nova versão em `regras_truco` e grave um snapshot em `jogos.snapshot_regras`.
- Configure regras de empate, mão de dez, mão de ferro, canga e sequência de chamadas no `snapshot_regras`; não as deixe espalhadas em componentes React.

## Seed do baralho

A tabela `cartas` é um catálogo estático: após a migration, faça seed das 40 combinações dos valores `4, 5, 6, 7, Q, J, K, A, 2, 3` com os naipes `CLUBS, HEARTS, SPADES, DIAMONDS`. Omitir 8, 9, 10 e curingas gera as 40 cartas. Use `codigo` consistente, por exemplo `4C`, `7H`, `AS` e `7D`.

Depois, crie um conjunto inicial em `regras_truco` e 40 linhas correspondentes em `forca_cartas`. Para a configuração mineira escolhida anteriormente, valide a hierarquia e as regras especiais com o regulamento oficial que o organizador adotará antes de publicar o conjunto.

## Nota sobre os valores de Truco Mineiro

O schema não fixa juridicamente toda a regra regional. A configuração JSONB é intencional: pontos, chamadas, empate, mão de dez e mão de ferro variam entre regulamentos. O serviço deve validar a configuração e congelar seu snapshot em cada jogo.
