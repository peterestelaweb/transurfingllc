# Configuración de Email - Transurfing LLC

## Opción 1: Gmail (Recomendado para empezar)

### Paso 1: Configurar Gmail para SMTP

1. Ve a [Google Account Settings](https://myaccount.google.com/)
2. Activa **Verificación en dos pasos**
3. Genera una **Contraseña de aplicación**:
   - Ve a https://myaccount.google.com/apppasswords
   - Selecciona "Correo" y "Ordenador"
   - Copia la contraseña generada (solo se muestra una vez)

### Paso 2: Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Servidor
PORT=3000
NODE_ENV=production

# Email SMTP (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASS=tu-contraseña-de-aplicación
EMAIL_FROM=Transurfing LLC <noreply@transurfing.llc>

# Destino
DESTINATION_EMAIL=contact@transurfing.llc
```

### Paso 3: Instalar dependencias y arrancar

```bash
npm install
npm start
```

---

## Opción 2: SendGrid (Para producción)

### Paso 1: Crear cuenta en SendGrid

1. Regístrate en https://sendgrid.com/
2. Ve a Settings → API Keys
3. Create API Key con permisos "Mail Send"

### Paso 2: Configurar variables de entorno

```env
# Servidor
PORT=3000

# Email SMTP (SendGrid)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
EMAIL_USER=apikey
EMAIL_PASS=SG.tu-api-key
EMAIL_FROM=noreply@transurfing.llc

# Destino
DESTINATION_EMAIL=contact@transurfing.llc
```

### Paso 3: Instalar dependencias

```bash
npm install
npm start
```

---

## Opción 3: Brevo (antes Sendinblue) - GRATIS hasta 300 emails/día

### Paso 1: Crear cuenta en Brevo

1. Regístrate en https://www.brevo.com/
2. Ve a SMTP & API → Your SMTP Keys
3. Create new SMTP key

### Paso 2: Configurar variables de entorno

```env
# Servidor
PORT=3000

# Email SMTP (Brevo)
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
EMAIL_USER=tu-email@brevo.com
EMAIL_PASS=tu-smtp-key
EMAIL_FROM=noreply@transurfing.llc

# Destino
DESTINATION_EMAIL=contact@transurfing.llc
```

---

## Probar el email

```bash
# Iniciar servidor
npm start

# Enviar test de formulario
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Test",
    "email": "test@example.com",
    "mensaje": "Prueba de email"
  }'
```

---

## Solución de problemas

### Gmail: "Less secure apps" error
- Usa **Contraseña de aplicación** en lugar de tu contraseña normal

### Puerto bloqueado
- Asegúrate de que tu firewall no bloquee el puerto 587

### Email no llega
- Verifica la carpeta SPAM
- Revisa los logs del servidor: `console.log` mostrará errores de nodemailer
