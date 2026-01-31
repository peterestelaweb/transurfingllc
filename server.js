/**
 * Transurfing LLC - Backend Server con Firebase
 * Servidor Express para procesar formularios de contacto y guardar en Firestore
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.')); // Servir archivos estáticos

// Firebase Admin SDK (opcional - para guardar en Firestore)
let db = null;
try {
    const admin = require('firebase-admin');
    const serviceAccount = require('./firebase-service-account.json');

    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID || 'gen-lang-client-0908711172'
    });

    db = admin.firestore();
    console.log('✅ Firebase conectado - Firestore activo');
} catch (error) {
    console.log('⚠️  Firebase no configurado - Solo email activo');
}

// Configuración de email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Endpoint de contacto
app.post('/api/contact', async (req, res) => {
    try {
        const { nombre, email, website, revenue, mensaje, idioma } = req.body;

        // Validación básica
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ error: 'Faltan campos requeridos' });
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

        // Email al administrador
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Transurfing LLC" <noreply@transurfing.llc>',
            to: process.env.DESTINATION_EMAIL || 'contact@transurfing.llc',
            subject: `🌊 Nueva Solicitud de ${nombre} - Transurfing LLC`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #121212;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 40px;">🌊</span>
                        <h1 style="color: #FF6B00; margin: 10px 0;">Transurfing LLC</h1>
                        <h2 style="color: #fff; margin: 0;">Nuevo Contacto</h2>
                    </div>

                    <div style="background: #1a1a1a; padding: 25px; border-radius: 15px; margin: 20px 0; border-left: 4px solid #FF6B00;">
                        <h3 style="color: #fff; margin-bottom: 20px;">📋 Información del Contacto</h3>
                        <table style="color: #ccc; width: 100%;">
                            <tr><td style="padding: 8px 0;"><strong>📇 Nombre:</strong></td><td style="color: #fff;">${nombre}</td></tr>
                            <tr><td style="padding: 8px 0;"><strong>📧 Email:</strong></td><td><a href="mailto:${email}" style="color: #FF6B00;">${email}</a></td></tr>
                            ${website ? `<tr><td style="padding: 8px 0;"><strong>🌐 Website:</strong></td><td><a href="https://${website}" target="_blank" style="color: #FF6B00;">${website}</a></td></tr>` : ''}
                            ${revenue ? `<tr><td style="padding: 8px 0;"><strong>💰 Ingresos:</strong></td><td style="color: #FF6B00;">${revenue}</td></tr>` : ''}
                            <tr><td style="padding: 8px 0;"><strong>🌍 Idioma:</strong></td><td>${idioma === 'es' ? 'Español' : 'English'}</td></tr>
                            <tr><td style="padding: 8px 0;"><strong>📅 Fecha:</strong></td><td>${new Date().toLocaleString('es-ES')}</td></tr>
                            ${firebaseResult ? `<tr><td style="padding: 8px 0;"><strong>🔥 Firebase ID:</strong></td><td style="color: #22c55e;">${firebaseResult.id}</td></tr>` : ''}
                        </table>
                    </div>

                    <div style="background: #121212; padding: 25px; border-radius: 15px; border: 1px solid #FF6B00/30;">
                        <h3 style="color: #fff; margin-bottom: 15px;">💬 Mensaje:</h3>
                        <p style="color: #ccc; white-space: pre-wrap; line-height: 1.6;">${mensaje}</p>
                    </div>

                    <div style="text-align: center; margin-top: 30px; padding: 15px; background: #FF6B00/10; border-radius: 10px;">
                        <p style="color: #FF6B00; margin: 0; font-size: 14px;">
                            ${idioma === 'es' ? '✨ Este contacto está guardado en tu base de datos Firebase' : '✨ This contact is saved in your Firebase database'}
                        </p>
                    </div>
                </div>
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        // Email de confirmación al cliente
        const confirmOptions = {
            from: process.env.EMAIL_FROM || '"Transurfing LLC" <noreply@transurfing.llc>',
            to: email,
            subject: idioma === 'es' ? '¡Hemos recibido tu solicitud! - Transurfing LLC' : 'We received your request! - Transurfing LLC',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #121212;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 40px;">🌊</span>
                        <h1 style="color: #FF6B00; margin: 10px 0;">Transurfing LLC</h1>
                    </div>
                    <h2 style="color: #fff; text-align: center;">
                        ${idioma === 'es' ? '¡Gracias por contactarnos!' : 'Thank you for reaching out!'}
                    </h2>
                    <p style="color: #ccc; font-size: 16px; text-align: center; line-height: 1.6;">
                        ${idioma === 'es'
                            ? 'Hemos recibido tu solicitud y te contactaremos pronto para sincronizar tu realidad de negocios.'
                            : 'We\'ve received your request and will contact you soon to synchronize your business reality.'
                        }
                    </p>
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 30px 0; border-left: 4px solid #FF6B00;">
                        <h3 style="color: #fff; margin-bottom: 10px;">${idioma === 'es' ? '¿Qué sigue?' : 'What happens next?'}</h3>
                        <ul style="color: #999; font-size: 14px; line-height: 1.8;">
                            <li>${idioma === 'es' ? 'Revisaremos tu información' : 'We\'ll review your information'}</li>
                            <li>${idioma === 'es' ? 'Te contactaremos en 24-48 horas' : 'We\'ll contact you in 24-48 hours'}</li>
                            <li>${idioma === 'es' ? 'Sincronizaremos una llamada si califica' : 'We\'ll schedule a call if you qualify'}</li>
                        </ul>
                    </div>
                    <div style="text-align: center; margin-top: 30px;">
                        <a href="${idioma === 'es' ? 'https://transurfing.llc/index-es.html' : 'https://transurfing.llc'}"
                           style="display: inline-block; background: #FF6B00; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                            ${idioma === 'es' ? '🌊 Volver al Sitio' : '🌊 Visit Website'}
                        </a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(confirmOptions);

        res.json({
            success: true,
            message: idioma === 'es' ? 'Solicitud recibida correctamente' : 'Request received successfully',
            firebaseId: firebaseResult?.id || null
        });

    } catch (error) {
        console.error('Error procesando contacto:', error);
        res.status(500).json({
            error: 'Error al procesar la solicitud',
            details: error.message
        });
    }
});

// Endpoint para obtener todos los contactos (solo admin)
app.get('/api/contacts', async (req, res) => {
    try {
        if (!db) {
            return res.status(503).json({ error: 'Firebase no configurado' });
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

        res.json({ success: true, contacts });
    } catch (error) {
        console.error('Error obteniendo contactos:', error);
        res.status(500).json({ error: 'Error obteniendo contactos', details: error.message });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        message: 'Transurfing LLC API is running',
        firebase: db ? 'connected' : 'not configured'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`%c🌊 Transurfing LLC Server running on port ${PORT}`, 'color: #FF6B00; font-size: 16px; font-weight: bold;');
    console.log(`%cFirebase: ${db ? '✅ Conectado' : '⚠️  No configurado'}`, 'color: ' + (db ? '#22c55e' : '#f59e0b'));
});
