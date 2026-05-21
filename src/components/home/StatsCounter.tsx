// src/components/home/StatsCounter.tsx
// Island React — Números animados sin Framer Motion
// Usa IntersectionObserver + requestAnimationFrame nativos

import { useRef, useEffect, useState } from 'react';

interface Stat {
  value:   number;
  label:   string;
  prefix?: string;
  suffix?: string;
  icon:    string;
}

const STATS: Stat[] = [
  { value: 6,   suffix: '+', label: 'Años de experiencia',      icon: '🏆', prefix: '' },
  { value: 200, suffix: '+', label: 'Clientes satisfechos',      icon: '😊', prefix: '' },
  { value: 1,   suffix: 'h', label: 'Tiempo de respuesta',       icon: '⚡', prefix: '<' },
  { value: 100, suffix: '%', label: 'Garantía en los trabajos',  icon: '✅', prefix: '' },
];

function CountUp({ to, duration = 1.5, prefix = '', suffix = '', started }: Readonly<{
  to:        number;
  duration?: number;
  prefix?:   string;
  suffix?:   string;
  started:   boolean;
}>) {
  const [count, setCount]   = useState(0);
  const hasRun = useRef(false);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!started || hasRun.current) return;
    hasRun.current = true;
    const t0  = performance.now();
    const ms  = duration * 1000;

    const tick = (now: number) => {
      const p     = Math.min((now - t0) / ms, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setCount(Math.round(to * eased));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [started, to, duration]);

  return <span>{prefix}{count}{suffix}</span>;
}

export default function StatsCounter() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { rootMargin: '-80px' }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        background: 'linear-gradient(135deg, #0B2240 0%, #0f3460 50%, #1565C0 100%)',
        padding: '5rem 0',
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 1.5rem' }}>
        {/* Título */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span
            style={{
              display: 'inline-block',
              background: 'rgba(0,180,216,0.15)',
              border: '1px solid rgba(0,180,216,0.4)',
              color: '#4FC3F7',
              padding: '0.3rem 1rem',
              borderRadius: 99,
              fontSize: '0.8125rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
            }}
          >
            Por qué elegirnos
          </span>
          <h2
            style={{
              fontFamily: "'Sora', sans-serif",
              fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
              fontWeight: 800,
              color: 'white',
              lineHeight: 1.2,
            }}
          >
            Números que hablan <span style={{ color: '#00B4D8' }}>por sí solos</span>
          </h2>
        </div>

        {/* Grid de stats */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              style={{
                textAlign: 'center',
                padding: '2rem 1.5rem',
                background: 'rgba(255,255,255,0.06)',
                borderRadius: '1.25rem',
                border: '1px solid rgba(0,180,216,0.15)',
                opacity: inView ? 1 : 0,
                transform: inView ? 'translateY(0)' : 'translateY(24px)',
                transition: `opacity 0.5s ease ${i * 0.1}s, transform 0.5s ease ${i * 0.1}s`,
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {stat.icon}
              </div>
              <div
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: 'clamp(2rem, 4vw, 3rem)',
                  fontWeight: 800,
                  color: '#00B4D8',
                  lineHeight: 1,
                  marginBottom: '0.375rem',
                }}
              >
                <CountUp
                  to={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  started={inView}
                />
              </div>
              <div
                style={{
                  fontSize: '0.9rem',
                  color: 'rgba(255,255,255,0.7)',
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
