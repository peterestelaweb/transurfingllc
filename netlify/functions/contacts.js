/**
 * Netlify Function: Contacts (Admin)
 * GET /api/contacts
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

        if (!db) {
            return createResponse({ error: 'Firebase no configurado' }, 503);
        }

        const snapshot = await db.collection('contacts')
            .orderBy('createdAt', 'desc')
            .limit(100)
            .get();

        const contacts = [];
        snapshot.forEach(doc => {
            contacts.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return createResponse({ success: true, contacts });

    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        return createResponse({
            error: 'Error obteniendo contactos',
            details: error.message
        }, 500);
    }
};
