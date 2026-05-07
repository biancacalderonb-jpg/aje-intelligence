'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { DOMINIOS, DOMINIOS_ORDER } from '@/lib/domains';
import { Noticia, Dominio, LineaRelacionada, DominioProgress } from '@/types';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import NewsFeed from '@/components/NewsFeed';
import RightPanel from '@/components/RightPanel';

async function saveEmptyResult(dominioKey: Dominio) {
  const label = DOMINIOS[dominioKey].label;
  await supabase.from('noticias').insert({
    titulo: `Sin resultados — ${label}`,
    resumen: 'No se encontraron noticias en las últimas 24 horas para este dominio. Intenta de nuevo más tarde.',
    fuente: 'AJE Intelligence',
    url: null,
    dominio: dominioKey,
    linea_relacionada: 'todas',
    relevancia: 'baja',
    es_manual: false,
  });
}

export default function Home() {
  const [noticias, setNoticias] = useState<Noticia[]>([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [searchMessage, setSearchMessage] = useState('');
  const [progress, setProgress] = useState<Record<Dominio, DominioProgress> | null>(null);
  const [dominioFilter, setDominioFilter] = useState<Dominio | null>(null);
  const [lineaFilter, setLineaFilter] = useState<LineaRelacionada | null>(null);
  const [ultimaBusqueda, setUltimaBusqueda] = useState<string | null>(null);

  const fetchNoticias = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('noticias')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(300);

      if (dominioFilter) query = query.eq('dominio', dominioFilter);
      if (lineaFilter) query = query.eq('linea_relacionada', lineaFilter);

      const { data, error } = await query;
      if (error) throw error;
      setNoticias((data as Noticia[]) ?? []);
    } catch (err) {
      console.error('Error cargando noticias:', err);
    } finally {
      setLoading(false);
    }
  }, [dominioFilter, lineaFilter]);

  useEffect(() => {
    fetchNoticias();
  }, [fetchNoticias]);

  // Load last search timestamp from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('aje_ultima_busqueda');
    if (stored) setUltimaBusqueda(stored);
  }, []);

  const handleSearchOne = async (dominioKey: Dominio) => {
    if (searching) return;
    setSearching(true);
    setSearchMessage(`Buscando ${DOMINIOS[dominioKey].label}...`);

    try {
      const res = await fetch('/api/buscar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dominio: dominioKey }),
      });
      const data = await res.json();
      const count = data.count ?? 0;
      if (!res.ok || count === 0) await saveEmptyResult(dominioKey);
    } catch {
      await saveEmptyResult(dominioKey);
    }

    const now = new Date().toISOString();
    setUltimaBusqueda(now);
    localStorage.setItem('aje_ultima_busqueda', now);
    setSearchMessage('');
    setSearching(false);
    await fetchNoticias();
  };

  const handleSearchAll = async () => {
    if (searching) return;
    setSearching(true);

    const initialProgress = DOMINIOS_ORDER.reduce(
      (acc, key) => ({
        ...acc,
        [key]: { dominio: key, status: 'pending', count: 0 },
      }),
      {} as Record<Dominio, DominioProgress>
    );
    setProgress(initialProgress);

    for (let i = 0; i < DOMINIOS_ORDER.length; i++) {
      const dominioKey = DOMINIOS_ORDER[i];
      const label = DOMINIOS[dominioKey].label;
      const step = `(${i + 1}/${DOMINIOS_ORDER.length})`;

      setSearchMessage(`Buscando ${label}... ${step}`);
      setProgress((prev) =>
        prev ? { ...prev, [dominioKey]: { ...prev[dominioKey], status: 'searching' } } : prev
      );

      try {
        const res = await fetch('/api/buscar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dominio: dominioKey }),
        });

        const data = await res.json();
        const count = data.count ?? 0;

        if (!res.ok || count === 0) {
          await saveEmptyResult(dominioKey);
        }

        setProgress((prev) =>
          prev
            ? {
                ...prev,
                [dominioKey]: {
                  ...prev[dominioKey],
                  status: res.ok ? 'done' : 'error',
                  count,
                  error: data.error,
                },
              }
            : prev
        );
      } catch (err) {
        await saveEmptyResult(dominioKey);
        setProgress((prev) =>
          prev
            ? {
                ...prev,
                [dominioKey]: {
                  ...prev[dominioKey],
                  status: 'error',
                  error: err instanceof Error ? err.message : 'Error',
                },
              }
            : prev
        );
      }
    }

    const now = new Date().toISOString();
    setUltimaBusqueda(now);
    localStorage.setItem('aje_ultima_busqueda', now);

    setSearchMessage('');
    setSearching(false);
    await fetchNoticias();
    setTimeout(() => setProgress(null), 5000);
  };

  const handleDelete = (id: string) => {
    setNoticias((prev) => prev.filter((n) => n.id !== id));
  };

  // Total count without domain/linea filter
  const [totalCount, setTotalCount] = useState(0);
  useEffect(() => {
    supabase
      .from('noticias')
      .select('id', { count: 'exact', head: true })
      .then(({ count }) => setTotalCount(count ?? 0));
  }, [noticias]);

  return (
    <div className="flex flex-col min-h-screen" style={{ background: '#08080e' }}>
      <Header
        searching={searching}
        searchMessage={searchMessage}
        progress={progress}
        ultimaBusqueda={ultimaBusqueda}
        totalCount={totalCount}
        onSearchOne={handleSearchOne}
        onSearchAll={handleSearchAll}
      />

      <div
        className="flex flex-1 overflow-hidden"
        style={{ height: 'calc(100vh - 57px)' }}
      >
        {/* Left sidebar */}
        <div className="w-64 flex-shrink-0 overflow-y-auto">
          <Sidebar
            noticias={noticias}
            dominioFilter={dominioFilter}
            lineaFilter={lineaFilter}
            onDominioChange={setDominioFilter}
            onLineaChange={setLineaFilter}
          />
        </div>

        {/* Center feed */}
        <main className="flex-1 overflow-y-auto px-5 py-5">
          {/* Feed header */}
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-white font-semibold text-sm">
                {dominioFilter
                  ? `${noticias.length} señales · ${dominioFilter}`
                  : `${noticias.length} señales`}
              </h2>
              {(dominioFilter || lineaFilter) && (
                <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                  Filtrando por{dominioFilter ? ` dominio "${dominioFilter}"` : ''}{lineaFilter ? ` línea "${lineaFilter}"` : ''}
                </p>
              )}
            </div>
          </div>

          <NewsFeed noticias={noticias} loading={loading} onDelete={handleDelete} />
        </main>

        {/* Right panel */}
        <div className="w-72 flex-shrink-0 overflow-y-auto">
          <RightPanel noticias={noticias} onManualSaved={fetchNoticias} />
        </div>
      </div>
    </div>
  );
}
