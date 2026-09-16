'use client';

import { useState, useEffect } from 'react';
import { Preloader } from '../components/Preloader';
import { Navbar } from '../components/Navbar';
import { HeroSection } from '../components/HeroSection';
import { AboutSection } from '../components/AboutSection';
import { ServicesSection } from '../components/ServicesSection';
import { ProjectsSection } from '../components/ProjectsSection';
import { ReviewsSection } from '../components/ReviewsSection';
import { FooterSection } from '../components/FooterSection';
import { ClientVisionModal } from '../components/ClientVisionModal';
import { Project, Review } from '../lib/supabase/types';
import { fetchProjects, fetchReviews } from '../lib/data-store';
import { createClient } from '../lib/supabase/client';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [user, setUser] = useState<any>(null);

  // Vision Brief Modal
  const [isVisionModalOpen, setIsVisionModalOpen] = useState(false);

  // Initial Data Load & Auto Sync on Focus
  useEffect(() => {
    async function loadData() {
      const [projData, revData] = await Promise.all([
        fetchProjects(),
        fetchReviews()
      ]);
      setProjects(projData);
      setReviews(revData);
    }
    loadData();

    // Re-sync data when returning to landing page tab or after admin updates
    const handleSync = () => {
      loadData();
    };

    window.addEventListener('focus', handleSync);
    window.addEventListener('storage', handleSync);

    // Check Supabase session
    const supabase = createClient();
    if (supabase) {
      supabase.auth.getUser().then(({ data }) => {
        if (data?.user) setUser(data.user);
      });
    }

    return () => {
      window.removeEventListener('focus', handleSync);
      window.removeEventListener('storage', handleSync);
    };
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  return (
    <main className="min-h-screen bg-white text-zinc-900 overflow-x-hidden selection:bg-black selection:text-white">
      {/* Animated Screen Preloader */}
      <Preloader />

      {/* Glass Header */}
      <Navbar
        onOpenVisionModal={() => setIsVisionModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onOpenVisionModal={() => setIsVisionModalOpen(true)}
      />

      {/* About Section: Vision, Mission & Differentiators */}
      <AboutSection onOpenVisionModal={() => setIsVisionModalOpen(true)} />

      {/* Services Scope: Photography, Videography, Graphic Design, Strategy */}
      <ServicesSection onOpenVisionModal={() => setIsVisionModalOpen(true)} />

      {/* Selected Works Portfolio */}
      <ProjectsSection projects={projects} />

      {/* Client Testimonials */}
      <ReviewsSection reviews={reviews} />

      {/* Footer & Inquiry CTA */}
      <FooterSection />

      {/* Client Vision Questionnaire Modal */}
      <ClientVisionModal
        isOpen={isVisionModalOpen}
        onClose={() => setIsVisionModalOpen(false)}
      />
    </main>
  );
}
