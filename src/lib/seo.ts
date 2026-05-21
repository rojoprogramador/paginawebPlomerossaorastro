// src/lib/seo.ts
// Helpers para metadata SEO y schemas JSON-LD

export const SITE = {
  name:        'Plomeros SAOR',
  tagline:     'Servicios locativos de calidad',
  url:         'https://www.plomerossaor.com',
  phone1:      '+573185922585',
  phone2:      '+573007750833',
  whatsapp:    '573185922585',
  email:       'servicios@plomerossaor.com',
  address:     'Cali, Valle del Cauca, Colombia',
  city:        'Cali',
  region:      'Valle del Cauca',
  country:     'CO',
  ogImage:     '/images/og/og-default.jpg',
  twitterHandle: '',
  facebook:    'https://facebook.com/plomerossaor',
  instagram:   'https://instagram.com/plomerossaor',
  youtube:     'https://youtube.com/@plomerossaor',
};

export const SERVICES = [
  {
    name:   'Destape de cañerías',
    slug:   '/destape-de-canerias-cali',
    icon:   '🚿',
  },
  {
    name:   'Detección de fugas de agua',
    slug:   '/deteccion-de-fugas-de-agua-como-saber-si-en-mi-casa-tengo-una-fuga-de-agua',
    icon:   '💧',
  },
  {
    name:   'Geófono — detección sin romper',
    slug:   '/servicio-geofono-cali',
    icon:   '🎯',
  },
  {
    name:   'Cámara térmica',
    slug:   '/servicio-camara-termica-cali',
    icon:   '🌡️',
  },
  {
    name:   'Cámara endoscópica',
    slug:   '/camara-endoscopica-inspeccion-tuberias-cali',
    icon:   '🔦',
  },
  {
    name:   'Remodelación de baños',
    slug:   '/remodelacion-de-banos-cali',
    icon:   '🛁',
  },
  {
    name:   'Instalación de tubería',
    slug:   '/instalacion-tuberia-cali',
    icon:   '🔧',
  },
];

export const ZONES = [
  { name: 'Cali',    slug: '/plomeros-en-cali' },
  { name: 'Jamundí', slug: '/plomeros-jamundi' },
  { name: 'Palmira', slug: '/plomeros-palmira' },
  { name: 'Yumbo',   slug: '/plomeros-yumbo' },
];

// ---- Schema JSON-LD base (LocalBusiness) ----
export function getLocalBusinessSchema(overrides: Record<string, unknown> = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    name: SITE.name,
    description: 'Plomeros profesionales en Cali con más de 10 años de experiencia. Destape de cañerías, detección de fugas con geófono y cámara térmica, remodelación de baños. Servicio 24 horas.',
    url: SITE.url,
    telephone: [SITE.phone1, SITE.phone2],
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE.city,
      addressRegion: SITE.region,
      addressCountry: SITE.country,
    },
    openingHours: 'Mo-Su 00:00-24:00',
    areaServed: [
      { '@type': 'City', name: 'Cali' },
      { '@type': 'City', name: 'Jamundí' },
      { '@type': 'City', name: 'Palmira' },
      { '@type': 'City', name: 'Yumbo' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '47',
    },
    sameAs: [SITE.facebook, SITE.instagram, SITE.youtube],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servicios de plomería en Cali',
      itemListElement: SERVICES.map((s, i) => ({
        '@type': 'Offer',
        position: i + 1,
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          url: `${SITE.url}${s.slug}`,
        },
      })),
    },
    ...overrides,
  };
}

// ---- Metadata SEO estándar ----
export interface PageSEO {
  title:       string;
  description: string;
  canonical?:  string;
  ogImage?:    string;
  noindex?:    boolean;
}

export function buildTitle(pageTitle: string): string {
  return `${pageTitle} | ${SITE.name}`;
}
