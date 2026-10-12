import os
import re
import urllib.request
import xml.etree.ElementTree as ET
from typing import Optional
from pydantic import BaseModel, Field
from agno.agent import Agent
from agno.models.google import Gemini
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not GOOGLE_API_KEY or not SUPABASE_URL or not SUPABASE_SERVICE_ROLE_KEY:
    raise ValueError("⚠️ Faltan variables en .env")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

class NewsArticle(BaseModel):
    title: str = Field(description="Título periodístico en español")
    summary: str = Field(description="Resumen de 2 a 3 líneas")
    content: str = Field(description="Cuerpo de la noticia de 400+ palabras en párrafos claros")
    category: str = Field(description="'Ciencia', 'Astronomía', 'Cultura', 'Naturaleza' o 'Tecnología'")
    source_url: Optional[str] = Field(description="Enlace original")
    image_url: Optional[str] = Field(description="URL de fotografía real en alta resolución")

def slugify(text: str) -> str:
    cleaned = str(text).lower()
    cleaned = re.sub(r'[^\w\s-]', '', cleaned)
    return re.sub(r'[-\s]+', '-', cleaned).strip('-')

# Asignar fotografías reales en HD según la temática
def assign_image(category: str, title: str) -> str:
    t = title.lower()
    if 'espacio' in t or 'telescopio' in t or 'planeta' in t or 'estrella' in t or category == 'Astronomía':
        return 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80'
    if 'animal' in t or 'selva' in t or 'especie' in t or 'bosque' in t or category == 'Naturaleza':
        return 'https://images.unsplash.com/photo-1534567153574-2b12153a87f0?auto=format&fit=crop&w=1200&q=80'
    if 'fósil' in t or 'arqueología' in t or 'historia' in t or category == 'Cultura':
        return 'https://images.unsplash.com/photo-1544967082-d9d25d867d66?auto=format&fit=crop&w=1200&q=80'
    if 'ia' in t or 'computador' in t or 'robot' in t or category == 'Tecnología':
        return 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80'
    return 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80'

def fetch_top_items():
    url = "https://feeds.bbci.co.uk/news/science_and_environment/rss.xml"
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=10) as response:
        xml_data = response.read()
    root = ET.fromstring(xml_data)
    
    items = []
    for item in root.findall('.//item')[:4]:
        title = item.find('title').text if item.find('title') is not None else ""
        desc = item.find('description').text if item.find('description') is not None else ""
        link = item.find('link').text if item.find('link') is not None else ""
        items.append({"title": title, "desc": desc, "link": link})
    return items

news_agent = Agent(
    model=Gemini(id="gemini-3.5-flash-lite", api_key=GOOGLE_API_KEY),
    description="Periodista científico principal del diario 'Ciencia y Cultura'.",
    instructions=[
        "Redacta un reportaje periodístico en español neutro basado en el titular y resumen recibido.",
        "Asegúrate de que sea profundo, con formato limpio y tono periodístico de prestigio.",
        "Devuelve únicamente la estructura requerida."
    ],
    output_schema=NewsArticle
)

def run_automation():
    items = fetch_top_items()
    print(f"🛰️ Se encontraron {len(items)} noticias. Comenzando redacción en lote...")

    for i, it in enumerate(items, 1):
        print(f"\n[{i}/{len(items)}] ✍️ Redactando: {it['title']}...")
        prompt = f"Titular: {it['title']}\nResumen: {it['desc']}\nFuente: {it['link']}"
        response = news_agent.run(prompt)

        if isinstance(response.content, NewsArticle):
            art: NewsArticle = response.content
            image = assign_image(art.category, art.title)
            slug = f"{slugify(art.title)}-{int(os.times().system * 100) + i}"

            data = {
                "title": art.title,
                "slug": slug,
                "summary": art.summary,
                "content": art.content,
                "category": art.category,
                "source_url": it['link'],
                "image_url": image
            }
            supabase.table("articles").insert(data).execute()
            print(f"✅ Noticia '{art.title[:40]}...' guardada con fotografía.")
        else:
            print("⚠️ No se pudo formatear.")

if __name__ == "__main__":
    run_automation()