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
      'tendencias consumidor salud bienestar 2026',
      'habitos compra generacion Z millennials Latam',
      'sostenibilidad identidad consumidor alimentos bebidas',
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
      'quick commerce marketplace retail Latam 2026',
      'super app DTC canal directo consumidor',
      'retail moderno hard discount expansion',
    ],
    fuentes: 'Peru Retail, America Retail, TechCrunch, Google Noticias',
    descripcion:
      'quién controla el acceso al cliente: marketplaces, super-apps, quick commerce, DTC, integraciones verticales en Latinoamérica.',
  },
  tecnologia: {
    key: 'tecnologia',
    label: 'Tecnología / Capacidades',
    color: '#a78bfa',
    number: 3,
    queries: [
      'inteligencia artificial automatizacion retail FMCG 2026',
      'software operativo data supply chain alimentos',
      'tecnologia estandar industria bebidas consumo masivo',
    ],
    fuentes: 'HBR, MIT Sloan, Forbes, TechCrunch, GeekWire, CNBC Technology, Fintech Weekly',
    descripcion:
      'IA, automatización, data y software operativo que se vuelve estándar de industria en FMCG y retail.',
  },
  margen: {
    key: 'margen',
    label: 'Modelo de Margen',
    color: '#fb923c',
    number: 4,
    queries: [
      'modelo suscripcion servicio consumo masivo 2026',
      'monetizacion data ecosistema digital retail',
      'revenue stream nuevo FMCG as-a-service',
    ],
    fuentes: 'HBR, Forbes, Bloomberg, Semana Económica',
    descripcion:
      'cómo se genera dinero fuera del producto: servicios, suscripciones, data, ecosistemas, as-a-service en consumo masivo.',
  },
  competencia: {
    key: 'competencia',
    label: 'Competencia No Tradicional',
    color: '#f87171',
    number: 5,
    queries: [
      'startup disruptivo alimentos bebidas modelo negocio 2026',
      'D2C marca directa consumidor Latam fintech retail',
      'scaleup innovacion consumo experiencia tecnologia',
    ],
    fuentes: 'The Food Tech, Fintech Weekly, Bloomberg, Forbes Innovation, WFC',
    descripcion:
      'startups y scaleups que compiten en lógica, no en volumen, en el ecosistema de bebidas y alimentos en Latam.',
  },
  finanzas: {
    key: 'finanzas',
    label: 'Finanzas / Riesgo',
    color: '#facc15',
    number: 6,
    queries: [
      'regulacion fintech retail Peru Latam 2026',
      'inversion venture capital alimentos bebidas startup',
      'riesgo regulatorio cambio legislacion consumo masivo',
    ],
    fuentes: 'Bloomberg, Semana Económica, Gestión, SBS Perú, Fintech Weekly',
    descripcion:
      'cambios regulatorios, nuevas formas de inversión y riesgo sistémico en Perú y Latinoamérica.',
  },
  coherencia: {
    key: 'coherencia',
    label: 'Coherencia Estratégica',
    color: '#4af0c8',
    number: 7,
    queries: [
      'ESG sostenibilidad empresa consumo masivo contradiccion',
      'estrategia corporativa retail bebidas decision controversial',
      'greenwashing proposito marca FMCG Latam 2026',
    ],
    fuentes: 'HBR, MIT Sloan, Forbes, Semana Económica',
    descripcion:
      'decisiones que contradicen el propósito declarado o la estrategia del sector consumo masivo.',
  },
  operaciones: {
    key: 'operaciones',
    label: 'Operaciones Internas',
    color: '#94a3b8',
    number: 8,
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
};

// Operaciones goes last: it's semi-manual and runs after all automatic domains
export const DOMINIOS_ORDER: Dominio[] = [
  'consumidor',
  'canales',
  'tecnologia',
  'margen',
  'competencia',
  'finanzas',
  'coherencia',
  'operaciones',
];
