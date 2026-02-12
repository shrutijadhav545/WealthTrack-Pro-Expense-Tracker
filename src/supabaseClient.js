import { createClient } from '@supabase/supabase-js';

// Vite uses import.meta.env instead of process.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the URL is defined before creating the client to prevent white screen
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing! Check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);