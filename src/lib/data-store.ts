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

const ODA_PROJECTS_KEY = 'oda_projects_data_v4';
const ODA_REVIEWS_KEY = 'oda_reviews_data_v4';
const ODA_QUESTIONNAIRES_KEY = 'oda_questionnaires_data_v4';

const ODA_DELETED_PROJECTS_KEY = 'oda_deleted_projects_v4';
const ODA_DELETED_REVIEWS_KEY = 'oda_deleted_reviews_v4';
const ODA_DELETED_QUESTIONNAIRES_KEY = 'oda_deleted_questionnaires_v4';

function getLocalData<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const stored = localStorage.getItem(key);
    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed as T;
      }
    }
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage`, e);
  }
  try {
    localStorage.setItem(key, JSON.stringify(fallback));
  } catch (e) {}
  return fallback;
}

function setLocalData<T>(key: string, data: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error saving ${key} to localStorage`, e);
  }
}

function getDeletedIds(key: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed as string[];
    }
  } catch (e) {}
  return [];
}

function addDeletedId(key: string, id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getDeletedIds(key);
    if (!current.includes(id)) {
      current.push(id);
      localStorage.setItem(key, JSON.stringify(current));
    }
  } catch (e) {}
}

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const INITIAL_PROJECTS: Project[] = [
  {
    id: '10000000-0000-4000-a000-000000000001',
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
    id: '10000000-0000-4000-a000-000000000002',
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
    id: '10000000-0000-4000-a000-000000000003',
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
    id: '10000000-0000-4000-a000-000000000004',
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
    id: '10000000-0000-4000-a000-000000000005',
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
    id: '10000000-0000-4000-a000-000000000006',
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
    id: 'e1d2c3b4-a5b6-7c8d-9e0f-1a2b3c4d5e6f',
    author_name: 'Evelyn Vance',
    author_role: 'Marketing Director, Maison Noir',
    author_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
    content: 'ODA (Olufemi Digital Agency) is truly our one-stop media partner. Their Client Vision Questionnaire helped us organize our thoughts effortlessly, and the photography and video campaign exceeded our highest expectations.',
    rating: 5,
    approved: true
  },
  {
    id: 'f2e3d4c5-b6a7-8d9e-0f1a-2b3c4d5e6f7a',
    author_name: 'Marcus Thorne',
    author_role: 'Head of Communications, TechSummit',
    author_avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    content: 'Having videography, photography, and graphic design delivered seamlessly by one team made our corporate event coverage stress-free. ODA understands before they create.',
    rating: 5,
    approved: true
  },
  {
    id: 'a3b4c5d6-e7f8-9a0b-1c2d-3e4f5a6b7c8d',
    author_name: 'Sora Takahashi',
    author_role: 'Founder, Aura Beauty',
    author_avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=400&auto=format&fit=crop',
    content: 'The product photos and campaign videos ODA produced elevated our online store presence immediately. Professionalism and reliability at its finest!',
    rating: 5,
    approved: true
  }
];

// ----------------------------------------------------
// PROJECTS DATA API (SUPABASE + LOCALSTORAGE BACKUP)
// ----------------------------------------------------
export async function fetchProjects(): Promise<Project[]> {
  const deletedIds = getDeletedIds(ODA_DELETED_PROJECTS_KEY);
  const supabase = createClient();
  let items: Project[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = data as Project[];
      }
    } catch (err) {
      console.warn('Supabase fetch projects warning', err);
    }
  }

  if (items.length === 0) {
    items = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
  } else {
    const local = getLocalData<Project[]>(ODA_PROJECTS_KEY, []);
    const merged = [...items];
    local.forEach((lp) => {
      if (!merged.some((p) => p.id === lp.id)) {
        merged.push(lp);
      }
    });
    items = merged;
    setLocalData(ODA_PROJECTS_KEY, items);
  }

  return items.filter((p) => !deletedIds.includes(p.id));
}

