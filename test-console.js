/**
 * ════════════════════════════════════════════════════════════
 * 🧪 MERVASON - SCRIPT DE TEST CONSOLE
 * ════════════════════════════════════════════════════════════
 * 
 * Comment utiliser :
 * 1. Ouvrir la page dans le navigateur
 * 2. Ouvrir DevTools (F12)
 * 3. Aller dans l'onglet Console
 * 4. Copier-coller tout ce fichier et appuyer sur Entrée
 * 5. Lancer les tests avec : runAllTests()
 * 
 * ════════════════════════════════════════════════════════════
 */

// ═══════════════════════════════════════════════════════════
// 📦 CONFIGURATION
// ═══════════════════════════════════════════════════════════

const TEST_CONFIG = {
  testEmail: `test_${Date.now()}@mervason.cm`,
  testPassword: "Test@123456",
  testUser: {
    firstName: "Test",
    lastName: "User",
    phone: "+237691234567"
  },
  testProduct: {
    name: "Produit Test Console",
    price: 5000,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    category: "Électronique",
    description: "Produit créé depuis la console de test",
    stock: 10
  }
};

// ═══════════════════════════════════════════════════════════
// 🎨 HELPERS - Affichage coloré
// ═══════════════════════════════════════════════════════════

const log = {
  success: (msg) => console.log(`%c✅ ${msg}`, 'color: #10b981; font-weight: bold'),
  error: (msg) => console.log(`%c❌ ${msg}`, 'color: #ef4444; font-weight: bold'),
  info: (msg) => console.log(`%c📘 ${msg}`, 'color: #3b82f6; font-weight: bold'),
  warning: (msg) => console.log(`%c⚠️ ${msg}`, 'color: #f59e0b; font-weight: bold'),
  section: (msg) => console.log(`\n%c═══ ${msg} ═══`, 'color: #8b5cf6; font-size: 14px; font-weight: bold'),
  data: (label, data) => {
    console.log(`%c${label}:`, 'color: #6b7280; font-weight: bold');
    console.log(data);
  }
};

// ═══════════════════════════════════════════════════════════
// 🔍 TESTS - AUTH (Authentication)
// ═══════════════════════════════════════════════════════════

