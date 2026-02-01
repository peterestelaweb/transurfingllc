#!/bin/bash

echo "🌊 Iniciando Transurfing LLC..."

# Verificar archivo de Firebase
if [ ! -f "firebase-service-account.json" ]; then
    echo ""
    echo "❌ ERROR: No existe firebase-service-account.json"
    echo ""
    echo "Pasos para arreglarlo:"
    echo "1. Ve a: https://console.firebase.google.com/u/0/project/gen-lang-client-0908711172/settings/serviceaccounts/adminsdk"
    echo "2. Haz clic en 'Generar nueva clave privada'"
    echo "3. Selecciona JSON y haz clic en 'Generar'"
    echo "4. Renombra el archivo descargado a 'firebase-service-account.json'"
    echo "5. Mueve el archivo a esta carpeta"
    echo ""
    exit 1
fi

echo "✅ Firebase configurado"

# Actualizar blog con artículos de RSS
echo "📡 Actualizando blog desde RSS feeds..."
node blog-updater.js

# Iniciar servidor
echo "🚀 Iniciando servidor..."
npm start