export async function saveProjectToDatabase(newProject: Omit<Project, 'id'>): Promise<Project> {
  const supabase = createClient();
  const projectId = generateUUID();
  const projectToSave = { ...newProject, id: projectId };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('projects').insert([projectToSave]).select().single();
      if (!error && data) {
        const current = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
        const updated = [data as Project, ...current];
        setLocalData(ODA_PROJECTS_KEY, updated);
        return data as Project;
      }
    } catch (e) {
      console.warn('Failed to insert project into Supabase', e);
    }
  }

  const current = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
  const created: Project = {
    ...newProject,
    id: projectId,
    created_at: new Date().toISOString()
  };
  const updated = [created, ...current];
  setLocalData(ODA_PROJECTS_KEY, updated);
  return created;
}

export async function deleteProjectFromDatabase(id: string): Promise<boolean> {
  addDeletedId(ODA_DELETED_PROJECTS_KEY, id);

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('projects').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete project from Supabase', e);
    }
  }

  const current = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
  const filtered = current.filter((p) => p.id !== id);
  setLocalData(ODA_PROJECTS_KEY, filtered);
  return true;
}

export async function updateProjectInDatabase(id: string, updatedFields: Partial<Project>): Promise<Project | null> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const current = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
        const updated = current.map((p) => (p.id === id ? (data as Project) : p));
        setLocalData(ODA_PROJECTS_KEY, updated);
        return data as Project;
      }
    } catch (e) {
      console.warn('Failed to update project in Supabase', e);
    }
  }

  const current = getLocalData<Project[]>(ODA_PROJECTS_KEY, INITIAL_PROJECTS);
  let updatedProj: Project | null = null;
  const updated = current.map((p) => {
    if (p.id === id) {
      updatedProj = { ...p, ...updatedFields };
      return updatedProj;
    }
    return p;
  });
  setLocalData(ODA_PROJECTS_KEY, updated);
  return updatedProj;
}

// ----------------------------------------------------
// REVIEWS DATA API (SUPABASE + LOCALSTORAGE BACKUP)
// ----------------------------------------------------
export async function fetchReviews(): Promise<Review[]> {
  const deletedIds = getDeletedIds(ODA_DELETED_REVIEWS_KEY);
  const supabase = createClient();
  let items: Review[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = data as Review[];
      }
    } catch (err) {
      console.warn('Supabase fetch reviews warning', err);
    }
  }

  if (items.length === 0) {
    items = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
  } else {
    const local = getLocalData<Review[]>(ODA_REVIEWS_KEY, []);
    const merged = [...items];
    local.forEach((lr) => {
      if (!merged.some((r) => r.id === lr.id)) {
        merged.push(lr);
      }
    });
    items = merged;
    setLocalData(ODA_REVIEWS_KEY, items);
  }

  return items.filter((r) => !deletedIds.includes(r.id));
}

export async function saveReviewToDatabase(newReview: Omit<Review, 'id'>): Promise<Review> {
  const supabase = createClient();
  const reviewId = generateUUID();
  const reviewToSave = {
    ...newReview,
    id: reviewId,
    approved: newReview.approved ?? true,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { data, error } = await supabase.from('reviews').insert([reviewToSave]).select().single();
      if (!error && data) {
        const current = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
        const updated = [data as Review, ...current];
        setLocalData(ODA_REVIEWS_KEY, updated);
        return data as Review;
      }
    } catch (e) {
      console.warn('Failed to insert review into Supabase', e);
    }
  }

  const current = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
  const updated = [reviewToSave, ...current];
  setLocalData(ODA_REVIEWS_KEY, updated);
  return reviewToSave;
}

