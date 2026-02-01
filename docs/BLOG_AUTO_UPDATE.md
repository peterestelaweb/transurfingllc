# Actualización Automática del Blog - Guía Completa

## 📋 Opciones Gratuitas de Autoactualización

---

## Opción 1: launchd (Mac - NATIVO y GRATUITO) ✅ RECOMENDADO

**Ventajas:**
- ✅ Nativo de macOS (no requiere instalar nada)
- ✅ Funciona aunque el Mac esté dormido
- ✅ Se ejecuta en segundo plano
- ✅ 100% gratuito

### Pasos para configurar:

1. **Crear el archivo plist:**

Crea el archivo `~/Library/LaunchAgents/com.transurfing.blog-updater.plist`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>com.transurfing.blog-updater</string>

    <key>ProgramArguments</key>
    <array>
        <string>/usr/local/bin/node</string>
        <string>/Users/maykacenteno/Desktop/WEBS EN LOCAL/TRANSURFING/blog-updater.js</string>
    </array>

    <key>StartInterval</key>
    <integer>3600</integer> <!-- 3600 segundos = 1 hora -->

    <key>StandardOutPath</key>
    <string>/tmp/blog-updater.log</string>

    <key>StandardErrorPath</key>
    <string>/tmp/blog-updater-error.log</string>

    <key>RunAtLoad</key>
    <true/>
</dict>
</plist>
```

2. **Cargar el servicio:**

```bash
launchctl load ~/Library/LaunchAgents/com.transurfing.blog-updater.plist
```

3. **Verificar que funciona:**

```bash
# Ver el log
tail -f /tmp/blog-updater.log

# Verificar que el servicio está corriendo
launchctl list | grep transurfing
```

4. **Comandos útiles:**

```bash
# Detener el servicio
launchctl unload ~/Library/LaunchAgents/com.transurfing.blog-updater.plist

# Reiniciar el servicio
launchctl unload ~/Library/LaunchAgents/com.transurfing.blog-updater.plist
launchctl load ~/Library/LaunchAgents/com.transurfing.blog-updater.plist

# Ver logs
tail -f /tmp/blog-updater.log
```

---

## Opción 2: Cron (Mac/Linux)

**Ventajas:**
- ✅ Simple y clásico
- ✅ Funciona en todos los sistemas Unix
- ⚠️ Requiere permisos especiales en macOS modernos

### Pasos:

1. **Editar crontab:**

```bash
crontab -e
```

2. **Agregar esta línea:**

```cron
# Actualizar blog cada hora
0 * * * * cd /Users/maykacenteno/Desktop/WEBS\ EN\ LOCAL/TRANSURFING && /usr/local/bin/node blog-updater.js >> /tmp/blog-updater.log 2>&1
```

3. **Verificar:**

```bash
# Ver tus crons
crontab -l

# Ver logs
tail -f /tmp/blog-updater.log
```

---

## Opción 3: GitHub Actions (Cloud - GRATUITO)

**Ventajas:**
- ✅ Se ejecuta en la nube (no necesita tu Mac encendido)
- ✅ 100% gratuito para repositorios públicos
- ✅ Muy fácil de configurar

### Pasos:

1. **Crear el archivo `.github/workflows/blog-update.yml`:**

```yaml
name: Update Blog

on:
  schedule:
    # Cada hora (cron UTC)
    - cron: '0 * * * *'
  workflow_dispatch: # Permite ejecución manual

jobs:
  update-blog:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Run blog updater
        env:
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_SERVICE_ACCOUNT: ${{ secrets.FIREBASE_SERVICE_ACCOUNT }}
        run: |
          # Crear archivo de credenciales desde secret
          echo "$FIREBASE_SERVICE_ACCOUNT" > firebase-service-account.json
          node blog-updater.js
```

2. **Configurar secrets en GitHub:**

Ve a: https://github.com/peterestelaweb/transurfingllc/settings/secrets/actions

Agrega estos secrets:
- `FIREBASE_PROJECT_ID`: `gen-lang-client-0908711172`
- `FIREBASE_SERVICE_ACCOUNT`: (contenido del archivo firebase-service-account.json)

3. **Hacer commit y push:**

```bash
git add .github/workflows/blog-update.yml
git commit -m "Add GitHub Actions for blog auto-update"
git push
```

---

## 📊 Comparación de Opciones

| Opción | Costo | Requiere Mac encendido | Dificultad | Fiabilidad |
|--------|-------|----------------------|------------|------------|
| **launchd** | Gratis | Sí | ⭐⭐ Media | ⭐⭐⭐⭐⭐ Alta |
| **Cron** | Gratis | Sí | ⭐⭐⭐ Fácil | ⭐⭐⭐⭐ Alta |
| **GitHub Actions** | Gratis | No | ⭐⭐ Media | ⭐⭐⭐⭐⭐ Alta |

---

## 🎯 RECOMENDACIÓN PARA TI

**Usa launchd** (Opción 1) porque:
- Es nativo de macOS
- No requiere configuración externa
- Es muy confiable
- No requiere credenciales extras

---

## 📝 Recordatorio para más tarde

Cuando quieras configurar la autoactualización:

1. **Abre este archivo:** `docs/BLOG_AUTO_UPDATE.md`
2. **Elige la Opción 1 (launchd)**
3. **Sigue los pasos**

---

## 🔧 Verificar que funciona

Una vez configurado, verifica:

```bash
# Ver los últimos logs
tail -20 /tmp/blog-updater.log

# Deberías ver algo como:
# 🔄 Iniciando actualización del blog...
# ✅ Entrepreneur: 3 artículos relevantes
# ✅ Sales Hacker: 3 artículos relevantes
```

---

**Última actualización:** 2026-01-31
**Proyecto:** Transurfing LLC Blog
