'use client';

import { useState } from 'react';
import { BarChart3, PlusCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { Noticia, Dominio, LineaRelacionada, Relevancia } from '@/types';
import { DOMINIOS, DOMINIOS_ORDER } from '@/lib/domains';

interface RightPanelProps {
  noticias: Noticia[];
  onManualSaved: () => void;
}

export default function RightPanel({ noticias, onManualSaved }: RightPanelProps) {
  const [titulo, setTitulo] = useState('');
  const [resumen, setResumen] = useState('');
  const [fuente, setFuente] = useState('');
  const [url, setUrl] = useState('');
  const [linea, setLinea] = useState<LineaRelacionada>('todas');
  const [relevancia, setRelevancia] = useState<Relevancia>('media');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  const countByDominio = DOMINIOS_ORDER.reduce(
    (acc, key) => ({ ...acc, [key]: noticias.filter((n) => n.dominio === key).length }),
    {} as Record<Dominio, number>
  );

  const maxCount = Math.max(...Object.values(countByDominio), 1);

  const handleSave = async () => {
    if (!titulo.trim() || !resumen.trim()) {
      setError('El título y el resumen son obligatorios.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ titulo, resumen, fuente, url, linea_relacionada: linea, relevancia }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Error al guardar');
      }
      setSaved(true);
      setTitulo('');
      setResumen('');
      setFuente('');
      setUrl('');
      setLinea('todas');
      setRelevancia('media');
      onManualSaved();
      setTimeout(() => setSaved(false), 3000);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    } finally {
      setSaving(false);
    }
  };

  return (
    <aside
      className="flex flex-col gap-0 h-full overflow-y-auto"
      style={{ background: '#08080e', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Domain stats */}
      <div className="p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 size={13} className="text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Señales por dominio
          </span>
        </div>
        <div className="space-y-2">
          {DOMINIOS_ORDER.map((key) => {
            const d = DOMINIOS[key];
            const count = countByDominio[key] ?? 0;
            const pct = count === 0 ? 0 : Math.max(4, (count / maxCount) * 100);
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs" style={{ color: '#94a3b8' }}>
                    {d.label}
                  </span>
                  <span className="text-xs font-medium" style={{ color: count > 0 ? d.color : '#475569' }}>
                    {count}
                  </span>
                </div>
                <div className="h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                  <div
                    className="h-1 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%`, background: d.color, opacity: count > 0 ? 0.7 : 0 }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual entry form */}
      <div className="p-4 flex-1">
        <div className="flex items-center gap-2 mb-4">
          <PlusCircle size={13} className="text-slate-500" />
          <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Entrada manual
          </span>
        </div>
        <p className="text-xs mb-4" style={{ color: '#475569', lineHeight: '1.5' }}>
          Para Operaciones Internas: pega posts de LinkedIn / Instagram o redacta señales observadas.
        </p>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
              Título *
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Título conciso de la señal"
              className="w-full text-sm rounded-lg px-3 py-2 outline-none transition-all placeholder:text-slate-600"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
              Contenido / Resumen *
            </label>
            <textarea
              value={resumen}
              onChange={(e) => setResumen(e.target.value)}
              placeholder="Pega el post o describe la señal observada..."
              rows={5}
              className="w-full text-sm rounded-lg px-3 py-2 outline-none resize-none transition-all placeholder:text-slate-600"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
              URL del post o artículo
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://linkedin.com/posts/..."
              className="w-full text-sm rounded-lg px-3 py-2 outline-none transition-all placeholder:text-slate-600"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
              Fuente
            </label>
            <input
              type="text"
              value={fuente}
              onChange={(e) => setFuente(e.target.value)}
              placeholder="Ej: LinkedIn @AJEGroup, Instagram, interno"
              className="w-full text-sm rounded-lg px-3 py-2 outline-none transition-all placeholder:text-slate-600"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.08)',
                color: '#f1f5f9',
              }}
              onFocus={(e) => (e.currentTarget.style.borderColor = 'rgba(167,139,250,0.4)')}
              onBlur={(e) => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
                Línea
              </label>
              <select
                value={linea}
                onChange={(e) => setLinea(e.target.value as LineaRelacionada)}
                className="w-full text-sm rounded-lg px-2 py-2 outline-none"
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f1f5f9',
                }}
              >
                <option value="todas">General</option>
                <option value="aje">AJE Group</option>
                <option value="toquea">Toquea</option>
                <option value="t3a">Tiendas 3A</option>
                <option value="ventures">Ventures</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: '#64748b' }}>
                Relevancia
              </label>
              <select
                value={relevancia}
                onChange={(e) => setRelevancia(e.target.value as Relevancia)}
                className="w-full text-sm rounded-lg px-2 py-2 outline-none"
                style={{
                  background: '#111118',
                  border: '1px solid rgba(255,255,255,0.08)',
                  color: '#f1f5f9',
                }}
              >
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: '#f87171' }}>
              {error}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={saving || saved}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all disabled:opacity-60"
            style={{
              background: saved
                ? 'rgba(52,211,153,0.15)'
                : 'rgba(148,163,184,0.1)',
              color: saved ? '#34d399' : '#94a3b8',
              border: `1px solid ${saved ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            {saving ? (
              <><Loader2 size={14} className="animate-spin" /> Guardando…</>
            ) : saved ? (
              <><CheckCircle2 size={14} /> Guardado</>
            ) : (
              <><PlusCircle size={14} /> Guardar señal</>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
}
