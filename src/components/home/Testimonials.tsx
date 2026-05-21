// src/components/home/Testimonials.tsx
// Island React — Carousel de testimonios sin Framer Motion

import { useState, useEffect, useRef } from 'react';

const TESTIMONIALS = [
  {
    name: 'Carlos Rodríguez',
    zone: 'Ciudad Jardín, Cali',
    rating: 5,
    text: 'Excelente servicio. Tenía una fuga oculta en el piso y con el geófono la encontraron en minutos, sin romper nada. Muy profesionales y rápidos.',
    service: 'Detección con geófono',
    avatar: 'CR',
  },
  {
    name: 'María González',
    zone: 'Unicentro, Cali',
    rating: 5,
    text: 'La cámara térmica es increíble. Encontraron la fuga detrás de la pared sin necesidad de romperla. Me ahorraron una fortuna. 100% recomendados.',
    service: 'Cámara térmica',
    avatar: 'MG',
  },
  {
    name: 'Andrés Ospina',
    zone: 'Jamundí',
    rating: 5,
    text: 'Atendieron una emergencia de destape a las 11pm. Llegaron en 40 minutos y resolvieron todo. El precio fue muy justo. Gracias Plomeros SAOR!',
    service: 'Destape de emergencia',
    avatar: 'AO',
  },
  {
    name: 'Lucia Caicedo',
    zone: 'Palmira',
    rating: 5,
    text: 'Contratamos para remodelar el baño principal y quedó espectacular. Trabajo limpio, puntual y con garantía. Ya los recomendé a todos mis vecinos.',
    service: 'Remodelación de baño',
    avatar: 'LC',
  },
  {
    name: 'Roberto Muñoz',
    zone: 'Yumbo',
    rating: 5,
    text: 'Mi factura de agua estaba por las nubes. En una hora encontraron la fuga y la repararon. Al mes siguiente la factura volvió a la normalidad.',
    service: 'Detección de fugas',
    avatar: 'RM',
  },
];

function StarRating({ rating }: Readonly<{ rating: number }>) {
  return (
    <div style={{ display: 'flex', gap: 3 }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < rating ? '#F59E0B' : '#E5E7EB'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [faded,   setFaded]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  const goTo = (index: number) => {
    clearInterval(timerRef.current);
    setFaded(true);
    setTimeout(() => {
      setCurrent(index);
      setFaded(false);
      timerRef.current = setInterval(autoAdvance, 5000);
    }, 220);
  };

  const autoAdvance = () => {
    setFaded(true);
    setTimeout(() => {
      setCurrent(c => (c + 1) % TESTIMONIALS.length);
      setFaded(false);
    }, 220);
  };

  useEffect(() => {
    timerRef.current = setInterval(autoAdvance, 5000);
    return () => clearInterval(timerRef.current);
  }, []);

  const prev = () => goTo((current - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  const next = () => goTo((current + 1) % TESTIMONIALS.length);

  const t = TESTIMONIALS[current];

  return (
    <section
      style={{
        padding: '5rem 0',
        background: 'var(--color-bg-light, #F0F7FA)',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(0,180,216,0.1)',
              border: '1px solid rgba(0,180,216,0.3)',
              color: '#0B2240',
              padding: '0.3rem 1rem',
              borderRadius: 99,
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            ⭐ 4.9 / 5 — 47 reseñas
          </span>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: 800,
              color: '#0B2240',
              lineHeight: 1.2,
            }}
          >
            Lo que dicen nuestros <span style={{ color: '#1565C0' }}>clientes</span>
          </h2>
        </div>

        {/* Carousel */}
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Card con fade transition CSS nativo */}
          <div
            style={{
              opacity:    faded ? 0 : 1,
              transform:  faded ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.22s ease, transform 0.22s ease',
            }}
          >
            <div
              style={{
                background: 'white',
                borderRadius: '1.25rem',
                padding: '2.5rem',
                boxShadow: '0 8px 32px rgba(11,34,64,0.1)',
                border: '1px solid rgba(0,180,216,0.08)',
                maxWidth: 720,
                margin: '0 auto',
                position: 'relative',
              }}
            >
              {/* Comillas decorativas */}
              <div
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  fontSize: '5rem',
                  lineHeight: 1,
                  color: 'rgba(0,180,216,0.08)',
                  fontFamily: 'Georgia, serif',
                  userSelect: 'none',
                }}
              >
                "
              </div>

              <StarRating rating={t.rating} />

              <p
                style={{
                  fontSize: '1.125rem',
                  lineHeight: 1.75,
                  color: '#374151',
                  margin: '1.25rem 0',
                  fontStyle: 'italic',
                }}
              >
                "{t.text}"
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #00B4D8, #1565C0)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '0.875rem',
                    flexShrink: 0,
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: '#0B2240', fontSize: '0.9375rem' }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: '0.8125rem', color: '#64748B' }}>
                    {t.zone} · {t.service}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Controles */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '1.5rem',
            }}
          >
            <button
              onClick={prev}
              aria-label="Testimonio anterior"
              style={{
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'white',
                border: '2px solid rgba(0,180,216,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1565C0',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m15 18-6-6 6-6"/>
              </svg>
            </button>

            {/* Dots */}
            {TESTIMONIALS.map((item, i) => (
              <button
                key={item.avatar}
                onClick={() => goTo(i)}
                aria-label={`Testimonio ${i + 1}`}
                style={{
                  width:      i === current ? 24 : 8,
                  height:     8,
                  borderRadius: 4,
                  background: i === current ? '#00B4D8' : 'rgba(0,180,216,0.25)',
                  border:     'none',
                  cursor:     'pointer',
                  transition: 'all 0.3s ease',
                  padding:    0,
                }}
              />
            ))}

            <button
              onClick={next}
              aria-label="Siguiente testimonio"
              style={{
                width: 40, height: 40,
                borderRadius: '50%',
                background: 'white',
                border: '2px solid rgba(0,180,216,0.3)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#1565C0',
                transition: 'all 0.2s ease',
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="m9 18 6-6-6-6"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
