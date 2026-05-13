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
      'noticias consumidor sector bebidas',
      'noticias consumidor sector fintech',
      'noticias consumidor sector hard discount',
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
      'noticias plataformas sector fintech',
      'noticias plataformas sector bebidas',
      'noticias plataformas sector hard discount',
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
      'site:hbr.org AI agents data strategy 2026',
      'site:forbes.com artificial intelligence business transformation 2026',
      'IA agentes automatizacion flujos trabajo empresa 2026',
      'data privacy estrategia crecimiento empresa 2026',
    ],
    fuentes: 'HBR, Forbes, TechCrunch, GeekWire, CNBC Technology, MIT Sloan, Semana Económica',
    descripcion:
      'Buscar noticias relacionadas con IA, infraestructura tecnológica, automatización, datos, cloud, agentes IA, capacidades digitales, innovación operativa, ciberseguridad, plataformas tecnológicas y transformación digital.',
  },
  margen: {
    key: 'margen',
    label: 'Modelo de Margen',
    color: '#fb923c',
    number: 4,
    queries: [
      'inflacion Peru impacto negocio consumo masivo 2026',
      'modelo B2B ingresos corporativos empresa telecomunicaciones retail 2026',
      'restructuracion quiebra retail modelo negocio 2026',
      'desafios globales impacto negocios locales alimentos bebidas 2026',
    ],
    fuentes: 'forbes.pe, Forbes, Semana Económica, Bloomberg, HBR',
    descripcion:
      'Buscar noticias relacionadas con eficiencia operativa, costos, pricing, supply chain, adquisiciones, modelos de negocio, monetización, suscripciones, rentabilidad, resiliencia financiera, inflación, energía, expansión rentable y captura de valor.',
  },
  competencia: {
    key: 'competencia',
    label: 'Competencia No Tradicional',
    color: '#f87171',
    number: 5,
    queries: [
      'site:hbr.org strategy disruption business model',
      'site:semanaeconomica.com competencia estrategia empresa',
      'fintech disruption Bloomberg WFC 2026',
    ],
    fuentes: 'HBR, Fintech Weekly, Bloomberg, WFC, Semana Económica',
    descripcion:
      'Buscar noticias relacionadas con liderazgo, cultura, talento, adaptabilidad, habilidades híbridas, reskilling, transformación cultural, gobernanza, confianza organizacional, nuevas formas de competencia y cambios generacionales.',
  },
  finanzas: {
    key: 'finanzas',
    label: 'Finanzas / Riesgo',
    color: '#facc15',
    number: 6,
    queries: [
      'BCRP tasa interes inflacion Peru 2026',
      'riesgo pais Peru elecciones economia 2026',
      'inflacion proyeccion Peru Scotiabank BBVA 2026',
      'precios combustibles tarifas Peru macroeconomia 2026',
    ],
    fuentes: 'bbvaresearch.com, bloomberglinea.com, rpp.pe, xtb.com, Semana Económica, Gestión',
    descripcion:
      'cambios regulatorios, nuevas formas de inversión y riesgo sistémico en Perú y Latinoamérica.',
  },
  coherencia: {
    key: 'coherencia',
    label: 'Coherencia Estratégica',
    color: '#4af0c8',
    number: 7,
    queries: [
      'AJE Group expansion estrategia Venezuela Big Cola 2026',
      'AJE Peru Hey Fit bebida funcional lanzamiento 2026',
      'Tiendas 3A Toquea AJE New Ventures noticias 2026',
      'AJE Group estrategia mercado Latam decision 2026',
    ],
    fuentes: 'bloomberg.com, peru-retail.com, foodnewslatam.com, Semana Económica, Gestión',
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
