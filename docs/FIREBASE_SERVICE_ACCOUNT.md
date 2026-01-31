# Guía para obtener Service Account de Firebase

## Paso 1: Ir a Firebase Console

Ve a tu proyecto: https://console.firebase.google.com/u/0/project/gen-lang-client-0908711172/settings/serviceaccounts/adminsdk

## Paso 2: Generar nueva clave privada

1. Clic en **"Generar nueva clave privada"**
2. Selecciona **JSON**
3. Clic en **"Generar"**

## Paso 3: Guardar el archivo

1. El archivo JSON se descargará automáticamente
2. **RENOMBRARLO** a `firebase-service-account.json`
3. Colocarlo en la raíz del proyecto (misma carpeta que `server.js`)

## ⚠️ IMPORTANTE: Seguridad

- **NUNCA** commits este archivo a GitHub (ya está en .gitignore)
- El archivo contiene credenciales sensibles
- Manténlo seguro y fuera del repositorio público

## Paso 4: Verificar configuración

El archivo JSON debe tener esta estructura:

```json
{
  "type": "service_account",
  "project_id": "gen-lang-client-0908711172",
  "private_key_id": "...",
  "private_key": "-----BEGIN PRIVATE KEY-----\n...",
  "client_email": "...@gen-lang-client-0908711172.iam.gserviceaccount.com"
}
```

---

## Una vez configurado

```bash
# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Editar .env con tus datos reales de email
nano .env

# Iniciar servidor
npm start
```

El servidor automáticamente:
- ✅ Conectará a Firebase Firestore
- ✅ Guardará todos los contactos
- ✅ Enviará emails de notificación
- ✅ Servirá las páginas web
