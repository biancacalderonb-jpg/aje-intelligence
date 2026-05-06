import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@supabase/supabase-js';
import { DOMINIOS } from '@/lib/domains';
import { Dominio, LineaRelacionada, Relevancia } from '@/types';

export const maxDuration = 120;

const hoy = new Date().toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });
const ayer = new Date(Date.now() - 86400000).toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' });

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface NoticiaRaw {
  titulo?: string;
  resumen?: string;
  fuente?: string;
  url?: string;
  relevancia?: string;
}

function extractNoticias(text: string): NoticiaRaw[] {
  const cleaned = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

  // Try full JSON object with noticias key
  const objMatch = cleaned.match(/\{[\s\S]*?"noticias"\s*:\s*(\[[\s\S]*?\])\s*\}/);
  if (objMatch) {
    try {
      return JSON.parse(objMatch[0]).noticias ?? [];
    } catch {}
  }

  // Try standalone array
  const arrMatch = cleaned.match(/\[[\s\S]*?\]/);
  if (arrMatch) {
    try {
      return JSON.parse(arrMatch[0]);
    } catch {}
  }

  // Try parsing the whole thing
  try {
    const parsed = JSON.parse(cleaned);
    if (parsed?.noticias && Array.isArray(parsed.noticias)) return parsed.noticias;
    if (Array.isArray(parsed)) return parsed;
  } catch {}

  return [];
}

function inferLinea(titulo: string, resumen: string): LineaRelacionada {
  const text = `${titulo} ${resumen}`.toLowerCase();
  if (text.includes('toquea') || (text.includes('fintech') && text.includes('aje'))) return 'toquea';
  if (text.includes('tiendas 3a') || text.includes('t3a') || text.includes('3a aje')) return 't3a';
  if (text.includes('aje group') || text.includes('big cola') || text.includes('cielo agua')) return 'aje';
  if (text.includes('new venture') || text.includes('nueva empresa') || text.includes('spin-off')) return 'ventures';
  return 'todas';
}

function sanitizeRelevancia(r?: string): Relevancia {
  if (r === 'alta' || r === 'media' || r === 'baja') return r;
  return 'media';
}

function sanitizeUrl(u?: string): string | null {
  if (!u || u === 'null' || u.trim() === '') return null;
  try {
    const parsed = new URL(u.trim());
    return parsed.href;
  } catch {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const dominioKey = body.dominio as Dominio;

    if (!dominioKey || !DOMINIOS[dominioKey]) {
      return NextResponse.json({ error: 'Dominio inválido' }, { status: 400 });
    }

    const dominio = DOMINIOS[dominioKey];

    const prompt = `Eres un analista de inteligencia estratégica para una consultoría que trabaja con AJE Group (empresa líder de bebidas y consumo masivo en Latinoamérica).

IMPORTANTE: Solo busca y reporta noticias publicadas entre ${ayer} y ${hoy} (últimas 24 horas). Si una noticia es más antigua, ignórala completamente. Incluye la fecha de publicación en cada resultado.

DOMINIO DE ANÁLISIS: ${dominio.label}
DESCRIPCIÓN: ${dominio.descripcion}

TAREA: Realiza búsquedas web con estas consultas exactas y encuentra señales estratégicas relevantes:
${dominio.queries.map((q, i) => `${i + 1}. "${q} 2026 últimas 24 horas"`).join('\n')}

FUENTES PRIORITARIAS: ${dominio.fuentes}

CRITERIOS DE SELECCIÓN:
- SOLO noticias de las últimas 24 horas (entre ${ayer} y ${hoy})
- Busca señales de CAMBIO, no noticias genéricas
- Relevancia ALTA: disrupciones significativas, regulaciones nuevas con impacto directo, movimientos competitivos relevantes
- Relevancia MEDIA: tendencias emergentes, cambios de comportamiento, novedades tecnológicas
- Relevancia BAJA: contexto general, información de fondo
- Incluye entre 3 y 5 señales concretas

RESPONDE ÚNICAMENTE con este JSON (sin markdown, sin texto antes ni después, solo el objeto):
{
  "noticias": [
    {
      "titulo": "Título conciso que describe la señal estratégica",
      "resumen": "2-3 oraciones: qué ocurrió (con fecha de publicación), datos concretos si los hay, y por qué importa estratégicamente para una empresa de bebidas y consumo masivo en Latam",
      "fuente": "Nombre del medio o fuente específica",
      "url": "https://url-completa-del-articulo.com (si está disponible, si no omitir o null)",
      "relevancia": "alta|media|baja"
    }
  ]
}`;

    // max_uses: 1 — one web search per domain call, stays within Vercel Hobby's 10s limit
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const tools: any[] = [{ type: 'web_search_20250305', name: 'web_search', max_uses: 1 }];

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-7',
      max_tokens: 4000,
      tools,
      messages: [{ role: 'user', content: prompt }],
    });

    const textContent = response.content
      .filter((b) => b.type === 'text')
      .map((b) => (b as Anthropic.TextBlock).text)
      .join('');

    const rawNoticias = extractNoticias(textContent);

    if (rawNoticias.length === 0) {
      return NextResponse.json({ success: true, count: 0, message: 'Sin señales encontradas' });
    }

    const toInsert = rawNoticias.map((n) => ({
      titulo: n.titulo?.slice(0, 300) || 'Sin título',
      resumen: n.resumen?.slice(0, 2000) || 'Sin resumen',
      fuente: n.fuente?.slice(0, 200) || 'Desconocida',
      url: sanitizeUrl(n.url),
      dominio: dominioKey,
      linea_relacionada: inferLinea(n.titulo || '', n.resumen || ''),
      relevancia: sanitizeRelevancia(n.relevancia),
      es_manual: false,
    }));

    const { error: dbError } = await supabase.from('noticias').insert(toInsert);

    if (dbError) {
      console.error('Supabase insert error:', dbError);
      return NextResponse.json({ error: 'Error al guardar en base de datos', detail: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, count: toInsert.length });
  } catch (err) {
    console.error('Error en /api/buscar:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
