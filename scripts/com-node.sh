#!/usr/bin/env bash
# Executa um comando com a versão de Node do .nvmrc.
#
# O nvm é uma função de shell, não um binário: não existe dentro de um recipe
# do make. Este wrapper carrega o nvm, seleciona a versão do .nvmrc (instalando
# se faltar) e só então executa o comando. Sem nvm na máquina, segue com o node
# do PATH em vez de falhar.
set -euo pipefail

NVM_DIR="${NVM_DIR:-$HOME/.nvm}"

if [ -s "$NVM_DIR/nvm.sh" ]; then
  set +u                      # os scripts do nvm não sobrevivem a `set -u`
  # shellcheck disable=SC1091
  . "$NVM_DIR/nvm.sh"
  if ! nvm use >/dev/null 2>&1; then
    echo "→ Node $(cat .nvmrc 2>/dev/null || echo '?') não está no nvm; instalando..." >&2
    nvm install >/dev/null
    nvm use >/dev/null
  fi
  set -u
else
  echo "→ nvm não encontrado em $NVM_DIR; usando o node do PATH ($(node -v 2>/dev/null || echo ausente))" >&2
fi

exec "$@"
