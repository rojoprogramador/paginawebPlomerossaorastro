// src/components/contact/ContactForm.tsx
// Island React — Formulario de contacto con RHF + Zod + Resend

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { contactSchema, SERVICE_OPTIONS, type ContactFormData } from '../../lib/schemas';

// GTM dataLayer
declare global { interface Window { dataLayer: Record<string, unknown>[]; } }

function pushGTM(event: string, data?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
  /*
    CONFIGURACIÓN GTM — Formulario:
    1. En GTM crea trigger: Evento personalizado → "form_submit_contacto"
    2. Crea etiqueta GA4: Evento "generate_lead" con los parámetros
       - service: {{DLV - service}}
       - zone: {{DLV - zone}}
    3. Para Google Ads: Importa la conversión "Envío de formulario" desde GA4
       Asigna valor de conversión (ej: $50.000 COP por lead)
    4. Para remarketing por servicio: crea audiencias en Google Ads basadas en
       el parámetro "service" del evento GA4
  */
}

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(data: ContactFormData) {
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Error al enviar el formulario');
      }

      setStatus('success');
      reset();

      // GTM — evento de conversión
      pushGTM('form_submit_contacto', {
        service: data.servicio,
        zone: data.barrio,
        page_path: window.location.pathname,
      });

    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Error inesperado');
    }
  }

  if (status === 'success') {
    return (
      <div
        style={{
          background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
          border: '2px solid #22C55E',
          borderRadius: '1.25rem',
          padding: '3rem 2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
        <h3 style={{ fontFamily: "'Sora', sans-serif", fontSize: '1.375rem', fontWeight: 800, color: '#15803d', marginBottom: '0.5rem' }}>
          ¡Solicitud recibida!
        </h3>
        <p style={{ color: '#166534', fontSize: '0.9375rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Revisaremos tu solicitud y te contactaremos en los próximos minutos.
          También puedes escribirnos por WhatsApp para atención inmediata.
        </p>
        <a
          href="https://wa.me/573185922585"
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: '#22C55E',
            color: 'white',
            padding: '0.75rem 1.75rem',
            borderRadius: '0.75rem',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Ir al WhatsApp →
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

      {/* Nombre */}
      <div>
        <label htmlFor="nombre" className="form-label">
          Nombre completo <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="nombre"
          type="text"
          placeholder="Ej: Ana María López"
          className={`form-input ${errors.nombre ? 'error' : ''}`}
          autoComplete="name"
          {...register('nombre')}
        />
        {errors.nombre && <p className="form-error">{errors.nombre.message}</p>}
      </div>

      {/* Teléfono + Email en fila — colapsa a 1 col en mobile */}
      <div className="form-row-2col">
        <div>
          <label htmlFor="telefono" className="form-label">
            Teléfono <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <input
            id="telefono"
            type="tel"
            placeholder="Ej: 318 592 2585"
            className={`form-input ${errors.telefono ? 'error' : ''}`}
            autoComplete="tel"
            {...register('telefono')}
          />
          {errors.telefono && <p className="form-error">{errors.telefono.message}</p>}
        </div>
        <div>
          <label htmlFor="email" className="form-label">
            Correo <span style={{ color: '#94a3b8', fontWeight: 400 }}>(opcional)</span>
          </label>
          <input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            className={`form-input ${errors.email ? 'error' : ''}`}
            autoComplete="email"
            {...register('email')}
          />
          {errors.email && <p className="form-error">{errors.email.message}</p>}
        </div>
      </div>

      {/* Servicio */}
      <div>
        <label htmlFor="servicio" className="form-label">
          Servicio que necesitas <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <select
          id="servicio"
          className={`form-input ${errors.servicio ? 'error' : ''}`}
          defaultValue=""
          {...register('servicio')}
          style={{ cursor: 'pointer' }}
        >
          <option value="" disabled>Selecciona un servicio...</option>
          {SERVICE_OPTIONS.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        {errors.servicio && <p className="form-error">{errors.servicio.message}</p>}
      </div>

      {/* Barrio */}
      <div>
        <label htmlFor="barrio" className="form-label">
          Barrio o zona <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <input
          id="barrio"
          type="text"
          placeholder="Ej: Ciudad Jardín, Cali"
          className={`form-input ${errors.barrio ? 'error' : ''}`}
          {...register('barrio')}
        />
        {errors.barrio && <p className="form-error">{errors.barrio.message}</p>}
      </div>

      {/* Descripción */}
      <div>
        <label htmlFor="descripcion" className="form-label">
          Descripción del problema <span style={{ color: '#ef4444' }}>*</span>
        </label>
        <textarea
          id="descripcion"
          rows={4}
          placeholder="Cuéntanos qué está pasando. Ej: Tengo una fuga de agua debajo del piso del baño, la factura subió mucho este mes..."
          className={`form-input ${errors.descripcion ? 'error' : ''}`}
          style={{ resize: 'vertical', minHeight: '100px' }}
          {...register('descripcion')}
        />
        {errors.descripcion && <p className="form-error">{errors.descripcion.message}</p>}
      </div>

      {/* Error global */}
      {status === 'error' && (
        <div
          style={{
            background: '#fef2f2',
            border: '1px solid #fca5a5',
            borderRadius: '0.5rem',
            padding: '0.75rem 1rem',
            color: '#dc2626',
            fontSize: '0.875rem',
          }}
        >
          ❌ {errorMsg || 'No pudimos enviar tu mensaje. Por favor intenta de nuevo.'}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={status === 'loading'}
        style={{
          background: status === 'loading'
            ? '#94a3b8'
            : 'linear-gradient(135deg, #00B4D8, #1565C0)',
          color: 'white',
          padding: '0.875rem 2rem',
          borderRadius: '0.75rem',
          fontFamily: "'Inter', sans-serif",
          fontSize: '1rem',
          fontWeight: 700,
          border: 'none',
          cursor: status === 'loading' ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.2s ease',
          boxShadow: status === 'loading' ? 'none' : '0 4px 16px rgba(0,180,216,0.3)',
        }}
      >
        {status === 'loading' ? (
          <>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{ animation: 'spin 1s linear infinite' }}
            >
              <path d="M21 12a9 9 0 11-6.219-8.56"/>
            </svg>
            Enviando...
          </>
        ) : (
          'Enviar solicitud →'
        )}
      </button>

      <p style={{ fontSize: '0.8125rem', color: '#94a3b8', textAlign: 'center' }}>
        🔒 Tu información es confidencial y no será compartida con terceros.
      </p>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .form-row-2col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }
        @media (max-width: 480px) {
          .form-row-2col {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </form>
  );
}
