-- ========================================
-- FIX: Forcer la relation products -> merchant_profiles
-- ========================================

-- Supprimer l'ancienne contrainte si elle existe
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'products_merchant_id_fkey' 
        AND table_name = 'products'
    ) THEN
        ALTER TABLE public.products DROP CONSTRAINT products_merchant_id_fkey;
        RAISE NOTICE 'Ancienne contrainte supprimée';
    END IF;
END $$;

-- Recréer la contrainte foreign key
ALTER TABLE public.products
ADD CONSTRAINT products_merchant_id_fkey 
FOREIGN KEY (merchant_id) 
REFERENCES public.merchant_profiles(id) 
ON DELETE CASCADE;

-- Vérifier la contrainte
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.table_name = 'products' 
    AND tc.constraint_type = 'FOREIGN KEY';

RAISE NOTICE '✅ Contrainte foreign key recréée avec succès';
