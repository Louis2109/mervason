// ========================================
// SCRIPT DE TEST - BASE DE DONNÉES
// ========================================
// À exécuter dans la console du navigateur après la migration

console.log('🧪 DÉBUT DES TESTS BASE DE DONNÉES\n');

const testDatabase = {
  
  // Test 1: Vérifier la connexion Supabase
  async testConnection() {
    console.log('📡 Test 1: Connexion Supabase...');
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      console.log('✅ Connexion OK');
      console.log('   Session:', data.session ? 'Active' : 'Aucune');
      return true;
    } catch (error) {
      console.error('❌ Erreur connexion:', error.message);
      return false;
    }
  },

  // Test 2: Vérifier table merchant_profiles
  async testMerchantProfiles() {
    console.log('\n📋 Test 2: Table merchant_profiles...');
    try {
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .limit(5);
      
      if (error) throw error;
      
      console.log('✅ Table accessible');
      console.log(`   ${data.length} profil(s) trouvé(s)`);
      
      if (data.length > 0) {
        console.log('   Exemple:', {
          id: data[0].id,
          phone: data[0].phone,
          business_name: data[0].business_name
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur merchant_profiles:', error.message);
      console.error('   💡 As-tu exécuté la migration SQL dans Supabase?');
      return false;
    }
  },

  // Test 3: Vérifier table products
  async testProducts() {
    console.log('\n📦 Test 3: Table products...');
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, merchant_id')
        .limit(5);
      
      if (error) throw error;
      
      console.log('✅ Table accessible');
      console.log(`   ${data.length} produit(s) trouvé(s)`);
      
      if (data.length > 0) {
        console.log('   Exemple:', {
          name: data[0].name,
          price: data[0].price,
          image_url: data[0].image_url ? '✓ Présent' : '✗ NULL'
        });
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur products:', error.message);
      return false;
    }
  },

  // Test 4: Vérifier jointure products <-> merchant_profiles
  async testJointure() {
    console.log('\n🔗 Test 4: Jointure products + merchant_profiles...');
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          id,
          name,
          price,
          merchant_profiles (
            phone,
            business_name
          )
        `)
        .limit(3);
      
      if (error) throw error;
      
      console.log('✅ Jointure fonctionne');
      console.log(`   ${data.length} produit(s) avec info merchant`);
      
      if (data.length > 0 && data[0].merchant_profiles) {
        console.log('   Exemple produit:', data[0].name);
        console.log('   Vendeur:', data[0].merchant_profiles.business_name);
        console.log('   Phone:', data[0].merchant_profiles.phone);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur jointure:', error.message);
      return false;
    }
  },

  // Test 5: Vérifier RLS (permissions)
  async testRLS() {
    console.log('\n🔒 Test 5: Row Level Security...');
    try {
      // Lecture publique (doit marcher même non connecté)
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id');
      
      if (prodError) throw prodError;
      console.log('✅ Lecture produits: OK (public)');
      
      const { data: profiles, error: profError } = await supabase
        .from('merchant_profiles')
        .select('id');
      
      if (profError) throw profError;
      console.log('✅ Lecture profils: OK (public)');
      
      return true;
    } catch (error) {
      console.error('❌ Erreur RLS:', error.message);
      return false;
    }
  },

  // Test 6: Vérifier si user connecté a un profil merchant
  async testCurrentUserProfile() {
    console.log('\n👤 Test 6: Profil merchant du user actuel...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        console.log('⚠️  Aucun user connecté - test ignoré');
        return true;
      }
      
      const userId = session.user.id;
      console.log(`   User ID: ${userId.substring(0, 8)}...`);
      
      const { data, error } = await supabase
        .from('merchant_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        console.log('✅ Profil merchant trouvé');
        console.log('   Business:', data.business_name);
        console.log('   Phone:', data.phone);
        console.log('   Merchant ID:', data.id.substring(0, 8) + '...');
      } else {
        console.log('⚠️  Aucun profil merchant pour ce user');
        console.log('   💡 Le trigger devrait le créer automatiquement');
      }
      
      return true;
    } catch (error) {
      console.error('❌ Erreur:', error.message);
      return false;
    }
  },

  // EXÉCUTER TOUS LES TESTS
  async runAll() {
    console.log('═══════════════════════════════════════');
    console.log('🧪 TESTS BASE DE DONNÉES MERVASON');
    console.log('═══════════════════════════════════════\n');
    
    const results = [];
    
    results.push(await this.testConnection());
    results.push(await this.testMerchantProfiles());
    results.push(await this.testProducts());
    results.push(await this.testJointure());
    results.push(await this.testRLS());
    results.push(await this.testCurrentUserProfile());
    
    console.log('\n═══════════════════════════════════════');
    const passed = results.filter(r => r).length;
    const total = results.length;
    
    if (passed === total) {
      console.log(`✅ TOUS LES TESTS PASSÉS (${passed}/${total})`);
      console.log('🎉 Base de données configurée correctement!');
    } else {
      console.log(`⚠️  ${passed}/${total} tests passés`);
      console.log('💡 Vérifie les erreurs ci-dessus');
    }
    console.log('═══════════════════════════════════════');
  }
};

// Auto-exécution si dans console
if (typeof window !== 'undefined' && window.supabase) {
  console.log('💡 Pour lancer les tests, exécute: testDatabase.runAll()');
  console.log('💡 Ou un test spécifique: testDatabase.testProducts()');
} else {
  console.error('❌ Supabase non disponible - ouvre la console du navigateur');
}

// Export global
window.testDatabase = testDatabase;