export async function updateReviewInDatabase(id: string, updatedFields: Partial<Review>): Promise<Review | null> {
  const supabase = createClient();
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updatedFields)
        .eq('id', id)
        .select()
        .single();
      if (!error && data) {
        const current = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
        const updated = current.map((r) => (r.id === id ? (data as Review) : r));
        setLocalData(ODA_REVIEWS_KEY, updated);
        return data as Review;
      }
    } catch (e) {
      console.warn('Failed to update review in Supabase', e);
    }
  }

  const current = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
  let updatedReview: Review | null = null;
  const updated = current.map((r) => {
    if (r.id === id) {
      updatedReview = { ...r, ...updatedFields };
      return updatedReview;
    }
    return r;
  });
  setLocalData(ODA_REVIEWS_KEY, updated);
  return updatedReview;
}

export async function deleteReviewFromDatabase(id: string): Promise<boolean> {
  addDeletedId(ODA_DELETED_REVIEWS_KEY, id);

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('reviews').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete review from Supabase', e);
    }
  }

  const current = getLocalData<Review[]>(ODA_REVIEWS_KEY, INITIAL_REVIEWS);
  const filtered = current.filter((r) => r.id !== id);
  setLocalData(ODA_REVIEWS_KEY, filtered);
  return true;
}

// ----------------------------------------------------
// VISION QUESTIONNAIRE BRIEFS API
// ----------------------------------------------------
export async function fetchVisionQuestionnaires(): Promise<VisionQuestionnaire[]> {
  const deletedIds = getDeletedIds(ODA_DELETED_QUESTIONNAIRES_KEY);
  const supabase = createClient();
  let items: VisionQuestionnaire[] = [];

  if (supabase) {
    try {
      const { data, error } = await supabase.from('vision_questionnaires').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        items = data as VisionQuestionnaire[];
      }
    } catch (err) {
      console.warn('Supabase fetch questionnaires warning', err);
    }
  }

  const initialBriefs: VisionQuestionnaire[] = [
    {
      id: 'q1000000-0000-4000-a000-000000000001',
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

  if (items.length === 0) {
    items = getLocalData<VisionQuestionnaire[]>(ODA_QUESTIONNAIRES_KEY, initialBriefs);
  } else {
    const local = getLocalData<VisionQuestionnaire[]>(ODA_QUESTIONNAIRES_KEY, []);
    const merged = [...items];
    local.forEach((lq) => {
      if (!merged.some((q) => q.id === lq.id)) {
        merged.push(lq);
      }
    });
    items = merged;
    setLocalData(ODA_QUESTIONNAIRES_KEY, items);
  }

  return items.filter((q) => !deletedIds.includes(q.id));
}

export async function saveVisionQuestionnaire(data: Omit<VisionQuestionnaire, 'id'>): Promise<boolean> {
  const supabase = createClient();
  const qId = generateUUID();
  const qToSave: VisionQuestionnaire = {
    ...data,
    id: qId,
    created_at: new Date().toISOString()
  };

  if (supabase) {
    try {
      const { error } = await supabase.from('vision_questionnaires').insert([qToSave]);
      if (!error) {
        const current = getLocalData<VisionQuestionnaire[]>(ODA_QUESTIONNAIRES_KEY, []);
        setLocalData(ODA_QUESTIONNAIRES_KEY, [qToSave, ...current]);
        return true;
      }
    } catch (e) {
      console.warn('Failed to insert vision questionnaire into Supabase', e);
    }
  }

  const current = getLocalData<VisionQuestionnaire[]>(ODA_QUESTIONNAIRES_KEY, []);
  setLocalData(ODA_QUESTIONNAIRES_KEY, [qToSave, ...current]);
  return true;
}

export async function deleteQuestionnaireFromDatabase(id: string): Promise<boolean> {
  addDeletedId(ODA_DELETED_QUESTIONNAIRES_KEY, id);

  const supabase = createClient();
  if (supabase) {
    try {
      await supabase.from('vision_questionnaires').delete().eq('id', id);
    } catch (e) {
      console.warn('Failed to delete questionnaire', e);
    }
  }

  const current = getLocalData<VisionQuestionnaire[]>(ODA_QUESTIONNAIRES_KEY, []);
  const filtered = current.filter((item) => item.id !== id);
  setLocalData(ODA_QUESTIONNAIRES_KEY, filtered);
  return true;
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
