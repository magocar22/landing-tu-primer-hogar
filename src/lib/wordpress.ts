// src/lib/wordpress.ts

// 1. CAMBIO IMPORTANTE:
// Intentamos leer la variable de entorno. Si no existe (ej. desarrollo local sin .env), usa localhost como respaldo.
const ENV_URL = import.meta.env.PUBLIC_WP_URL;
// Aseguramos que no tenga barra al final para evitar errores de doble //
const BASE = ENV_URL ? ENV_URL.replace(/\/$/, "") : "http://localhost/tph-backend";

interface WPFetchOptions {
  endpoint: string;
  params?: Record<string, string>;
}

export async function fetchWP<T>({ endpoint, params }: WPFetchOptions): Promise<T> {
  // 2. Usamos la variable BASE que ya contiene la URL correcta (Railway o Localhost)
  const url = new URL(`${BASE}/wp-json/wp/v2/${endpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.append(key, value);
    });
  }

  // Truco Pro: Añadimos '_embed' para que WP nos mande la foto destacada y autor en la misma petición
  if (!url.searchParams.has('_embed')) {
      url.searchParams.append('_embed', 'true');
  }

  console.log(`📡 Fetching: ${url.toString()}`); // Log para ver qué está pidiendo

  const res = await fetch(url.toString());
  
  if (!res.ok) {
    console.error(`Error fetching WP: ${url.toString()}`);
    throw new Error(`Error fetching WP: ${res.statusText}`);
  }

  return await res.json();
}