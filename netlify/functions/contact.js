/**
 * Netlify Function: Contact
 * POST /api/contact
 */

const { getFirebaseDB, sendEmail, createResponse } = require('./utils');

exports.handler = async (event, context) => {
    // Manejar CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    if (event.httpMethod !== 'POST') {
        return createResponse({ error: 'Method not allowed' }, 405);
    }

    try {
        const data = JSON.parse(event.body);
        const { nombre, email, website, revenue, mensaje, idioma } = data;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return createResponse({ error: 'Faltan campos requeridos' }, 400);
        }

        const contactData = {
            nombre,
            email,
            website: website || '',
            revenue: revenue || '',
            mensaje,
            idioma: idioma || 'es',
            source: 'landing_page',
            status: 'new',
            createdAt: new Date().toISOString()
        };

        // Guardar en Firebase Firestore si está disponible
        const db = getFirebaseDB();
        let firebaseResult = null;

        if (db) {
            try {
                const docRef = await db.collection('contacts').add(contactData);
                firebaseResult = { id: docRef.id, success: true };
                console.log('✅ Contacto guardado en Firestore:', docRef.id);
            } catch (fbError) {
                console.error('⚠️  Error guardando en Firestore:', fbError.message);
            }
        }

        // En Netlify, usar SendGrid o similar configurado en variables de entorno
        // Por ahora, el email es opcional - el contacto se guarda en Firebase
        try {
            if (process.env.SENDGRID_API_KEY) {
                // Aquí iría la integración con SendGrid
                await sendEmail({
                    to: process.env.DESTINATION_EMAIL || 'contact@transurfing.llc',
                    subject: `🌊 Nueva Solicitud de ${nombre} - Transurfing LLC`,
                    body: mensaje
                });
            }
        } catch (emailError) {
            console.error('⚠️  Error enviando email:', emailError.message);
            // No fallar si el email falla, el contacto ya está guardado
        }

        return createResponse({
            success: true,
            message: idioma === 'es' ? 'Solicitud recibida correctamente' : 'Request received successfully',
            firebaseId: firebaseResult?.id || null
        });

    } catch (error) {
        console.error('Error procesando contacto:', error);
        return createResponse({
            error: 'Error al procesar la solicitud',
            details: error.message
        }, 500);
    }
};
