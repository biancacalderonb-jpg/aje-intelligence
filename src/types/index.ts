export type Dominio =
  | 'consumidor'
  | 'canales'
  | 'tecnologia'
  | 'margen'
  | 'competencia'
  | 'finanzas'
  | 'coherencia'
  | 'operaciones';

export type LineaRelacionada = 'aje' | 'toquea' | 't3a' | 'ventures' | 'todas';
export type Relevancia = 'alta' | 'media' | 'baja';

export interface Noticia {
  id: string;
  titulo: string;
  resumen: string;
  fuente: string;
  url: string | null;
  dominio: Dominio;
  linea_relacionada: LineaRelacionada;
  relevancia: Relevancia;
  es_manual: boolean;
  created_at: string;
  imagen_query?: string | null;
}

export type SearchStatus = 'idle' | 'pending' | 'searching' | 'done' | 'error';

export interface DominioProgress {
  dominio: Dominio;
  status: SearchStatus;
  count: number;
  error?: string;
}
