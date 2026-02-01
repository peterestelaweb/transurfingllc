/**
 * Blog Auto-Updater - Transurfing LLC
 * Sistema de actualización automática del blog desde RSS feeds
 * Obtiene noticias de sitios de ventas, setters y closers
 */

const RSSParser = require('rss-parser');
const axios = require('axios');
const admin = require('firebase-admin');

// Inicializar Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0908711172'
});
const db = admin.firestore();

// RSS Sources - Fuentes de contenido sobre ventas, business, sales
const RSS_SOURCES = [
    {
        name: 'Forbes Business',
        url: 'https://www.forbes.com/simple-data/business/feed/',
        category: 'business',
        priority: 1
    },
    {
        name: 'Entrepreneur',
        url: 'https://www.entrepreneur.com/latest.rss',
        category: 'sales',
        priority: 1
    },
    {
        name: 'Inc.com',
        url: 'https://www.inc.com/rss.xml',
        category: 'growth',
        priority: 1
    },
    {
        name: 'Sales Hacker',
        url: 'https://blog.hubspot.com/sales/rss.xml',
        category: 'sales',
        priority: 2
    },
    {
        name: 'Harvard Business Review',
        url: 'https://hbr.org/feed',
        category: 'business',
        priority: 2
    },
    {
        name: 'Business Insider',
        url: 'https://feeds.businessinsider.com/businessinsider',
        category: 'sales',
        priority: 3
    }
];

// Palabras clave para filtrar artículos relevantes
const RELEVANT_KEYWORDS = [
    // Ventas y closing
    'sales', 'selling', 'closing', 'close', 'deal', 'revenue', 'commission',
    'salesperson', 'closer', 'B2B', 'B2C', 'lead', 'prospect',

    // High-ticket y premium
    'high-ticket', 'premium', 'luxury', 'expensive', 'enterprise',

    // Appointment setting y outbound
    'appointment', 'outbound', 'cold call', 'outreach', 'prospecting',
    'setter', 'setting',

    // Estrategia y mentalidad
    'strategy', 'tactic', 'technique', 'mindset', 'psychology',
    'negotiation', 'persuasion', 'influence',

    // Agencias y crecimiento
    'agency', 'scale', 'growth', 'revenue', 'profit', 'client'
];

/**
 * Verifica si un artículo es relevante basado en título y contenido
 */
function isRelevantArticle(title, content, category) {
    const text = `${title} ${content} ${category}`.toLowerCase();

    // Categorías siempre relevantes
    const alwaysRelevantCategories = ['sales', 'business', 'growth'];
    if (alwaysRelevantCategories.includes(category)) {
        return true;
    }

    // Verificar palabras clave
    const hasRelevantKeyword = RELEVANT_KEYWORDS.some(keyword =>
        text.includes(keyword.toLowerCase())
    );

    // Excluir palabras irrelevantes
    const EXCLUDED_KEYWORDS = ['politics', 'election', 'stock market', 'crypto', 'bitcoin', 'nft'];
    const hasExcludedKeyword = EXCLUDED_KEYWORDS.some(keyword =>
        text.includes(keyword.toLowerCase())
    );

    return hasRelevantKeyword && !hasExcludedKeyword;
}

/**
 * Extrae imagen del contenido HTML
 */
function extractImage(content, category) {
    // Imágenes por categoría como fallback
    const categoryImages = {
        'sales': 'https://images.unsplash.com/photo-1556761175-5973-eee8416?w=800',
        'setting': 'https://images.unsplash.com/photo-1553877522-4ac694a47edc?w=800',
        'closing': 'https://images.unsplash.com/photo-1542744173-8f7d549518d7?w=800',
        'business': 'https://images.unsplash.com/photo-15070022139046-60dd975c5cd9?w=800',
        'growth': 'https://images.unsplash.com/photo-1460925859341-9d8c6a5a5d8?w=800'
    };

    // Buscar la primera imagen válida en el contenido
    const imgRegex = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi;
    const matches = content?.matchAll(imgRegex);

    if (matches) {
        for (const match of matches) {
            const url = match[1];
            // Filtrar URLs que no sean imágenes de tracking/trackers
            if (!url.includes('hubspot.com/cta') &&
                !url.includes('tracking') &&
                !url.includes('pixel') &&
                url.startsWith('http')) {
                return url;
            }
        }
    }

    // Si no hay imagen válida, usar una por categoría
    return categoryImages[category] || categoryImages['sales'];
}

