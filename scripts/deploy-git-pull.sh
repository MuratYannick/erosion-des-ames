#!/usr/bin/env bash
# =============================================================================
# deploy-git-pull.sh — Déploiement manuel via git pull sur O2Switch
#
# Usage :
#   chmod +x scripts/deploy-git-pull.sh
#   ./scripts/deploy-git-pull.sh
#
# Variables à configurer ci-dessous (ou via variables d'environnement).
# =============================================================================

set -euo pipefail

# ---------------------------------------------------------------------------
# Configuration — adapter à votre serveur O2Switch
# ---------------------------------------------------------------------------
SSH_HOST="${SSH_HOST:-user@hostname}"
SSH_PORT="${SSH_PORT:-22}"
REMOTE_BACKEND_PATH="${REMOTE_BACKEND_PATH:-/home/user/app/backend}"
REMOTE_FRONTEND_PATH="${REMOTE_FRONTEND_PATH:-/home/user/public_html}"
VITE_API_URL="${VITE_API_URL:-https://api.erosion-des-ames.fr/api}"

# ---------------------------------------------------------------------------
# Couleurs
# ---------------------------------------------------------------------------
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

step()  { echo -e "\n${GREEN}▶ $1${NC}"; }
warn()  { echo -e "${YELLOW}⚠  $1${NC}"; }
error() { echo -e "${RED}✖  $1${NC}"; exit 1; }

# ---------------------------------------------------------------------------
# Vérifications préalables
# ---------------------------------------------------------------------------
step "Vérification de la configuration"

[[ "$SSH_HOST" == "user@hostname" ]] && error \
  "SSH_HOST non configuré. Exportez la variable ou éditez ce script."
[[ "$REMOTE_BACKEND_PATH" == "/home/user/app/backend" ]] && warn \
  "REMOTE_BACKEND_PATH semble être la valeur par défaut."
[[ "$REMOTE_FRONTEND_PATH" == "/home/user/public_html" ]] && warn \
  "REMOTE_FRONTEND_PATH semble être la valeur par défaut."

echo "  Host    : $SSH_HOST:$SSH_PORT"
echo "  Backend : $REMOTE_BACKEND_PATH"
echo "  Frontend: $REMOTE_FRONTEND_PATH"
echo "  API URL : $VITE_API_URL"

# ---------------------------------------------------------------------------
# Étape 1 — Build frontend en local
# ---------------------------------------------------------------------------
step "1/7 — Build frontend"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FRONTEND_DIR="$SCRIPT_DIR/../frontend"

cd "$FRONTEND_DIR"
npm ci
VITE_API_URL="$VITE_API_URL" npm run build
echo "  Build terminé : $FRONTEND_DIR/dist"

# ---------------------------------------------------------------------------
# Étape 2 — git pull backend sur le serveur
# ---------------------------------------------------------------------------
step "2/7 — git pull backend sur le serveur"
ssh -p "$SSH_PORT" "$SSH_HOST" bash <<REMOTE
  set -euo pipefail
  cd "$REMOTE_BACKEND_PATH"
  echo "  Branche actuelle : \$(git branch --show-current)"
  git pull origin main
  echo "  Dernier commit   : \$(git log -1 --oneline)"
REMOTE

# ---------------------------------------------------------------------------
# Étape 3 — Installer les nouvelles dépendances backend
# ---------------------------------------------------------------------------
step "3/7 — npm ci --omit=dev (morgan, express-rate-limit, node-cron)"
ssh -p "$SSH_PORT" "$SSH_HOST" bash <<REMOTE
  set -euo pipefail
  cd "$REMOTE_BACKEND_PATH"
  npm ci --omit=dev
REMOTE

# ---------------------------------------------------------------------------
# Étape 4 — Créer le dossier tmp si absent (requis par Passenger)
# ---------------------------------------------------------------------------
step "4/7 — Création du dossier tmp"
ssh -p "$SSH_PORT" "$SSH_HOST" "mkdir -p $REMOTE_BACKEND_PATH/tmp"

# ---------------------------------------------------------------------------
# Étape 5 — Migrations (bonne pratique, aucune nouvelle migration attendue)
# ---------------------------------------------------------------------------
step "5/7 — Migrations Sequelize"
ssh -p "$SSH_PORT" "$SSH_HOST" bash <<REMOTE
  set -euo pipefail
  cd "$REMOTE_BACKEND_PATH"
  npx sequelize-cli db:migrate
REMOTE

# ---------------------------------------------------------------------------
# Étape 6 — Déployer le build frontend
# ---------------------------------------------------------------------------
step "6/7 — Copie du build frontend vers public_html"
rsync -az --delete \
  -e "ssh -p $SSH_PORT" \
  "$FRONTEND_DIR/dist/" \
  "$SSH_HOST:$REMOTE_FRONTEND_PATH/"

# ---------------------------------------------------------------------------
# Étape 7 — Redémarrer l'app Node.js via Passenger
# ---------------------------------------------------------------------------
step "7/7 — Redémarrage Passenger (touch tmp/restart.txt)"
ssh -p "$SSH_PORT" "$SSH_HOST" "touch $REMOTE_BACKEND_PATH/tmp/restart.txt"

# ---------------------------------------------------------------------------
# Vérification post-déploiement
# ---------------------------------------------------------------------------
step "Vérification de l'API (health check)"
sleep 3

API_BASE="${VITE_API_URL%/api}"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$API_BASE/api/health" || echo "000")

if [[ "$HTTP_CODE" == "200" ]]; then
  echo -e "  ${GREEN}Health check OK (HTTP $HTTP_CODE)${NC}"
  curl -s "$API_BASE/api/health" | python3 -m json.tool 2>/dev/null || true
else
  warn "Health check retourné HTTP $HTTP_CODE — vérifiez les logs Passenger"
fi

echo -e "\n${GREEN}Déploiement terminé !${NC}"
echo "  Points à vérifier dans le navigateur :"
echo "  - Page d'accueil : polices chargées sans requête Google"
echo "  - Page Univers   : pas d'erreur console"
echo "  - Forum          : stable après quelques minutes"
echo "  - Mon profil     : pas d'erreur 500"
