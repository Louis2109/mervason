-- ========================================
-- SCRIPT POUR CRÉER LES PROFILS MERCHANTS
-- Pour les users déjà existants
-- ========================================
-- À exécuter dans Supabase SQL Editor

-- Créer des profils merchant pour tous les users existants qui n'en ont pas
INSERT INTO public.merchant_profiles (user_id, phone, business_name)
SELECT 
    au.id,
    COALESCE(au.raw_user_meta_data->>'phone', '+237000000000') as phone,
    COALESCE(
        CONCAT(
            au.raw_user_meta_data->>'firstName', 
            ' ', 
            au.raw_user_meta_data->>'lastName'
        ),
        SPLIT_PART(au.email, '@', 1)
    ) as business_name
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.merchant_profiles mp WHERE mp.user_id = au.id
)
ON CONFLICT (user_id) DO NOTHING;

-- Vérifier le résultat
SELECT 
    COUNT(*) as total_users,
    (SELECT COUNT(*) FROM public.merchant_profiles) as total_merchant_profiles
FROM auth.users;

-- Afficher les users sans profil (devrait être 0)
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
WHERE NOT EXISTS (
    SELECT 1 FROM public.merchant_profiles mp WHERE mp.user_id = au.id
);
