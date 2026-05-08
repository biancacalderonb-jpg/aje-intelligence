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
      'tendencias consumidor bebidas consumo masivo 2026',
      'tendencias consumidor fintech pagos digitales Latam 2026',
      'tendencias consumidor hard discount retail Peru 2026',
      'cambios habitos compra salud bienestar sostenibilidad 2026',
    ],
    fuentes: 'Google Noticias, Peru Retail, Semana Económica, The Food Tech, Forbes',
    descripcion:
      'cambios en valores, hábitos y tensiones del consumidor: salud, bienestar, sostenibilidad, conveniencia, identidad generacional. Foco Perú y Latam.',
  },
  canales: {
    key: 'canales',
    label: 'Plataforma / Canales',
    color: '#38bdf8',
    number: 2,
    queries: [
      'canales distribucion plataformas bebidas consumo masivo 2026',
      'canales distribucion plataformas fintech pagos Latam 2026',
      'canales distribucion plataformas hard discount retail Peru 2026',
      'marketplace quick commerce DTC super app acceso cliente 2026',
    ],
    fuentes: 'Google Noticias, Peru Retail, Semana Económica, The Food Tech, Forbes',
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
      'tecnologia IA operaciones bebidas consumo masivo Latam',
      'software automatizacion hard discount fintech Peru 2026',
    ],
    fuentes: 'TechCrunch, GeekWire, CNBC Technology, HBR, Forbes, MIT Sloan, Semana Económica, Fintech Weekly',
    descripcion:
      'IA, automatización, data y software operativo que se vuelve estándar de industria en FMCG y retail.',
  },
  margen: {
    key: 'margen',
    label: 'Modelo de Margen',
    color: '#fb923c',
    number: 4,
    queries: [
      'modelo suscripcion servicios revenue consumo masivo 2026',
      'monetizacion data ecosistema digital FMCG Latam',
      'as-a-service nuevos ingresos bebidas retail fintech 2026',
    ],
    fuentes: 'HBR, Forbes, Semana Económica',
    descripcion:
      'cómo se genera dinero fuera del producto: servicios, suscripciones, data, ecosistemas, as-a-service en consumo masivo.',
  },
  competencia: {
    key: 'competencia',
    label: 'Competencia No Tradicional',
    color: '#f87171',
    number: 5,
    queries: [
      'startup disruptivo bebidas consumo masivo Latam 2026',
      'modelo negocio disruptivo hard discount retail Peru 2026',
      'scaleup fintech competencia no tradicional Latam 2026',
    ],
    fuentes: 'HBR, Fintech Weekly, Bloomberg, WFC, Semana Económica',
    descripcion:
      'startups y scaleups que compiten en lógica, no en volumen, en el ecosistema de bebidas y alimentos en Latam.',
  },
  finanzas: {
    key: 'finanzas',
    label: 'Finanzas / Riesgo',
    color: '#facc15',
    number: 6,
    queries: [
      'regulacion fintech SBS Peru 2026',
      'inversion venture capital consumo masivo bebidas Latam 2026',
      'riesgo regulatorio legislacion retail fintech Peru 2026',
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
      'ESG sostenibilidad estrategia empresa consumo masivo Latam 2026',
      'greenwashing proposito marca bebidas retail decision controversial',
      'coherencia estrategica empresa FMCG Peru Latam 2026',
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
