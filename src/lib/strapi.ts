import qs from 'qs';

interface Props {
  endpoint: string;
  query?: Record<string, any>;
  wrappedByKey?: string;
  wrappedByList?: boolean;
}

/**
 * Función para pedir datos a Strapi
 */
export default async function fetchApi<T>({
  endpoint,
  query,
  wrappedByKey,
  wrappedByList,
}: Props): Promise<T> {
  
  if (endpoint.startsWith('/')) {
    endpoint = endpoint.slice(1);
  }

  // 1. DETECTAR URL BASE (Nube o Local)
  // Si existe la variable de entorno (en Netlify), la usa. Si no, usa tu IP local.
  const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

  // 2. CREAR LA URL (Aquí definimos la variable 'url' que te estaba fallando)
  const url = new URL(`${STRAPI_URL}/api/${endpoint}`);

  // 3. AÑADIR PARÁMETROS (Query)
  if (query) {
    const q = qs.stringify(query);
    url.search = q;
  }

  // 4. HACER LA PETICIÓN
  const res = await fetch(url.toString()); // Aquí es donde fallaba si 'url' no existía arriba
  
  // Gestión de errores básica por si Strapi está apagado
  if (!res.ok) {
    throw new Error(`Error fetching ${url.toString()}: ${res.statusText}`);
  }

  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data.data as T;
}