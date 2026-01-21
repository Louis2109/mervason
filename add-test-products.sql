-- ========================================
-- AJOUTER DES PRODUITS DE TEST
-- ========================================
-- Exécute ce script si tu n'as aucun produit dans la BD

DO $$
DECLARE
    test_merchant_id UUID;
    products_added INTEGER := 0;
BEGIN
    -- Récupérer le premier merchant
    SELECT id INTO test_merchant_id 
    FROM public.merchant_profiles 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF test_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Aucun merchant_profile ! Connecte-toi d''abord à l''app pour créer ton profil.';
    END IF;
    
    RAISE NOTICE 'Ajout de produits pour merchant: %', test_merchant_id;
    
    -- Ajouter 5 produits de test
    INSERT INTO public.products (merchant_id, name, price, category, description, image_url, stock)
    VALUES
        (test_merchant_id, 'iPhone 15 Pro', 750000, 'Électronique', 'Smartphone Apple dernière génération', 'https://images.unsplash.com/photo-1678685888221-cda773a3dcdb?w=400', 10),
        (test_merchant_id, 'Samsung Galaxy S24', 650000, 'Électronique', 'Flagship Samsung avec écran AMOLED', 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 15),
        (test_merchant_id, 'MacBook Air M3', 1200000, 'Électronique', 'Ordinateur portable ultra-léger Apple', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 5),
        (test_merchant_id, 'Robe Ankara', 25000, 'Mode', 'Robe traditionnelle africaine élégante', 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=400', 20),
        (test_merchant_id, 'Chaussures Nike', 85000, 'Mode', 'Baskets Nike Air Max confortables', 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 12)
    ON CONFLICT DO NOTHING;
    
    GET DIAGNOSTICS products_added = ROW_COUNT;
    
    RAISE NOTICE '✅ % produits de test ajoutés', products_added;
END $$;

-- Vérifier les produits
SELECT 
    p.name,
    p.price,
    p.category,
    mp.business_name as vendeur,
    mp.phone
FROM public.products p
JOIN public.merchant_profiles mp ON p.merchant_id = mp.id
ORDER BY p.created_at DESC
LIMIT 10;
