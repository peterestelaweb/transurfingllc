/**
 * Fix Blog Images - Eliminar y recrear artículos con imágenes correctas
 */

require('dotenv').config();
const admin = require('firebase-admin');
const serviceAccount = require('./firebase-service-account.json');
const { execSync } = require('child_process');

// Inicializar Firebase con nombre único para evitar conflictos
const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0908711172'
}, 'fix-blog-app');

const db = app.firestore();

async function fixBlogImages() {
    console.log('🔄 Arreglando imágenes del blog...');

    // 1. Obtener todos los artículos actuales
    const snapshot = await db.collection('blog_articles').get();
    const count = snapshot.size;

    console.log(`📊 Encontrados ${count} artículos actuales`);

    if (count === 0) {
        console.log('⚠️  No hay artículos para borrar');
        return;
    }

    // 2. Borrar todos
    console.log('🗑️  Borrando artículos antiguos...');
    const batch = db.batch();

    snapshot.forEach(doc => {
        batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`✅ ${count} artículos borrados`);

    // 3. Volver a crear con el código arreglado (ejecutando blog-updater)
    console.log('📡 Obteniendo artículos actualizados...');
    try {
        execSync('node blog-updater.js', {
            cwd: __dirname,
            stdio: 'inherit'
        });
        console.log('✅ ¡Imágenes arregladas!');
    } catch (error) {
        console.error('Error actualizando blog:', error.message);
    }
}

fixBlogImages().then(() => {
    process.exit(0);
}).catch(error => {
    console.error('Error:', error);
    process.exit(1);
});
