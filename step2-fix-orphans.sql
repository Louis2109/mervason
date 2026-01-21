-- ========================================
-- ÉTAPE 2: CORRECTION - Assigner les produits orphelins à un merchant existant
-- ========================================

-- Option A: Assigner TOUS les produits orphelins au PREMIER merchant_profile
DO $$
DECLARE
    first_merchant_id UUID;
    orphan_count INTEGER;
BEGIN
    -- Récupérer le premier merchant_profile
    SELECT id INTO first_merchant_id 
    FROM public.merchant_profiles 
    ORDER BY created_at ASC 
    LIMIT 1;
    
    IF first_merchant_id IS NULL THEN
        RAISE EXCEPTION 'Aucun merchant_profile trouvé ! Exécute d''abord create-existing-profiles.sql';
    END IF;
    
    RAISE NOTICE 'Merchant par défaut: %', first_merchant_id;
    
    -- Compter les orphelins
    SELECT COUNT(*) INTO orphan_count
    FROM public.products p
    WHERE NOT EXISTS (
        SELECT 1 FROM public.merchant_profiles mp WHERE mp.id = p.merchant_id
    );
    
    RAISE NOTICE 'Produits orphelins trouvés: %', orphan_count;
    
    -- Corriger les merchant_id invalides
    UPDATE public.products
    SET merchant_id = first_merchant_id
    WHERE NOT EXISTS (
        SELECT 1 FROM public.merchant_profiles mp WHERE mp.id = merchant_id
    );
    
    RAISE NOTICE '✅ % produits réassignés au merchant %', orphan_count, first_merchant_id;
END $$;

-- Vérifier qu'il n'y a plus d'orphelins
SELECT 
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Aucun produit orphelin'
        ELSE '❌ Encore ' || COUNT(*) || ' produits orphelins'
    END as status
FROM public.products p
WHERE NOT EXISTS (
    SELECT 1 FROM public.merchant_profiles mp WHERE mp.id = p.merchant_id
);
