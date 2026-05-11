import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Dominio, LineaRelacionada, Relevancia } from '@/types';
import { DOMINIOS } from '@/lib/domains';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, resumen, fuente, url, dominio, linea_relacionada, relevancia } = body;

    if (!titulo?.trim() || !resumen?.trim()) {
      return NextResponse.json({ error: 'Título y resumen son obligatorios' }, { status: 400 });
    }

    const validLineas: LineaRelacionada[] = ['aje', 'toquea', 't3a', 'ventures', 'todas'];
    const validRelevancias: Relevancia[] = ['alta', 'media', 'baja'];

    let sanitizedUrl: string | null = null;
    if (url?.trim()) {
      try { sanitizedUrl = new URL(url.trim()).href; } catch {}
    }

    const { error } = await supabase.from('noticias').insert({
      titulo: titulo.trim().slice(0, 300),
      resumen: resumen.trim().slice(0, 2000),
      fuente: (fuente || 'Manual').trim().slice(0, 200),
      url: sanitizedUrl,
      dominio: (dominio && DOMINIOS[dominio as Dominio]) ? (dominio as Dominio) : 'operaciones',
      linea_relacionada: validLineas.includes(linea_relacionada) ? linea_relacionada : 'todas',
      relevancia: validRelevancias.includes(relevancia) ? relevancia : 'media',
      es_manual: true,
    });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ error: 'Error al guardar', detail: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'ID requerido' }, { status: 400 });

    const { error } = await supabase.from('noticias').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Error desconocido' },
      { status: 500 }
    );
  }
}
