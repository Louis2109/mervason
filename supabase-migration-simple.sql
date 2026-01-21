-- ========================================
-- MERVASON - MIGRATION SIMPLIFIÉE (SANS TRIGGER)
-- Date: 2026-01-17
-- Version: MVP Compatible
-- ========================================

-- 1. CRÉATION TABLE MERCHANT_PROFILES
-- ========================================
CREATE TABLE IF NOT EXISTS public.merchant_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    phone TEXT NOT NULL,
    business_name TEXT DEFAULT 'Ma Boutique',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Contrainte: un user = un seul profil merchant
    CONSTRAINT unique_user_merchant UNIQUE(user_id)
);

-- Index pour performance
CREATE INDEX IF NOT EXISTS idx_merchant_profiles_user_id 
ON public.merchant_profiles(user_id);

COMMENT ON TABLE public.merchant_profiles IS 'Profils marchands - contient les infos business (phone pour WhatsApp)';
COMMENT ON COLUMN public.merchant_profiles.phone IS 'Numéro WhatsApp du marchand (format: +237XXXXXXXXX)';


-- 2. VÉRIFICATION/MODIFICATION TABLE PRODUCTS
-- ========================================

-- Vérifier si la table existe
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        -- Créer la table si elle n'existe pas
        CREATE TABLE public.products (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            merchant_id UUID NOT NULL REFERENCES public.merchant_profiles(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
            image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
            category TEXT,
            description TEXT,
            stock INTEGER DEFAULT 0 CHECK (stock >= 0),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Index pour performance
        CREATE INDEX idx_products_merchant_id ON public.products(merchant_id);
        CREATE INDEX idx_products_category ON public.products(category);
        
        RAISE NOTICE 'Table products créée avec succès';
    ELSE
        -- Ajouter la colonne image_url si elle n'existe pas
        IF NOT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'products' 
            AND column_name = 'image_url'
        ) THEN
            ALTER TABLE public.products 
            ADD COLUMN image_url TEXT DEFAULT 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop';
            
            RAISE NOTICE 'Colonne image_url ajoutée à products';
        END IF;
        
        RAISE NOTICE 'Table products existe déjà';
    END IF;
END $$;

COMMENT ON TABLE public.products IS 'Produits mis en vente par les marchands';
COMMENT ON COLUMN public.products.image_url IS 'URL image produit (utilise image par défaut si NULL)';


-- 3. FONCTION HELPER: RÉCUPÉRER MERCHANT_ID DEPUIS USER_ID
-- ========================================

CREATE OR REPLACE FUNCTION public.get_merchant_id_from_user_id(p_user_id UUID)
RETURNS UUID AS $$
    SELECT id FROM public.merchant_profiles WHERE user_id = p_user_id LIMIT 1;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION public.get_merchant_id_from_user_id(UUID) IS 'Retourne le merchant_id à partir du user_id';


-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================

-- Activer RLS sur merchant_profiles
ALTER TABLE public.merchant_profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut lire les profils (pour afficher infos vendeur)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.merchant_profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.merchant_profiles FOR SELECT
USING (true);

-- Policy: Les users peuvent créer leur propre profil
DROP POLICY IF EXISTS "Users can create their own profile" ON public.merchant_profiles;
CREATE POLICY "Users can create their own profile"
ON public.merchant_profiles FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Policy: Les users peuvent modifier leur propre profil
DROP POLICY IF EXISTS "Users can update their own profile" ON public.merchant_profiles;
CREATE POLICY "Users can update their own profile"
ON public.merchant_profiles FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Les users peuvent supprimer leur propre profil
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.merchant_profiles;
CREATE POLICY "Users can delete their own profile"
ON public.merchant_profiles FOR DELETE
USING (auth.uid() = user_id);


-- Activer RLS sur products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Policy: Tout le monde peut voir les produits
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
CREATE POLICY "Products are viewable by everyone"
ON public.products FOR SELECT
USING (true);

-- Policy: Les marchands peuvent créer leurs produits
DROP POLICY IF EXISTS "Merchants can create their own products" ON public.products;
CREATE POLICY "Merchants can create their own products"
ON public.products FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.merchant_profiles
        WHERE id = merchant_id AND user_id = auth.uid()
    )
);

-- Policy: Les marchands peuvent modifier leurs produits
DROP POLICY IF EXISTS "Merchants can update their own products" ON public.products;
CREATE POLICY "Merchants can update their own products"
ON public.products FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.merchant_profiles
        WHERE id = merchant_id AND user_id = auth.uid()
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.merchant_profiles
        WHERE id = merchant_id AND user_id = auth.uid()
    )
);

-- Policy: Les marchands peuvent supprimer leurs produits
DROP POLICY IF EXISTS "Merchants can delete their own products" ON public.products;
CREATE POLICY "Merchants can delete their own products"
ON public.products FOR DELETE
USING (
    EXISTS (
        SELECT 1 FROM public.merchant_profiles
        WHERE id = merchant_id AND user_id = auth.uid()
    )
);


-- 5. VÉRIFICATIONS FINALES
-- ========================================

-- Compter les profils créés
DO $$
DECLARE
    profile_count INTEGER;
    product_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO profile_count FROM public.merchant_profiles;
    SELECT COUNT(*) INTO product_count FROM public.products;
    
    RAISE NOTICE '✅ Migration terminée avec succès!';
    RAISE NOTICE '📊 Profils merchants: %', profile_count;
    RAISE NOTICE '📦 Produits: %', product_count;
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  IMPORTANT: Les profils merchant seront créés automatiquement lors de l''inscription (via JavaScript)';
END $$;
