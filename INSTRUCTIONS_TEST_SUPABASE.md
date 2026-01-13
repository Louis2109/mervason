# 🧪 Instructions de Test - Supabase Integration

## ⚠️ ÉTAPE OBLIGATOIRE AVANT DE TESTER

**Remplacer les credentials dans supabase-config.js**

1. Ouvre le fichier `supabase-config.js`
2. Trouve les lignes avec les placeholders:
   ```javascript
   const SUPABASE_URL = 'https://xxxx.supabase.co';
   const SUPABASE_ANON_KEY = 'eyJhbGci...';
   ```
3. Remplace par tes vraies valeurs du fichier `.env.local`:
   - Copie `SUPABASE_URL` depuis `.env.local`
   - Copie `SUPABASE_ANON_KEY` depuis `.env.local`
4. Sauvegarde le fichier

---

## 📋 Tests à Effectuer

### ✅ Test 1: Inscription Nouveau Marchand (Register)

**Objectif:** Vérifier que Supabase Auth et la table `users` fonctionnent

**Étapes:**
1. Ouvre `index.html` dans le navigateur
2. Clique sur **"S'inscrire"** dans la navbar
3. Remplis le formulaire:
   - Prénom: `Jean`
   - Nom: `Dupont`
   - Email: `jean.dupont@test.com`
   - Téléphone: `+237670000001`
   - Mot de passe: `Test123456`
   - Confirmation: `Test123456`
4. Clique **"Créer mon compte"**

**Résultat attendu:**
- ✅ Toast vert: "Compte créé avec succès !"
- ✅ Redirection automatique vers "Mes Produits"
- ✅ Navbar affiche "Jean Dupont" et bouton "Déconnexion"

**Vérification Supabase (Dashboard):**
1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet
3. **Authentication → Users**:
   - ✅ Nouvelle ligne avec `jean.dupont@test.com`
4. **Table Editor → users**:
   - ✅ Nouvelle ligne avec:
     - email: `jean.dupont@test.com`
     - first_name: `Jean`
     - last_name: `Dupont`
     - phone: `+237670000001`
     - merchant_id: `merchant_[timestamp]`
     - role: `merchant`

---

### ✅ Test 2: Connexion (Login)

**Objectif:** Vérifier l'authentification existante

**Étapes:**
1. Clique **"Déconnexion"** (si connecté)
2. Clique **"Se connecter"** dans la navbar
3. Entre les identifiants du Test 1:
   - Email: `jean.dupont@test.com`
   - Mot de passe: `Test123456`
4. Clique **"Se connecter"**

**Résultat attendu:**
- ✅ Toast vert: "Connexion réussie"
- ✅ Redirection vers Home
- ✅ Navbar affiche "Jean Dupont" et "Déconnexion"

**Test supplémentaire - Persistence de session:**
1. Reste connecté
2. **Refresh la page (F5)**
3. ✅ Tu dois RESTER connecté (nom visible, pas de déconnexion)
4. **Ferme le navigateur complètement**
5. **Rouvre** `index.html`
6. ✅ Tu dois TOUJOURS être connecté

---

### ✅ Test 3: Créer un Produit (CRUD Create)

**Objectif:** Vérifier l'insertion dans la table `products`

**Étapes:**
1. Assure-toi d'être connecté (Login si nécessaire)
2. Clique **"Mes Produits"** dans la navbar
3. Clique **"Ajouter un produit"** (bouton orange)
4. Remplis le formulaire:
   - Nom: `Samsung Galaxy S23`
   - Catégorie: `Électronique`
   - Prix: `450000`
   - Stock: `15`
   - Description: `Smartphone Android dernière génération`
   - Image URL: `https://i.imgur.com/ABC123.jpg` (ou laisse vide)
5. Clique **"Ajouter le produit"**

**Résultat attendu:**
- ✅ Toast vert: "Produit ajouté avec succès"
- ✅ Formulaire se ferme automatiquement
- ✅ Nouvelle carte produit apparaît dans "Mes Produits"
- ✅ Produit visible aussi dans "Boutique"

