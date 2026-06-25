/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_ANON_KEY?: string;
}

interface Window {
  MEOO_CONFIG?: {
    meoo_app_access_url?: string;
  };
}
