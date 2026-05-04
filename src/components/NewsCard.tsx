'use client';

import { useState } from 'react';
import { ExternalLink, Pencil, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Noticia } from '@/types';
import { DOMINIOS } from '@/lib/domains';

interface NewsCardProps {
  noticia: Noticia;
  onDelete?: (id: string) => void;
}

const LINEA_LABELS: Record<string, { label: string; color: string }> = {
  aje: { label: 'AJE', color: '#38bdf8' },
  toquea: { label: 'Toquea', color: '#a78bfa' },
  t3a: { label: '3A', color: '#fb923c' },
  ventures: { label: 'Ventures', color: '#34d399' },
  todas: { label: 'General', color: '#64748b' },
};

const RELEVANCIA_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  alta: { label: 'Alta', color: '#f87171', bg: 'rgba(248,113,113,0.12)' },
  media: { label: 'Media', color: '#facc15', bg: 'rgba(250,204,21,0.12)' },
  baja: { label: 'Baja', color: '#4af0c8', bg: 'rgba(74,240,200,0.12)' },
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (days > 0) return `hace ${days}d`;
  if (hours > 0) return `hace ${hours}h`;
  if (mins > 0) return `hace ${mins}m`;
  return 'ahora';
}

export default function NewsCard({ noticia, onDelete }: NewsCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const dominio = DOMINIOS[noticia.dominio];
  const linea = LINEA_LABELS[noticia.linea_relacionada];
  const rel = RELEVANCIA_STYLE[noticia.relevancia];

  const handleDelete = async () => {
    if (!confirm('¿Eliminar esta señal?')) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/manual?id=${noticia.id}`, { method: 'DELETE' });
      if (res.ok && onDelete) onDelete(noticia.id);
    } finally {
      setDeleting(false);
    }
  };

  const isLong = noticia.resumen.length > 200;

  return (
    <article
      className="rounded-xl p-4 transition-all hover:translate-y-[-1px] group"
      style={{
        background: '#111118',
        border: '1px solid rgba(255,255,255,0.06)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top row: badges + meta */}
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {/* Domain badge */}
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full"
          style={{
            background: `${dominio.color}18`,
            color: dominio.color,
            border: `1px solid ${dominio.color}30`,
          }}
        >
          {dominio.number}. {dominio.label}
        </span>

        {/* Linea badge */}
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{ background: `${linea.color}12`, color: linea.color }}
        >
          {linea.label}
        </span>

        {/* Relevancia badge */}
        <span
          className="text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ background: rel.bg, color: rel.color }}
        >
          {rel.label}
        </span>

        {/* Manual badge */}
        {noticia.es_manual && (
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8' }}>
            <Pencil size={10} className="inline mr-1" />Manual
          </span>
        )}

        {/* Time */}
        <span className="ml-auto text-xs" style={{ color: '#475569' }}>
          {timeAgo(noticia.created_at)}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-sm leading-snug mb-2">
        {noticia.url ? (
          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-white hover:underline decoration-slate-500 underline-offset-2 transition-colors"
            style={{ color: 'inherit' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#a78bfa')}
            onMouseLeave={(e) => (e.currentTarget.style.color = 'inherit')}
          >
            {noticia.titulo}
          </a>
        ) : (
          <span className="text-white">{noticia.titulo}</span>
        )}
      </h3>

      {/* Summary */}
      <p className="text-sm leading-relaxed mb-3" style={{ color: '#94a3b8' }}>
        {isLong && !expanded ? `${noticia.resumen.slice(0, 200)}…` : noticia.resumen}
      </p>

      {/* Footer */}
      <div className="flex items-center gap-3">
        {noticia.url ? (
          <a
            href={noticia.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs transition-colors"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
          >
            <ExternalLink size={11} />
            {noticia.fuente}
          </a>
        ) : (
          <span className="flex items-center gap-1 text-xs" style={{ color: '#475569' }}>
            <ExternalLink size={11} />
            {noticia.fuente}
          </span>
        )}

        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-0.5 text-xs transition-colors"
            style={{ color: '#64748b' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#64748b')}
          >
            {expanded ? <><ChevronUp size={11} /> Menos</> : <><ChevronDown size={11} /> Más</>}
          </button>
        )}

        {/* Delete (only visible for manual or on hover) */}
        {onDelete && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
            style={{ color: '#475569' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            title="Eliminar señal"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </article>
  );
}
