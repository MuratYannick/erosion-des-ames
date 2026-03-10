#!/usr/bin/env bash
# backup-db.sh — Sauvegarde complète de la base de données MySQL
#
# Usage:
#   ./scripts/backup-db.sh                  # sauvegarde dans ~/backups/
#   BACKUP_DIR=/chemin/custom ./scripts/backup-db.sh
#
# Variables d'environnement lues depuis le .env du backend (répertoire parent).
# Peut aussi être appelé directement par le cron job Node.js.

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
BACKUP_DIR="${BACKUP_DIR:-$HOME/backups}"
RETENTION_DAYS="${RETENTION_DAYS:-7}"

# ── Préparer le répertoire de sauvegarde ────────────────────────────────────
mkdir -p "$BACKUP_DIR"

# ── Nom du fichier de sauvegarde ────────────────────────────────────────────
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
BACKUP_FILE="$BACKUP_DIR/${DB_NAME}_${TIMESTAMP}.sql.gz"

echo "[backup-db] Démarrage de la sauvegarde de '$DB_NAME'..."

# ── Dump MySQL + compression gzip ───────────────────────────────────────────
MYSQL_PWD="$DB_PASSWORD" mysqldump \
  --host="$DB_HOST" \
  --port="$DB_PORT" \
  --user="$DB_USER" \
  --single-transaction \
  --routines \
  --triggers \
  --add-drop-table \
  "$DB_NAME" | gzip > "$BACKUP_FILE"

BACKUP_SIZE="$(du -sh "$BACKUP_FILE" | cut -f1)"
echo "[backup-db] Sauvegarde créée : $BACKUP_FILE ($BACKUP_SIZE)"

# ── Suppression des sauvegardes plus anciennes que RETENTION_DAYS jours ─────
DELETED=$(find "$BACKUP_DIR" -maxdepth 1 -name "${DB_NAME}_*.sql.gz" \
  -mtime +"$RETENTION_DAYS" -print -delete | wc -l)

if [ "$DELETED" -gt 0 ]; then
  echo "[backup-db] $DELETED ancienne(s) sauvegarde(s) supprimée(s) (rétention : ${RETENTION_DAYS}j)"
fi

echo "[backup-db] Terminé."
