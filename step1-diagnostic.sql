-- ========================================
-- ÉTAPE 1: DIAGNOSTIC - Identifier les produits orphelins
-- ========================================

-- Vérifier combien de produits ont des merchant_id invalides
SELECT 
    'Produits orphelins' as status,
    COUNT(*) as nombre
FROM public.products p
WHERE NOT EXISTS (
    SELECT 1 FROM public.merchant_profiles mp 
    WHERE mp.id = p.merchant_id
);

-- Voir les détails des produits orphelins
SELECT 
    p.id as product_id,
    p.name,
    p.merchant_id as merchant_id_invalide
FROM public.products p
WHERE NOT EXISTS (
    SELECT 1 FROM public.merchant_profiles mp 
    WHERE mp.id = p.merchant_id
)
ORDER BY p.created_at DESC;

-- Vérifier les merchant_profiles disponibles
SELECT 
    'Merchant profiles existants' as status,
    COUNT(*) as nombre,
    ARRAY_AGG(id) as merchant_ids
FROM public.merchant_profiles;
