# 📘 INSTRUCTIONS - MIGRATION BASE DE DONNÉES

## 🎯 Objectif
Configurer la structure Supabase pour Mervason (merchant_profiles + products)

---

## 📋 ÉTAPES À SUIVRE

### **Étape 1️⃣ : Ouvrir Supabase Dashboard**

1. Va sur [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Connecte-toi avec ton compte
3. Sélectionne ton projet **Mervason**

---

### **Étape 2️⃣ : Ouvrir l'éditeur SQL**

1. Dans le menu de gauche, clique sur **"SQL Editor"** 
   (icône `</>`)
2. Clique sur **"New query"** (en haut à droite)

---

### **Étape 3️⃣ : Copier-Coller la migration**

1. Ouvre le fichier `supabase-migration.sql` (dans ce dossier)
2. **Sélectionne TOUT le contenu** (Ctrl+A)
3. **Copie** (Ctrl+C)
4. **Colle** dans l'éditeur SQL Supabase (Ctrl+V)

---

### **Étape 4️⃣ : Exécuter la migration**

1. Clique sur le bouton **"Run"** (en bas à droite) ou appuie sur **Ctrl+Enter**
2. ⏳ Attends quelques secondes...
3. ✅ Tu devrais voir des messages verts avec :
   ```
   Migration terminée avec succès!
   Profils merchants: X
   Produits: X
   ```

---

### **Étape 5️⃣ : Vérifier les tables créées**

1. Dans le menu de gauche, clique sur **"Table Editor"**
2. Tu devrais voir les tables :
   - ✅ `merchant_profiles`
   - ✅ `products`

3. Clique sur `merchant_profiles` :
   - Colonnes : `id`, `user_id`, `phone`, `business_name`, `created_at`
   
4. Clique sur `products` :
   - Colonnes : `id`, `merchant_id`, `name`, `price`, `image_url`, `category`, `description`, `stock`, `created_at`

---

### **Étape 6️⃣ : Tester dans l'application**

1. Ouvre ton application Mervason dans le navigateur
2. Ouvre la **Console DevTools** (F12)
3. Copie-colle cette commande :

```javascript
testDatabase.runAll()
```

4. ✅ Tous les tests doivent passer (6/6)

---

## 🔍 EN CAS DE PROBLÈME

### ❌ Erreur "relation already exists"
**Solution**: C'est normal si tu relances la migration. Le script gère les doublons.

### ❌ Erreur "permission denied"
**Solution**: Vérifie que tu es connecté à Supabase en tant qu'admin du projet.

### ❌ Erreur dans la console "table not found"
**Solutions**:
1. Rafraîchis la page (F5)
2. Vérifie que la migration SQL s'est bien exécutée
3. Vérifie l'URL et la clé dans `supabase-config.js`

### ❌ Aucun profil merchant pour user existant
**Solution**: Déconnecte-toi et reconnecte-toi (le trigger créera le profil)

---

## 📞 SUPPORT

Si un test échoue :
1. 📸 Fais une capture d'écran de l'erreur dans la console
2. 📋 Note le numéro du test qui échoue
3. 💬 Envoie-moi ces infos pour que je t'aide

---

## ✅ CHECKLIST FINALE

Avant de passer à la Phase 2, vérifie :

- [ ] Migration SQL exécutée sans erreur
- [ ] Tables `merchant_profiles` et `products` visibles dans Supabase
- [ ] Tests console : 6/6 passés ✅
- [ ] User connecté a un profil merchant automatiquement

**Une fois tout coché → On passe à la Phase 2 ! 🚀**
