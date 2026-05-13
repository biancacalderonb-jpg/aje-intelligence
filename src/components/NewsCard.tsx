'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Pencil, Trash2 } from 'lucide-react';
import { Noticia } from '@/types';
import { DOMINIOS } from '@/lib/domains';

interface NewsCardProps {
  noticia: Noticia;
  onDelete?: (id: string) => void;
}

function picsumUrl(query: string): string {
  const seed = query.replace(/\s+/g, '').replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'news';
  return `https://picsum.photos/seed/${seed}/400/200`;
}

const RELEVANCIA_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  alta: { label: 'Alta', color: '#f87171', bg: 'rgba(248,113,113,0.15)' },
  media: { label: 'Media', color: '#facc15', bg: 'rgba(250,204,21,0.15)' },
  baja: { label: 'Baja', color: '#4af0c8', bg: 'rgba(74,240,200,0.15)' },
};

const LINEA_LABELS: Record<string, { label: string; color: string }> = {
  aje: { label: 'AJE', color: '#38bdf8' },
  toquea: { label: 'Toquea', color: '#a78bfa' },
  t3a: { label: '3A', color: '#fb923c' },
  ventures: { label: 'Ventures', color: '#34d399' },
  todas: { label: 'General', color: '#64748b' },
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
  const [deleting, setDeleting] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [imgError, setImgError] = useState(false);

  const dominio = DOMINIOS[noticia.dominio];
  const linea = LINEA_LABELS[noticia.linea_relacionada];
  const rel = RELEVANCIA_STYLE[noticia.relevancia];

  const fallbackUrl = picsumUrl(noticia.imagen_query || noticia.titulo);
  const [imageUrl, setImageUrl] = useState(fallbackUrl);

  useEffect(() => {
    if (!noticia.url) return;
    fetch(`/api/og?url=${encodeURIComponent(noticia.url)}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => { if (data?.image) { setImgError(false); setImageUrl(data.image); } })
      .catch(() => {});
  }, [noticia.url]);

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

  return (
    <article
      className="rounded-xl overflow-hidden transition-all duration-200 group flex flex-col"
      style={{
        background: '#111118',
        border: `1px solid ${hovered ? dominio.color + '50' : 'rgba(255,255,255,0.06)'}`,
        boxShadow: hovered
          ? `0 12px 32px rgba(0,0,0,0.6), 0 0 0 1px ${dominio.color}25`
          : '0 1px 3px rgba(0,0,0,0.4)',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area */}
      <div className="relative flex-shrink-0" style={{ height: '160px' }}>
        {!imgError ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt=""
            onError={() => {
              if (imageUrl !== fallbackUrl) {
                setImageUrl(fallbackUrl);
              } else {
                setImgError(true);
              }
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div
            style={{
              width: '100%',
              height: '100%',
              background: `linear-gradient(135deg, ${dominio.color}20 0%, ${dominio.color}06 100%)`,
            }}
          />
        )}

        {/* Bottom gradient so text below feels connected */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(17,17,24,0.1) 0%, rgba(17,17,24,0.85) 100%)',
          }}
        />

        {/* Domain badge — absolute over image */}
        <div className="absolute top-3 left-3">
          <span
            className="text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              background: `${dominio.color}35`,
              color: dominio.color,
              border: `1px solid ${dominio.color}55`,
              backdropFilter: 'blur(6px)',
            }}
          >
            {dominio.number}. {dominio.label}
          </span>
        </div>

        {/* Manual badge */}
        {noticia.es_manual && (
          <div className="absolute top-3 right-3">
            <span
              className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
              style={{
                background: 'rgba(148,163,184,0.2)',
                color: '#94a3b8',
                border: '1px solid rgba(148,163,184,0.2)',
                backdropFilter: 'blur(6px)',
              }}
            >
              <Pencil size={10} />
              Manual
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex flex-col flex-1 gap-2">
        {/* Title — max 2 lines */}
        <h3 className="font-semibold text-sm leading-snug line-clamp-2">
          {noticia.url ? (
            <a
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-150"
              style={{ color: hovered ? dominio.color : 'white' }}
            >
              {noticia.titulo}
            </a>
          ) : (
            <span className="text-white">{noticia.titulo}</span>
          )}
        </h3>

        {/* Summary — max 2 lines */}
        <p className="text-xs leading-relaxed line-clamp-2 flex-1" style={{ color: '#94a3b8' }}>
          {noticia.resumen}
        </p>

        {/* Badges row */}
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ background: rel.bg, color: rel.color }}
          >
            {rel.label}
          </span>
          <span
            className="text-xs px-2 py-0.5 rounded-full"
            style={{ background: `${linea.color}14`, color: linea.color }}
          >
            {linea.label}
          </span>
          <span className="ml-auto text-xs" style={{ color: '#475569' }}>
            {timeAgo(noticia.created_at)}
          </span>
        </div>

        {/* Source + delete row */}
        <div
          className="flex items-center gap-2 pt-2"
          style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
        >
          {noticia.url ? (
            <a
              href={noticia.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs min-w-0 transition-colors"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#94a3b8')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
            >
              <ExternalLink size={11} className="flex-shrink-0" />
              <span className="truncate">{noticia.fuente}</span>
            </a>
          ) : (
            <span className="flex items-center gap-1 text-xs min-w-0" style={{ color: '#475569' }}>
              <ExternalLink size={11} className="flex-shrink-0" />
              <span className="truncate">{noticia.fuente}</span>
            </span>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="ml-auto flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded"
              style={{ color: '#475569' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = '#f87171')}
              onMouseLeave={(e) => (e.currentTarget.style.color = '#475569')}
              title="Eliminar señal"
            >
              <Trash2 size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
