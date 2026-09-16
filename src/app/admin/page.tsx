'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Trash2, Eye, LogOut, Lock, Mail, Image as ImageIcon,
  CheckCircle2, FolderKanban, MessageSquare, FileText, ArrowLeft, Star, Upload, Loader2,
  Video, Film, X, Edit3, RefreshCw, AlertTriangle
} from 'lucide-react';
import { Project, Review } from '../../lib/supabase/types';
import {
  fetchProjects, fetchReviews, fetchVisionQuestionnaires,
  saveProjectToDatabase, deleteProjectFromDatabase, updateProjectInDatabase,
  saveReviewToDatabase, deleteReviewFromDatabase, updateReviewInDatabase,
  deleteQuestionnaireFromDatabase,
  uploadMediaFile, VisionQuestionnaire
} from '../../lib/data-store';
import { createClient } from '../../lib/supabase/client';
import { ConfirmModal } from '../../components/ConfirmModal';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'vision'>('projects');

  // CMS Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questionnaires, setQuestionnaires] = useState<VisionQuestionnaire[]>([]);

  // Modals for Adding / Editing
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    variant?: 'danger' | 'success' | 'info';
    confirmText?: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Warning Popup Modal State (e.g. Image required rule)
  const [warningModal, setWarningModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
  }>({
    isOpen: false,
    title: '',
    message: '',
  });

  // Project Form State (New & Edit)
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Photography');
  const [projClient, setProjClient] = useState('');
  const [projYear, setProjYear] = useState('2025');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('Commercial, Editorial');
  const [projImageUrl, setProjImageUrl] = useState('');
  const [projGalleryImages, setProjGalleryImages] = useState<string[]>([]);
  const [projVideoUrl, setProjVideoUrl] = useState('');
  const [uploadingProj, setUploadingProj] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);

  // Review Form State (New & Edit)
  const [revAuthor, setRevAuthor] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revContent, setRevContent] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revAvatar, setRevAvatar] = useState('');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Initial Check Auth & Load Data
  useEffect(() => {
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      });
    } else {
      const localSession = sessionStorage.getItem('oda_admin_session');
      if (localSession === 'authenticated') {
        setIsAuthenticated(true);
      }
    }
    loadData();
  }, []);

  async function loadData() {
    setIsRefreshing(true);
    try {
      const [pList, rList, qList] = await Promise.all([
        fetchProjects(),
        fetchReviews(),
        fetchVisionQuestionnaires()
      ]);
      setProjects(pList);
      setReviews(rList);
      setQuestionnaires(qList);
    } catch (err) {
      console.error('Error loading admin data', err);
    } finally {
      setIsRefreshing(false);
    }
  }

  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [authSuccessMessage, setAuthSuccessMessage] = useState('');

  // Reset Project Form State
  const resetProjectForm = () => {
    setProjTitle('');
    setProjCategory('Photography');
    setProjClient('');
    setProjYear('2025');
    setProjDesc('');
    setProjTags('Commercial, Editorial');
    setProjImageUrl('');
    setProjGalleryImages([]);
    setProjVideoUrl('');
    setEditingProject(null);
  };

  // Reset Review Form State
  const resetReviewForm = () => {
    setRevAuthor('');
    setRevRole('');
    setRevContent('');
    setRevRating(5);
    setRevAvatar('');
    setEditingReview(null);
  };

  // Handle Login / Sign Up
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');
    setAuthSuccessMessage('');

    if (authPassword.length < 6) {
      setAuthError('Password must be at least 6 characters long.');
      setAuthLoading(false);
      return;
    }

    const supabase = createClient();
    if (supabase) {
      try {
        if (isSignUpMode) {
          const { data, error } = await supabase.auth.signUp({
            email: authEmail,
            password: authPassword,
          });
          if (error) throw error;

          if (data.session) {
            setUser(data.user);
            setIsAuthenticated(true);
            setAuthSuccessMessage('Admin account created & authenticated!');
          } else if (data.user) {
            setIsAuthenticated(true);
            setAuthSuccessMessage('Admin account created! You are logged in.');
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: authEmail,
            password: authPassword,
          });
          if (error) throw error;
          if (data.user) {
            setUser(data.user);
            setIsAuthenticated(true);
          }
        }
      } catch (err: any) {
        const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@oda.studio';
        const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123456';

        // Direct fallback to master admin login if credentials match
        if (authEmail.trim().toLowerCase() === validEmail.toLowerCase() && authPassword === validPass) {
          setIsAuthenticated(true);
          sessionStorage.setItem('oda_admin_session', 'authenticated');
          setAuthError('');
        } else if (err.message === 'Invalid login credentials') {
          setAuthError('Invalid credentials. If you haven\'t created your admin user in Supabase yet, click "Register Admin Account" below.');
        } else if (err.message?.toLowerCase().includes('email logins are disabled') || err.message?.toLowerCase().includes('disabled')) {
          setAuthError('Email logins are disabled in Supabase. You can log in using your master admin credentials, or enable Email Provider in Supabase Dashboard -> Authentication -> Providers -> Email.');
        } else {
          setAuthError(err.message || 'Authentication failed');
        }
      } finally {
        setAuthLoading(false);
      }
    } else {
      const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@oda.studio';
      const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'admin123456';

      if (authEmail.trim().toLowerCase() === validEmail.toLowerCase() && authPassword === validPass) {
        setIsAuthenticated(true);
        sessionStorage.setItem('oda_admin_session', 'authenticated');
      } else {
        setAuthError('Invalid admin email or password');
      }
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('oda_admin_session');
    setUser(null);
    setIsAuthenticated(false);
  };

  // Add Project Execution with Strict Image Validation Rule
  const submitProject = async () => {
    if (!projTitle || !projDesc) return;

    const finalImg = projImageUrl || projGalleryImages[0] || '';
    if (!finalImg) {
      setWarningModal({
        isOpen: true,
        title: 'Image Required to Publish Project',
        message: 'A project MUST have at least 1 primary cover image or gallery image before it can be published. Please upload an image first.',
      });
      return;
    }

    const slug = projTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tags = projTags.split(',').map((t) => t.trim()).filter(Boolean);
    const finalGallery = projGalleryImages.length > 0 ? projGalleryImages : [finalImg];

    const created = await saveProjectToDatabase({
      title: projTitle,
      slug: slug || `project-${Date.now()}`,
      category: projCategory,
      description: projDesc,
      client_name: projClient,
      year: projYear,
      image_url: finalImg,
      gallery_images: finalGallery,
      video_url: projVideoUrl || undefined,
      tags,
      featured: true,
    });

    setProjects([created, ...projects]);
    setShowAddProjectModal(false);
    resetProjectForm();
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) return;

    const finalImg = projImageUrl || projGalleryImages[0] || '';
    if (!finalImg) {
      setWarningModal({
        isOpen: true,
        title: 'Image Required to Publish Project',
        message: 'A project MUST have at least 1 primary cover image or gallery image before it can be published. Please upload an image first.',
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Publish New Media Work',
      message: `Are you sure you want to publish "${projTitle}" to the public portfolio showcase?`,
      variant: 'info',
      confirmText: 'Publish Project',
      onConfirm: submitProject,
    });
  };

  // Edit Project Handlers
  const handleOpenEditProject = (proj: Project) => {
    setEditingProject(proj);
    setProjTitle(proj.title);
    setProjCategory(proj.category);
    setProjClient(proj.client_name || '');
    setProjYear(proj.year || '2025');
    setProjDesc(proj.description);
    setProjTags(proj.tags ? proj.tags.join(', ') : '');
    setProjImageUrl(proj.image_url || '');
    setProjGalleryImages(proj.gallery_images || []);
    setProjVideoUrl(proj.video_url || '');
    setShowEditProjectModal(true);
  };

  const submitEditProject = async () => {
    if (!editingProject || !projTitle || !projDesc) return;

    const finalImg = projImageUrl || projGalleryImages[0] || '';
    if (!finalImg) {
      setWarningModal({
        isOpen: true,
        title: 'Image Required to Save Project',
        message: 'A project MUST have at least 1 primary cover image or gallery image before it can be saved. Please upload an image first.',
      });
      return;
    }

    const tags = projTags.split(',').map((t) => t.trim()).filter(Boolean);
    const finalGallery = projGalleryImages.length > 0 ? projGalleryImages : [finalImg];

    const updated = await updateProjectInDatabase(editingProject.id, {
      title: projTitle,
      category: projCategory,
      description: projDesc,
      client_name: projClient,
      year: projYear,
      image_url: finalImg,
      gallery_images: finalGallery,
      video_url: projVideoUrl || undefined,
      tags,
    });

    if (updated) {
      setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
    }
    setShowEditProjectModal(false);
    resetProjectForm();
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveEditProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) return;

    const finalImg = projImageUrl || projGalleryImages[0] || '';
    if (!finalImg) {
      setWarningModal({
        isOpen: true,
        title: 'Image Required to Save Project',
        message: 'A project MUST have at least 1 primary cover image or gallery image before it can be saved. Please upload an image first.',
      });
      return;
    }

    setConfirmModal({
      isOpen: true,
      title: 'Update Featured Media Project',
      message: `Are you sure you want to save changes to "${projTitle}"?`,
      variant: 'info',
      confirmText: 'Save Project',
      onConfirm: submitEditProject,
    });
  };

  // Delete Project
  const handleDeleteProject = (id: string) => {
    const proj = projects.find((p) => p.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Media Work',
      message: `Are you sure you want to permanently delete "${proj?.title || 'this project'}"? This action cannot be undone.`,
      variant: 'danger',
      confirmText: 'Delete Project',
      onConfirm: async () => {
        await deleteProjectFromDatabase(id);
        setProjects(projects.filter((p) => p.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Review Avatar Upload Handler
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const url = await uploadMediaFile(file);
      setRevAvatar(url);
    } catch (err) {
      console.error('Avatar upload error', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Add Review
  const submitReview = async () => {
    if (!revAuthor || !revContent) return;

    const created = await saveReviewToDatabase({
      author_name: revAuthor,
      author_role: revRole || 'Client',
      author_avatar: revAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      content: revContent,
      rating: revRating,
      approved: true,
    });

    setReviews([created, ...reviews]);
    setShowAddReviewModal(false);
    resetReviewForm();
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCreateReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor || !revContent) return;
    setConfirmModal({
      isOpen: true,
      title: 'Publish Testimonial Review',
      message: `Are you sure you want to publish this review from "${revAuthor}" to the website?`,
      variant: 'info',
      confirmText: 'Publish Review',
      onConfirm: submitReview,
    });
  };

  // Edit Review Handlers
  const handleOpenEditReview = (rev: Review) => {
    setEditingReview(rev);
    setRevAuthor(rev.author_name);
    setRevRole(rev.author_role);
    setRevContent(rev.content);
    setRevRating(rev.rating);
    setRevAvatar(rev.author_avatar || '');
    setShowEditReviewModal(true);
  };

  const submitEditReview = async () => {
    if (!editingReview || !revAuthor || !revContent) return;

    const updated = await updateReviewInDatabase(editingReview.id, {
      author_name: revAuthor,
      author_role: revRole || 'Client',
      author_avatar: revAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
      content: revContent,
      rating: revRating,
    });

    if (updated) {
      setReviews(reviews.map((r) => (r.id === updated.id ? updated : r)));
    }
    setShowEditReviewModal(false);
    resetReviewForm();
    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
  };

  const handleSaveEditReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revAuthor || !revContent) return;
    setConfirmModal({
      isOpen: true,
      title: 'Update Testimonial Review',
      message: `Save changes to the review from "${revAuthor}"?`,
      variant: 'info',
      confirmText: 'Save Changes',
      onConfirm: submitEditReview,
    });
  };

  // Delete Review
  const handleDeleteReview = (id: string) => {
    const rev = reviews.find((r) => r.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Testimonial Review',
      message: `Are you sure you want to delete the review by "${rev?.author_name || 'this client'}"?`,
      variant: 'danger',
      confirmText: 'Delete Review',
      onConfirm: async () => {
        await deleteReviewFromDatabase(id);
        setReviews(reviews.filter((r) => r.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Delete Questionnaire Brief
  const handleDeleteQuestionnaire = (id: string) => {
    const q = questionnaires.find((item) => item.id === id);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Vision Brief',
      message: `Are you sure you want to remove the Client Vision Brief submitted by "${q?.client_name || 'this client'}"?`,
      variant: 'danger',
      confirmText: 'Delete Brief',
      onConfirm: async () => {
        await deleteQuestionnaireFromDatabase(id);
        setQuestionnaires(questionnaires.filter((item) => item.id !== id));
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Media File Upload Handler (Cover Image)
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProj(true);
    try {
      const url = await uploadMediaFile(file);
      setProjImageUrl(url);
      if (!projGalleryImages.includes(url)) {
        setProjGalleryImages((prev) => [...prev, url].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingProj(false);
    }
  };

  // Multi-Image Gallery File Upload Handler
  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const maxAllowed = projCategory === 'Videography' && projVideoUrl ? 3 : 5;
    const remainingSlots = maxAllowed - projGalleryImages.length;
    if (remainingSlots <= 0) return;

    const filesToUpload = files.slice(0, remainingSlots);
    setUploadingGallery(true);

    try {
      const uploadPromises = filesToUpload.map((f) => uploadMediaFile(f));
      const urls = await Promise.all(uploadPromises);
      setProjGalleryImages((prev) => [...prev, ...urls].slice(0, maxAllowed));
      if (!projImageUrl && urls.length > 0) {
        setProjImageUrl(urls[0]);
      }
    } catch (err) {
      console.error('Gallery image upload failed', err);
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setProjGalleryImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Optional Video Upload Handler
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingVideo(true);
    try {
      const url = await uploadMediaFile(file);
      setProjVideoUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingVideo(false);
    }
  };

  // Unauthenticated Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center justify-center p-6 bg-noise">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div className="text-center">
            <span className="font-mono text-3xl font-black tracking-widest text-zinc-900">ODA</span>
            <h1 className="text-xl font-bold uppercase text-zinc-900 mt-2">
              {isSignUpMode ? 'REGISTER ADMIN ACCOUNT' : 'ADMIN PORTAL LOGIN'}
            </h1>
            <p className="text-xs font-mono text-zinc-600 mt-1">
              {isSignUpMode ? 'Create your official agency owner credentials' : 'Sign in to manage projects, reviews & vision briefs'}
            </p>
          </div>

          {authSuccessMessage && (
            <div className="p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-xs font-mono text-center">
              {authSuccessMessage}
            </div>
          )}

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-mono text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-600 mb-1.5">ADMIN EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="email"
                  required
                  placeholder="femikolawole142@gmail.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 placeholder-zinc-400 focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-zinc-600 mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 focus:outline-none focus:border-black transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer shadow-lg shadow-black/10"
            >
              {authLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : isSignUpMode ? (
                'Create Admin Account'
              ) : (
                'Enter Admin Dashboard'
              )}
            </button>
          </form>

          <div className="text-center pt-2 space-y-3 border-t border-zinc-100">
            <button
              type="button"
              onClick={() => {
                setIsSignUpMode(!isSignUpMode);
                setAuthError('');
                setAuthSuccessMessage('');
              }}
              className="text-xs text-zinc-600 hover:text-black underline underline-offset-4 transition-colors font-mono cursor-pointer"
            >
              {isSignUpMode ? 'Already registered? Sign In to Admin' : 'First time setting up? Register Admin Account'}
            </button>

            <Link href="/" className="text-xs text-zinc-600 hover:text-black font-mono flex items-center justify-center gap-1.5 pt-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Public Website</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // Authenticated Admin Dashboard View
  return (
    <div className="min-h-screen bg-white text-zinc-900 bg-noise">
      {/* Admin Top Header */}
      <header className="border-b border-zinc-200 glass-header sticky top-0 z-40 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border border-zinc-300 flex items-center justify-center p-0.5">
                <img src="/logo-circle.png" alt="ODA" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-black font-mono text-xl uppercase tracking-tighter text-zinc-900">ODA ADMIN</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={isRefreshing}
              className="px-3.5 py-2 text-xs font-mono uppercase bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Reload Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              href="/"
              className="px-4 py-2 text-xs font-mono uppercase bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-300 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-mono uppercase bg-red-50 text-red-600 hover:bg-red-100 border border-red-200 rounded-full flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="max-w-7xl mx-auto px-6 md:px-12 py-12 space-y-10">

        {/* Dashboard Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl glass-card border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">FEATURED PROJECTS</p>
              <p className="text-3xl font-bold font-mono text-zinc-900 mt-1">{projects.length}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-zinc-400" />
          </div>

          <div className="p-6 rounded-2xl glass-card border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">CLIENT TESTIMONIALS</p>
              <p className="text-3xl font-bold font-mono text-zinc-900 mt-1">{reviews.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-zinc-400" />
          </div>

          <div className="p-6 rounded-2xl glass-card border border-zinc-200 bg-zinc-50/50 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">VISION BRIEFS RECEIVED</p>
              <p className="text-3xl font-bold font-mono text-zinc-900 mt-1">{questionnaires.length}</p>
            </div>
            <FileText className="w-8 h-8 text-zinc-400" />
          </div>
        </div>

        {/* Management Tabs Navigation */}
        <div className="flex items-center gap-3 border-b border-zinc-200 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'projects'
                ? 'bg-black text-white shadow-lg'
                : 'bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-200'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Media Works ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-black text-white shadow-lg'
                : 'bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Manage Client Voices ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'vision'
                ? 'bg-black text-white shadow-lg'
                : 'bg-zinc-100 text-zinc-700 hover:text-black border border-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Client Vision Questionnaires ({questionnaires.length})</span>
          </button>
        </div>

        {/* Tab 1: Manage Projects CMS */}
        {activeTab === 'projects' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase text-zinc-900">FEATURED MEDIA PROJECTS</h2>
                <p className="text-xs font-mono text-zinc-600">Add, edit, or remove portfolio projects showcased on the landing page</p>
              </div>

              <button
                onClick={() => {
                  resetProjectForm();
                  setShowAddProjectModal(true);
                }}
                className="px-6 py-3 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl glass-card border border-zinc-200 bg-white flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-100 relative">
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card border border-zinc-200 text-[10px] uppercase font-mono text-zinc-900 bg-white/90 font-semibold">
                      {proj.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 uppercase">{proj.title}</h3>
                    <p className="text-xs text-zinc-600 font-light line-clamp-2 mt-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100">
                    <span className="text-xs font-mono text-zinc-500">{proj.client_name || 'ODA Client'}</span>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditProject(proj)}
                        className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Project"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Manage Reviews CMS */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black uppercase text-zinc-900">CLIENT VOICES & TESTIMONIALS</h2>
                <p className="text-xs font-mono text-zinc-600">Add, edit, or remove client feedback entries displayed on the landing page</p>
              </div>

              <button
                onClick={() => {
                  resetReviewForm();
                  setShowAddReviewModal(true);
                }}
                className="px-6 py-3 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-800 transition-all shadow-lg active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl glass-card border border-zinc-200 bg-white flex flex-col justify-between space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-zinc-900">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-zinc-900 text-zinc-900" />
                      ))}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditReview(rev)}
                        className="p-2 text-zinc-600 hover:text-black hover:bg-zinc-100 rounded-lg transition-colors cursor-pointer"
                        title="Edit Testimonial"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-700 italic font-light leading-relaxed">"{rev.content}"</p>

                  <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
                    <img
                      src={rev.author_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop'}
                      alt={rev.author_name}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-200"
                    />
                    <div>
                      <h4 className="font-bold text-xs text-zinc-900 uppercase">{rev.author_name}</h4>
                      <p className="text-[10px] font-mono text-zinc-500">{rev.author_role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: View Client Vision Questionnaires */}
        {activeTab === 'vision' && (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-black uppercase text-zinc-900">CLIENT VISION QUESTIONNAIRE BRIEFS</h2>
              <p className="text-xs font-mono text-zinc-600">Incoming project inquiries submitted via the Client Vision Questionnaire</p>
            </div>

            <div className="space-y-4">
              {questionnaires.map((q) => (
                <div key={q.id} className="p-6 rounded-2xl glass-card border border-zinc-200 bg-white space-y-4 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-zinc-900 uppercase">{q.client_name}</h3>
                      <p className="text-xs font-mono text-zinc-600">{q.email} {q.phone && `• ${q.phone}`} {q.brand_name && `• Brand: ${q.brand_name}`}</p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
                        {q.estimated_budget || 'Custom'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700">
                        {q.preferred_timeline || 'Within 2-4 Weeks'}
                      </span>
                      <button
                        onClick={() => handleDeleteQuestionnaire(q.id)}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors ml-2 cursor-pointer"
                        title="Delete Brief"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-mono text-zinc-500 mb-1">SERVICES REQUESTED</p>
                    <div className="flex flex-wrap gap-2">
                      {q.services_requested?.map((s) => (
                        <span key={s} className="px-2.5 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-zinc-800 text-xs font-mono font-medium">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-mono text-zinc-500 mb-1">CLIENT VISION BRIEF</p>
                    <p className="text-sm text-zinc-700 font-light leading-relaxed">{q.vision_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white border border-zinc-200 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black uppercase text-zinc-900">ADD NEW FEATURED WORK</h2>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY BRAND CAMPAIGN"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CATEGORY</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Campaigns">Campaigns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CLIENT</label>
                  <input
                    type="text"
                    placeholder="Maison Noir"
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">YEAR</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={projYear}
                    onChange={(e) => setProjYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Project details..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm resize-none focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Brand Photography, Editorial"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">MAIN COVER IMAGE UPLOAD *</label>
                <div className="border border-dashed border-zinc-300 p-4 rounded-xl text-center relative bg-zinc-50">
                  <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  {uploadingProj ? (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
                      <span className="text-xs font-mono text-zinc-600">Uploading cover image...</span>
                    </div>
                  ) : projImageUrl ? (
                    <div className="flex items-center justify-between p-1">
                      <img src={projImageUrl} alt="Cover Preview" className="h-12 rounded object-cover border border-zinc-300" />
                      <span className="text-xs text-green-600 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cover Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-6 h-6 text-zinc-400" />
                      <span className="text-xs text-zinc-600 font-medium">Click to select primary cover image (Required)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase font-mono text-zinc-600">
                    PROJECT GALLERY IMAGES ({projGalleryImages.length}/{projCategory === 'Videography' && projVideoUrl ? 3 : 5} MAX)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Max 5 image previews</span>
                </div>

                {projGalleryImages.length < (projCategory === 'Videography' && projVideoUrl ? 3 : 5) && (
                  <div className="border border-dashed border-zinc-300 p-3.5 rounded-xl text-center relative bg-zinc-50 hover:border-zinc-400 transition-colors mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {uploadingGallery ? (
                      <div className="flex items-center justify-center gap-2 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                        <span className="text-xs font-mono text-zinc-600">Uploading gallery images...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs text-zinc-600">Add Showcase Images to Gallery</span>
                      </div>
                    )}
                  </div>
                )}

                {projGalleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                    {projGalleryImages.map((imgUrl, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                        <img src={imgUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors shadow-lg cursor-pointer opacity-80 group-hover:opacity-100"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videography Options */}
              {projCategory === 'Videography' && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                    <Video className="w-4 h-4 text-zinc-900" />
                    <span>VIDEOGRAPHY PROJECT MEDIA OPTIONS (OPTIONAL)</span>
                  </div>

                  <p className="text-xs text-zinc-600 font-light">
                    Upload an optional video file or paste a video link alongside showcase gallery images.
                  </p>

                  <div className="space-y-3">
                    <div className="border border-dashed border-zinc-300 p-3 rounded-xl text-center relative bg-white">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleVideoFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {uploadingVideo ? (
                        <div className="flex items-center justify-center gap-2 py-1">
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                          <span className="text-xs font-mono text-zinc-600">Uploading video file...</span>
                        </div>
                      ) : projVideoUrl ? (
                        <div className="flex items-center justify-between p-1">
                          <span className="text-xs text-green-600 font-mono truncate max-w-[200px]">Video Uploaded</span>
                          <button
                            type="button"
                            onClick={() => setProjVideoUrl('')}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Remove Video
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Film className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs text-zinc-600">Upload Video File (MP4/WebM)</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono text-zinc-500 mb-1">OR PASTE VIDEO URL</label>
                      <input
                        type="url"
                        placeholder="https://commondatastorage.googleapis.com/... or https://..."
                        value={projVideoUrl}
                        onChange={(e) => setProjVideoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {projVideoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 bg-black aspect-video">
                        <video src={projVideoUrl} controls className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-lg shadow-black/10"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {showEditProjectModal && editingProject && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-white border border-zinc-200 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl">
            <h2 className="text-2xl font-black uppercase text-zinc-900">EDIT FEATURED MEDIA WORK</h2>

            <form onSubmit={handleSaveEditProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY BRAND CAMPAIGN"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CATEGORY</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  >
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Campaigns">Campaigns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CLIENT</label>
                  <input
                    type="text"
                    placeholder="Maison Noir"
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">YEAR</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={projYear}
                    onChange={(e) => setProjYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Project details..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm resize-none focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Brand Photography, Editorial"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              {/* Cover Image Upload */}
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">MAIN COVER IMAGE UPLOAD *</label>
                <div className="border border-dashed border-zinc-300 p-4 rounded-xl text-center relative bg-zinc-50">
                  <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  {uploadingProj ? (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-zinc-900" />
                      <span className="text-xs font-mono text-zinc-600">Uploading cover image...</span>
                    </div>
                  ) : projImageUrl ? (
                    <div className="flex items-center justify-between p-1">
                      <img src={projImageUrl} alt="Cover Preview" className="h-12 rounded object-cover border border-zinc-300" />
                      <span className="text-xs text-green-600 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Cover Uploaded
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-6 h-6 text-zinc-400" />
                      <span className="text-xs text-zinc-600 font-medium">Click to select primary cover image (Required)</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Gallery Images Upload */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs uppercase font-mono text-zinc-600">
                    PROJECT GALLERY IMAGES ({projGalleryImages.length}/{projCategory === 'Videography' && projVideoUrl ? 3 : 5} MAX)
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono">Max 5 image previews</span>
                </div>

                {projGalleryImages.length < (projCategory === 'Videography' && projVideoUrl ? 3 : 5) && (
                  <div className="border border-dashed border-zinc-300 p-3.5 rounded-xl text-center relative bg-zinc-50 hover:border-zinc-400 transition-colors mb-3">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleGalleryImageUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    {uploadingGallery ? (
                      <div className="flex items-center justify-center gap-2 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                        <span className="text-xs font-mono text-zinc-600">Uploading gallery images...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4 text-zinc-500" />
                        <span className="text-xs text-zinc-600">Add Showcase Images to Gallery</span>
                      </div>
                    )}
                  </div>
                )}

                {projGalleryImages.length > 0 && (
                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-1">
                    {projGalleryImages.map((imgUrl, index) => (
                      <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-zinc-200 bg-zinc-100">
                        <img src={imgUrl} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(index)}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-white hover:bg-red-600 transition-colors shadow-lg cursor-pointer opacity-80 group-hover:opacity-100"
                          title="Remove image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                        <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-black/80 text-[9px] font-mono text-white">
                          #{index + 1}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videography Options */}
              {projCategory === 'Videography' && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-900">
                    <Video className="w-4 h-4 text-zinc-900" />
                    <span>VIDEOGRAPHY PROJECT MEDIA OPTIONS (OPTIONAL)</span>
                  </div>

                  <p className="text-xs text-zinc-600 font-light">
                    Upload an optional video file or paste a video link alongside showcase gallery images.
                  </p>

                  <div className="space-y-3">
                    <div className="border border-dashed border-zinc-300 p-3 rounded-xl text-center relative bg-white">
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/ogg"
                        onChange={handleVideoFileUpload}
                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      />
                      {uploadingVideo ? (
                        <div className="flex items-center justify-center gap-2 py-1">
                          <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                          <span className="text-xs font-mono text-zinc-600">Uploading video file...</span>
                        </div>
                      ) : projVideoUrl ? (
                        <div className="flex items-center justify-between p-1">
                          <span className="text-xs text-green-600 font-mono truncate max-w-[200px]">Video Uploaded</span>
                          <button
                            type="button"
                            onClick={() => setProjVideoUrl('')}
                            className="text-xs text-red-600 hover:underline cursor-pointer"
                          >
                            Remove Video
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2">
                          <Film className="w-4 h-4 text-zinc-500" />
                          <span className="text-xs text-zinc-600">Upload Video File (MP4/WebM)</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase font-mono text-zinc-500 mb-1">OR PASTE VIDEO URL</label>
                      <input
                        type="url"
                        placeholder="https://commondatastorage.googleapis.com/... or https://..."
                        value={projVideoUrl}
                        onChange={(e) => setProjVideoUrl(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-black"
                      />
                    </div>

                    {projVideoUrl && (
                      <div className="mt-2 rounded-xl overflow-hidden border border-zinc-200 bg-black aspect-video">
                        <video src={projVideoUrl} controls className="w-full h-full object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditProjectModal(false);
                    resetProjectForm();
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-lg shadow-black/10"
                >
                  Save Project Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-black uppercase text-zinc-900">ADD CLIENT TESTIMONIAL</h2>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CLIENT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Evelyn Vance"
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">ROLE / BRAND</label>
                <input
                  type="text"
                  placeholder="Marketing Director, Maison Noir"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">AVATAR IMAGE</label>
                <div className="space-y-2">
                  <div className="border border-dashed border-zinc-300 p-3 rounded-xl text-center relative bg-zinc-50">
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {uploadingAvatar ? (
                      <div className="flex items-center justify-center gap-2 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                        <span className="text-xs font-mono text-zinc-600">Uploading avatar...</span>
                      </div>
                    ) : revAvatar ? (
                      <div className="flex items-center justify-between p-1">
                        <img src={revAvatar} alt="Avatar Preview" className="w-8 h-8 rounded-full object-cover border border-zinc-300" />
                        <span className="text-xs text-green-600 font-mono">Avatar Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs text-zinc-600 font-medium">Click to upload avatar photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={revAvatar}
                    onChange={(e) => setRevAvatar(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">RATING</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRevRating(star)} className="cursor-pointer">
                      <Star className={`w-5 h-5 ${star <= revRating ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TESTIMONIAL CONTENT *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Client feedback..."
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm resize-none focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-lg shadow-black/10"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Review Modal */}
      {showEditReviewModal && editingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-8 space-y-6 shadow-2xl">
            <h2 className="text-2xl font-black uppercase text-zinc-900">EDIT TESTIMONIAL</h2>

            <form onSubmit={handleSaveEditReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">CLIENT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Evelyn Vance"
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">ROLE / BRAND</label>
                <input
                  type="text"
                  placeholder="Marketing Director, Maison Noir"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">AVATAR IMAGE</label>
                <div className="space-y-2">
                  <div className="border border-dashed border-zinc-300 p-3 rounded-xl text-center relative bg-zinc-50">
                    <input type="file" accept="image/*" onChange={handleAvatarUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                    {uploadingAvatar ? (
                      <div className="flex items-center justify-center gap-2 py-1">
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-900" />
                        <span className="text-xs font-mono text-zinc-600">Uploading avatar...</span>
                      </div>
                    ) : revAvatar ? (
                      <div className="flex items-center justify-between p-1">
                        <img src={revAvatar} alt="Avatar Preview" className="w-8 h-8 rounded-full object-cover border border-zinc-300" />
                        <span className="text-xs text-green-600 font-mono">Avatar Ready</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Upload className="w-4 h-4 text-zinc-400" />
                        <span className="text-xs text-zinc-600 font-medium">Click to upload avatar photo</span>
                      </div>
                    )}
                  </div>
                  <input
                    type="url"
                    placeholder="Or paste image URL (https://...)"
                    value={revAvatar}
                    onChange={(e) => setRevAvatar(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-xs placeholder-zinc-400 focus:outline-none focus:border-black"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">RATING</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRevRating(star)} className="cursor-pointer">
                      <Star className={`w-5 h-5 ${star <= revRating ? 'text-zinc-900 fill-zinc-900' : 'text-zinc-300'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-600 mb-1">TESTIMONIAL CONTENT *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Client feedback..."
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-50 border border-zinc-200 text-zinc-900 text-sm resize-none focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-100">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditReviewModal(false);
                    resetReviewForm();
                  }}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-600 hover:text-black cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 cursor-pointer shadow-lg shadow-black/10"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Required Validation Warning Popup Modal */}
      {warningModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md p-4 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-md w-full bg-white border border-zinc-200 rounded-3xl p-6 md:p-8 shadow-2xl space-y-5 text-center relative"
          >
            <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto text-amber-600">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-xl font-bold uppercase text-zinc-900">{warningModal.title}</h3>
              <p className="text-xs text-zinc-600 font-light mt-2 leading-relaxed">
                {warningModal.message}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setWarningModal((prev) => ({ ...prev, isOpen: false }))}
                className="w-full py-3 rounded-full bg-black text-white font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-colors shadow-lg cursor-pointer"
              >
                Understood, Upload Image
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Global Framer Motion Confirmation Dialog */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        variant={confirmModal.variant}
        confirmText={confirmModal.confirmText}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

    </div>
  );
}
