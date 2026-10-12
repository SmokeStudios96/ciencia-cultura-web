import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Clock, Share2, Sparkles } from 'lucide-react';

// Forzar renderizado dinámico para evitar errores de pre-render en Vercel
export const dynamic = 'force-dynamic';

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { data: article } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!article) return notFound();

  const { data: related } = await supabase
    .from('articles')
    .select('id, title, slug, category, image_url')
    .neq('slug', slug)
    .limit(4);

  const fallbackImg = article.image_url || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80';

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 antialiased font-sans">
      <header className="border-b border-neutral-200 bg-white py-4 px-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-serif font-black text-2xl tracking-tighter uppercase">
            Ciencia y Cultura
          </Link>
          <Link
            href="/"
            className="inline-flex items-center text-xs font-bold text-neutral-600 hover:text-amber-600 transition gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Volver a Portada
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <article className="lg:col-span-8">
            <span className="inline-block bg-neutral-950 text-white font-mono text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-3">
              {article.category}
            </span>

            <h1 className="font-serif font-black text-3xl md:text-5xl leading-tight text-neutral-950 mb-4">
              {article.title}
            </h1>

            <p className="text-lg md:text-xl font-medium text-neutral-600 leading-relaxed pb-6 border-b border-neutral-200">
              {article.summary}
            </p>

            <div className="flex items-center justify-between text-xs text-neutral-500 py-3 border-b border-neutral-200 mb-8">
              <span className="flex items-center gap-1.5 font-medium">
                <Clock className="w-3.5 h-3.5" />
                Publicado el {new Date(article.created_at).toLocaleDateString('es-CL', { dateStyle: 'long' })}
              </span>
              <button className="flex items-center gap-1 font-bold text-neutral-700 hover:text-black">
                <Share2 className="w-3.5 h-3.5" /> Compartir
              </button>
            </div>

            {/* FOTOGRAFÍA EDITORIAL REAL */}
            <div className="rounded-xl overflow-hidden mb-8 shadow-sm">
              <img
                src={fallbackImg}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
              <p className="text-[11px] text-neutral-500 mt-2 italic px-1">
                Fotografía documental de archivo referencial para Ciencia y Cultura.
              </p>
            </div>

            {/* Contenido */}
            <div className="prose prose-neutral max-w-none text-neutral-800 text-lg leading-relaxed space-y-5 whitespace-pre-line font-serif">
              {article.content}
            </div>

            {article.source_url && (
              <div className="mt-12 p-4 bg-neutral-100 rounded-lg text-xs text-neutral-600 font-sans border border-neutral-200">
                <span className="font-bold block text-neutral-800 mb-1">Fuente citada:</span>
                <a
                  href={article.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-amber-700 underline break-all hover:text-amber-900"
                >
                  {article.source_url}
                </a>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-8">
            <div className="sticky top-20">
              <div className="border border-neutral-200 bg-white rounded-xl p-4 shadow-sm mb-6 text-center">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 block mb-2">
                  Publicidad
                </span>
                <div className="aspect-square bg-gradient-to-tr from-amber-500 to-amber-400 rounded-lg flex flex-col items-center justify-center p-6 text-neutral-950">
                  <Sparkles className="w-10 h-10 mb-3" />
                  <h4 className="font-black text-xl uppercase tracking-tight">Espacio Premium</h4>
                  <p className="text-xs mt-1 font-medium text-neutral-900">
                    Banner publicitario disponible para anunciantes directos o AdSense.
                  </p>
                </div>
              </div>

              {related && related.length > 0 && (
                <div className="border-t-2 border-neutral-900 pt-4">
                  <h3 className="font-serif font-black text-sm uppercase tracking-wider mb-4">
                    Más Leídos en esta Edición
                  </h3>
                  <div className="space-y-4">
                    {related.map((item) => (
                      <Link key={item.id} href={`/article/${item.slug}`} className="group block">
                        <span className="text-[10px] font-black uppercase text-amber-600">
                          {item.category}
                        </span>
                        <h4 className="font-serif font-bold text-sm leading-snug group-hover:text-amber-600 transition">
                          {item.title}
                        </h4>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}