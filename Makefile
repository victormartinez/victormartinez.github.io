# Fluxo de escrita e publicação do vcrmartinez.com
#
# Todo alvo que precisa de Node passa por scripts/com-node.sh, que carrega o
# nvm e seleciona a versão do .nvmrc (o nvm é função de shell e não existe
# dentro de um recipe do make).
#
# GNU Make 3.81 (o que vem no macOS) não tem .ONESHELL: cada linha de recipe
# roda no seu próprio shell, por isso os comandos encadeiam com &&.

SHELL := /bin/bash
NODE  := ./scripts/com-node.sh

.DEFAULT_GOAL := ajuda
.PHONY: ajuda novo-texto nova-nota editor dev build servir limpar deps publicar

ajuda:
	@echo ""
	@echo "  make novo-texto TITULO=\"...\"   cria a pasta e o frontmatter de um texto"
	@echo "  make nova-nota CAMINHO=\"...\"   cria uma anotação de estudo (já nasce no ar)"
	@echo "  make editor                     editor de notas e textos no navegador, salva sozinho (localhost:8100)"
	@echo "  make dev                        servidor local com recarga (localhost:8000)"
	@echo "  make build                      build de produção"
	@echo "  make servir                     serve o build local (localhost:9000)"
	@echo "  make publicar MSG=\"...\"        commita content/ e publica (push dispara o deploy)"
	@echo "  make deps                       instala as dependências"
	@echo "  make limpar                     limpa o cache do Gatsby"
	@echo ""
	@echo "  Opções do novo-texto:  CATEGORIA=\"Carreira\"  DESCRICAO=\"...\"  DATA=AAAA-MM-DD"
	@echo "  Opções da nova-nota:   TITULO=\"...\"  DESCRICAO=\"...\"  MATURIDADE=em-aberto|revisada"
	@echo "  O CAMINHO é a hierarquia:  \"kubernetes\"  ou  \"kubernetes/networking\""
	@echo ""

novo-texto:
ifndef TITULO
	@echo "Falta o título:  make novo-texto TITULO=\"Como eu decido quando parar de refatorar\"" && exit 1
endif
	@$(NODE) node scripts/novo-texto.mjs "$(TITULO)" \
		$(if $(CATEGORIA),--categoria "$(CATEGORIA)") \
		$(if $(DESCRICAO),--descricao "$(DESCRICAO)") \
		$(if $(DATA),--data "$(DATA)")

nova-nota:
ifndef CAMINHO
	@echo "Falta o caminho:  make nova-nota CAMINHO=\"kubernetes/networking\" TITULO=\"Networking no Kubernetes\"" && exit 1
endif
	@$(NODE) node scripts/nova-nota.mjs "$(CAMINHO)" \
		$(if $(TITULO),--titulo "$(TITULO)") \
		$(if $(DESCRICAO),--descricao "$(DESCRICAO)") \
		$(if $(MATURIDADE),--maturidade "$(MATURIDADE)")

editor:
	@$(if $(PORTA),PORTA=$(PORTA)) $(NODE) node scripts/editor-notas/servidor.mjs

dev:
	@$(NODE) npm run develop

build:
	@$(NODE) npm run build

servir:
	@$(NODE) npm run serve

limpar:
	@$(NODE) npm run clean

deps:
	@$(NODE) npm install

publicar:
	@./scripts/publicar.sh "$(MSG)"
