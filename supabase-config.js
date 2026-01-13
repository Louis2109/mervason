// Supabase Configuration
// IMPORTANT : Remplace ces valeurs par tes vraies clés depuis .env.local
const SUPABASE_URL = 'https://xxxx.supabase.co'; // Remplace par ton URL
const SUPABASE_ANON_KEY = 'eyJhbGciOi...'; // Remplace par ta clé

// Initialiser le client Supabase
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('✅ Supabase client initialized');