**Vérification Supabase:**
1. **Table Editor → products**
2. ✅ Nouvelle ligne avec:
   - name: `Samsung Galaxy S23`
   - price: `450000`
   - category: `Électronique`
   - merchant_id: (correspond au merchant_id de ton user)
   - stock: `15`
   - status: `active`

---

### ✅ Test 4: Modifier un Produit (CRUD Update)

**Objectif:** Vérifier la mise à jour dans Supabase

**Étapes:**
1. Dans **"Mes Produits"**, trouve le produit créé au Test 3
2. Clique **"Modifier"** (icône stylo)
3. Change:
   - Nom → `Samsung Galaxy S23 Ultra`
   - Prix → `550000`
4. Clique **"Mettre à jour"**

**Résultat attendu:**
- ✅ Toast vert: "Produit mis à jour avec succès"
- ✅ Carte affiche le nouveau nom et prix immédiatement
- ✅ Changements visibles aussi dans "Boutique"

**Vérification Supabase:**
1. **Table Editor → products**
2. ✅ Ligne du produit mise à jour:
   - name: `Samsung Galaxy S23 Ultra`
   - price: `550000`
   - updated_at: (timestamp récent)

---

### ✅ Test 5: Supprimer un Produit (CRUD Delete)

**Objectif:** Vérifier la suppression dans Supabase

**Étapes:**
1. Dans **"Mes Produits"**, trouve un produit
2. Clique **"Supprimer"** (icône poubelle)
3. Confirme dans le dialog: **"OK"**

**Résultat attendu:**
- ✅ Toast vert: "Produit supprimé avec succès"
- ✅ Carte disparaît immédiatement de "Mes Produits"
- ✅ Produit n'apparaît plus dans "Boutique"

**Vérification Supabase:**
1. **Table Editor → products**
2. ✅ Ligne supprimée (plus visible dans la table)

---

### ✅ Test 6: Multi-Marchands (RLS Security)

**Objectif:** Vérifier que les RLS policies fonctionnent (isolation des données)

**Étapes:**

**Partie 1 - Créer un 2e marchand:**
1. Déconnexion (si connecté)
2. Clique **"S'inscrire"**
3. Nouveau compte:
   - Prénom: `Marie`
   - Nom: `Martin`
   - Email: `marie.martin@test.com`
   - Téléphone: `+237670000002`
   - Mot de passe: `Test123456`
4. Inscription → Redirection vers "Mes Produits"

**Partie 2 - Créer un produit pour le 2e marchand:**
1. (Toujours connecté comme Marie)
2. Clique **"Ajouter un produit"**
3. Remplis:
   - Nom: `iPhone 15 Pro`
   - Catégorie: `Électronique`
   - Prix: `750000`
   - Stock: `8`
4. Ajouter

**Partie 3 - Vérifier la visibilité publique:**
1. Va dans **"Boutique"**
2. ✅ Tu dois voir **LES DEUX** produits:
   - `Samsung Galaxy S23 Ultra` (marchand 1)
   - `iPhone 15 Pro` (marchand 2)

**Partie 4 - Vérifier l'isolation (RLS):**
1. Va dans **"Mes Produits"**
2. ✅ Tu dois voir SEULEMENT:
   - `iPhone 15 Pro` (ton produit)
3. ❌ Tu ne dois PAS voir:
   - `Samsung Galaxy S23 Ultra` (produit de Jean)

**Partie 5 - Tester la sécurité:**
1. Déconnexion
2. Connexion avec premier compte:
   - Email: `jean.dupont@test.com`
   - Mot de passe: `Test123456`
3. Va dans **"Mes Produits"**
4. ✅ Tu dois voir SEULEMENT:
   - `Samsung Galaxy S23 Ultra` (ton produit)
5. ❌ Tu ne dois PAS voir:
   - `iPhone 15 Pro` (produit de Marie)

**Vérification Supabase:**
1. **Table Editor → products**
2. ✅ Deux lignes avec merchant_id DIFFÉRENTS:
   - Produit 1: merchant_id de Jean
   - Produit 2: merchant_id de Marie

---

### ✅ Test 7: Logout & Session

**Objectif:** Vérifier la déconnexion et la persistence

