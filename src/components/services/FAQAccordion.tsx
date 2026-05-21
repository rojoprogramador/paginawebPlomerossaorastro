// src/components/services/FAQAccordion.tsx
// Island React — Acordeón animado para preguntas frecuentes

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface FAQ {
  question: string;
  answer:   string;
}

interface Props {
  faqs:   FAQ[];
  title?: string;
}

export default function FAQAccordion({ faqs, title = 'Preguntas frecuentes' }: Props) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section style={{ padding: '4rem 0', background: 'var(--color-bg-light, #F0F7FA)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(0,180,216,0.1)',
              border: '1px solid rgba(0,180,216,0.3)',
              color: '#00B4D8',
              padding: '0.3rem 1rem',
              borderRadius: 99,
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            FAQ
          </span>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.5rem, 3.5vw, 2rem)',
              fontWeight: 800,
              color: '#0B2240',
            }}
          >
            {title}
          </h2>
        </div>

        {/* Acordeón */}
        <div style={{ maxWidth: 760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {faqs.map((faq, i) => (
            <div
              key={i}
              style={{
                background: 'white',
                borderRadius: '0.875rem',
                border: open === i
                  ? '2px solid rgba(0,180,216,0.4)'
                  : '1px solid rgba(0,180,216,0.1)',
                overflow: 'hidden',
                boxShadow: open === i
                  ? '0 4px 16px rgba(0,180,216,0.1)'
                  : '0 1px 4px rgba(0,0,0,0.04)',
                transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
              }}
            >
              {/* Pregunta */}
              <button
                id={`faq-btn-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-panel-${i}`}
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  padding: '1.125rem 1.5rem',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                <span
                  style={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    color: open === i ? '#00B4D8' : '#0B2240',
                    lineHeight: 1.4,
                    transition: 'color 0.2s ease',
                  }}
                >
                  {faq.question}
                </span>
                <motion.div
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ duration: 0.25, ease: 'easeInOut' }}
                  style={{ flexShrink: 0 }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={open === i ? '#00B4D8' : '#94a3b8'}
                    strokeWidth="2.5"
                  >
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </motion.div>
              </button>

              {/* Respuesta */}
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-btn-${i}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    style={{ overflow: 'hidden' }}
                  >
                    <div
                      style={{
                        padding: '0 1.5rem 1.25rem',
                        fontSize: '0.9rem',
                        color: '#64748b',
                        lineHeight: 1.7,
                        borderTop: '1px solid rgba(0,180,216,0.1)',
                        paddingTop: '1rem',
                      }}
                    >
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
