// Supabase client configuration
// Project URL derived from connection string host: db.pmhhmyzjwlqnkjhsioju.supabase.co
const SUPABASE_URL = 'https://pmhhmyzjwlqnkjhsioju.supabase.co';

// Get this key from: Supabase Dashboard → Settings → API → Project API keys → "anon public"
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY_HERE';

if (SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
  console.warn(
    'Supabase: la clave API no está configurada. ' +
    'Obtén la clave "anon public" en Supabase Dashboard → Settings → API ' +
    'y actualiza SUPABASE_ANON_KEY en supabase.js. ' +
    'La aplicación funcionará usando solo almacenamiento local.'
  );
}

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
