#!/usr/bin/env bash
# restore-db.sh — Restauration d'une sauvegarde MySQL
#
# Usage:
#   ./scripts/restore-db.sh <fichier.sql.gz>
#   ./scripts/restore-db.sh ~/backups/erosion_des_ames_20260310_020000.sql.gz
#
# ATTENTION : écrase entièrement la base de données cible.

set -euo pipefail

# ── Répertoire du script (pour trouver le .env) ─────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$(dirname "$SCRIPT_DIR")"

# ── Charger les variables d'environnement depuis le .env ────────────────────
if [ -f "$BACKEND_DIR/.env" ]; then
  # shellcheck disable=SC1091
  set -a
  source "$BACKEND_DIR/.env"
  set +a
fi

# ── Variables avec valeurs par défaut ────────────────────────────────────────
DB_HOST="${DB_HOST:-127.0.0.1}"
DB_PORT="${DB_PORT:-3306}"
DB_NAME="${DB_NAME:?Erreur : DB_NAME non défini dans .env}"
DB_USER="${DB_USER:?Erreur : DB_USER non défini dans .env}"
DB_PASSWORD="${DB_PASSWORD:-}"

# ── Vérification de l'argument ───────────────────────────────────────────────
BACKUP_FILE="${1:-}"
if [ -z "$BACKUP_FILE" ]; then
  echo "Erreur : fichier de sauvegarde manquant."
  echo "Usage : $0 <fichier.sql.gz>"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "Erreur : fichier introuvable : $BACKUP_FILE"
  exit 1
fi

# ── Confirmation ─────────────────────────────────────────────────────────────
echo ""
echo "  ATTENTION : cette opération va écraser la base '$DB_NAME' sur $DB_HOST."
echo "  Fichier source : $BACKUP_FILE"
echo ""
read -r -p "  Confirmer la restauration ? [oui/N] : " CONFIRM

if [ "$CONFIRM" != "oui" ]; then
  echo "[restore-db] Restauration annulée."
  exit 0
fi

echo "[restore-db] Restauration en cours..."

# ── Restauration ─────────────────────────────────────────────────────────────
gunzip -c "$BACKUP_FILE" | MYSQL_PWD="$DB_PASSWORD" mysql \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  "$DB_NAME"

echo "[restore-db] Restauration terminée depuis : $BACKUP_FILE"
