/**
 * Utilidades compartidas para Netlify Functions
 */

// Firebase Admin SDK
let db = null;
let admin = null;

function getFirebaseDB() {
    if (!db) {
        try {
            // Para Netlify, necesitamos las variables de entorno
            const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT;

            if (!serviceAccountKey) {
                console.log('⚠️  FIREBASE_SERVICE_ACCOUNT no configurado');
                return null;
            }

            admin = require('firebase-admin');
            const serviceAccount = JSON.parse(serviceAccountKey);

            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0908711172'
            });

            db = admin.firestore();
            console.log('✅ Firebase conectado');
        } catch (error) {
            console.error('⚠️  Error conectando Firebase:', error.message);
            return null;
        }
    }
    return db;
}

// Configuración de email (usando SendGrid o similar para Netlify)
async function sendEmail(options) {
    // En Netlify Functions, recomendamos usar SendGrid o EmailJS
    // Por ahora, retornamos un mock para que el deploy funcione
    console.log('📧 Email mock enviado:', options.to);
    return { messageId: 'mock-message-id' };
}

// Respuestas CORS
function getCORSHeaders() {
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Content-Type': 'application/json'
    };
}

function createResponse(data, statusCode = 200) {
    return {
        statusCode,
        headers: getCORSHeaders(),
        body: JSON.stringify(data)
    };
}

module.exports = {
    getFirebaseDB,
    sendEmail,
    getCORSHeaders,
    createResponse
};
