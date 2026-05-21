// src/components/layout/WhatsAppButton.tsx
// Island React — Botón flotante WhatsApp con pulse animation
// GTM: dispara evento "whatsapp_click" al hacer clic

import { useState, useEffect } from 'react';

const WHATSAPP = '573185922585';
const MESSAGE  = encodeURIComponent('Hola, necesito un servicio de plomería en Cali');

// GTM dataLayer helper
declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

function pushGTM(event: string, data?: Record<string, unknown>) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...data });
  /*
    CONFIGURACIÓN GTM:
    1. En GTM crea un Trigger → Tipo: Evento personalizado → Nombre del evento: "whatsapp_click"
    2. Crea una Etiqueta GA4 → Tipo: Evento → Nombre del evento: whatsapp_click
    3. Conecta esa etiqueta con el trigger anterior
    4. Para Google Ads: crea una Conversión e importa el evento desde GA4
  */
}

export default function WhatsAppButton() {
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState(false);

  useEffect(() => {
    // Aparece 2s después de cargar
    const timer = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  function handleClick() {
    pushGTM('whatsapp_click', {
      button_location: 'floating',
      page_path: window.location.pathname,
    });
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 999,
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.6)',
        transition: 'opacity 0.4s ease, transform 0.4s ease',
      }}
    >
      {/* Tooltip */}
      {tooltip && (
        <div
          style={{
            position: 'absolute',
            bottom: '110%',
            right: 0,
            background: 'white',
            color: '#0F172A',
            padding: '0.5rem 0.875rem',
            borderRadius: '8px',
            fontSize: '0.8125rem',
            fontWeight: 600,
            whiteSpace: 'nowrap',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
            marginBottom: '0.25rem',
            pointerEvents: 'none',
          }}
        >
          ¡Escríbenos ahora!
          <div
            style={{
              position: 'absolute',
              bottom: -5,
              right: 20,
              width: 10,
              height: 10,
              background: 'white',
              transform: 'rotate(45deg)',
            }}
          />
        </div>
      )}

      {/* Notification Dot */}
      <div
        style={{
          position: 'absolute',
          top: 2,
          right: 2,
          width: 14,
          height: 14,
          background: '#22C55E',
          borderRadius: '50%',
          border: '2px solid white',
          zIndex: 10,
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        }}
      />

      {/* Pulse rings */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(34,197,94,0.4)',
          animation: 'pulse-ring 2s ease-out infinite',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background: 'rgba(34,197,94,0.25)',
          animation: 'pulse-ring 2s ease-out infinite 0.5s',
        }}
      />

      {/* Botón principal */}
      <a
        href={`https://wa.me/${WHATSAPP}?text=${MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        id="whatsapp-floating-btn"
        aria-label="Contactar por WhatsApp"
        onClick={handleClick}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 58,
          height: 58,
          borderRadius: '50%',
          background: '#22C55E',
          boxShadow: '0 4px 20px rgba(34,197,94,0.5)',
          position: 'relative',
          zIndex: 2,
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          textDecoration: 'none',
        }}
        onMouseDown={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(0.93)';
        }}
        onMouseUp={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'scale(1)';
        }}
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
