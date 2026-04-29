import { Dominio } from '@/types';

export interface DominioConfig {
  key: Dominio;
  label: string;
  color: string;
  number: number;
  queries: string[];
  fuentes: string;
  descripcion: string;
  esManual?: boolean;
}

export const DOMINIOS: Record<Dominio, DominioConfig> = {
  consumidor: {
    key: 'consumidor',
    label: 'Consumidor / Sentido',
    color: '#e879f9',
    number: 1,
    queries: [
      'cambios habitos consumidor Latam 2025',
      'tendencias consumo saludable Peru',
      'generacion Z consumo masivo',
      'bienestar sostenibilidad consumidor',
    ],
    fuentes: 'Google Noticias, medicalxpress.com, sciencedaily.com, Forbes, Semana Económica',
    descripcion:
      'cambios en valores, hábitos y tensiones del consumidor: salud, bienestar, sostenibilidad, conveniencia, identidad generacional. Foco Perú y Latam.',
  },
  canales: {
    key: 'canales',
    label: 'Plataforma / Canales',
    color: '#38bdf8',
    number: 2,
    queries: [
      'quick commerce Latam 2025',
      'super app Peru',
      'DTC marcas consumo masivo',
      'marketplace retail Peru',
    ],
    fuentes: 'Peru Retail, America Retail, TechCrunch, Google Noticias',
    descripcion:
      'quién controla el acceso al cliente: marketplaces, super-apps, quick commerce, DTC, integraciones verticales en Latinoamérica.',
  },
  operaciones: {
    key: 'operaciones',
    label: 'Operaciones Internas',
    color: '#94a3b8',
    number: 3,
    queries: [
      'AJE Group Peru noticias 2025',
      'Tiendas 3A expansion Peru',
      'Toquea fintech novedades Peru',
    ],
    fuentes: 'LinkedIn, Instagram, noticias corporativas, medios de negocio',
    descripcion:
      'señales de AJE Group, Tiendas 3A, Toquea y New Ventures. Complementa con entradas manuales del equipo.',
    esManual: true,
  },
  tecnologia: {
    key: 'tecnologia',
    label: 'Tecnología / Capacidades',
    color: '#a78bfa',
    number: 4,
    queries: [
      'inteligencia artificial retail 2025',
      'automatizacion FMCG operaciones',
      'IA supply chain alimentos Latam',
    ],
    fuentes: 'HBR, MIT Sloan, Forbes, TechCrunch, GeekWire, CNBC Technology, Fintech Weekly',
    descripcion:
      'IA, automatización, data y software operativo que se vuelve estándar de industria en FMCG y retail.',
  },
  margen: {
    key: 'margen',
    label: 'Modelo de Margen',
    color: '#fb923c',
    number: 5,
    queries: [
      'modelo suscripcion consumo masivo',
      'monetizacion data retail',
      'ecosistema digital marcas FMCG',
    ],
    fuentes: 'HBR, Forbes, Bloomberg, Semana Económica',
    descripcion:
      'cómo se genera dinero fuera del producto: servicios, suscripciones, data, ecosistemas, as-a-service en consumo masivo.',
  },
  competencia: {
    key: 'competencia',
    label: 'Competencia No Tradicional',
    color: '#f87171',
    number: 6,
    queries: [
      'startup disruption bebidas Latam',
      'D2C alimentos Peru 2025',
      'modelo negocio disruptivo retail',
    ],
    fuentes: 'The Food Tech, Fintech Weekly, Bloomberg, Forbes Innovation, WFC',
    descripcion:
      'startups y scaleups que compiten en lógica, no en volumen, en el ecosistema de bebidas y alimentos en Latam.',
  },
  finanzas: {
    key: 'finanzas',
    label: 'Finanzas / Riesgo',
    color: '#facc15',
    number: 7,
    queries: [
      'regulacion fintech Peru SBS 2025',
      'riesgo macroeconomico Peru Latam',
      'inversion venture capital alimentos Peru',
    ],
    fuentes: 'Bloomberg, Semana Económica, Gestión, SBS Perú, Fintech Weekly',
    descripcion:
      'cambios regulatorios, nuevas formas de inversión y riesgo sistémico en Perú y Latinoamérica.',
  },
  coherencia: {
    key: 'coherencia',
    label: 'Coherencia Estratégica',
    color: '#4af0c8',
    number: 8,
    queries: [
      'ESG greenwashing bebidas Latam',
      'coherencia estrategica retail Peru',
      'proposito marca consumo masivo',
    ],
    fuentes: 'HBR, MIT Sloan, Forbes, Semana Económica',
    descripcion:
      'decisiones que contradicen el propósito declarado o la estrategia del sector consumo masivo.',
  },
  ciencia: {
    key: 'ciencia',
    label: 'Medicina / Ciencia',
    color: '#34d399',
    number: 9,
    queries: [
      'ingredientes bebidas salud 2025',
      'regulacion sanitaria alimentos Peru',
      'ciencia nutricion consumo',
    ],
    fuentes: 'medicalxpress.com, sciencedaily.com, The Food Tech',
    descripcion:
      'hallazgos científicos y regulatorios que impacten al consumidor o a los productos de bebidas y alimentos.',
  },
};

export const DOMINIOS_ORDER: Dominio[] = [
  'consumidor',
  'canales',
  'operaciones',
  'tecnologia',
  'margen',
  'competencia',
  'finanzas',
  'coherencia',
  'ciencia',
];