**Étapes:**
1. Connecté (n'importe quel compte)
2. Clique **"Déconnexion"**

**Résultat attendu:**
- ✅ Toast bleu: "Déconnexion réussie"
- ✅ Navbar: "Se connecter" et "S'inscrire" réapparaissent
- ✅ Nom utilisateur disparaît

**Test persistence après logout:**
1. **Refresh la page (F5)**
2. ✅ Tu dois rester DÉCONNECTÉ
3. ✅ Pas de nom dans la navbar

---

## 🚨 Résolution de Problèmes

### Erreur "Invalid API Key"
**Cause:** Credentials mal copiés dans `supabase-config.js`
**Solution:**
1. Vérifie que `SUPABASE_URL` et `SUPABASE_ANON_KEY` sont corrects
2. Pas d'espace avant/après les valeurs
3. Guillemets bien présents: `'https://...'`

### Erreur "User already registered"
**Cause:** Email déjà utilisé dans un test précédent
**Solution:**
1. Va sur Supabase Dashboard → Authentication → Users
2. Supprime l'utilisateur existant
3. Ou utilise un nouvel email: `test2@test.com`, `test3@test.com`, etc.

### Produits ne s'affichent pas dans "Boutique"
**Cause:** Problème de chargement async
**Solution:**
1. Ouvre la Console du navigateur (F12)
2. Cherche des erreurs rouges
3. Vérifie que `loadAllProducts()` est appelé dans `init()`

### Session ne persiste pas après refresh
**Cause:** `checkSupabaseSession()` non appelé
**Solution:**
1. Vérifie que `init()` contient:
   ```javascript
   await this.checkSupabaseSession();
   ```
2. Vérifie que `setupAuthListener()` est appelé

### RLS: "new row violates row-level security policy"
**Cause:** Policies Supabase mal configurées
**Solution:**
1. Va sur Supabase Dashboard → Table Editor → products
2. Clique "RLS" (à droite)
3. Vérifie policies:
   - **INSERT**: `auth.uid() = merchant_id`
   - **UPDATE**: `auth.uid() = merchant_id`
   - **DELETE**: `auth.uid() = merchant_id`
   - **SELECT**: `status = 'active'` (publique)

---

## ✅ Checklist Finale

Avant de considérer les tests comme réussis, vérifie:

- [ ] ✅ Inscription fonctionne (Auth + users table)
- [ ] ✅ Login fonctionne (connexion réussie)
- [ ] ✅ Session persiste après refresh
- [ ] ✅ Session persiste après fermeture navigateur
- [ ] ✅ Déconnexion fonctionne
- [ ] ✅ Créer produit fonctionne (table products)
- [ ] ✅ Modifier produit fonctionne (update dans Supabase)
- [ ] ✅ Supprimer produit fonctionne (delete dans Supabase)
- [ ] ✅ Produits visibles dans "Boutique" (tous marchands)
- [ ] ✅ "Mes Produits" affiche SEULEMENT mes produits (RLS)
- [ ] ✅ Console navigateur: pas d'erreurs rouges
- [ ] ✅ Supabase Dashboard: données correspondent

---

## 🎯 Prochaines Étapes

Une fois tous les tests passés:

1. **Tester sur appareil mobile** (même réseau WiFi):
   - Trouve l'IP locale de ton PC: `ipconfig` (Windows)
   - Ouvre `http://[TON_IP]:5500/index.html` sur mobile
   - Vérifie que les produits sont visibles

2. **Déploiement Vercel** (Phase 4):
   - Push code sur GitHub
   - Connecter Vercel à ton repo
   - Configurer variables d'environnement:
     - `VITE_SUPABASE_URL`
     - `VITE_SUPABASE_ANON_KEY`
   - Tester avec plusieurs appareils distants

---

## 📞 Support

Si tu rencontres des problèmes:
1. Ouvre Console navigateur (F12) → Onglet "Console"
2. Copie les erreurs rouges
3. Vérifie Supabase Dashboard → Logs (pour erreurs backend)
4. Vérifie que toutes les tables ont RLS activé

Bon test ! 🚀
