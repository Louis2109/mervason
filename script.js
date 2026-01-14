// Alpine.js Data and Functions
function app() {
  return {
    // State Management
    currentPage: "home",
    mobileMenuOpen: false,
    searchModalOpen: false,
    darkMode: false, // Default to light mode
    cartCount: 0,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    currentUser: JSON.parse(localStorage.getItem("currentUser")) || null,
    isLoggedIn: false,
    merchantProducts: [],
    showAddProductForm: false,
    editingProduct: null,
    toast: {
      show: false,
      message: "",
      type: "success",
    },

    // Sample Data
    featuredProducts: [
      {
        id: 1,
        name: "iPhone 14 Pro Max",
        price: 650000,
        image:
          "https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Électronique",
        description:
          "Smartphone Apple dernière génération avec appareil photo professionnel",
        vendor: "TechStore CM",
        rating: 4.8,
        reviews: 156,
      },
      {
        id: 2,
        name: "Robe Ankara Premium",
        price: 25000,
        image:
          "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Mode & Beauté",
        description:
          "Robe traditionnelle camerounaise en tissu Ankara de qualité",
        vendor: "Afrique Style",
        rating: 4.6,
        reviews: 89,
      },
      {
        id: 3,
        name: "MacBook Air M2",
        price: 850000,
        image:
          "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Électronique",
        description: "Ordinateur portable Apple avec puce M2 ultra-performante",
        vendor: "TechStore CM",
        rating: 4.9,
        reviews: 203,
      },
    ],

    allProducts: [],

    // Initialization
    async init() {
      this.initializeTheme();
      this.applyTheme();
      this.initializeCart();
      this.setupNavigation();
      
      // Vérifier session Supabase
      await this.checkSupabaseSession();
      
      await this.loadMerchantProducts();
      this.loadAllProducts();
      
      // Listener pour changements auth
      this.setupAuthListener();
    },

    // Theme Management
    initializeTheme() {
      const savedTheme = localStorage.getItem("darkMode");
      if (savedTheme !== null) {
        this.darkMode = savedTheme === "true";
      } else {
        // Default to light mode for new users
        this.darkMode = false;
        localStorage.setItem("darkMode", "false");
      }
    },
    toggleDarkMode() {
      console.log("AVANT toggle - darkMode:", this.darkMode);
      this.darkMode = !this.darkMode;
      console.log("APRÈS toggle - darkMode:", this.darkMode);
      localStorage.setItem("darkMode", this.darkMode.toString());
      this.applyTheme();
    },

    applyTheme() {
      const html = document.documentElement;
      console.log("applyTheme called - darkMode:", this.darkMode);
      console.log("HTML element:", html);
      console.log("Classes AVANT:", html.classList.toString());

      if (this.darkMode) {
        html.classList.add("dark");
        console.log("Ajout de la classe dark");
      } else {
        html.classList.remove("dark");
        console.log("Suppression de la classe dark");
      }

      console.log("Classes APRÈS:", html.classList.toString());
    },

    // Navigation Management
    setupNavigation() {
      // Handle navigation clicks
      document.addEventListener("click", (e) => {
        const pageLink = e.target.closest("[data-page]");
        if (pageLink) {
          e.preventDefault();
          const page = pageLink.getAttribute("data-page");
          this.navigateTo(page);
        }
      });

      // Handle browser back/forward
      window.addEventListener("popstate", (e) => {
        if (e.state && e.state.page) {
          this.showPage(e.state.page);
        }
      });

      // Set initial page from URL
      const urlParams = new URLSearchParams(window.location.search);
      const initialPage = urlParams.get("page") || "home";
      this.showPage(initialPage);
    },

    navigateTo(page) {
      this.showPage(page);
      // Update URL without reload
      const url = new URL(window.location);
      url.searchParams.set("page", page);
      history.pushState({ page }, "", url);

      // Close mobile menu
      this.mobileMenuOpen = false;
    },

    showPage(page) {
      // Hide all pages
      document.querySelectorAll(".page").forEach((p) => {
        p.classList.remove("active");
      });

      // Show target page
      const targetPage = document.getElementById(`${page}-page`);
      if (targetPage) {
        targetPage.classList.add("active");
        this.currentPage = page;

        // Update navigation active states
        this.updateNavActiveState(page);

        // Scroll to top
        window.scrollTo(0, 0);
      }
    },

    updateNavActiveState(page) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("data-page") === page) {
          link.classList.add("active");
        }
      });
    },

    // Product Management
    loadFeaturedProducts() {
      // Simulate API call
      setTimeout(() => {
        this.products = this.featuredProducts;
      }, 100);
    },

    loadAllProducts() {
      // Merger les produits samples et marchands
      this.allProducts = [...this.featuredProducts, ...this.merchantProducts];
      this.products = this.allProducts;
    },

    loadCurrentProduct() {
      // Get product ID from URL or state
      const urlParams = new URLSearchParams(window.location.search);
      const productId = parseInt(urlParams.get("id")) || 1;

      this.currentProduct =
        this.allProducts.find((p) => p.id === productId) ||
        this.featuredProducts[0];
    },

    viewProduct(product) {
      this.currentProduct = product;
      const url = new URL(window.location);
      url.searchParams.set("page", "product");
      url.searchParams.set("id", product.id);
      history.pushState({ page: "product", id: product.id }, "", url);
      this.showPage("product");
    },

    // Cart Management
    initializeCart() {
      this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
    },

    addToCart(product, quantity = 1) {
      const existingItem = this.cart.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        this.cart.push({
          ...product,
          quantity: quantity,
        });
      }

      this.updateCart();
      this.showToast(`${product.name} ajouté au panier`, "success");
    },

    removeFromCart(productId) {
      const index = this.cart.findIndex((item) => item.id === productId);
      if (index > -1) {
        const removedItem = this.cart.splice(index, 1)[0];
        this.updateCart();
        this.showToast(`${removedItem.name} retiré du panier`, "info");
      }
    },

    updateCartQuantity(productId, newQuantity) {
      const item = this.cart.find((item) => item.id === productId);
      if (item) {
        if (newQuantity <= 0) {
          this.removeFromCart(productId);
        } else {
          item.quantity = newQuantity;
          this.updateCart();
        }
      }
    },

    updateCart() {
      this.cartCount = this.cart.reduce((sum, item) => sum + item.quantity, 0);
      localStorage.setItem("cart", JSON.stringify(this.cart));
    },

    getCartTotal() {
      return this.cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },

    clearCart() {
      this.cart = [];
      this.updateCart();
      this.showToast("Panier vidé", "info");
    },

    // Purchase Actions
    buyNow(product) {
      // Clear cart and add single product
      this.cart = [
        {
          ...product,
          quantity: 1,
        },
      ];
      this.updateCart();
      this.navigateTo("checkout");
    },

    // Authentication
    checkAuthStatus() {
      this.isLoggedIn = !!this.currentUser;
    },

    login(email, password) {
      return this.loginWithSupabase(email, password);
    },

    async loginWithSupabase(email, password) {
      try {
        // Validation côté client
        if (!this.isValidEmail(email)) {
          this.showToast("Adresse email invalide", "error");
          return false;
        }

        if (password.length < 6) {
          this.showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
          return false;
        }

        // 1. Authentifier avec Supabase
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (authError) {
          this.showToast(`Erreur de connexion: ${authError.message}`, "error");
          throw authError;
        }

        // 2. Récupérer le profil depuis la table users
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (userError) throw userError;

        // 3. Mettre à jour currentUser
        this.currentUser = {
          id: userData.id,
          email: userData.email,
          firstName: userData.first_name,
          lastName: userData.last_name,
          phone: userData.phone,
          merchantId: userData.merchant_id,
          role: userData.role
        };

        this.isLoggedIn = true;
        this.showToast("Connexion réussie", "success");
        this.navigateTo("home");
        return true;
      } catch (error) {
        console.error('Login error:', error);
        this.showToast(error.message || "Email ou mot de passe incorrect", "error");
        return false;
      }
    },

    register(userData) {
      return this.registerWithSupabase(userData);
    },

    async registerWithSupabase(userData) {
      try {
        // Validation côté client
        if (!this.isValidEmail(userData.email)) {
          this.showToast("Adresse email invalide", "error");
          return false;
        }

        if (userData.password.length < 6) {
          this.showToast("Le mot de passe doit contenir au moins 6 caractères", "error");
          return false;
        }

        if (!userData.firstName || !userData.lastName) {
          this.showToast("Nom et prénom requis", "error");
          return false;
        }

        // Sanitize inputs
        userData.firstName = this.sanitizeInput(userData.firstName);
        userData.lastName = this.sanitizeInput(userData.lastName);
        userData.email = this.sanitizeInput(userData.email);
        if (!userData.email || !userData.password) {
          this.showToast("Veuillez remplir tous les champs", "error");
          return false;
        }

        // 1. Créer l'utilisateur dans Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: userData.email,
          password: userData.password,
        });

        if (authError) throw authError;

        // 2. Créer le profil marchand dans la table users
        const merchantId = `merchant_${Date.now()}`;
        const { error: insertError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            email: userData.email,
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
            merchant_id: merchantId,
            role: 'merchant'
          }]);

        if (insertError) throw insertError;

        // 3. Mettre à jour currentUser local
        this.currentUser = {
          id: authData.user.id,
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          merchantId: merchantId,
          role: 'merchant'
        };

        this.isLoggedIn = true;
        this.showToast("Compte créé avec succès ! Vous pouvez maintenant poster des produits.", "success");
        this.navigateTo("merchant-products");
        return true;
      } catch (error) {
        console.error('Registration error:', error);
        this.showToast(error.message || "Erreur lors de l'inscription", "error");
        return false;
      }
    },

    async logout() {
      await supabase.auth.signOut();
      this.currentUser = null;
      this.isLoggedIn = false;
      this.showToast("Déconnexion réussie", "info");
      this.navigateTo("home");
    },

    // ========== SUPABASE SESSION MANAGEMENT ==========
    
    async checkSupabaseSession() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          // User est connecté, récupérer son profil
          const { data: userData, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (userData && !error) {
            this.currentUser = {
              id: userData.id,
              email: userData.email,
              firstName: userData.first_name,
              lastName: userData.last_name,
              phone: userData.phone,
              merchantId: userData.merchant_id,
              role: userData.role
            };
            this.isLoggedIn = true;
            console.log('✅ Session restaurée:', this.currentUser.email);
          }
        } else {
          this.currentUser = null;
          this.isLoggedIn = false;
        }
      } catch (error) {
        console.error('Session check error:', error);
      }
    },

    setupAuthListener() {
      supabase.auth.onAuthStateChange((event, session) => {
        if (event === 'SIGNED_OUT') {
          this.currentUser = null;
          this.isLoggedIn = false;
          this.navigateTo('home');
        }
      });
    },

    // Merchant Actions
    becomeMerchant() {
      // Fonction obsolète - Tout user est déjà merchant
      // Gardée pour compatibilité navigation HTML
      if (!this.isLoggedIn) {
        this.showToast(
          "Veuillez vous connecter",
          "error"
        );
        this.navigateTo("login");
        return;
      }

      // Rediriger vers dashboard produits
      this.navigateTo("merchant-products");
    },

    // Check if current user is merchant (always true in MVP)
    isMerchant() {
      return this.isLoggedIn && this.currentUser?.role === "merchant";
    },

    // Check if user can edit a specific product
    canEditProduct(product) {
      if (!this.isLoggedIn) return false;
      if (!this.isMerchant()) return false;
      if (!product.merchantId) return false; // Sample products
      return product.merchantId === this.currentUser.merchantId;
    },

    // Get merchant display name
    getMerchantName() {
      if (!this.currentUser) return "Anonyme";
      return `${this.currentUser.firstName} ${this.currentUser.lastName}`;
    },

    // ========== CRUD PRODUCTS ==========
    
    // Load merchant products from Supabase
    async loadMerchantProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Convertir format Supabase → format App
        this.merchantProducts = data.map(p => ({
          id: p.id,
          merchantId: p.merchant_id,
          merchantName: p.merchant_name || 'Marchand',
          name: p.name,
          price: parseFloat(p.price),
          image: p.image,
          category: p.category,
          description: p.description,
          stock: p.stock,
          status: p.status,
          vendor: p.merchant_name || 'Marchand',
          rating: parseFloat(p.rating) || 0,
          reviews: p.reviews || 0,
          createdAt: new Date(p.created_at).getTime(),
          updatedAt: new Date(p.updated_at).getTime()
        }));
        
        console.log(`✅ ${this.merchantProducts.length} produits chargés depuis Supabase`);
      } catch (error) {
        console.error('Load products error:', error);
        this.merchantProducts = [];
      }
    },

    // Save merchant products (obsolète avec Supabase - gardé pour compatibilité)
    saveMerchantProducts() {
      this.loadAllProducts(); // Refresh merged products
    },

    // Get products of current merchant
    getMyProducts() {
      if (!this.isMerchant()) return [];
      return this.merchantProducts.filter(
        (p) => p.merchantId === this.currentUser.merchantId
      );
    },

    // Add new merchant product
    addMerchantProduct(productData) {
      return this.addProductToSupabase(productData);
    },

    async addProductToSupabase(productData) {
      if (!this.isMerchant()) {
        this.showToast("Vous devez être marchand pour ajouter des produits", "error");
        return false;
      }

      try {
        const { data, error } = await supabase
          .from('products')
          .insert([{
            merchant_id: this.currentUser.merchantId,
            name: productData.name,
            price: parseFloat(productData.price),
            image: productData.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            category: productData.category,
            description: productData.description,
            stock: parseInt(productData.stock) || 0,
            status: 'active',
            rating: 0,
            reviews: 0
          }])
          .select()
          .single();

        if (error) throw error;

        // Ajouter au state local
        this.merchantProducts.push({
          id: data.id,
          merchantId: data.merchant_id,
          merchantName: data.merchant_name,
          name: data.name,
          price: parseFloat(data.price),
          image: data.image,
          category: data.category,
          description: data.description,
          stock: data.stock,
          status: data.status,
          vendor: data.merchant_name,
          rating: 0,
          reviews: 0,
          createdAt: new Date(data.created_at).getTime(),
          updatedAt: new Date(data.updated_at).getTime()
        });

        this.loadAllProducts();
        this.showToast("Produit ajouté avec succès", "success");
        this.showAddProductForm = false;
        return true;
      } catch (error) {
        console.error('Add product error:', error);
        this.showToast(error.message || "Erreur lors de l'ajout", "error");
        return false;
      }
    },

    // Update existing product
    updateProduct(productId, updatedData) {
      return this.updateProductInSupabase(productId, updatedData);
    },

    async updateProductInSupabase(productId, updatedData) {
      try {
        const { error } = await supabase
          .from('products')
          .update({
            name: updatedData.name,
            price: parseFloat(updatedData.price),
            image: updatedData.image,
            category: updatedData.category,
            description: updatedData.description,
            stock: parseInt(updatedData.stock),
            updated_at: new Date().toISOString()
          })
          .eq('id', productId)
          .eq('merchant_id', this.currentUser.merchantId); // Sécurité RLS

        if (error) throw error;

        // Mettre à jour le state local
        const index = this.merchantProducts.findIndex(p => p.id === productId);
        if (index > -1) {
          this.merchantProducts[index] = {
            ...this.merchantProducts[index],
            name: updatedData.name,
            price: parseFloat(updatedData.price),
            image: updatedData.image,
            category: updatedData.category,
            description: updatedData.description,
            stock: parseInt(updatedData.stock),
            updatedAt: Date.now()
          };
        }

        this.loadAllProducts();
        this.showToast("Produit mis à jour avec succès", "success");
        this.editingProduct = null;
        this.showAddProductForm = false;
        return true;
      } catch (error) {
        console.error('Update product error:', error);
        this.showToast("Erreur lors de la mise à jour", "error");
        return false;
      }
    },

    // Delete product
    deleteProduct(productId) {
      return this.deleteProductFromSupabase(productId);
    },

    async deleteProductFromSupabase(productId) {
      if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
        return false;
      }

      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', productId)
          .eq('merchant_id', this.currentUser.merchantId); // Sécurité RLS

        if (error) throw error;

        // Retirer du state local
        this.merchantProducts = this.merchantProducts.filter(p => p.id !== productId);
        this.loadAllProducts();
        this.showToast("Produit supprimé avec succès", "success");
        return true;
      } catch (error) {
        console.error('Delete product error:', error);
        this.showToast("Erreur lors de la suppression", "error");
        return false;
      }
    },

    // Start editing product
    startEditProduct(product) {
      if (!this.canEditProduct(product)) {
        this.showToast("Vous ne pouvez pas modifier ce produit", "error");
        return;
      }
      this.editingProduct = { ...product };
      this.showAddProductForm = true;
    },

    // Cancel editing
    cancelEditProduct() {
      this.editingProduct = null;
      this.showAddProductForm = false;
    },

    // WhatsApp Integration
    contactViaWhatsApp(product = null) {
      const phoneNumber = "+237123456789"; // Replace with actual number
      let message =
        "Bonjour, je suis intéressé(e) par vos produits sur Mervason.";

      if (product) {
        message = `Bonjour, je suis intéressé(e) par le produit "${product.name}" (${product.price} FCFA) sur Mervason.`;
      }

      const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappUrl, "_blank");
    },

    // Toast Notifications
    showToast(message, type = "success") {
      this.toast = {
        show: true,
        message: message,
        type: type,
      };

      // Auto hide after 3 seconds
      setTimeout(() => {
        this.hideToast();
      }, 3000);
    },

    hideToast() {
      this.toast.show = false;
    },

    // Form Handlers
    handleLoginForm(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const email = formData.get("email");
      const password = formData.get("password");
      this.login(email, password);
    },

    handleRegisterForm(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const userData = {
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        password: formData.get("password"),
      };
      this.register(userData);
    },

    handleContactForm(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      const contactData = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      };

      // Simulate form submission
      this.showToast("Message envoyé avec succès", "success");
      event.target.reset();
    },

    handleCheckoutForm(event) {
      event.preventDefault();

      if (this.cart.length === 0) {
        this.showToast("Votre panier est vide", "error");
        return;
      }

      const formData = new FormData(event.target);
      const orderData = {
        items: this.cart,
        total: this.getCartTotal(),
        shipping: {
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          address: formData.get("address"),
          city: formData.get("city"),
        },
        payment: {
          method: formData.get("paymentMethod"),
        },
      };

      // Simulate order processing
      setTimeout(() => {
        this.clearCart();
        this.showToast("Commande passée avec succès!", "success");

        // Redirect to WhatsApp for payment confirmation
        const message = `Nouvelle commande Mervason:\nTotal: ${orderData.total} FCFA\nMode de paiement: ${orderData.payment.method}`;
        this.contactViaWhatsApp({ name: "Commande", price: orderData.total });

        this.navigateTo("home");
      }, 1000);
    },

    handleAddProductForm(event) {
      event.preventDefault();
      const formData = new FormData(event.target);
      
      const productData = {
        name: formData.get("name"),
        price: formData.get("price"),
        image: formData.get("image"),
        category: formData.get("category"),
        description: formData.get("description"),
        stock: formData.get("stock"),
      };

      if (this.editingProduct) {
        // Update existing product
        this.updateProduct(this.editingProduct.id, productData);
      } else {
        // Add new product
        this.addMerchantProduct(productData);
      }
      
      event.target.reset();
    },

    // Search Functionality
    searchProducts(query) {
      if (!query.trim()) {
        this.products = this.allProducts;
        return;
      }

      const filteredProducts = this.allProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query.toLowerCase()) ||
          product.description.toLowerCase().includes(query.toLowerCase()) ||
          product.category.toLowerCase().includes(query.toLowerCase())
      );

      this.products = filteredProducts;
      this.showToast(`${filteredProducts.length} produit(s) trouvé(s)`, "info");
    },

    // Utility Functions
    formatPrice(price) {
      return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("fr-FR");
    },

    isValidEmail(email) {
      // Validation email plus stricte
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    },

    // Sanitize input pour éviter XSS
    sanitizeInput(input) {
      if (typeof input !== 'string') return input;
      return input.trim().replace(/[<>"']/g, '');
    },

    // Loading States
    showLoading(element) {
      if (element) {
        element.innerHTML = '<div class="loading-spinner mx-auto"></div>';
      }
    },

    hideLoading(element, originalContent) {
      if (element) {
        element.innerHTML = originalContent;
      }
    },

    // Error Handling
    handleError(error) {
      console.error("Application Error:", error);
      this.showToast("Une erreur est survenue", "error");
    },

    // Local Storage Helpers
    saveToStorage(key, data) {
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },

    loadFromStorage(key) {
      try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
      } catch (error) {
        console.error("Error loading from localStorage:", error);
        return null;
      }
    },

    // Performance Optimization
    debounce(func, wait) {
      let timeout;
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout);
          func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
      };
    },
  };
}

