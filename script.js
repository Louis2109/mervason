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
      {
        id: 4,
        name: "Chaussures Nike Air Max",
        price: 85000,
        image:
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        category: "Sports & Loisirs",
        description: "Baskets Nike confortables pour le sport et le quotidien",
        vendor: "Sport Plus",
        rating: 4.5,
        reviews: 112,
      },
    ],

    allProducts: [],

    // Initialization
    init() {
      this.initializeTheme();
      this.applyTheme();
      this.initializeCart();
      this.setupNavigation();
      this.loadAllProducts();
      this.checkAuthStatus();
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
      // Simulate loading all products for shop page
      const additionalProducts = [
        {
          id: 5,
          name: "Samsung Galaxy S23",
          price: 580000,
          image:
            "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Électronique",
          description:
            "Smartphone Samsung avec écran AMOLED et appareil photo 200MP",
          vendor: "Mobile World",
          rating: 4.7,
          reviews: 134,
        },
        {
          id: 6,
          name: "Sac à main cuir",
          price: 45000,
          image:
            "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Mode & Beauté",
          description: "Sac à main en cuir véritable, élégant et pratique",
          vendor: "Leather Craft",
          rating: 4.4,
          reviews: 67,
        },
        {
          id: 7,
          name: "Casque Audio Sony",
          price: 125000,
          image:
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Électronique",
          description: "Casque sans fil avec réduction de bruit active",
          vendor: "Audio Pro",
          rating: 4.8,
          reviews: 189,
        },
        {
          id: 8,
          name: "Montre connectée",
          price: 75000,
          image:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
          category: "Électronique",
          description: "Montre intelligente avec suivi de santé et GPS",
          vendor: "Smart Tech",
          rating: 4.5,
          reviews: 98,
        },
      ];

      this.allProducts = [...this.featuredProducts, ...additionalProducts];
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
      // Simulate login
      if (email && password) {
        this.currentUser = {
          id: 1,
          email: email,
          name: "John Doe",
          role: "customer",
        };
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        this.isLoggedIn = true;
        this.showToast("Connexion réussie", "success");
        this.navigateTo("home");
        return true;
      }
      this.showToast("Email ou mot de passe incorrect", "error");
      return false;
    },

    register(userData) {
      // Simulate registration
      if (userData.email && userData.password) {
        this.currentUser = {
          id: Date.now(),
          ...userData,
          role: "customer",
        };
        localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
        this.isLoggedIn = true;
        this.showToast("Compte créé avec succès", "success");
        this.navigateTo("home");
        return true;
      }
      this.showToast("Veuillez remplir tous les champs", "error");
      return false;
    },

    logout() {
      this.currentUser = null;
      this.isLoggedIn = false;
      localStorage.removeItem("currentUser");
      this.showToast("Déconnexion réussie", "info");
      this.navigateTo("home");
    },

    // Merchant Actions
    becomeMerchant() {
      if (!this.isLoggedIn) {
        this.showToast(
          "Veuillez vous connecter pour devenir marchand",
          "error"
        );
        this.navigateTo("login");
        return;
      }

      // Simulate merchant subscription
      this.currentUser.role = "merchant";
      this.currentUser.merchantStatus = "pending";
      localStorage.setItem("currentUser", JSON.stringify(this.currentUser));
      this.showToast("Demande de marchand envoyée", "success");
      this.navigateTo("merchant-dashboard");
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
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
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
