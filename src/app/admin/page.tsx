'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Plus, Trash2, Eye, LogOut, Lock, Mail, Image as ImageIcon,
  CheckCircle2, FolderKanban, MessageSquare, FileText, ArrowLeft, Star, Upload, Loader2
} from 'lucide-react';
import { Project, Review } from '../../lib/supabase/types';
import {
  fetchProjects, fetchReviews, fetchVisionQuestionnaires,
  saveProjectToDatabase, deleteProjectFromDatabase,
  saveReviewToDatabase, deleteReviewFromDatabase,
  deleteQuestionnaireFromDatabase,
  uploadMediaFile, VisionQuestionnaire
} from '../../lib/data-store';
import { createClient } from '../../lib/supabase/client';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'projects' | 'reviews' | 'vision'>('projects');

  // CMS Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [questionnaires, setQuestionnaires] = useState<VisionQuestionnaire[]>([]);

  // Modals for Adding
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showAddReviewModal, setShowAddReviewModal] = useState(false);

  // New Project Form State
  const [projTitle, setProjTitle] = useState('');
  const [projCategory, setProjCategory] = useState('Photography');
  const [projClient, setProjClient] = useState('');
  const [projYear, setProjYear] = useState('2025');
  const [projDesc, setProjDesc] = useState('');
  const [projTags, setProjTags] = useState('Commercial, Editorial');
  const [projImageUrl, setProjImageUrl] = useState('');
  const [uploadingProj, setUploadingProj] = useState(false);

  // New Review Form State
  const [revAuthor, setRevAuthor] = useState('');
  const [revRole, setRevRole] = useState('');
  const [revContent, setRevContent] = useState('');
  const [revRating, setRevRating] = useState(5);
  const [revAvatar, setRevAvatar] = useState('');

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
    const [pList, rList, qList] = await Promise.all([
      fetchProjects(),
      fetchReviews(),
      fetchVisionQuestionnaires()
    ]);
    setProjects(pList);
    setReviews(rList);
    setQuestionnaires(qList);
  }

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError('');

    const supabase = createClient();
    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: authEmail,
          password: authPassword,
        });

        if (error) throw error;
        if (data.user) {
          setUser(data.user);
          setIsAuthenticated(true);
        }
      } catch (err: any) {
        setAuthError(err.message || 'Invalid admin credentials');
      } finally {
        setAuthLoading(false);
      }
    } else {
      // Secure local credential check when Supabase keys are not set
      const validEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'admin@oda.studio';
      const validPass = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'oda2025admin';

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

  // Add Project
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) return;

    const slug = projTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const tags = projTags.split(',').map((t) => t.trim()).filter(Boolean);
    const finalImg = projImageUrl || 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1600&auto=format&fit=crop';

    const created = await saveProjectToDatabase({
      title: projTitle,
      slug: slug || `project-${Date.now()}`,
      category: projCategory,
      description: projDesc,
      client_name: projClient,
      year: projYear,
      image_url: finalImg,
      tags,
      featured: true,
    });

    setProjects([created, ...projects]);
    setShowAddProjectModal(false);
    setProjTitle('');
    setProjDesc('');
    setProjImageUrl('');
  };

  // Delete Project
  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await deleteProjectFromDatabase(id);
    setProjects(projects.filter((p) => p.id !== id));
  };

  // Add Review
  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
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
    setRevAuthor('');
    setRevRole('');
    setRevContent('');
  };

  // Delete Review
  const handleDeleteReview = async (id: string) => {
    if (!confirm('Delete this testimonial review?')) return;
    await deleteReviewFromDatabase(id);
    setReviews(reviews.filter((r) => r.id !== id));
  };

  // Delete Questionnaire Brief
  const handleDeleteQuestionnaire = async (id: string) => {
    if (!confirm('Delete this vision questionnaire brief?')) return;
    await deleteQuestionnaireFromDatabase(id);
    setQuestionnaires(questionnaires.filter((q) => q.id !== id));
  };

  // Media File Upload Handler
  const handleProjectImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingProj(true);
    try {
      const url = await uploadMediaFile(file);
      setProjImageUrl(url);
    } catch (err) {
      console.error(err);
    } finally {
      setUploadingProj(false);
    }
  };

  // Unauthenticated Login View
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 bg-noise">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full bg-[#121215] border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6"
        >
          <div className="text-center">
            <span className="font-mono text-3xl font-black tracking-widest text-white">ODA</span>
            <h1 className="text-xl font-bold uppercase text-white mt-2">ADMIN PORTAL LOGIN</h1>
            <p className="text-xs font-mono text-zinc-400 mt-1">Sign in to manage projects, reviews & vision briefs</p>
          </div>

          {authError && (
            <div className="p-3 bg-red-950/60 border border-red-800/40 text-red-400 rounded-xl text-xs font-mono text-center">
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">ADMIN EMAIL</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  placeholder="admin@oda.studio"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white placeholder-zinc-600 focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase font-mono text-zinc-400 mb-1.5">PASSWORD</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white focus:outline-none focus:border-white transition-colors text-sm"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              {authLoading ? <Loader2 className="w-4 h-4 animate-spin text-black" /> : 'Enter Admin Dashboard'}
            </button>
          </form>

          <div className="text-center pt-4 border-t border-zinc-900">
            <Link href="/" className="text-xs text-zinc-400 hover:text-white font-mono flex items-center justify-center gap-1.5">
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
    <div className="min-h-screen bg-[#09090b] text-white bg-noise">
      {/* Admin Top Header */}
      <header className="border-b border-zinc-800 glass-header sticky top-0 z-40 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full border border-zinc-700 flex items-center justify-center p-0.5">
                <img src="/logo-circle.png" alt="ODA" className="w-full h-full object-cover rounded-full" />
              </div>
              <span className="font-black font-mono text-xl uppercase tracking-tighter">ODA ADMIN</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="px-4 py-2 text-xs font-mono uppercase bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-full flex items-center gap-1.5 transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>View Site</span>
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2 text-xs font-mono uppercase bg-red-950/60 text-red-300 hover:bg-red-900/60 border border-red-800/40 rounded-full flex items-center gap-1.5 transition-colors"
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
          <div className="p-6 rounded-2xl glass-card border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">FEATURED PROJECTS</p>
              <p className="text-3xl font-bold font-mono text-white mt-1">{projects.length}</p>
            </div>
            <FolderKanban className="w-8 h-8 text-zinc-600" />
          </div>

          <div className="p-6 rounded-2xl glass-card border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">CLIENT TESTIMONIALS</p>
              <p className="text-3xl font-bold font-mono text-white mt-1">{reviews.length}</p>
            </div>
            <MessageSquare className="w-8 h-8 text-zinc-600" />
          </div>

          <div className="p-6 rounded-2xl glass-card border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-mono text-zinc-500">VISION BRIEFS RECEIVED</p>
              <p className="text-3xl font-bold font-mono text-white mt-1">{questionnaires.length}</p>
            </div>
            <FileText className="w-8 h-8 text-zinc-600" />
          </div>
        </div>

        {/* Management Tabs Navigation */}
        <div className="flex items-center gap-3 border-b border-zinc-800 pb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'projects'
                ? 'bg-white text-black shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Manage Media Works ({projects.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'reviews'
                ? 'bg-white text-black shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Manage Client Voices ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('vision')}
            className={`px-6 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-2 transition-all ${
              activeTab === 'vision'
                ? 'bg-white text-black shadow-lg'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
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
                <h2 className="text-2xl font-black uppercase text-white">FEATURED MEDIA PROJECTS</h2>
                <p className="text-xs font-mono text-zinc-400">Add or remove portfolio projects showcased on the landing page</p>
              </div>

              <button
                onClick={() => setShowAddProjectModal(true)}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Project</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((proj) => (
                <div key={proj.id} className="p-6 rounded-2xl glass-card border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-zinc-900 relative">
                    <img src={proj.image_url} alt={proj.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full glass-card border border-white/10 text-[10px] uppercase font-mono text-white">
                      {proj.category}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-lg text-white uppercase">{proj.title}</h3>
                    <p className="text-xs text-zinc-400 font-light line-clamp-2 mt-1">{proj.description}</p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                    <span className="text-xs font-mono text-zinc-500">{proj.client_name || 'ODA Client'}</span>
                    <button
                      onClick={() => handleDeleteProject(proj.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition-colors"
                      title="Delete Project"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
                <h2 className="text-2xl font-black uppercase text-white">CLIENT VOICES & TESTIMONIALS</h2>
                <p className="text-xs font-mono text-zinc-400">Add or manage client feedback entries displayed on the live site</p>
              </div>

              <button
                onClick={() => setShowAddReviewModal(true)}
                className="px-6 py-3 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-200 transition-all shadow-lg active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Add Testimonial</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-6 rounded-2xl glass-card border border-zinc-800 flex flex-col justify-between space-y-4">
                  <div className="flex items-center gap-1 text-white">
                    {Array.from({ length: rev.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-white text-white" />
                    ))}
                  </div>

                  <p className="text-xs text-zinc-300 italic font-light">"{rev.content}"</p>

                  <div className="flex items-center justify-between pt-4 border-t border-zinc-900">
                    <div className="flex items-center gap-3">
                      <img src={rev.author_avatar} alt={rev.author_name} className="w-9 h-9 rounded-full object-cover border border-zinc-700" />
                      <div>
                        <h4 className="font-bold text-xs text-white uppercase">{rev.author_name}</h4>
                        <p className="text-[10px] font-mono text-zinc-500">{rev.author_role}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteReview(rev.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition-colors"
                      title="Delete Testimonial"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
              <h2 className="text-2xl font-black uppercase text-white">CLIENT VISION QUESTIONNAIRE BRIEFS</h2>
              <p className="text-xs font-mono text-zinc-400">Incoming project inquiries submitted via the Client Vision Questionnaire</p>
            </div>

            <div className="space-y-4">
              {questionnaires.map((q) => (
                <div key={q.id} className="p-6 rounded-2xl glass-card border border-zinc-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-800 pb-4">
                    <div>
                      <h3 className="font-bold text-lg text-white uppercase">{q.client_name}</h3>
                      <p className="text-xs font-mono text-zinc-400">{q.email} {q.phone && `• ${q.phone}`} {q.brand_name && `• Brand: ${q.brand_name}`}</p>
                    </div>

                    <div className="flex items-center gap-3 font-mono text-xs">
                      <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {q.estimated_budget || 'Custom'}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300">
                        {q.preferred_timeline || 'Within 2-4 Weeks'}
                      </span>
                      <button
                        onClick={() => handleDeleteQuestionnaire(q.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/60 rounded-lg transition-colors ml-2"
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
                        <span key={s} className="px-2.5 py-1 rounded-md bg-white/10 text-white text-xs font-mono">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs uppercase font-mono text-zinc-500 mb-1">CLIENT VISION BRIEF</p>
                    <p className="text-sm text-zinc-300 font-light leading-relaxed">{q.vision_description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-2xl w-full bg-[#09090b] border border-zinc-800 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black uppercase text-white">ADD NEW FEATURED WORK</h2>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">TITLE *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. LUXURY BRAND CAMPAIGN"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">CATEGORY</label>
                  <select
                    value={projCategory}
                    onChange={(e) => setProjCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                  >
                    <option value="Photography">Photography</option>
                    <option value="Videography">Videography</option>
                    <option value="Graphic Design">Graphic Design</option>
                    <option value="Campaigns">Campaigns</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">CLIENT</label>
                  <input
                    type="text"
                    placeholder="Maison Noir"
                    value={projClient}
                    onChange={(e) => setProjClient(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">YEAR</label>
                  <input
                    type="text"
                    placeholder="2025"
                    value={projYear}
                    onChange={(e) => setProjYear(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">DESCRIPTION *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Project details..."
                  value={projDesc}
                  onChange={(e) => setProjDesc(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">TAGS (COMMA SEPARATED)</label>
                <input
                  type="text"
                  placeholder="Brand Photography, Editorial"
                  value={projTags}
                  onChange={(e) => setProjTags(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">COVER MEDIA UPLOAD</label>
                <div className="border border-dashed border-zinc-800 p-4 rounded-xl text-center relative bg-zinc-950">
                  <input type="file" accept="image/*" onChange={handleProjectImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  {uploadingProj ? (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <Loader2 className="w-5 h-5 animate-spin text-white" />
                      <span className="text-xs font-mono text-zinc-400">Uploading to Supabase Storage...</span>
                    </div>
                  ) : projImageUrl ? (
                    <div className="flex items-center justify-between p-1">
                      <img src={projImageUrl} alt="Preview" className="h-12 rounded object-cover" />
                      <span className="text-xs text-green-400 font-mono">Image Uploaded</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      <Upload className="w-6 h-6 text-zinc-500" />
                      <span className="text-xs text-zinc-400 font-medium">Click to select image file</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200"
                >
                  Publish Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Review Modal */}
      {showAddReviewModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md p-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-[#09090b] border border-zinc-800 rounded-3xl p-8 space-y-6">
            <h2 className="text-2xl font-black uppercase text-white">ADD CLIENT TESTIMONIAL</h2>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">CLIENT NAME *</label>
                <input
                  type="text"
                  required
                  placeholder="Evelyn Vance"
                  value={revAuthor}
                  onChange={(e) => setRevAuthor(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">ROLE / BRAND</label>
                <input
                  type="text"
                  placeholder="Marketing Director, Maison Noir"
                  value={revRole}
                  onChange={(e) => setRevRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">RATING</label>
                <div className="flex items-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} type="button" onClick={() => setRevRating(star)}>
                      <Star className={`w-5 h-5 ${star <= revRating ? 'text-white fill-white' : 'text-zinc-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase font-mono text-zinc-400 mb-1">TESTIMONIAL CONTENT *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Client feedback..."
                  value={revContent}
                  onChange={(e) => setRevContent(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-900 border border-zinc-800 text-white text-sm resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddReviewModal(false)}
                  className="px-6 py-2.5 rounded-full text-xs font-mono uppercase text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200"
                >
                  Publish Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
