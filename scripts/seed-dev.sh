#!/usr/bin/env bash
# Popula a API local com dados de demonstração.
# Uso: ./scripts/seed-dev.sh [API_URL]   (padrão: http://localhost:8080)
#
# Requer o administrador inicial criado pela API (ADMIN_EMAIL / ADMIN_SENHA).
#
# ATENÇÃO: apenas para desenvolvimento. As credenciais abaixo são públicas.
set -euo pipefail

API="${1:-http://localhost:8080}"
ADMIN_EMAIL="${ADMIN_EMAIL:-admin@constructflow.dev}"
ADMIN_SENHA="${ADMIN_SENHA:-senha123}"
SENHA="senha123"

json() { curl -fsS -H 'Content-Type: application/json' "$@"; }

TOKEN=$(json -X POST "$API/auth/login" -d "{\"email\":\"$ADMIN_EMAIL\",\"senha\":\"$ADMIN_SENHA\"}") || {
  echo "✗ Falha no login como $ADMIN_EMAIL. A API foi iniciada com ADMIN_EMAIL/ADMIN_SENHA?" >&2
  exit 1
}
auth=(-H "Authorization: Bearer $TOKEN")

criar_usuario() { # nome email papel
  json "${auth[@]}" -X POST "$API/usuarios" \
    -d "{\"nome\":\"$1\",\"email\":\"$2\",\"senha\":\"$SENHA\",\"papel\":\"$3\"}" \
    | sed -E 's/.*"id":([0-9]+).*/\1/'
}

echo "→ Criando usuários"
ENG1=$(criar_usuario "Carlos Mendes" "carlos@constructflow.dev" ENGENHEIRO)
ENG2=$(criar_usuario "Beatriz Lima" "beatriz@constructflow.dev" ENGENHEIRO)
criar_usuario "Diego Souza" "backoffice@constructflow.dev" BACKOFFICE >/dev/null
criar_usuario "Eduardo Campos" "campo@constructflow.dev" CAMPO >/dev/null

criar_obra() { # nome endereco cep status responsavelId
  json "${auth[@]}" -X POST "$API/obras" \
    -d "{\"nome\":\"$1\",\"endereco\":\"$2\",\"cep\":\"$3\",\"status\":\"$4\",\"responsavelId\":$5}" \
    | sed -E 's/.*"id":([0-9]+).*/\1/'
}

criar_documento() { # obraId nome tipo status
  json "${auth[@]}" -X POST "$API/documentos" \
    -d "{\"obraId\":$1,\"nome\":\"$2\",\"tipo\":\"$3\",\"status\":\"$4\"}" >/dev/null
}

echo "→ Criando obras e documentos"
O1=$(criar_obra "Residencial Jardim das Flores" "Rua das Acácias, 120 - Campinas/SP" "13090-000" EM_ANDAMENTO "$ENG1")
O2=$(criar_obra "Centro Comercial Paulista" "Av. Paulista, 1500 - São Paulo/SP" "01310-200" PLANEJADA "$ENG2")
O3=$(criar_obra "Galpão Logístico Anhanguera" "Rod. Anhanguera, km 98 - Sumaré/SP" "13170-000" EM_ANDAMENTO "$ENG1")
criar_obra "Escola Municipal Vila Nova" "Rua Projetada, 45 - Hortolândia/SP" "13185-000" PLANEJADA "$ENG2" >/dev/null

criar_documento "$O1" "Orçamento executivo v2" ORCAMENTO APROVADO
criar_documento "$O1" "Contrato de empreitada" CONTRATO APROVADO
criar_documento "$O1" "Relatório de medição — março" RELATORIO PENDENTE
criar_documento "$O2" "Projeto arquitetônico" PROJETO PENDENTE
criar_documento "$O3" "NF 4521 — aço CA-50" NOTA_FISCAL REPROVADO
criar_documento "$O3" "Projeto estrutural" PROJETO PENDENTE

echo "✓ Pronto. Os usuários criados usam a senha \"$SENHA\"; o admin usa ADMIN_SENHA."
