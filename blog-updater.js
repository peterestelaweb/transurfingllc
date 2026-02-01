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
        url: 'https://www.forbes.com/business/feed/',
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
        name: 'Sales Hacker',
        url: 'https://blog.hubspot.com/sales/rss.xml',
        category: 'sales',
        priority: 2
    },
    {
        name: 'Harvard Business Review',
        url: 'https://hbr.org/topic/sales/rss',
        category: 'sales',
        priority: 2
    },
    {
        name: 'Business Insider',
        url: 'https://feeds.businessinsider.com/custom/all',
        category: 'business',
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
 * Extrae imagen del contenido HTML o de los metadatos del item
 */
function extractImage(item, content, category) {
    // 1. Intentar obtener de metadatos comunes de RSS
    // Manejar diferentes estructuras de media:content
    const mediaContent = item['media:content'] || item.mediaContent;

    if (mediaContent) {
        // Caso 1: mediaContent es un objeto con $ (Forbes, algunos feeds)
        if (mediaContent.$ && mediaContent.$.url) {
            return validateImageUrl(mediaContent.$.url);
        }
        // Caso 2: mediaContent es un array de objetos
        if (Array.isArray(mediaContent) && mediaContent.length > 0) {
            if (mediaContent[0].$ && mediaContent[0].$.url) {
                return validateImageUrl(mediaContent[0].$.url);
            }
            if (mediaContent[0].url) {
                return validateImageUrl(mediaContent[0].url);
            }
        }
        // Caso 3: mediaContent es un objeto simple con url
        if (mediaContent.url) {
            return validateImageUrl(mediaContent.url);
        }
    }

    // media:thumbnail como alternativa
    const mediaThumbnail = item['media:thumbnail'] || item.mediaThumbnail;
    if (mediaThumbnail) {
        if (mediaThumbnail.$ && mediaThumbnail.$.url) {
            return validateImageUrl(mediaThumbnail.$.url);
        }
        if (Array.isArray(mediaThumbnail) && mediaThumbnail.length > 0) {
            if (mediaThumbnail[0].$ && mediaThumbnail[0].$.url) {
                return validateImageUrl(mediaThumbnail[0].$.url);
            }
        }
    }

    // Enclosure (algunos feeds)
    const enclosure = item.enclosure;
    if (enclosure && enclosure.url && enclosure.type && enclosure.type.includes('image')) {
        return validateImageUrl(enclosure.url);
    }

    // 2. Open Graph tags (og:image) - Muy común en artículos modernos
    const ogImageMatch = content?.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i) ||
        content?.match(/content=["']([^"']+)["']\s+property=["']og:image["']/i);
    if (ogImageMatch && ogImageMatch[1]) {
        const url = validateImageUrl(ogImageMatch[1]);
        if (url) return url;
    }

    // 3. Twitter Card tags (twitter:image)
    const twitterImageMatch = content?.match(/name=["']twitter:image(?::src)?["']\s+content=["']([^"']+)["']/i) ||
        content?.match(/content=["']([^"']+)["']\s+name=["']twitter:image(?::src)?["']/i);
    if (twitterImageMatch && twitterImageMatch[1]) {
        const url = validateImageUrl(twitterImageMatch[1]);
        if (url) return url;
    }

    // 4. Buscar en el contenido HTML - Mejorado con más formatos
    const imgRegex = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp|avif|gif|svg))["'][^>]*>/gi;
    const matches = content?.matchAll(imgRegex);

    if (matches) {
        for (const match of matches) {
            const url = match[1];
            // Filtrar URLs que no sean imágenes de tracking/trackers
            if (!url.includes('hubspot.com/cta') &&
                !url.includes('tracking') &&
                !url.includes('pixel') &&
                !url.includes('analytics') &&
                !url.includes('feedburner') &&
                !url.includes('doubleclick') &&
                url.startsWith('http')) {
                const validUrl = validateImageUrl(url);
                if (validUrl) return validUrl;
            }
        }
    }

    // 5. Buscar cualquier URL de imagen en el contenido (último recurso)
    const urlRegex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp|avif|gif)/gi;
    const urlMatches = content?.matchAll(urlRegex);

    if (urlMatches) {
        for (const match of urlMatches) {
            const url = match[0];
            if (!url.includes('tracking') &&
                !url.includes('pixel') &&
                !url.includes('analytics')) {
                const validUrl = validateImageUrl(url);
                if (validUrl) return validUrl;
            }
        }
    }

    // 6. Fallback a imágenes por categoría (se manejará en el frontend)
    return null;
}

/**
 * Valida que una URL de imagen sea válida y accesible
 */
function validateImageUrl(url) {
    if (!url) return null;

    // Asegurar que sea una URL completa
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return null;
    }

    // Filtrar URLs problemáticas conocidas
    const blacklist = [
        'feedburner.com',
        'doubleclick.net',
        'googleadservices.com',
        'pixel',
        'tracking',
        'analytics',
        '1x1',
        'spacer.gif'
    ];

    const lowerUrl = url.toLowerCase();
    if (blacklist.some(term => lowerUrl.includes(term))) {
        return null;
    }

    // Verificar que tenga una extensión de imagen válida
    const validExtensions = /\.(jpg|jpeg|png|webp|avif|gif)(\?|$)/i;
    if (!validExtensions.test(url)) {
        // Algunas URLs de imágenes no tienen extensión (ej: URLs de CDN dinámicas)
        // Solo rechazar si claramente no es una imagen
        if (!url.includes('/image') && !url.includes('/img') && !url.includes('/photo')) {
            return null;
        }
    }

    return url;
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

        // Extraer imagen (pasando el item y el contenido)
        const image = extractImage(item, content, source.category);

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

        // Crear parser con configuración para capturar campos de media
        const parser = new RSSParser({
            customFields: {
                item: [
                    ['media:content', 'mediaContent'],
                    ['media:thumbnail', 'mediaThumbnail'],
                    ['content:encoded', 'contentEncoded']
                ]
            }
        });

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
