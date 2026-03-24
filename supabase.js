// Supabase client configuration
// Project URL derived from connection string host: db.pmhhmyzjwlqnkjhsioju.supabase.co
const SUPABASE_URL = window.SUPABASE_CONFIG?.url || 'https://pmhhmyzjwlqnkjhsioju.supabase.co';

// Get this key from: Supabase Dashboard → Settings → API → Project API keys → "anon public"
const SUPABASE_ANON_KEY = window.SUPABASE_CONFIG?.anonKey || 'YOUR_SUPABASE_ANON_KEY_HERE';

let supabaseClient = null;

if (!window.supabase || typeof window.supabase.createClient !== 'function') {
  console.warn(
    'Supabase: no se pudo cargar la librería de cliente. ' +
    'La aplicación funcionará usando solo almacenamiento local.'
  );
} else if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn(
    'Supabase: falta config.local.js con la clave "anon public". ' +
    'Copia config.example.js a config.local.js y añade solo la clave pública anon. ' +
    'La aplicación funcionará usando solo almacenamiento local.'
  );
} else {
  const { createClient } = supabase;
  supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}
