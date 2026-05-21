// src/lib/schemas.ts
// Schemas Zod para el formulario de contacto

import { z } from 'zod';

export const contactSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(80, 'Nombre demasiado largo'),

  telefono: z
    .string()
    .min(7, 'Teléfono inválido')
    .max(15, 'Teléfono inválido')
    .regex(
      /^[\d\s\+\-\(\)]{7,15}$/,
      'Ingresa un número de teléfono válido'
    ),

  email: z
    .string()
    .email('Correo electrónico inválido')
    .optional()
    .or(z.literal('')),

  servicio: z.enum(
    [
      'destape-canerias',
      'deteccion-fugas',
      'geofono',
      'camara-termica',
      'remodelacion-banos',
      'instalacion-tuberia',
      'otro',
    ],
    { message: 'Selecciona un servicio' }
  ),

  barrio: z
    .string()
    .min(2, 'Ingresa tu barrio o zona')
    .max(100, 'Demasiado largo'),

  descripcion: z
    .string()
    .min(20, 'Describe el problema con al menos 20 caracteres')
    .max(1000, 'Descripción demasiado larga'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const SERVICE_OPTIONS = [
  { value: 'destape-canerias',    label: 'Destape de cañerías' },
  { value: 'deteccion-fugas',     label: 'Detección de fugas de agua' },
  { value: 'geofono',             label: 'Geófono — sin romper paredes' },
  { value: 'camara-termica',      label: 'Cámara térmica' },
  { value: 'remodelacion-banos',  label: 'Remodelación de baños' },
  { value: 'instalacion-tuberia', label: 'Instalación de tubería' },
  { value: 'otro',                label: 'Otro servicio' },
] as const;
