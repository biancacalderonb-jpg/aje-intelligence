'use client';

import { Loader2, Inbox } from 'lucide-react';
import { Noticia } from '@/types';
import NewsCard from './NewsCard';

interface NewsFeedProps {
  noticias: Noticia[];
  loading: boolean;
  onDelete: (id: string) => void;
}

export default function NewsFeed({ noticias, loading, onDelete }: NewsFeedProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <Loader2 size={24} className="animate-spin" style={{ color: '#a78bfa' }} />
        <span className="text-sm" style={{ color: '#475569' }}>Cargando señales…</span>
      </div>
    );
  }

  if (noticias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          <Inbox size={22} style={{ color: '#475569' }} />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white mb-1">Sin señales</p>
          <p className="text-xs" style={{ color: '#475569' }}>
            Presiona &quot;Buscar señales hoy&quot; para iniciar la exploración del entorno.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {noticias.map((n) => (
        <NewsCard key={n.id} noticia={n} onDelete={onDelete} />
      ))}
    </div>
  );
}
