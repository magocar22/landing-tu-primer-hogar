// src/lib/strapi.ts
import qs from "qs";

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
  if (endpoint.startsWith("/")) {
    endpoint = endpoint.slice(1);
  }

  // Si existe la variable de entorno (en la nube), úsala. Si no, usa localhost.
  const STRAPI_URL = import.meta.env.PUBLIC_STRAPI_URL || "http://127.0.0.1:1337";

  if (query) {
    const q = qs.stringify(query);
    url.search = q;
  }

  const res = await fetch(url.toString());
  let data = await res.json();

  if (wrappedByKey) {
    data = data[wrappedByKey];
  }

  if (wrappedByList) {
    data = data[0];
  }

  return data.data as T;
}
