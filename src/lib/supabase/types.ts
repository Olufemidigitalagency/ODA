export interface Project {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  client_name?: string;
  year?: string;
  image_url: string;
  tags: string[];
  featured?: boolean;
  created_at?: string;
}

export interface Review {
  id: string;
  author_name: string;
  author_role: string;
  author_avatar?: string;
  content: string;
  rating: number;
  approved?: boolean;
  created_at?: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  role?: 'admin' | 'client';
  avatar_url?: string;
}
