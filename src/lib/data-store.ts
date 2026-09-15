import { createClient } from './supabase/client';
import { Project, Review } from './supabase/types';

export interface VisionQuestionnaire {
  id: string;
  client_name: string;
  email: string;
  phone?: string;
  brand_name?: string;
  services_requested: string[];
  vision_description: string;
  target_audience?: string;
  estimated_budget?: string;
  preferred_timeline?: string;
  status?: string;
  created_at?: string;
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '1',
    title: 'LUXURY BRAND CAMPAIGN',
    slug: 'luxury-brand-campaign',
    category: 'Photography',
    description: 'High-fashion campaign photography and editorial portraiture for premium luxury lifestyle brand.',
    client_name: 'Maison Noir',
    year: '2025',
    image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop'
    ],
    tags: ['Brand Photography', 'Editorial Portraits', 'Commercial'],
    featured: true
  },
  {
    id: '2',
    title: 'CORPORATE HIGHLIGHTS FILM',
    slug: 'corporate-highlights-film',
    category: 'Videography',
    description: 'Cinematic event video highlights and executive talking head interviews for annual global tech summit.',
    client_name: 'Vortex Global',
    year: '2025',
    image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?q=80&w=1600&auto=format&fit=crop'
    ],
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    tags: ['Event Highlights', 'Talking Head', 'Videography'],
    featured: true
  },
  {
    id: '3',
    title: 'BRAND IDENT & FLYER SYSTEM',
    slug: 'brand-ident-flyer-system',
    category: 'Graphic Design',
    description: 'Complete promotional flyer design system, presentation deck, and carousel graphics for product launch.',
    client_name: 'Nebula Labs',
    year: '2025',
    image_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop'
    ],
    tags: ['Graphic Design', 'Flyers', 'Presentation Deck'],
    featured: true
  },
  {
    id: '4',
    title: 'BEHIND THE SCENES DOCUMENTARY',
    slug: 'behind-the-scenes-doc',
    category: 'Videography',
    description: 'Documentary style behind-the-scenes video production and social media video series.',
    client_name: 'Chronos Watchmakers',
    year: '2024',
    image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1600&auto=format&fit=crop'
    ],
    video_url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    tags: ['Behind The Scenes', 'Social Media Video', 'Promotional'],
    featured: false
  },
  {
    id: '5',
    title: 'E-COMMERCE PRODUCT CATALOG',
    slug: 'e-commerce-product-catalog',
    category: 'Photography',
    description: 'Studio product photography and commercial campaign imagery optimized for online store conversion.',
    client_name: 'Aura Beauty',
    year: '2024',
    image_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1600&auto=format&fit=crop'
    ],
    tags: ['Product Photography', 'E-Commerce', 'Commercial'],
    featured: true
  },
  {
    id: '6',
    title: 'SOCIAL MEDIA CAROUSELS',
    slug: 'social-media-carousels',
    category: 'Graphic Design',
    description: 'High-engagement social media carousel slide designs and seasonal promotional graphics.',
    client_name: 'Synthesis Media',
    year: '2025',
    image_url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop',
    gallery_images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1600&auto=format&fit=crop'
    ],
    tags: ['Carousel Design', 'Social Media', 'Flyers'],
    featured: false
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'r1',
    author_name: 'Evelyn Vance',
    author_role: 'Marketing Director, Maison Noir',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    content: 'ODA (Olufemi Digital Agency) is truly our one-stop media partner. Their Client Vision Questionnaire helped us organize our thoughts effortlessly, and the photography and video campaign exceeded our highest expectations.',
    rating: 5
  },
  {
    id: 'r2',
    author_name: 'Marcus Thorne',
    author_role: 'Head of Communications, TechSummit',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    content: 'Having videography, photography, and graphic design delivered seamlessly by one team made our corporate event coverage stress-free. ODA understands before they create.',
    rating: 5
  },
  {
    id: 'r3',
    author_name: 'Sora Takahashi',
    author_role: 'Founder, Aura Beauty',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    content: 'The product photos and campaign videos ODA produced elevated our online store presence immediately. Professionalism and reliability at its finest!',
    rating: 5
  }
];

export async function fetchProjects(): Promise<Project[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Project[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local data', err);
    }
  }
  return INITIAL_PROJECTS;
}

export async function fetchReviews(): Promise<Review[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Review[];
      }
    } catch (err) {
      console.warn('Supabase fetch failed, fallback to local data', err);
    }
  }
  return INITIAL_REVIEWS;
}

export async function fetchVisionQuestionnaires(): Promise<VisionQuestionnaire[]> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('vision_questionnaires').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as VisionQuestionnaire[];
      }
    } catch (err) {
      console.warn('Supabase fetch questionnaires failed', err);
    }
  }
  return [
    {
      id: 'q1',
      client_name: 'Evelyn Vance',
      email: 'evelyn@maisonnoir.com',
      brand_name: 'Maison Noir',
      services_requested: ['Photography', 'Videography'],
      vision_description: 'High fashion campaign photography and behind the scenes documentary video for Paris Fashion Week.',
      estimated_budget: 'Custom',
      preferred_timeline: 'Within 2-4 Weeks',
      status: 'new',
      created_at: new Date().toISOString()
    }
  ];
}

export async function uploadMediaFile(file: File): Promise<string> {
  const supabase = createClient();
  if (supabase) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('oda-assets')
        .upload(filePath, file);

      if (!uploadError) {
        const { data } = supabase.storage.from('oda-assets').getPublicUrl(filePath);
        if (data?.publicUrl) {
          return data.publicUrl;
        }
      }
    } catch (e) {
      console.warn('Supabase storage upload failed, converting to object URL locally', e);
    }
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.readAsDataURL(file);
  });
}

export async function saveProjectToDatabase(newProject: Omit<Project, 'id'>): Promise<Project> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').insert([newProject]).select().single();
      if (!error && data) {
        return data as Project;
      }
    } catch (e) {
      console.warn('Failed to insert project into Supabase', e);
    }
  }

  return {
    ...newProject,
    id: `p-${Date.now()}`
  };
}

export async function deleteProjectFromDatabase(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete project', e);
    }
  }
  return true;
}

export async function saveReviewToDatabase(newReview: Omit<Review, 'id'>): Promise<Review> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').insert([newReview]).select().single();
      if (!error && data) {
        return data as Review;
      }
    } catch (e) {
      console.warn('Failed to insert review into Supabase', e);
    }
  }

  return {
    ...newReview,
    id: `r-${Date.now()}`
  };
}

export async function deleteReviewFromDatabase(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('reviews').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete review', e);
    }
  }
  return true;
}

export async function saveVisionQuestionnaire(data: Omit<VisionQuestionnaire, 'id'>): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('vision_questionnaires').insert([data]);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to insert vision questionnaire into Supabase', e);
    }
  }

  return true;
}

export async function deleteQuestionnaireFromDatabase(id: string): Promise<boolean> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { error } = await supabase.from('vision_questionnaires').delete().eq('id', id);
      if (!error) return true;
    } catch (e) {
      console.warn('Failed to delete questionnaire', e);
    }
  }
  return true;
}