/**
 * Procesa un artículo del RSS feed
 */
function processArticle(item, source) {
    try {
        const title = item.title || '';
        const content = item.content || item.contentSnippet || item['content:encoded'] || '';
        const link = item.link || item.guid;
        const pubDate = item.pubDate || item.published || new Date().toISOString();
        const creator = item.creator || item['dc:creator'] || source.name;

        // Limpiar HTML del contenido
        const cleanContent = content
            .replace(/<[^>]+>/g, ' ') // Eliminar tags HTML
            .replace(/\s+/g, ' ')      // Eliminar espacios extra
            .substring(0, 500)        // Limitar longitud
            .trim();

        // Verificar relevancia
        if (!isRelevantArticle(title, cleanContent, source.category)) {
            return null;
        }

        // Extraer imagen (pasando el contenido original con HTML para encontrar imágenes)
        const image = extractImage(content, source.category);

        // Determinar tiempo de lectura
        const wordCount = cleanContent.split(/\s+/).length;
        const readTime = Math.max(3, Math.ceil(wordCount / 200));

        // Generar extracto
        const excerpt = cleanContent.substring(0, 150).trim() + '...';

        return {
            title,
            excerpt,
            content: cleanContent,
            link,
            image,
            category: source.category,
            source: source.name,
            pubDate,
            readTime: `${readTime} min`,
            createdAt: new Date().toISOString(),
            isActive: true
        };
    } catch (error) {
        console.error('Error procesando artículo:', error.message);
        return null;
    }
}

/**
 * Obtiene artículos de un RSS feed
 */
async function fetchRSSFeed(source) {
    try {
        console.log(`📡 Obteniendo feed de ${source.name}...`);

        // Crear parser y obtener feed directamente
        const parser = new RSSParser();
        const feed = await parser.parseURL(source.url);
        const items = feed.items || [];

        const articles = [];
        let count = 0;
        const maxArticles = 3; // Máximo 3 artículos por fuente

        for (const item of items) {
            if (count >= maxArticles) break;

            const article = processArticle(item, source);
            if (article) {
                articles.push(article);
                count++;
            }
        }

        console.log(`✅ ${source.name}: ${articles.length} artículos relevantes`);
        return articles;

    } catch (error) {
        console.error(`❌ Error obteniendo ${source.name}:`, error.message);
        return [];
    }
}

/**
 * Guarda artículos en Firebase Firestore (solo si no existen)
 */
async function saveArticlesToFirestore(articles) {
    try {
        let savedCount = 0;

        for (const article of articles) {
            // Verificar si ya existe un artículo con el mismo link
            const existingSnapshot = await db.collection('blog_articles')
                .where('link', '==', article.link)
                .limit(1)
                .get();

            // Solo guardar si NO existe (evitar duplicados)
            if (existingSnapshot.empty) {
                await db.collection('blog_articles').add(article);
                savedCount++;
            } else {
                console.log(`⏭️  Artículo ya existe: ${article.title.substring(0, 50)}...`);
            }
        }

        console.log(`✅ ${savedCount} nuevos artículos guardados en Firestore`);

    } catch (error) {
        console.error('Error guardando artículos:', error);
    }
}

/**
 * Función principal de actualización
 */
async function updateBlog() {
    console.log('🔄 Iniciando actualización del blog...');
    console.log('='.repeat(50));

    let totalArticles = 0;

    for (const source of RSS_SOURCES) {
        const articles = await fetchRSSFeed(source);

        if (articles.length > 0) {
            await saveArticlesToFirestore(articles);
            totalArticles += articles.length;
        }

        // Pequeña pausa entre fuentes para no sobrecargar
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log('='.repeat(50));
    console.log(`📊 Total de artículos procesados: ${totalArticles}`);
    console.log(`✅ Actualización completada a las ${new Date().toISOString()}`);
}

// ============================================
// EJECUTAR ACTUALIZACIÓN
// ============================================
if (require.main === module) {
    updateBlog().then(() => {
        console.log('%c🎉 Proceso completado!', 'color: #22c55e; font-size: 16px; font-weight: bold;');
        process.exit(0);
    }).catch(error => {
        console.error('Error en la actualización:', error);
        process.exit(1);
    });
}

module.exports = { updateBlog, saveArticlesToFirestore };
