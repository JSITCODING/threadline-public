# Threadline

O Threadline é uma ponte local, controlada por revisão, que transforma conversas com IA em conhecimento Markdown duradouro.

[English](README.md)

Ele importa um ficheiro de exportação do ChatGPT, normaliza o ramo ativo da conversa, guarda o resultado localmente e permite que uma pessoa crie, aprove, aplique e reverta propostas Markdown explícitas. O Threadline nunca escreve silenciosamente num cofre de notas.

## Porquê

Decisões e aprendizagens úteis ficam frequentemente presas em conversas longas. Copiar transcrições completas para um sistema de conhecimento pessoal cria ruído e riscos de privacidade. O Threadline preserva apenas o fio útil: uma decisão, princípio, atualização de projeto ou próxima ação — sempre com revisão antes de se tornar memória.

## Capacidades atuais

- Inicializar um espaço de trabalho local e privado para um cofre Markdown.
- Importar o ficheiro `conversations.json` de uma exportação do ChatGPT.
- Normalizar o ramo ativo e evitar duplicados em importações repetidas.
- Marcar conversas potencialmente sensíveis para tratamento apenas por princípios.
- Criar propostas Markdown manuais sem copiar transcrições.
- Aprovar, rejeitar, aplicar, criar snapshots, auditar e reverter propostas.
- Rejeitar caminhos absolutos, travessias de diretórios, ligações simbólicas inseguras, hashes desatualizados e escritas não aprovadas.

## Estado da versão

O Threadline está a preparar o seu primeiro candidato a lançamento. A implementação atual destina-se apenas a avaliação sintética: não utilize uma exportação real nem um cofre pessoal até que o piloto com cofre real e a revisão de privacidade estejam concluídos.

## Início rápido

```bash
pnpm install --frozen-lockfile
pnpm check

pnpm threadline init --vault ./examples/synthetic-vault
pnpm threadline import chatgpt ./examples/fixtures/conversations.json
pnpm threadline conversation list

pnpm threadline propose CONVERSATION_ID \
  --provider manual \
  --target "20 Projects/Example Project.md" \
  --content-file ./examples/proposal.md

pnpm threadline proposal list
pnpm threadline proposal approve PROPOSAL_ID
pnpm threadline proposal apply PROPOSAL_ID
```

O Threadline guarda importações reais, a base de dados SQLite, propostas, snapshots e o histórico de auditoria no diretório privado de dados da aplicação do sistema operativo. Esses ficheiros não pertencem a este repositório nem ao cofre.

## Limites de segurança

- Não existem operações de eliminação ou renomeação.
- Nenhuma escrita pode ocorrer fora do caminho configurado para o cofre real.
- Nenhuma proposta é aplicada sem aprovação explícita.
- Nenhuma proposta é aplicada se o alvo tiver mudado após a sua criação.
- É criado um snapshot privado de recuperação antes de cada escrita.
- Os fornecedores de IA são opcionais e nunca são chamados implicitamente.
- Todos os exemplos do repositório são sintéticos.

Leia o [modelo de segurança](docs/security/security-model.md) e a [arquitetura](docs/decisions/0001-local-review-gated-core.md) antes de alterar o caminho de escrita.

As notas do candidato a lançamento estão disponíveis em [v0.1.0-rc.1](docs/releases/v0.1.0-rc.1.md).

## Roteiro

1. `v0.1` — importação e normalização
2. `v0.2` — extração e encaminhamento de candidatos
3. `v0.3` — revisão, snapshot e aplicação de propostas
4. `v0.4` — piloto com cofre real
5. `v0.5` — interface React local para revisão

O repositório já inclui um pequeno percurso vertical que atravessa os marcos 1–3 para permitir testes completos do modelo de segurança. A CLI continua a ser a interface principal até que o núcleo esteja estável.
