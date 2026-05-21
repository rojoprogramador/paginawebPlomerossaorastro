// src/pages/api/contact.ts
// API endpoint — Formulario de contacto → Resend
// Este endpoint NO se prerenderiza (SSR puro)

export const prerender = false;

import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { contactSchema } from '../../lib/schemas';

// Mapa de etiquetas legibles para los servicios
const SERVICE_LABELS: Record<string, string> = {
  'destape-canerias':    'Destape de cañerías',
  'deteccion-fugas':     'Detección de fugas de agua',
  'geofono':             'Geófono — sin romper paredes',
  'camara-termica':      'Cámara térmica',
  'remodelacion-banos':  'Remodelación de baños',
  'instalacion-tuberia': 'Instalación de tubería',
  'otro':                'Otro servicio',
};

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parsear body
    const body = await request.json();

    // Validar con Zod
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return new Response(
        JSON.stringify({
          error: 'Datos inválidos',
          details: result.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { nombre, telefono, email, servicio, barrio, descripcion } = result.data;
    const servicioLabel = SERVICE_LABELS[servicio] ?? servicio;

    // Configurar Resend
    // Para desarrollo: usa RESEND_API_KEY=re_test_xxxx (clave de test)
    // Para producción: usa RESEND_API_KEY=re_live_xxxx (clave real)
    // Registra tu cuenta en https://resend.com — Plan gratuito: 3.000 emails/mes
    const resend = new Resend(import.meta.env.RESEND_API_KEY);

    const contactEmail = import.meta.env.CONTACT_EMAIL ?? 'servicios@plomerossaor.com';
    const now = new Date().toLocaleString('es-CO', { timeZone: 'America/Bogota' });

    // ---- Email principal al negocio ----
    await resend.emails.send({
      from: 'Formulario Web <noreply@plomerossaor.com>',
      // En producción: verifica tu dominio en Resend → Settings → Domains
      // En desarrollo: usa el from por defecto de Resend (onboarding@resend.dev)
      to: [contactEmail],
      subject: `🔧 Nueva solicitud — ${servicioLabel} — ${nombre}`,
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
            .card { background: white; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; box-shadow: 0 4px 16px rgba(0,0,0,0.06); }
            .header { background: linear-gradient(135deg, #0B2240, #1565C0); border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; }
            .header h1 { color: #00B4D8; margin: 0 0 4px; font-size: 1.25rem; }
            .header p { color: rgba(255,255,255,0.7); margin: 0; font-size: 0.875rem; }
            .field { margin-bottom: 16px; }
            .field label { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
            .field value { display: block; font-size: 1rem; color: #0f172a; background: #f8fafc; border-radius: 6px; padding: 10px 14px; border: 1px solid #e2e8f0; }
            .badge { display: inline-block; background: #00B4D8; color: white; padding: 4px 12px; border-radius: 99px; font-size: 0.8125rem; font-weight: 700; margin-bottom: 20px; }
            .cta { background: #22C55E; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 700; margin-top: 20px; }
            .footer { text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 24px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1>💧 Plomeros SAOR — Nueva solicitud</h1>
              <p>Recibida el ${now}</p>
            </div>

            <div class="badge">${servicioLabel}</div>

            <div class="field">
              <label>👤 Nombre</label>
              <value>${nombre}</value>
            </div>
            <div class="field">
              <label>📞 Teléfono</label>
              <value><a href="tel:${telefono}" style="color:#00B4D8;">${telefono}</a></value>
            </div>
            ${email ? `
            <div class="field">
              <label>📧 Email</label>
              <value><a href="mailto:${email}" style="color:#00B4D8;">${email}</a></value>
            </div>` : ''}
            <div class="field">
              <label>📍 Barrio / Zona</label>
              <value>${barrio}</value>
            </div>
            <div class="field">
              <label>📝 Descripción del problema</label>
              <value>${descripcion.replace(/\n/g, '<br>')}</value>
            </div>

            <a href="https://wa.me/573185922585?text=${encodeURIComponent(`Hola ${nombre}, vi tu solicitud de ${servicioLabel} en ${barrio}. ¿Estás disponible ahora?`)}" class="cta">
              ✅ Responder por WhatsApp
            </a>

            <p class="footer">
              Enviado desde el formulario de www.plomerossaor.com
            </p>
          </div>
        </body>
        </html>
      `,
    });

    // ---- Auto-respuesta al cliente (solo si tiene email) ----
    if (email) {
      await resend.emails.send({
        from: 'Plomeros SAOR <noreply@plomerossaor.com>',
        to: [email],
        subject: `✅ Recibimos tu solicitud — Plomeros SAOR`,
        html: `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8">
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f8fafc; margin: 0; padding: 20px; }
              .card { background: white; border-radius: 12px; padding: 32px; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; }
              .header { background: linear-gradient(135deg, #0B2240, #1565C0); border-radius: 8px; padding: 20px 24px; margin-bottom: 24px; text-align: center; }
              .header h1 { color: #00B4D8; margin: 0 0 4px; font-size: 1.375rem; }
              .header p { color: rgba(255,255,255,0.8); margin: 0; }
              .body { color: #374151; font-size: 0.9375rem; line-height: 1.7; }
              .cta { background: #22C55E; color: white; padding: 14px 24px; border-radius: 8px; text-decoration: none; display: inline-block; font-weight: 700; margin: 20px 0; }
              .contact { background: #f0f7fa; border-radius: 8px; padding: 16px; margin: 16px 0; }
              .footer { text-align: center; color: #94a3b8; font-size: 0.75rem; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 16px; }
            </style>
          </head>
          <body>
            <div class="card">
              <div class="header">
                <h1>💧 ¡Solicitud recibida!</h1>
                <p>Plomeros SAOR — Cali, Colombia</p>
              </div>
              <div class="body">
                <p>Hola <strong>${nombre}</strong>,</p>
                <p>Recibimos tu solicitud para <strong>${servicioLabel}</strong> en <strong>${barrio}</strong>. La revisaremos de inmediato y te contactaremos por teléfono al <strong>${telefono}</strong>.</p>
                <p>⏱ <strong>Tiempo estimado de respuesta: menos de 1 hora</strong></p>
                <p>Si necesitas atención más rápida, escríbenos directamente por WhatsApp:</p>
                <a href="https://wa.me/573185922585" class="cta">📱 WhatsApp Ahora</a>
                <div class="contact">
                  <strong>📞 Teléfonos de contacto</strong><br>
                  <a href="tel:+573185922585" style="color:#00B4D8;">+57 318 592 2585</a><br>
                  <a href="tel:+573007750833" style="color:#00B4D8;">+57 300 775 0833</a>
                </div>
                <p>¡Gracias por confiar en Plomeros SAOR!</p>
              </div>
              <p class="footer">
                © ${new Date().getFullYear()} Plomeros SAOR · Cali, Colombia<br>
                <a href="https://www.plomerossaor.com" style="color:#00B4D8;">www.plomerossaor.com</a>
              </p>
            </div>
          </body>
          </html>
        `,
      });
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err) {
    console.error('[api/contact] Error:', err);
    return new Response(
      JSON.stringify({ error: 'Error interno del servidor' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
