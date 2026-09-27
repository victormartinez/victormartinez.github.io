# content/notas — anotações de estudo

Esta pasta é a árvore de `/notas-de-estudo/`. **A pasta é a URL**: cada pasta com
um `index.md` vira uma página, e as pastas de dentro viram sub-páginas dela.

```
content/notas/
  kubernetes/
    index.md              ->  /notas-de-estudo/kubernetes/
    diagrama.png              (imagem ao lado do texto, como nos textos)
    networking/
      index.md            ->  /notas-de-estudo/kubernetes/networking/
      services/
        index.md          ->  /notas-de-estudo/kubernetes/networking/services/
```

Só o `index.md` da pasta vira nota. Qualquer outro `.md` daqui — este README
inclusive — é ignorado pelo build.

## Escrevendo no editor

```
make editor        # abre http://localhost:8100
```

O editor (que também edita os textos do blog, na aba Textos) lista a árvore de
notas, cria nota e sub-nota, e **salva sozinho**: um
instante depois que você para de digitar, o texto está no `index.md` da nota.
Não há botão de salvar (`Cmd+S` força na hora, se quiser). Ele também:

- mostra a prévia ao lado com o CSS do site — é a página como ela vai ao ar;
- cuida das imagens: cole, arraste ou use o botão Imagem. O arquivo vai para a
  pasta da nota, foto maior que 2000 px é reduzida, HEIC vira JPG quando o
  navegador consegue abrir, e o editor pergunta o que a imagem mostra para
  preencher a descrição — sem precisar mexer no Markdown;
- guarda cada mudança também no navegador: se o editor cair antes de gravar,
  a nota oferece recuperar o texto na próxima vez que abrir;
- não passa por cima de edição feita em outro programa: se o arquivo mudou no
  disco desde que foi aberto, pergunta qual versão fica.

**Salvar não publica.** O editor grava em `content/notas/`; quem manda para o ar
continua sendo o `make publicar`. Com `make dev` rodando em outro terminal, o
link "Ver no site" abre a página de verdade, que recarrega a cada gravação.

## Criando uma nota pela linha de comando

```
make nova-nota CAMINHO="kubernetes" TITULO="Kubernetes"
make nova-nota CAMINHO="kubernetes/networking" TITULO="Networking no Kubernetes"
```

O comando cria os `index.md` dos temas acima que ainda não existirem: uma nota
sem índice em alguma pasta acima dela fica fora do site (o build avisa no
terminal quando isso acontece).

## Frontmatter

```yaml
---
title: "Networking no Kubernetes"
description: "Como o tráfego chega no pod: CNI, Service, Ingress."
maturidade: em-aberto        # em-aberto | revisada
atualizado: 2026-09-20       # aparece como "atualizada em ..."
# ordem: 10                  # opcional: ordena entre as irmãs (sem ela, alfabética)
# publicado: false           # descomente para tirar a nota do ar
---
```

**Nota nasce publicada.** Ao contrário dos textos em `content/blog/`, que só vão
ao ar com `publicado: true`, a anotação entra no site assim que existe — quem diz
o estágio dela é o selo de maturidade, não um rascunho que nunca sai do lugar.
Para segurar uma nota, use `publicado: false`.

## O que cada página mostra

- **`/notas-de-estudo/`** — índice A–Z dos temas com busca. O contador de cada
  tema soma a árvore inteira abaixo dele.
- **Página da nota** — trilha até a raiz, selo, data, sumário (a partir de 3
  seções `##`) e, no fim, as sub-páginas diretas.

O `index.md` de um tema é o lugar de escrever o caminho entre as notas de dentro:
o A–Z acha o tema, esse texto é que explica por onde começar.
