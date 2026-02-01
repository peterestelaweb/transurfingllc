/**
 * Netlify Function: Health Check
 * GET /api/health
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
        const db = getFirebaseDB();

        return createResponse({
            status: 'ok',
            message: 'Transurfing LLC API is running on Netlify',
            firebase: db ? 'connected' : 'not configured',
            platform: 'netlify',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('Error en health check:', error);
        return createResponse({
            status: 'error',
            error: error.message
        }, 500);
    }
};