async function testAuth() {
  log.section("TEST AUTH - Système d'Authentification");
  
  const results = {
    supabaseConnected: false,
    registerWorks: false,
    loginWorks: false,
    sessionPersists: false,
    logoutWorks: false
  };

  try {
    // 1️⃣ Test connexion Supabase
    log.info("Test 1/5 - Connexion Supabase");
    if (typeof supabase === 'undefined') {
      log.error("Supabase client n'est pas défini");
      return results;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    log.success("Supabase client connecté");
    log.data("Session actuelle", session);
    results.supabaseConnected = true;

    // 2️⃣ Test Register
    log.info("Test 2/5 - Inscription nouvel utilisateur");
    const registerData = {
      email: TEST_CONFIG.testEmail,
      password: TEST_CONFIG.testPassword,
      ...TEST_CONFIG.testUser
    };
    
    log.data("Données d'inscription", registerData);
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          first_name: registerData.firstName,
          last_name: registerData.lastName
        }
      }
    });

    if (signUpError) {
      log.error(`Erreur inscription: ${signUpError.message}`);
      log.warning("Si l'email existe déjà, c'est normal - on passe au login");
    } else {
      log.success("Inscription réussie");
      log.data("User créé", signUpData.user);
      results.registerWorks = true;
      
      // Vérifier si profil créé dans table users
      const { data: profileData, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', signUpData.user.id)
        .single();
      
      if (profileError) {
        log.error(`Profil non créé dans table users: ${profileError.message}`);
      } else {
        log.success("Profil créé dans table users");
        log.data("Profil", profileData);
      }
    }

    // 3️⃣ Test Login
    log.info("Test 3/5 - Connexion utilisateur");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: TEST_CONFIG.testEmail,
      password: TEST_CONFIG.testPassword
    });

    if (loginError) {
      log.error(`Erreur login: ${loginError.message}`);
      return results;
    }

    log.success("Login réussi");
    log.data("Session", loginData.session);
    log.data("User", loginData.user);
    results.loginWorks = true;

    // Vérifier profil
    const { data: userProfile, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', loginData.user.id)
      .single();

    if (userError) {
      log.error(`Impossible de récupérer le profil: ${userError.message}`);
    } else {
      log.success("Profil récupéré");
      log.data("Profil complet", userProfile);
    }

    // 4️⃣ Test Session Persistence
    log.info("Test 4/5 - Persistance de session");
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    
    if (currentSession) {
      log.success("Session active détectée");
      log.data("Session ID", currentSession.access_token.substring(0, 20) + "...");
      results.sessionPersists = true;
    } else {
      log.error("Pas de session active");
    }

    // 5️⃣ Test Logout
    log.info("Test 5/5 - Déconnexion");
    const { error: logoutError } = await supabase.auth.signOut();
    
    if (logoutError) {
      log.error(`Erreur logout: ${logoutError.message}`);
    } else {
      log.success("Logout réussi");
      results.logoutWorks = true;
    }

    // Vérifier que la session est bien détruite
    const { data: { session: afterLogout } } = await supabase.auth.getSession();
    if (afterLogout) {
      log.warning("Session encore active après logout !");
    } else {
      log.success("Session bien détruite");
    }

  } catch (error) {
    log.error(`Erreur globale: ${error.message}`);
    console.error(error);
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// 📦 TESTS - CRUD PRODUCTS
// ═══════════════════════════════════════════════════════════

async function testCRUDProducts() {
  log.section("TEST CRUD - Gestion des Produits");
  
  const results = {
    loginFirst: false,
    createProduct: false,
    readProducts: false,
    updateProduct: false,
    deleteProduct: false
  };

  let createdProductId = null;
  let merchantId = null;

  try {
    // 0️⃣ Se connecter d'abord
    log.info("Setup - Connexion utilisateur");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: TEST_CONFIG.testEmail,
      password: TEST_CONFIG.testPassword
    });

    if (loginError) {
      log.error(`Impossible de se connecter: ${loginError.message}`);
      log.warning("Assurez-vous d'avoir exécuté testAuth() d'abord");
      return results;
    }

    // Récupérer merchantId (utiliser snake_case pour Supabase)
    const { data: userProfile, error: profileError } = await supabase
      .from('users')
      .select('*')  // ✅ Utiliser '*' comme l'app (Supabase convertit en camelCase)
      .eq('id', loginData.user.id)
      .single();

    if (profileError) {
      log.error(`Erreur récupération profil: ${profileError.message}`);
      return results;
    }

    merchantId = userProfile?.merchantId;
    
    if (!merchantId) {
      log.error("merchantId introuvable dans le profil");
      return results;
    }

    log.success(`Connecté en tant que merchant: ${merchantId.substring(0, 8)}...`);
    results.loginFirst = true;

    // 1️⃣ CREATE - Créer un produit
    log.info("Test 1/4 - CREATE - Création produit");
    
    const newProduct = {
      ...TEST_CONFIG.testProduct,
      merchantId: merchantId
    };

    log.data("Données du nouveau produit", newProduct);

    const { data: createdProduct, error: createError } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single();

    if (createError) {
      log.error(`Erreur CREATE: ${createError.message}`);
      log.data("Détails erreur", createError);
      return results;
    }

    createdProductId = createdProduct.id;
    log.success(`Produit créé avec ID: ${createdProductId}`);
    log.data("Produit créé", createdProduct);
    results.createProduct = true;

    // 2️⃣ READ - Lire les produits
    log.info("Test 2/4 - READ - Lecture produits du marchand");
    
    const { data: merchantProducts, error: readError } = await supabase
      .from('products')
      .select('*')
      .eq('merchantId', merchantId);

    if (readError) {
      log.error(`Erreur READ: ${readError.message}`);
      return results;
    }

    log.success(`${merchantProducts.length} produit(s) trouvé(s)`);
    log.data("Produits du marchand", merchantProducts);
    results.readProducts = true;

    // 3️⃣ UPDATE - Modifier le produit
    log.info("Test 3/4 - UPDATE - Modification produit");
    
    const updatedData = {
      name: "Produit Modifié via Console",
      price: 7500
    };

    const { data: updatedProduct, error: updateError } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', createdProductId)
      .select()
      .single();

    if (updateError) {
      log.error(`Erreur UPDATE: ${updateError.message}`);
      return results;
    }

    log.success("Produit modifié");
    log.data("Avant", { name: newProduct.name, price: newProduct.price });
    log.data("Après", { name: updatedProduct.name, price: updatedProduct.price });
    results.updateProduct = true;

    // 4️⃣ DELETE - Supprimer le produit
    log.info("Test 4/4 - DELETE - Suppression produit");
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', createdProductId);

    if (deleteError) {
      log.error(`Erreur DELETE: ${deleteError.message}`);
      return results;
    }

    log.success(`Produit ${createdProductId} supprimé`);
    results.deleteProduct = true;

    // Vérifier suppression
    const { data: checkDeleted } = await supabase
      .from('products')
      .select('id')
      .eq('id', createdProductId)
      .single();

    if (checkDeleted) {
      log.warning("Produit toujours présent après DELETE !");
    } else {
      log.success("Suppression confirmée");
    }

  } catch (error) {
    log.error(`Erreur globale: ${error.message}`);
    console.error(error);
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// 🔒 TESTS - SECURITY (RLS Policies)
// ═══════════════════════════════════════════════════════════

async function testSecurity() {
  log.section("TEST SECURITY - Row Level Security");
  
  const results = {
    cannotEditOthersProducts: false,
    cannotDeleteOthersProducts: false
  };

  try {
    log.info("Test 1/2 - Tentative modification produit d'un autre marchand");
    
    // Essayer de modifier un produit qui n'est pas à nous
    const { data: allProducts } = await supabase
      .from('products')
      .select('id, merchantId')
      .limit(5);

    if (!allProducts || allProducts.length === 0) {
      log.warning("Aucun produit dans la base pour tester");
      return results;
    }

    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      log.warning("Pas connecté - impossible de tester la sécurité");
      return results;
    }

    const { data: currentUser } = await supabase
      .from('users')
      .select('merchantId')
      .eq('id', session.user.id)
      .single();

    // Trouver un produit qui n'est pas à nous
    const otherProduct = allProducts.find(p => p.merchantId !== currentUser?.merchantId);

    if (!otherProduct) {
      log.warning("Tous les produits appartiennent au marchand actuel");
      return results;
    }

    log.data("Tentative modification du produit", otherProduct.id);

    const { data: hackAttempt, error: hackError } = await supabase
      .from('products')
      .update({ price: 1 })
      .eq('id', otherProduct.id)
      .select();

    if (hackError || !hackAttempt || hackAttempt.length === 0) {
      log.success("✅ RLS bloque bien la modification (SÉCURITÉ OK)");
      results.cannotEditOthersProducts = true;
    } else {
      log.error("🚨 FAILLE DE SÉCURITÉ - Peut modifier produits des autres !");
      log.data("Produit modifié illégalement", hackAttempt);
    }

    // Test DELETE
    log.info("Test 2/2 - Tentative suppression produit d'un autre marchand");
    
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', otherProduct.id);

    if (deleteError) {
      log.success("✅ RLS bloque bien la suppression (SÉCURITÉ OK)");
      results.cannotDeleteOthersProducts = true;
    } else {
      log.error("🚨 FAILLE DE SÉCURITÉ - Peut supprimer produits des autres !");
    }

  } catch (error) {
    log.error(`Erreur: ${error.message}`);
    console.error(error);
  }

  return results;
}

