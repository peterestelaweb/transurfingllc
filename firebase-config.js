/**
 * Firebase Configuration - Transurfing LLC
 * Configuración para el proyecto: gen-lang-client-0908711172
 */

// Configuración de Firebase - PROYECTO EXISTENTE
// Este proyecto ya está configurado en Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyDkCr4fSFs4_j6rJ9Q1xXjL6vLqXxXYcBg", // Debes obtenerlo del proyecto
    authDomain: "gen-lang-client-0908711172.firebaseappapp.com",
    projectId: "gen-lang-client-0908711172",
    storageBucket: "gen-lang-client-0908711172.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:abcdef"
};

// NOTA: Para obtener la configuración correcta de tu proyecto:
// 1. Ve a: https://console.firebase.google.com/u/0/project/gen-lang-client-0908711172/overview
// 2. Clic en el icono </> (Web)
// 3. Registra la app o copia la configuración existente
// 4. Reemplaza los valores arriba con los reales

// Para el servidor Node.js, usa el SDK administrativo:
import admin from 'firebase-admin';

const serviceAccount = {
    "type": "service_account",
    "project_id": "gen-lang-client-0908711172",
    "private_key_id": "TU_KEY_ID",
    "private_key": "TU_PRIVATE_KEY",
    "client_email": "firebase-adminsdk-xxxxx@gen-lang-client-0908711172.iam.gserviceaccount.com"
};

// Inicializar Firebase Admin SDK para el servidor
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: 'gen-lang-client-0908711172'
});

const db = admin.firestore();

export { db, admin };
