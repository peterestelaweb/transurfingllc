/**
 * Netlify Function: Blog
 * GET /api/blog
 */

const { getFirebaseDB, createResponse } = require('./utils');

exports.handler = async (event, context) => {
    // Manejar CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'GET') {
        return createResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const params = new URLSearchParams(event.queryStringParameters || '');
        const category = params.get('category') || 'all';
        const limit = parseInt(params.get('limit') || '12');

        const db = getFirebaseDB();

        if (!db) {
            return createResponse({ error: 'Firebase no configurado' }, 503);
        }

        // Obtener artículos ordenados por fecha
        let query = db.collection('blog_articles')
            .orderBy('createdAt', 'desc')
            .limit(50);

        const snapshot = await query.get();

        let articles = [];
        snapshot.forEach(doc => {
            const article = {
                id: doc.id,
                ...doc.data()
            };
            // Filtrar por isActive
            if (article.isActive === true || article.isActive === undefined) {
                articles.push(article);
            }
        });

        // Filtrar por categoría si se especifica
        if (category !== 'all') {
            articles = articles.filter(a => a.category === category);
        }

        // Aplicar límite
        articles = articles.slice(0, limit);

        return createResponse({
            success: true,
            articles,
            total: articles.length,
            category: category
        });

    } catch (error) {
        console.error('Error obteniendo artículos:', error);
        return createResponse({
            error: 'Error obteniendo artículos',
            details: error.message
        }, 500);
    }
};
