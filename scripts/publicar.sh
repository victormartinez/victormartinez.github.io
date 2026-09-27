#!/usr/bin/env bash
# Publica o que mudou em content/: commit e push na main, que dispara o deploy
# (.github/workflows/deploy.yml). Chamado por  make publicar MSG="...".
#
# Cada checagem abaixo existe porque o engano correspondente é silencioso: sem
# ela, o comando terminaria dizendo "Publicado" (ou "nada foi enviado") sem
# que isso fosse verdade.
set -uo pipefail

msg="${1:-}"
if [ -z "$msg" ]; then
  echo 'Falta a mensagem:  make publicar MSG="texto novo sobre X"'
  exit 1
fi

cd "$(git rev-parse --show-toplevel)" || exit 1

# 1. Só a main vai ao ar. Numa branch (ou numa worktree de outra branch) o
#    commit ficaria nela e o push da main sairia vazio.
ramo=$(git branch --show-current)
if [ "$ramo" != "main" ]; then
  echo "Você está na branch \"${ramo:-(nenhuma)}\" — daqui nada iria ao ar: só a main é publicada."
  onde=$(git worktree list --porcelain |
    awk '/^worktree /{w=substr($0, 10)} /^branch refs\/heads\/main$/{print w}')
  if [ -n "$onde" ] && [ "$onde" != "$PWD" ]; then
    echo "A main está em outra pasta. Rode lá:"
    echo "  cd \"$onde\" && make publicar MSG=\"$msg\""
  else
    echo "Volte para a main (git switch main) e rode de novo."
  fi
  exit 1
fi

# 2. O GitHub não pode estar na frente: o push seria recusado depois do commit.
if ! git fetch -q origin main; then
  echo "Não consegui falar com o GitHub (sem internet?). Nada foi feito."
  exit 1
fi
atras=$(git rev-list --count HEAD..origin/main)
if [ "$atras" -gt 0 ]; then
  echo "O GitHub tem $atras commit(s) que esta pasta ainda não tem."
  echo "Rode  git pull  e depois publique de novo. Nada foi feito."
  exit 1
fi

# 3. Mostra tudo o que vai subir, inclusive commits de código ainda não enviados.
git add content/
conteudo=$(git diff --cached --name-only -- content/)
pendentes=$(git log --oneline origin/main..HEAD)
if [ -z "$conteudo" ] && [ -z "$pendentes" ]; then
  echo "Nada novo em content/ para publicar."
  exit 0
fi
if [ -n "$conteudo" ]; then
  echo "Conteúdo:"
  git status --short -- content/ | sed 's/^/  /'
fi
if [ -n "$pendentes" ]; then
  [ -n "$conteudo" ] && echo
  echo "Também sobem estes commits, que ainda não estão no GitHub:"
  echo "$pendentes" | sed 's/^/  /'
fi
echo
read -r -p "Publicar isso em vcrmartinez.com? [s/N] " resposta
if [ "$resposta" != "s" ]; then
  echo "Cancelado (nada foi enviado)."
  exit 0
fi

# 4. O commit leva só content/: o que estiver preparado fora dela fica de fora.
if [ -n "$conteudo" ]; then
  if ! git commit -q -m "content: $msg" -- content/; then
    echo "O commit falhou. Nada foi enviado."
    exit 1
  fi
fi
if ! git push -q origin main; then
  echo
  echo "O commit foi feito nesta pasta, mas o push falhou — ainda NÃO foi ao ar."
  echo "Depois de resolver (em geral,  git pull --rebase ), rode:  git push origin main"
  exit 1
fi
echo "Publicado. O deploy roda em ~2min: https://vcrmartinez.com/"
