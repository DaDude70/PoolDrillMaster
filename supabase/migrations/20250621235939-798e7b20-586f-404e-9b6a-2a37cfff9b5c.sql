
-- Add is_admin column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT false;

-- Update RLS policies for drills to allow admin access
DROP POLICY IF EXISTS "Users can view their own drills" ON public.drills;
DROP POLICY IF EXISTS "Users can update their own drills" ON public.drills;
DROP POLICY IF EXISTS "Users can delete their own drills" ON public.drills;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_user_admin(user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    (SELECT is_admin FROM public.profiles WHERE id = user_id),
    false
  );
$$;

-- New RLS policies that allow admin access to all drills
CREATE POLICY "Users can view their own drills or admin can view all" 
  ON public.drills 
  FOR SELECT 
  USING (auth.uid() = user_id OR public.is_user_admin(auth.uid()));

CREATE POLICY "Users can update their own drills or admin can update all" 
  ON public.drills 
  FOR UPDATE 
  USING (auth.uid() = user_id OR public.is_user_admin(auth.uid()));

CREATE POLICY "Users can delete their own drills or admin can delete all" 
  ON public.drills 
  FOR DELETE 
  USING (auth.uid() = user_id OR public.is_user_admin(auth.uid()));

-- Set the first user (if any exists) as admin
-- This will only affect the first user that was created
UPDATE public.profiles 
SET is_admin = true 
WHERE id = (
  SELECT id 
  FROM public.profiles 
  ORDER BY created_at 
  LIMIT 1
);
