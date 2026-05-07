'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Zap, Clock, Database, Loader2,
  CheckCircle2, XCircle, Circle,
  ChevronDown, RefreshCw,
} from 'lucide-react';
import { DominioProgress, Dominio } from '@/types';
import { DOMINIOS, DOMINIOS_ORDER } from '@/lib/domains';

interface HeaderProps {
  searching: boolean;
  searchMessage: string;
  progress: Record<Dominio, DominioProgress> | null;
  ultimaBusqueda: string | null;
  totalCount: number;
  onSearchOne: (dominio: Dominio) => void;
  onSearchAll: () => void;
}

// Only automatic domains appear in the picker (operaciones is manual)
const AUTO_DOMINIOS = DOMINIOS_ORDER.filter((k) => k !== 'operaciones');

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-PE', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function ProgressIcon({ status }: { status: DominioProgress['status'] }) {
  if (status === 'searching') return <Loader2 size={12} className="animate-spin text-yellow-400" />;
  if (status === 'done')      return <CheckCircle2 size={12} className="text-emerald-400" />;
  if (status === 'error')     return <XCircle size={12} className="text-red-400" />;
  return <Circle size={12} className="text-slate-600" />;
}

export default function Header({
  searching, searchMessage, progress,
  ultimaBusqueda, totalCount,
  onSearchOne, onSearchAll,
}: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Also close when a search starts
  useEffect(() => {
    if (searching) setIsOpen(false);
  }, [searching]);

  return (
    <header
      className="sticky top-0 z-50 border-b"
      style={{ background: '#08080e', borderColor: 'rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-center justify-between px-6 py-3 gap-4">
        {/* Logo */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #a78bfa, #38bdf8)' }}
          >
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight tracking-tight">
              AJE Intelligence
            </h1>
            <p className="text-xs" style={{ color: '#475569' }}>
              Inteligencia estratégica del entorno
            </p>
          </div>
        </div>

        {/* Meta info */}
        <div className="flex items-center gap-6 text-xs" style={{ color: '#64748b' }}>
          {ultimaBusqueda && (
            <span className="flex items-center gap-1.5">
              <Clock size={12} />
              Última búsqueda: {formatDate(ultimaBusqueda)}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Database size={12} />
            <span className="text-white font-medium">{totalCount}</span> señales
          </span>
        </div>

        {/* Dropdown trigger */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            onClick={() => { if (!searching) setIsOpen((o) => !o); }}
            disabled={searching}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              background: searching
                ? 'rgba(167,139,250,0.15)'
                : 'linear-gradient(135deg, #a78bfa, #38bdf8)',
              color: searching ? '#a78bfa' : '#fff',
              border: searching ? '1px solid rgba(167,139,250,0.3)' : 'none',
            }}
          >
            {searching ? (
              <>
                <Loader2 size={14} className="animate-spin flex-shrink-0" />
                <span className="truncate max-w-[220px]">
                  {searchMessage || 'Buscando...'}
                </span>
              </>
            ) : (
              <>
                <Zap size={14} />
                Buscar señales hoy
                <ChevronDown
                  size={14}
                  className="transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                />
              </>
            )}
          </button>

          {/* Dropdown menu */}
          {isOpen && !searching && (
            <div
              className="absolute right-0 top-full mt-2 w-64 rounded-xl overflow-hidden z-50"
              style={{
                background: '#111118',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 24px 48px rgba(0,0,0,0.7)',
              }}
            >
              {/* Header */}
              <div
                className="px-3 py-2.5"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
              >
                <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: '#475569' }}>
                  Seleccionar dominio
                </p>
              </div>

              {/* Individual domain options */}
              <div className="py-1">
                {AUTO_DOMINIOS.map((key) => {
                  const d = DOMINIOS[key];
                  return (
                    <button
                      key={key}
                      onClick={() => { onSearchOne(key); setIsOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-all"
                      style={{ color: '#94a3b8', background: 'transparent' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${d.color}10`;
                        e.currentTarget.style.color = d.color;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = '#94a3b8';
                      }}
                    >
                      <span
                        className="w-2 h-2 rounded-full flex-shrink-0"
                        style={{ background: d.color }}
                      />
                      <span className="flex-1 leading-tight">{d.number}. {d.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Separator + Search all */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }} className="py-1">
                <button
                  onClick={() => { onSearchAll(); setIsOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm transition-all"
                  style={{ color: '#94a3b8', background: 'transparent' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(167,139,250,0.1)';
                    e.currentTarget.style.color = '#a78bfa';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#94a3b8';
                  }}
                >
                  <RefreshCw size={13} className="flex-shrink-0" />
                  <span className="flex-1">Buscar todos</span>
                  <span className="text-xs" style={{ color: '#475569' }}>
                    {AUTO_DOMINIOS.length}/8 dominios
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Progress strip — only shown during "Buscar todos" */}
      {searching && progress && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-center gap-1 px-6 py-2 overflow-x-auto">
            {DOMINIOS_ORDER.map((key) => {
              const d = DOMINIOS[key];
              const p = progress[key];
              const isActive = p?.status === 'searching';
              const isDone   = p?.status === 'done';
              const isError  = p?.status === 'error';
              return (
                <div
                  key={key}
                  className="flex items-center gap-1.5 text-xs whitespace-nowrap px-2.5 py-1 rounded-full transition-all"
                  style={{
                    background: isActive ? `${d.color}20` : isDone ? `${d.color}10` : 'rgba(255,255,255,0.03)',
                    color: isActive ? d.color : isDone ? `${d.color}cc` : isError ? '#f87171' : '#334155',
                    border: isActive ? `1px solid ${d.color}40` : '1px solid transparent',
                  }}
                >
                  <ProgressIcon status={p?.status ?? 'pending'} />
                  <span>{d.label}</span>
                  {isDone && p.count > 0 && <span className="font-semibold">+{p.count}</span>}
                </div>
              );
            })}
          </div>

          {/* Progress bar */}
          {(() => {
            const done = DOMINIOS_ORDER.filter(
              (k) => progress[k]?.status === 'done' || progress[k]?.status === 'error'
            ).length;
            return (
              <div className="h-0.5 w-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <div
                  className="h-0.5 transition-all duration-500"
                  style={{
                    width: `${Math.round((done / DOMINIOS_ORDER.length) * 100)}%`,
                    background: 'linear-gradient(90deg, #a78bfa, #38bdf8)',
                  }}
                />
              </div>
            );
          })()}
        </div>
      )}
    </header>
  );
}
