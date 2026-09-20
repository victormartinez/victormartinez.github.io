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

## Criando uma nota

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
