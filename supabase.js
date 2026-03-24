// Supabase client configuration
// Project URL derived from connection string host: db.pmhhmyzjwlqnkjhsioju.supabase.co
const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://pmhhmyzjwlqnkjhsioju.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
};

let supabaseClient = null;

window.supabaseConfigReady = (async () => {
  let localConfig = {};

  try {
    const response = await fetch('config.local.json', { cache: 'no-store' });
    if (response.ok) {
      localConfig = await response.json();
    }
  } catch (error) {
    // Ignore missing local config and continue with the built-in fallback.
  }

  const supabaseConfig = {
    ...DEFAULT_SUPABASE_CONFIG,
    ...(window.SUPABASE_CONFIG || {}),
    ...localConfig
  };

  if (!window.supabase || typeof window.supabase.createClient !== 'function') {
    console.warn(
      'Supabase: no se pudo cargar la librería de cliente. ' +
      'La aplicación funcionará usando solo almacenamiento local.'
    );
    return;
  }

  if (supabaseConfig.anonKey === DEFAULT_SUPABASE_CONFIG.anonKey) {
    console.warn(
      'Supabase: falta config.local.json con la clave "anon public". ' +
      'Copia config.example.json a config.local.json y añade solo la clave pública anon. ' +
      'La aplicación funcionará usando solo almacenamiento local.'
    );
    return;
  }

  const { createClient } = supabase;
  supabaseClient = createClient(supabaseConfig.url, supabaseConfig.anonKey);
})();
