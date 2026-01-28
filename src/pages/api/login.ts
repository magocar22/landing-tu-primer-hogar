// src/pages/api/login.ts
import type { APIRoute } from 'astro';
import { WP_URL } from '../../lib/wordpress'; // Importamos la URL centralizada

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const data = await request.json();
    const { identifier, password } = data; // 'identifier' es el username o email

    if (!identifier || !password) {
      return new Response(JSON.stringify({ message: "Faltan datos" }), { status: 400 });
    }

    // Limpiamos la URL base
    const baseUrl = WP_URL.replace(/\/$/, '');
    
    // 1. Petición al WordPress (Plugin JWT Auth)
    const wpRes = await fetch(`${baseUrl}/wp-json/jwt-auth/v1/token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: identifier,
        password: password
      }),
    });

    const wpData = await wpRes.json();

    // 2. Validación de respuesta
    // El plugin suele devolver statusCode 200 si es OK, o 403/401 si falla
    if (!wpRes.ok || !wpData.token) {
      return new Response(JSON.stringify({ 
        message: wpData.message || "Usuario o contraseña incorrectos" 
      }), { status: 401 });
    }

    // 3. Configuración de Cookies
    // Importante: En local (HTTP) 'secure' debe ser false. En Prod (HTTPS) true.
    const isProd = import.meta.env.PROD; 

    // Cookie del Token (HttpOnly por seguridad, el JS del navegador no la ve)
    cookies.set("wp_jwt", wpData.token, {
      path: "/",
      httpOnly: true,
      secure: isProd, 
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 semana
    });

    // Cookie del Nombre (Para mostrar "Hola, usuario en la UI")
    cookies.set("wp_user_display", wpData.user_display_name, {
      path: "/",
      httpOnly: false, // Esta sí la puede leer el JS para la UI
      secure: isProd,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);
    return new Response(JSON.stringify({ message: "Error interno de conexión" }), { status: 500 });
  }
};