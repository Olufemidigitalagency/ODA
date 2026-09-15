-- ========================================================
-- ODA (OLUFEMI DIGITAL AGENCY) - SUPABASE BACKEND SCHEMA
-- Includes Admin Role Security Policies & Vision Questionnaires
-- Execute this script in your Supabase SQL Editor:
-- (Supabase Dashboard -> SQL Editor -> New Query -> Run)
-- ========================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --------------------------------------------------------
-- 1. PROJECTS TABLE
-- Stores Olufemi Digital Agency portfolio projects
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'Photography', 'Videography', 'Graphic Design', 'Campaigns'
    description TEXT NOT NULL,
    client_name VARCHAR(255),
    year VARCHAR(10) DEFAULT '2025',
    image_url TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_category ON public.projects(category);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON public.projects(featured);

-- --------------------------------------------------------
-- 2. REVIEWS TABLE
-- Stores client testimonials & feedback
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(255) NOT NULL,
    author_avatar TEXT,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    approved BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_reviews_created ON public.reviews(created_at DESC);

-- --------------------------------------------------------
-- 3. CLIENT VISION QUESTIONNAIRES TABLE
-- Stores structured responses from the ODA Client Vision Questionnaire
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.vision_questionnaires (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    brand_name VARCHAR(255),
    services_requested TEXT[] DEFAULT '{}',
    vision_description TEXT NOT NULL,
    target_audience TEXT,
    estimated_budget VARCHAR(100),
    preferred_timeline VARCHAR(100),
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'in_review', 'contacted'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vision_created ON public.vision_questionnaires(created_at DESC);

-- --------------------------------------------------------
-- 4. PROFILES TABLE (Linked with Supabase Auth)
-- Stores user role ('admin' or 'client')
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin', -- Set to admin by default for main agency owner
    avatar_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
    VALUES (
        new.id,
        new.email,
        coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
        new.raw_user_meta_data->>'avatar_url',
        'admin' -- Default new registrations as admin for ODA portal management
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- --------------------------------------------------------
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vision_questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Projects Policies: Public read, Authenticated Admin insert/update/delete
DROP POLICY IF EXISTS "Public can view projects" ON public.projects;
CREATE POLICY "Public can view projects" ON public.projects FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage projects" ON public.projects;
CREATE POLICY "Authenticated users can manage projects" ON public.projects FOR ALL USING (auth.role() = 'authenticated');

-- Reviews Policies: Public read approved reviews, Authenticated Admin manage all
DROP POLICY IF EXISTS "Public can view approved reviews" ON public.reviews;
CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated users can manage reviews" ON public.reviews;
CREATE POLICY "Authenticated users can manage reviews" ON public.reviews FOR ALL USING (auth.role() = 'authenticated');

-- Vision Questionnaires Policies: Public insert, Authenticated Admin view & manage
DROP POLICY IF EXISTS "Anyone can submit vision questionnaire" ON public.vision_questionnaires;
CREATE POLICY "Anyone can submit vision questionnaire" ON public.vision_questionnaires FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users can view vision questionnaires" ON public.vision_questionnaires;
CREATE POLICY "Authenticated users can view vision questionnaires" ON public.vision_questionnaires FOR SELECT USING (true);

-- --------------------------------------------------------
-- 6. STORAGE BUCKET FOR MEDIA & UPLOADS
-- --------------------------------------------------------
INSERT INTO storage.buckets (id, name, public)
VALUES ('oda-assets', 'oda-assets', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public can view oda-assets" ON storage.objects;
CREATE POLICY "Public can view oda-assets" ON storage.objects FOR SELECT USING (bucket_id = 'oda-assets');

DROP POLICY IF EXISTS "Anyone can upload to oda-assets" ON storage.objects;
CREATE POLICY "Anyone can upload to oda-assets" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'oda-assets');

-- --------------------------------------------------------
-- 7. SEED DATA FOR OLUFEMI DIGITAL AGENCY (ODA)
-- --------------------------------------------------------
INSERT INTO public.projects (title, slug, category, description, client_name, year, image_url, tags, featured)
VALUES
('LUXURY BRAND CAMPAIGN', 'luxury-brand-campaign', 'Photography', 'High-fashion campaign photography and editorial portraiture for premium luxury lifestyle brand.', 'Maison Noir', '2025', 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop', ARRAY['Brand Photography', 'Editorial Portraits', 'Commercial'], true),
('CORPORATE HIGHLIGHTS FILM', 'corporate-highlights-film', 'Videography', 'Cinematic event video highlights and executive talking head interviews for annual global tech summit.', 'Vortex Global', '2025', 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop', ARRAY['Event Highlights', 'Talking Head', 'Videography'], true),
('BRAND IDENT & FLYER SYSTEM', 'brand-ident-flyer-system', 'Graphic Design', 'Complete promotional flyer design system, presentation deck, and carousel graphics for product launch.', 'Nebula Labs', '2025', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop', ARRAY['Graphic Design', 'Flyers', 'Presentation Deck'], true),
('BEHIND THE SCENES DOCUMENTARY', 'behind-the-scenes-doc', 'Videography', 'Documentary style behind-the-scenes video production and social media video series.', 'Chronos Watchmakers', '2024', 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop', ARRAY['Behind The Scenes', 'Social Media Video', 'Promotional'], false),
('E-COMMERCE PRODUCT CATALOG', 'e-commerce-product-catalog', 'Photography', 'Studio product photography and commercial campaign imagery optimized for online store conversion.', 'Aura Beauty', '2024', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop', ARRAY['Product Photography', 'E-Commerce', 'Commercial'], true),
('SOCIAL MEDIA CAROUSELS', 'social-media-carousels', 'Graphic Design', 'High-engagement social media carousel slide designs and seasonal promotional graphics.', 'Synthesis Media', '2025', 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop', ARRAY['Carousel Design', 'Social Media', 'Flyers'], false)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.reviews (author_name, author_role, author_avatar, content, rating, approved)
VALUES
('Evelyn Vance', 'Marketing Director, Maison Noir', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop', 'ODA (Olufemi Digital Agency) is truly our one-stop media partner. Their Client Vision Questionnaire helped us organize our thoughts effortlessly, and the photography and video campaign exceeded our highest expectations.', 5, true),
('Marcus Thorne', 'Head of Communications, TechSummit', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop', 'Having videography, photography, and graphic design delivered seamlessly by one team made our corporate event coverage stress-free. ODA understands before they create.', 5, true),
('Sora Takahashi', 'Founder, Aura Beauty', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop', 'The product photos and campaign videos ODA produced elevated our online store presence immediately. Professionalism and reliability at its finest!', 5, true)
ON CONFLICT DO NOTHING;
