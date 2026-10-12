import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Search, Menu, Sparkles, TrendingUp, ArrowRight, Clock } from 'lucide-react';

// Forzar renderizado dinámico para evitar errores de pre-render en Vercel
export const instant = false;

export default async function Home() {
  const { data: articles } = await supabase
    .from('articles')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(10);

  const hero = articles?.[0];
  const sideArticleLeft = articles?.[1];
  const sideArticleRight = articles?.[2];
  const moreArticles = articles?.slice(3) || [];

  const today = new Date().toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Imagen de respaldo si el artículo no tiene una directa
  const fallbackImage = (cat?: string) => {
    if (cat === 'Astronomía') return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80';
    if (cat === 'Cultura' || cat === 'Arqueología') return 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80';
    if (cat === 'Tecnología') return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80';
    return 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'; // Naturaleza/Ciencia
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans antialiased">
      {/* 1. Barra Superior */}
      <div className="border-b border-neutral-200 bg-white text-xs text-neutral-500 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span className="capitalize">{today}</span>
          <div className="flex items-center space-x-6 font-medium">
            <span className="text-emerald-600 flex items-center gap-1.5 font-semibold">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              EDICIÓN DIGITAL ACTUALIZADA
            </span>
            <span className="hidden md:inline hover:underline cursor-pointer">Boletín Diario</span>
          </div>
        </div>
      </div>

      {/* 2. Cabecera Principal */}
      <header className="border-b border-neutral-900 py-6 px-4 bg-white">
        <div className="max-w-7xl mx-auto text-center relative">
          <Link href="/">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-black tracking-tighter uppercase text-neutral-950 hover:opacity-90 transition">
              Ciencia y Cultura
            </h1>
          </Link>
          <p className="text-[11px] md:text-xs uppercase tracking-[0.25em] text-neutral-600 mt-2 font-medium">
            El diario de descubrimientos, astronomía y pensamiento humano
          </p>
        </div>
      </header>

      {/* 3. Menú */}
      <nav className="border-b border-neutral-200 bg-white sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-12 text-sm font-bold uppercase tracking-wider text-neutral-800">
          <div className="flex items-center space-x-6 overflow-x-auto py-2">
            <Link href="/" className="bg-neutral-950 text-white px-3 py-1 rounded text-xs hover:bg-neutral-800">
              Lo Último
            </Link>
            <span className="hover:text-amber-600 cursor-pointer">Ciencia</span>
            <span className="hover:text-amber-600 cursor-pointer">Astronomía</span>
            <span className="hover:text-amber-600 cursor-pointer">Naturaleza</span>
            <span className="hover:text-amber-600 cursor-pointer">Cultura</span>
            <span className="hover:text-amber-600 cursor-pointer">Tecnología</span>
          </div>
          <div className="flex items-center space-x-3 text-neutral-600">
            <Search className="w-4 h-4 cursor-pointer hover:text-black" />
            <Menu className="w-5 h-5 cursor-pointer hover:text-black md:hidden" />
          </div>
        </div>
      </nav>

      {/* 4. Franja de Destacados */}
      <div className="bg-[#FFB703] text-neutral-950 font-bold text-xs uppercase tracking-widest py-2 px-4 border-b border-amber-400">
        <div className="max-w-7xl mx-auto flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          <span className="font-black">Destacados:</span>
          <span className="font-medium normal-case truncate">
            Hallazgos biológicos • Exploración espacial • Investigaciones antropológicas del mes
          </span>
        </div>
      </div>

      {/* 5. Grilla Periodística */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {hero ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 border-b border-neutral-300">
            
            {/* Noticia Izquierda */}
            <div className="lg:col-span-3 space-y-6 lg:border-r lg:border-neutral-200 lg:pr-6">
              {sideArticleLeft ? (
                <Link href={`/article/${sideArticleLeft.slug}`} className="group block">
                  <article>
                    <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 relative bg-neutral-100">
                      <img
                        src={sideArticleLeft.image_url || fallbackImage(sideArticleLeft.category)}
                        alt={sideArticleLeft.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                      {sideArticleLeft.category}
                    </span>
                    <h3 className="font-serif font-bold text-lg leading-tight mt-1 group-hover:text-amber-600 transition">
                      {sideArticleLeft.title}
                    </h3>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-3 leading-relaxed">
                      {sideArticleLeft.summary}
                    </p>
                  </article>
                </Link>
              ) : (
                <div className="p-6 bg-neutral-50 rounded-lg text-xs text-neutral-500 border border-dashed">
                  Ejecuta el agente para rellenar esta columna.
                </div>
              )}
            </div>

            {/* NOTICIA PRINCIPAL (HERO) */}
            <div className="lg:col-span-6">
              <Link href={`/article/${hero.slug}`} className="group block">
                <article>
                  <div className="aspect-[16/9] rounded-xl overflow-hidden mb-4 relative shadow-sm bg-neutral-200">
                    <img
                      src={hero.image_url || fallbackImage(hero.category)}
                      alt={hero.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-700"
                    />
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-amber-500 text-black font-black text-[10px] uppercase px-2 py-1 rounded shadow">
                        Portada del Día
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-neutral-900 border-l-4 border-amber-500 pl-2">
                    {hero.category}
                  </span>
                  <h2 className="font-serif font-black text-2xl md:text-4xl leading-tight mt-2 text-neutral-950 group-hover:text-amber-700 transition">
                    {hero.title}
                  </h2>
                  <p className="text-neutral-700 text-base md:text-lg leading-relaxed mt-3">
                    {hero.summary}
                  </p>
                  <div className="flex items-center gap-1 text-xs font-bold text-neutral-900 mt-4 group-hover:translate-x-1 transition">
                    Leer reportaje completo <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </article>
              </Link>
            </div>

            {/* Noticia Derecha + Publicidad */}
            <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-neutral-200 lg:pl-6">
              {sideArticleRight && (
                <Link href={`/article/${sideArticleRight.slug}`} className="group block pb-6 border-b border-neutral-200">
                  <article>
                    <div className="aspect-[16/10] rounded-lg overflow-hidden mb-2 bg-neutral-100">
                      <img
                        src={sideArticleRight.image_url || fallbackImage(sideArticleRight.category)}
                        alt={sideArticleRight.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-amber-600">
                      {sideArticleRight.category}
                    </span>
                    <h3 className="font-serif font-bold text-base leading-tight mt-1 group-hover:text-amber-600 transition">
                      {sideArticleRight.title}
                    </h3>
                  </article>
                </Link>
              )}

              {/* ANUNCIO PATROCINADO */}
              <div className="border border-neutral-200 bg-white rounded-xl p-4 text-center shadow-sm">
                <span className="text-[10px] uppercase tracking-widest font-bold text-neutral-400 block mb-2">
                  Espacio Patrocinado
                </span>
                <div className="aspect-[4/5] bg-gradient-to-br from-amber-400 to-amber-500 rounded-lg flex flex-col items-center justify-center p-4 text-neutral-950 shadow-inner">
                  <Sparkles className="w-8 h-8 mb-2" />
                  <p className="font-black text-lg leading-snug">Tu Anuncio Aquí</p>
                  <p className="text-xs mt-1 opacity-90">Google AdSense / Anunciantes</p>
                </div>
              </div>
            </div>

          </div>
        ) : (
          <div className="text-center py-24 text-neutral-500">Cargando noticias...</div>
        )}

        {/* 6. Más Noticias (Grilla Inferior) */}
        {moreArticles.length > 0 && (
          <div className="pt-10">
            <h3 className="font-serif font-black text-xl uppercase tracking-wider mb-6 border-b-2 border-neutral-900 pb-2">
              Edición Continua
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {moreArticles.map((art) => (
                <Link key={art.id} href={`/article/${art.slug}`} className="group block">
                  <article>
                    <div className="aspect-[16/10] rounded-lg overflow-hidden mb-3 bg-neutral-100">
                      <img
                        src={art.image_url || fallbackImage(art.category)}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase text-amber-600 tracking-wider">
                      {art.category}
                    </span>
                    <h4 className="font-serif font-bold text-base mt-1 group-hover:text-amber-600 transition leading-snug">
                      {art.title}
                    </h4>
                    <p className="text-xs text-neutral-600 mt-2 line-clamp-2 leading-relaxed">
                      {art.summary}
                    </p>
                  </article>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="border-t border-neutral-300 bg-neutral-100 py-10 mt-12 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-serif font-bold text-neutral-900 text-sm">
            CIENCIA Y CULTURA © 2026
          </p>
          <p>Portal periodístico autónomo con IA y fuentes científicas verificadas.</p>
        </div>
      </footer>
    </div>
  );
}