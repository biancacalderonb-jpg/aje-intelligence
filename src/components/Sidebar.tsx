'use client';

import { LayoutGrid, X } from 'lucide-react';
import { Dominio, LineaRelacionada, Noticia } from '@/types';
import { DOMINIOS, DOMINIOS_ORDER } from '@/lib/domains';

interface SidebarProps {
  noticias: Noticia[];
  dominioFilter: Dominio | null;
  lineaFilter: LineaRelacionada | null;
  onDominioChange: (d: Dominio | null) => void;
  onLineaChange: (l: LineaRelacionada | null) => void;
}

const LINEAS: { key: LineaRelacionada; label: string; color: string }[] = [
  { key: 'todas', label: 'Todas las líneas', color: '#64748b' },
  { key: 'aje', label: 'AJE Group', color: '#38bdf8' },
  { key: 'toquea', label: 'Toquea', color: '#a78bfa' },
  { key: 't3a', label: 'Tiendas 3A', color: '#fb923c' },
  { key: 'ventures', label: 'New Ventures', color: '#34d399' },
];

export default function Sidebar({
  noticias,
  dominioFilter,
  lineaFilter,
  onDominioChange,
  onLineaChange,
}: SidebarProps) {
  const countByDominio = DOMINIOS_ORDER.reduce(
    (acc, key) => ({ ...acc, [key]: noticias.filter((n) => n.dominio === key).length }),
    {} as Record<Dominio, number>
  );

  const countByLinea = LINEAS.reduce(
    (acc, l) => ({
      ...acc,
      [l.key]: l.key === 'todas' ? noticias.length : noticias.filter((n) => n.linea_relacionada === l.key).length,
    }),
    {} as Record<string, number>
  );

  const hasFilters = dominioFilter !== null || lineaFilter !== null;

  return (
    <aside
      className="flex flex-col gap-0 h-full overflow-y-auto"
      style={{ background: '#08080e', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="px-4 py-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <LayoutGrid size={13} className="text-slate-500" />
            <span className="text-xs font-semibold uppercase tracking-widest text-slate-500">Filtros</span>
          </div>
          {hasFilters && (
            <button
              onClick={() => { onDominioChange(null); onLineaChange(null); }}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors"
            >
              <X size={11} />
              Limpiar
            </button>
          )}
        </div>

        {/* Domain filters */}
        <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2">Dominios</p>
        <nav className="space-y-0.5 mb-5">
          {DOMINIOS_ORDER.map((key) => {
            const d = DOMINIOS[key];
            const active = dominioFilter === key;
            const count = countByDominio[key] ?? 0;
            return (
              <button
                key={key}
                onClick={() => onDominioChange(active ? null : key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-all group"
                style={{
                  background: active ? `${d.color}18` : 'transparent',
                  color: active ? d.color : '#94a3b8',
                  border: active ? `1px solid ${d.color}30` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: d.color, opacity: active ? 1 : 0.5 }}
                  />
                  <span className="font-medium leading-tight">{d.label}</span>
                </div>
                {count > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded"
                    style={{
                      background: active ? `${d.color}25` : 'rgba(255,255,255,0.06)',
                      color: active ? d.color : '#64748b',
                    }}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Linea filters */}
        <p className="text-xs text-slate-600 uppercase tracking-widest font-medium mb-2">Línea</p>
        <nav className="space-y-0.5">
          {LINEAS.map((l) => {
            const active = l.key === 'todas' ? lineaFilter === null : lineaFilter === l.key;
            const count = countByLinea[l.key] ?? 0;
            return (
              <button
                key={l.key}
                onClick={() => onLineaChange(l.key === 'todas' ? null : l.key)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-md text-left text-xs transition-all"
                style={{
                  background: active ? `${l.color}15` : 'transparent',
                  color: active ? l.color : '#94a3b8',
                  border: active ? `1px solid ${l.color}25` : '1px solid transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ background: l.color, opacity: active ? 1 : 0.5 }}
                  />
                  {l.label}
                </div>
                {count > 0 && (
                  <span className="text-xs" style={{ color: '#475569' }}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
