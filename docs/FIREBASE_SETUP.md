# Configuración de Firebase - Transurfing LLC

## Paso 1: Crear proyecto en Firebase

1. Ve a https://console.firebase.google.com/
2. Clic en "Add project"
3. Nombre: `transurfing-llc`
4. Desactiva Google Analytics (puedes activarlo después)
5. Clic en "Create project"

## Paso 2: Configurar Firestore Database

1. En el panel izquierdo, ve a **Firestore Database**
2. Clic en **Create database**
3. Selecciona **Start in test mode** (para desarrollo)
4. Selecciona ubicación (ej: `nam5 (us-central)`)
5. Clic en **Enable**

## Paso 3: Obtener credenciales

1. Ve a **Project Settings** (icono de engranaje)
2. Desplázate a **Your apps**
3. Clic en **Web** (icono `</>`)
4. Nombre: `transurfing-llc`
5. NO marcar "Firebase Hosting" todavía
6. Clic en **Register app**
7. **COPIA** el código de configuración (firebaseConfig)

## Paso 4: Copiar credenciales al proyecto

Abre `firebase.js` y reemplaza los valores placeholder:

```javascript
const firebaseConfig = {
    apiKey: "COPIA_TU_API_KEY_AQUI",
    authDomain: "transurfing-llc.firebaseapp.com",
    projectId: "COPIA_TU_PROJECT_ID",
    storageBucket: "transurfing-llc.appspot.com",
    messagingSenderId: "COPIA_TU_SENDER_ID",
    appId: "COPIA_TU_APP_ID"
};
```

## Paso 5: Instalar Firebase SDK

```bash
npm install firebase
```

## Paso 6: Integrar en el formulario

El servidor ya está configurado para guardar en Firebase. Solo necesitas:

1. Copiar las credenciales correctas
2. Ejecutar `npm install`
3. Iniciar servidor: `npm start`

---

## Estructura de datos en Firestore

```
contacts (colección)
  ├── id_documento_1
  │   ├── nombre: "Juan Pérez"
  │   ├── email: "juan@empresa.com"
  │   ├── website: "https://juan.com"
  │   ├── revenue: "10k-50k"
  │   ├── mensaje: "Me interesa..."
  │   ├── status: "new"
  │   ├── source: "landing_page"
  │   └── createdAt: timestamp
  ├── id_documento_2
  └── ...
```

---

## Ver datos en tiempo real

1. Ve a Firebase Console → Firestore Database
2. Verás todos los contactos entrando en tiempo real
3. Puedes exportar a CSV, JSON, o conectar con Google Sheets
