// Supabase client configuration
// Project URL derived from connection string host: db.pmhhmyzjwlqnkjhsioju.supabase.co
const ANON_KEY_PLACEHOLDER = 'PON_AQUI_LA_CLAVE_ANON_PUBLIC';

const DEFAULT_SUPABASE_CONFIG = {
  url: 'https://pmhhmyzjwlqnkjhsioju.supabase.co',
  anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'
};

let supabaseClient = null;

function createSupabaseRestClient({ url, anonKey }) {
  const baseUrl = `${url.replace(/\/$/, '')}/rest/v1`;
  const baseHeaders = {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`
  };

  async function parseResponse(response) {
    let data = null;
    let error = null;

    const text = await response.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch (parseError) {
        error = {
          message: 'Respuesta inválida de Supabase',
          details: parseError.message
        };
      }
    }

    if (!response.ok) {
      error = data || {
        message: `Error HTTP ${response.status}`,
        details: response.statusText
      };
      data = null;
    }

    return { data, error };
  }

  async function request(url, options) {
    try {
      const response = await fetch(url, options);
      return await parseResponse(response);
    } catch (fetchError) {
      return {
        data: null,
        error: {
          message: 'No se pudo conectar con Supabase',
          details: fetchError.message
        }
      };
    }
  }

  return {
    from(table) {
      return {
        upsert(payload) {
          return request(`${baseUrl}/${table}?on_conflict=id`, {
            method: 'POST',
            headers: {
              ...baseHeaders,
              'Content-Type': 'application/json',
              Prefer: 'resolution=merge-duplicates,return=representation'
            },
            body: JSON.stringify(payload)
          });
        },
        select(columns) {
          const params = new URLSearchParams({ select: columns });

          return {
            eq(column, value) {
              params.set(column, `eq.${value}`);

              return {
                async single() {
                  const { data, error } = await request(`${baseUrl}/${table}?${params.toString()}`, {
                    headers: {
                      ...baseHeaders,
                      Accept: 'application/json'
                    }
                  });

                  if (error) {
                    return { data: null, error };
                  }

                  if (!Array.isArray(data) || data.length === 0) {
                    return { data: null, error: null };
                  }

                  return { data: data[0], error: null };
                }
              };
            }
          };
        }
      };
    }
  };
}

window.supabaseConfigReady = (async () => {
  let localConfig = {};

  for (const configFile of ['config.local.json', 'config.json']) {
    try {
      const response = await fetch(configFile, { cache: 'no-store' });
      if (response.ok) {
        const parsed = await response.json();
        // Only use this file if it has a real (non-placeholder) anonKey
        if (parsed.anonKey && parsed.anonKey !== ANON_KEY_PLACEHOLDER) {
          localConfig = parsed;
          break;
        }
      }
    } catch (error) {
      // Ignore missing config files and try the next one.
    }
  }

  const supabaseConfig = {
    ...DEFAULT_SUPABASE_CONFIG,
    ...(window.SUPABASE_CONFIG || {}),
    ...localConfig
  };

  if (supabaseConfig.anonKey === DEFAULT_SUPABASE_CONFIG.anonKey) {
    console.warn(
      'Supabase: falta config.local.json con la clave "anon public". ' +
      'Copia config.example.json a config.local.json y añade solo la clave pública anon. ' +
      'La aplicación funcionará usando solo almacenamiento local.'
    );
    return;
  }

  supabaseClient = createSupabaseRestClient(supabaseConfig);
})();
