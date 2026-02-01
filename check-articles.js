/**
 * Script de diagnóstico para verificar imágenes de artículos del blog
 */

const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./firebase-service-account.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0908711172'
    });
}

const db = admin.firestore();

async function checkArticleImages() {
    try {
        console.log('🔍 Verificando artículos en Firestore...\n');

        const snapshot = await db.collection('blog_articles')
            .orderBy('createdAt', 'desc')
            .limit(20)
            .get();

        let total = 0;
        let withImage = 0;
        let withoutImage = 0;

        console.log('📊 ANÁLISIS DE ARTÍCULOS:\n');
        console.log('='.repeat(80));

        snapshot.forEach(doc => {
            total++;
            const article = doc.data();
            const hasImage = article.image && article.image !== null && article.image !== '';

            if (hasImage) {
                withImage++;
                console.log(`✅ CON IMAGEN:`);
            } else {
                withoutImage++;
                console.log(`❌ SIN IMAGEN:`);
            }

            console.log(`   Título: ${article.title?.substring(0, 60)}...`);
            console.log(`   Categoría: ${article.category}`);
            console.log(`   Fuente: ${article.source}`);

            if (hasImage) {
                console.log(`   📷 URL: ${article.image}`);
            }

            console.log(`   🔗 Link: ${article.link?.substring(0, 60)}...`);
            console.log('   ' + '-'.repeat(76));
        });

        console.log('='.repeat(80));
        console.log(`\n📈 ESTADÍSTICAS:`);
        console.log(`   Total de artículos: ${total}`);
        console.log(`   Con imagen: ${withImage} (${Math.round(withImage / total * 100)}%)`);
        console.log(`   Sin imagen: ${withoutImage} (${Math.round(withoutImage / total * 100)}%)`);
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

checkArticleImages();
