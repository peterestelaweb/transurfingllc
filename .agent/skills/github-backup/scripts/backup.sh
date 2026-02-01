#!/bin/bash
# Script de Backup Automático para GitHub
# Uso: ./backup.sh "Mensaje del commit"

# Colores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

COMMIT_MSG="$1"

# Verificar si hay mensaje de commit
if [ -z "$COMMIT_MSG" ]; then
    echo -e "${RED}Error: Debes proporcionar un mensaje para el commit.${NC}"
    echo "Uso: ./backup.sh \"Tu mensaje descriptivo\""
    exit 1
fi

echo -e "\n${BLUE}🔄 Iniciando proceso de backup...${NC}"

# Paso 1: Git Add
echo -e "\n${YELLOW}📦 Paso 1: Agregando todos los cambios (git add .)${NC}"
git add .
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al agregar archivos.${NC}"
    exit 1
fi

# Paso 2: Git Commit
echo -e "\n${YELLOW}✅ Paso 2: Confirmando cambios (git commit)${NC}"
# Verificar si hay cambios para commitear
if git diff-index --quiet HEAD --; then
    echo -e "${GREEN}ℹ️ No hay cambios nuevos para confirmar.${NC}"
else
    git commit -m "$COMMIT_MSG"
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Error al hacer commit.${NC}"
        exit 1
    fi
fi

# Paso 3: Git Push
echo -e "\n${YELLOW}🚀 Paso 3: Subiendo a GitHub (git push)${NC}"
git push
if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Error al subir a GitHub. Verifica tu conexión o permisos.${NC}"
    exit 1
else
    echo -e "\n${GREEN}✨ ¡Backup completado! Tu repositorio está sincronizado con GitHub.${NC}"
fi
