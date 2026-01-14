// ========== SUPABASE CONFIGURATION ==========
console.log('🔧 [supabase-config.js] Chargement du fichier...');

// Credentials
const SUPABASE_URL = 'https://ybqgajuzjdgaabtkpvnh.supabase.co'; 
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicWdhanV6amRnYWFidGtwdm5oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgyNjUxMDcsImV4cCI6MjA4Mzg0MTEwN30.qAph6FaZFtuOo379EZAkXFmOoPimutBA53DSAnDMB8U';

console.log('📍 URL:', SUPABASE_URL);
console.log('🔑 Key (20 premiers chars):', SUPABASE_ANON_KEY.substring(0, 20) + '...');

// Vérifier que le SDK est chargé
console.log('🔍 Vérification SDK...');
console.log('  typeof window.supabase:', typeof window.supabase);

if (typeof window.supabase === 'undefined') {
  console.error('❌ ERREUR CRITIQUE: Supabase SDK non chargé!');
  console.error('   Vérifie que <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script> est AVANT supabase-config.js');
  throw new Error('Supabase SDK is not available');
}

console.log('✅ SDK détecté');
console.log('  window.supabase.createClient:', typeof window.supabase.createClient);

// Sauvegarder le SDK
const supabaseSDK = window.supabase;
console.log('💾 SDK sauvegardé dans supabaseSDK');

// Créer le client
console.log('🔨 Création du client Supabase...');
try {
  const client = supabaseSDK.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log('✅ Client créé avec succès');
  console.log('  client.auth:', typeof client.auth);
  console.log('  client.from:', typeof client.from);
  
  // REMPLACER window.supabase par le client
  window.supabase = client;
  console.log('✅ window.supabase REMPLACÉ par le client');
  console.log('  window.supabase.auth:', typeof window.supabase.auth);
  
  // Variable globale aussi pour compatibilité
  window.supabaseClient = client;
  console.log('✅ window.supabaseClient créé (backup)');
  
} catch (error) {
  console.error('❌ ERREUR lors de la création du client:', error);
  throw error;
}

console.log('🎉 Configuration Supabase terminée avec succès!');

