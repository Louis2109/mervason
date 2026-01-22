# Mervason - Marketplace E-Commerce Cameroun

Une plateforme e-commerce moderne pour le Cameroun permettant aux marchands de vendre leurs produits avec intégration WhatsApp.

## 🚀 Fonctionnalités

- **Marketplace Multi-Marchands** : Plusieurs commerçants peuvent vendre sur la même plateforme
- **Checkout WhatsApp** : Les commandes sont envoyées directement au WhatsApp du marchand
- **Gestion Produits** : Interface intuitive pour les marchands pour ajouter/modifier leurs produits
- **Upload d'Images par URL** : Ajout facile d'images produits via URLs
- **Authentification** : Système de connexion sécurisé pour les marchands
- **Design Responsive** : Interface adaptée mobile et desktop
- **Mode Sombre** : Support du thème sombre

## 🛠 Stack Technique

### Frontend
- **Alpine.js 3.x** - Framework JavaScript réactif léger
- **Tailwind CSS** - Framework CSS utility-first
- **HTML5/CSS3/JavaScript** - Technologies web standards

### Backend
- **Supabase** - Backend-as-a-Service
  - PostgreSQL Database
  - Authentication
  - Row Level Security (RLS)
  - Real-time subscriptions

### Architecture
- SPA (Single Page Application) avec routing côté client
- Aucun build process requis - déploiement direct
- CDN pour les librairies (Alpine.js, Tailwind)

## 📦 Structure de la Base de Données

### Table `merchant_profiles`
```sql
- id (uuid, primary key)
- user_id (uuid, foreign key → auth.users)
- phone (text) - Numéro WhatsApp
- business_name (text)
- created_at (timestamp)
```

### Table `products`
```sql
- id (uuid, primary key)
- merchant_id (uuid, foreign key → merchant_profiles)
- name (text)
- price (numeric)
- image_url (text)
- category (text)
- description (text)
- stock (integer)
- created_at (timestamp)
```

### Politiques RLS
- Les marchands peuvent lire tous les produits
- Les marchands peuvent créer/modifier/supprimer uniquement leurs propres produits
- Accès public en lecture pour les produits

## 🚦 Installation & Démarrage

### Prérequis
- Compte Supabase (gratuit)
- Serveur web local ou hébergement statique

### Configuration

1. **Cloner le projet**
```bash
git clone <votre-repo>
cd mervason
```

2. **Configurer Supabase**
   - Créez un projet sur [supabase.com](https://supabase.com)
   - Copiez votre URL et clé ANON
   - Mettez à jour `supabase-config.js` :
```javascript
const SUPABASE_URL = 'votre-url'
const SUPABASE_ANON_KEY = 'votre-cle'
```

3. **Migrer la base de données**
   - Dans le Dashboard Supabase → SQL Editor
   - Exécutez `supabase-migration-simple.sql`
   - Vérifiez avec `test-database.js`

4. **Lancer localement**
```bash
# Avec Python
python -m http.server 8000

# Avec Node.js
npx serve

# Avec VS Code
# Installez l'extension "Live Server"
```

5. **Accéder à l'application**
   - Ouvrez `http://localhost:8000`
   - Créez un compte marchand
   - Ajoutez vos produits

## 📱 Workflow E-Commerce

### Pour les Clients
1. Parcourir les produits dans la boutique
2. Cliquer sur "Acheter maintenant" sur un produit
3. Remplir le formulaire de commande
4. Validation → Redirection automatique vers WhatsApp du marchand
5. Finaliser la commande sur WhatsApp

### Pour les Marchands
1. S'inscrire avec email/mot de passe
2. Renseigner numéro WhatsApp et nom du business
3. Ajouter des produits (nom, prix, image URL, catégorie, description, stock)
4. Recevoir les commandes sur WhatsApp
5. Traiter les commandes directement via WhatsApp

## 🎨 Personnalisation

### Images Produits
Les images utilisent des URLs. Sources recommandées :
- Unsplash (gratuit)
- Pexels (gratuit)
- Cloudinary
- Vos propres URLs d'images

Voir `GUIDE-IMAGES.md` pour le guide complet.

### Styles
Modifiez `styles.css` pour personnaliser :
- Couleurs primaires/secondaires
- Animations
- Composants custom

### Contenu
Modifiez `index.html` pour :
- Textes et traductions
- Sections de la page d'accueil
- Formulaires

## 🚀 Déploiement

### Netlify
```bash
# Déployez simplement le dossier mervason
netlify deploy --prod
```

### Vercel
```bash
vercel --prod
```

### GitHub Pages
```bash
git push origin main
# Activez GitHub Pages dans les settings du repo
```

**Note** : Comme c'est une application statique avec backend Supabase, aucune configuration serveur n'est nécessaire.

## 🔐 Sécurité

- Authentification via Supabase Auth
- RLS (Row Level Security) sur toutes les tables
- Clés API exposées côté client (normal pour applications publiques)
- Pas de données sensibles stockées côté client
- Messages WhatsApp chiffrés end-to-end

## 📊 Tests

Exécutez les tests de la base de données :
```bash
node test-database.js
```

Tests inclus :
- ✅ Connexion Supabase
- ✅ Structure des tables
- ✅ Contraintes foreign keys
- ✅ Politiques RLS
- ✅ Insertion de données
- ✅ Requêtes JOIN

## 🤝 Contribution

Les contributions sont les bienvenues ! 

1. Fork le projet
2. Créez une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📝 Roadmap

- [ ] Multi-langues (Français/Anglais)
- [ ] Système de notation produits
- [ ] Recherche et filtres avancés
- [ ] Intégration paiement mobile (MTN/Orange Money)
- [ ] Dashboard analytics pour marchands
- [ ] Notifications en temps réel

## 📄 Licence

MIT License - voir `LICENSE` pour plus de détails

## 🙋 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Email : support@mervason.com

## 💡 Crédits

Développé avec ❤️ pour la communauté e-commerce du Cameroun

Technologies utilisées :
- [Alpine.js](https://alpinejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/)
- [Font Awesome](https://fontawesome.com/)
