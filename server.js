require('dotenv').config();
const http = require('http');
const fs = require('fs');
const path = require('path');
const { Resend } = require('resend');

const resend = new Resend(process.env.EMAIL_API);

// correos de la empresa
const EMPRESA_EMAIL = 'darwin@abacore.co';

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
};

const server = http.createServer(async (req, res) => {
    // CORS para desarrollo
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    // endpoint del formulario
    if (req.method === 'POST' && req.url === '/api/contact') {
        let body = '';

        req.on('data', chunk => { body += chunk.toString(); });

        req.on('end', async () => {
            try {
                const { name, email, subject, message } = JSON.parse(body);

                if (!name || !email || !subject || !message) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ error: 'Campos incompletos.' }));
                }

                const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

                // correo para la empresa
                await resend.emails.send({
                    from: 'ABACORE Contacto <contacto@abacore.co>',
                    to: [EMPRESA_EMAIL],
                    subject: `[Nuevo Contacto] ${subject}`,
                    html: `
                        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
                            <div style="background: #1A1F2E; padding: 32px 40px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">ABACORE</h1>
                                <p style="color: #B0B8C8; margin: 4px 0 0; font-size: 13px;">Software y Tecnología</p>
                            </div>
                            <div style="padding: 36px 40px; background: #ffffff;">
                                <p style="color: #C0392B; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px;">Nuevo mensaje de contacto</p>
                                <h2 style="color: #1A1F2E; margin: 0 0 28px; font-size: 20px;">${subject}</h2>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px; width: 120px;">Nombre</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1A1F2E; font-size: 14px; font-weight: 500;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Correo</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1A1F2E; font-size: 14px; font-weight: 500;"><a href="mailto:${email}" style="color: #C0392B;">${email}</a></td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; font-size: 13px;">Asunto</td>
                                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #1A1F2E; font-size: 14px; font-weight: 500;">${subject}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 12px 0; color: #888; font-size: 13px; vertical-align: top;">Mensaje</td>
                                        <td style="padding: 12px 0; color: #1A1F2E; font-size: 14px; line-height: 1.7;">${message.replace(/\n/g, '<br>')}</td>
                                    </tr>
                                </table>
                                <div style="margin-top: 28px; padding: 16px; background: #f9f9f9; border-radius: 6px; border-left: 3px solid #C0392B;">
                                    <p style="margin: 0; font-size: 12px; color: #888;">Recibido el ${now} — Panel de ABACORE S.A.S.</p>
                                </div>
                            </div>
                        </div>
                    `
                });

                // respuesta automatica al cliente
                await resend.emails.send({
                    from: 'ABACORE S.A.S. <no-reply@abacore.co>',
                    to: [email],
                    subject: 'Hemos recibido tu mensaje — ABACORE S.A.S.',
                    html: `
                        <div style="font-family: 'Inter', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9f9f9; border-radius: 8px; overflow: hidden;">
                            <div style="background: #1A1F2E; padding: 32px 40px;">
                                <h1 style="color: #ffffff; margin: 0; font-size: 22px; letter-spacing: 1px;">ABACORE</h1>
                                <p style="color: #B0B8C8; margin: 4px 0 0; font-size: 13px;">Software y Tecnología</p>
                            </div>
                            <div style="padding: 36px 40px; background: #ffffff;">
                                <h2 style="color: #1A1F2E; margin: 0 0 16px; font-size: 20px;">Hola, ${name}</h2>
                                <p style="color: #444; font-size: 15px; line-height: 1.7; margin: 0 0 20px;">
                                    Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y uno de nuestros asesores lo revisará a la brevedad posible.
                                </p>
                                <div style="background: #f9f9f9; border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; border-left: 3px solid #C0392B;">
                                    <p style="margin: 0 0 6px; font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 1px;">Tu consulta</p>
                                    <p style="margin: 0; color: #1A1F2E; font-weight: 600; font-size: 15px;">${subject}</p>
                                </div>
                                <p style="color: #444; font-size: 14px; line-height: 1.7; margin: 0 0 28px;">
                                    Nuestro tiempo de respuesta habitual es de <strong>24 a 48 horas hábiles</strong>. Si tu consulta es urgente, puedes escribirnos directamente a <a href="mailto:${EMPRESA_EMAIL}" style="color: #C0392B;">${EMPRESA_EMAIL}</a>.
                                </p>
                                <div style="border-top: 1px solid #eee; padding-top: 24px;">
                                    <p style="margin: 0; color: #888; font-size: 13px;">ABACORE S.A.S. — Meta, Colombia</p>
                                    <p style="margin: 4px 0 0; color: #888; font-size: 13px;">Firma de Ingeniería Tecnológica</p>
                                </div>
                            </div>
                        </div>
                    `
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ ok: true }));

            } catch (err) {
                console.error('Error enviando correo:', err);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Error interno al enviar el correo.' }));
            }
        });

        return;
    }

    // sirve los archivos estaticos
    let filePath = path.join(__dirname, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    const contentType = MIME_TYPES[ext] || 'text/plain';

    fs.readFile(filePath, (err, data) => {
        if (err) {
            res.writeHead(404);
            return res.end('Not found');
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`\n  ABACORE Dev Server corriendo en http://localhost:${PORT}\n`);
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n  Puerto ${PORT} ya en uso. Cierra el proceso anterior o cambia PORT en .env\n`);
        process.exit(1);
    } else {
        throw err;
    }
});