// Additional utility functions outside Alpine
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tooltips, lazy loading, etc.
  initializeLazyLoading();
  initializeTooltips();
  initializeAnimations();
});

// Lazy Loading Images
function initializeLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy-image");
        img.classList.add("loaded");
        observer.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
}

// Initialize Tooltips
function initializeTooltips() {
  const tooltipElements = document.querySelectorAll("[data-tooltip]");
  tooltipElements.forEach((element) => {
    element.addEventListener("mouseenter", showTooltip);
    element.addEventListener("mouseleave", hideTooltip);
  });
}

function showTooltip(event) {
  const tooltip = document.createElement("div");
  tooltip.className =
    "tooltip absolute z-50 bg-gray-900 text-white text-sm rounded px-2 py-1 pointer-events-none";
  tooltip.textContent = event.target.dataset.tooltip;
  document.body.appendChild(tooltip);

  // Position tooltip
  const rect = event.target.getBoundingClientRect();
  tooltip.style.left =
    rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + "px";
  tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + "px";
}

function hideTooltip() {
  const tooltip = document.querySelector(".tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Initialize Animations
function initializeAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  document
    .querySelectorAll(".product-card, .testimonial-card, .feature-card")
    .forEach((el) => {
      observer.observe(el);
    });
}

// Smooth scrolling for anchor links
document.addEventListener("click", function (e) {
  if (e.target.matches('a[href^="#"]')) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }
});

// Handle form validation
function validateForm(form) {
  const inputs = form.querySelectorAll(
    "input[required], textarea[required], select[required]"
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.classList.add("error");
      isValid = false;
    } else {
      input.classList.remove("error");
    }

    // Email validation
    if (input.type === "email" && input.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(input.value)) {
        input.classList.add("error");
        isValid = false;
      }
    }
  });

  return isValid;
}

// PWA Support
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// Handle online/offline status
window.addEventListener("online", () => {
  document.body.classList.remove("offline");
  console.log("App is online");
});

window.addEventListener("offline", () => {
  document.body.classList.add("offline");
  console.log("App is offline");
});

// Performance monitoring
function measurePerformance() {
  if ("performance" in window) {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const perfData = performance.getEntriesByType("navigation")[0];
        console.log(
          "Page load time:",
          perfData.loadEventEnd - perfData.loadEventStart
        );
      }, 0);
    });
  }
}

measurePerformance();