// ═══════════════════════════════════════════════════════════
// 🎯 RUNNER - Lancer tous les tests
// ═══════════════════════════════════════════════════════════

async function runAllTests() {
  console.clear();
  log.section("🧪 MERVASON - SUITE DE TESTS COMPLÈTE");
  log.info("Début des tests...\n");

  const startTime = Date.now();
  const allResults = {};

  // Test 1: Auth
  allResults.auth = await testAuth();
  
  // Test 2: CRUD
  allResults.crud = await testCRUDProducts();
  
  // Test 3: Security
  allResults.security = await testSecurity();

  // Rapport final
  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  
  log.section("📊 RAPPORT FINAL");
  console.table(allResults);
  
  log.info(`Durée totale: ${duration}s`);
  
  // Compter les succès/échecs
  let totalTests = 0;
  let passedTests = 0;
  
  Object.values(allResults).forEach(category => {
    Object.values(category).forEach(result => {
      totalTests++;
      if (result) passedTests++;
    });
  });
  
  const percentage = ((passedTests / totalTests) * 100).toFixed(0);
  
  if (percentage === "100") {
    log.success(`\n🎉 TOUS LES TESTS PASSENT - ${passedTests}/${totalTests} (${percentage}%)`);
  } else if (percentage >= "70") {
    log.warning(`\n⚠️ TESTS PARTIELS - ${passedTests}/${totalTests} (${percentage}%)`);
  } else {
    log.error(`\n❌ ÉCHEC CRITIQUE - ${passedTests}/${totalTests} (${percentage}%)`);
  }
  
  return allResults;
}

// ═══════════════════════════════════════════════════════════
// 🚀 COMMANDES RAPIDES
// ═══════════════════════════════════════════════════════════

console.log(`
%c╔══════════════════════════════════════════════════════════╗
║   🧪 MERVASON - TESTS CONSOLE CHARGÉS                   ║
╚══════════════════════════════════════════════════════════╝
`, 'color: #8b5cf6; font-weight: bold');

console.log(`
📌 COMMANDES DISPONIBLES :

  runAllTests()       → Lance tous les tests
  testAuth()          → Teste uniquement l'authentification
  testCRUDProducts()  → Teste uniquement CRUD produits
  testSecurity()      → Teste la sécurité RLS

📘 EXEMPLE :
  await runAllTests()
`);
