/**
 * Transurfing LLC - Backend Server
 * Servidor Express para procesar formularios de contacto
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

        // Email al administrador
        const mailOptions = {
            from: process.env.EMAIL_FROM || '"Transurfing LLC" <noreply@transurfing.llc>',
            to: process.env.DESTINATION_EMAIL || 'contact@transurfing.llc',
            subject: `Nueva Solicitud de ${nombre} - Transurfing LLC`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #FF6B00;">🌊 Nueva Solicitud de Contacto</h2>
                    <div style="background: #1a1a1a; padding: 20px; border-radius: 10px; margin: 20px 0;">
                        <h3 style="color: #fff; border-bottom: 1px solid #FF6B00; padding-bottom: 10px;">Información del Contacto</h3>
                        <table style="color: #ccc;">
                            <tr><td><strong>📇 Nombre:</strong></td><td>${nombre}</td></tr>
                            <tr><td><strong>📧 Email:</strong></td><td><a href="mailto:${email}">${email}</a></td></tr>
                            ${website ? `<tr><td><strong>🌐 Website:</strong></td><td><a href="https://${website}" target="_blank">${website}</a></td></tr>` : ''}
                            ${revenue ? `<tr><td><strong>💰 Ingresos:</strong></td><td>${revenue}</td></tr>` : ''}
                            <tr><td><strong>🌍 Idioma:</strong></td><td>${idioma === 'es' ? 'Español' : 'English'}</td></tr>
                            <tr><td><strong>📅 Fecha:</strong></td><td>${new Date().toLocaleString()}</td></tr>
                        </table>
                    </div>
                    <div style="background: #121212; padding: 20px; border-radius: 10px;">
                        <h3 style="color: #fff;">💬 Mensaje:</h3>
                        <p style="color: #ccc; white-space: pre-wrap;">${mensaje}</p>
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
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <span style="font-size: 40px;">🌊</span>
                        <h1 style="color: #FF6B00;">Transurfing LLC</h1>
                    </div>
                    <h2 style="color: #fff;">
                        ${idioma === 'es' ? '¡Gracias por contactarnos!' : 'Thank you for reaching out!'}
                    </h2>
                    <p style="color: #ccc; font-size: 16px;">
                        ${idioma === 'es'
                            ? `Hemos recibido tu solicitud y te contactaremos pronto para sincronizar tu realidad.`
                            : `We've received your request and will contact you soon to synchronize your reality.`
                        }
                    </p>
                    <div style="background: #1a1a1a; padding: 15px; border-radius: 10px; margin: 20px 0; border-left: 4px solid #FF6B00;">
                        <p style="color: #999; font-size: 14px;">
                            ${idioma === 'es'
                                ? 'Mientras tanto, explora nuestro espacio de variantes:'
                                : 'Meanwhile, explore our space of variations:'
                            }
                        </p>
                        <a href="${idioma === 'es' ? 'https://transurfing.llc/index-es.html' : 'https://transurfing.llc'}"
                           style="display: inline-block; background: #FF6B00; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
                            ${idioma === 'es' ? 'Visitar Sitio Web' : 'Visit Website'}
                        </a>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(confirmOptions);

        res.json({
            success: true,
            message: idioma === 'es' ? 'Solicitud recibida correctamente' : 'Request received successfully'
        });

    } catch (error) {
        console.error('Error procesando contacto:', error);
        res.status(500).json({
            error: 'Error al procesar la solicitud',
            details: error.message
        });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Transurfing LLC API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`%c🌊 Transurfing LLC Server running on port ${PORT}`, 'color: #FF6B00; font-size: 16px; font-weight: bold;');
});
