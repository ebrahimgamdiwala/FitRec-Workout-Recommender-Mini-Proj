'use client';

import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import RecommendSection from '@/components/RecommendSection';
import Footer from '@/components/Footer';

// Dynamically import Ballpit to avoid SSR issues
const Ballpit = dynamic(() => import('@/components/Ballpit'), { ssr: false });

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* Ballpit Background */}
      <div className="fixed inset-0 z-0">
        <Ballpit 
          followCursor={true}
          count={150}
          colors={[0x000000, 0x1e3a8a, 0x06b6d4, 0x3b82f6]}
          size0={1.5}
          minSize={0.3}
          maxSize={0.8}
          gravity={0.3}
          friction={0.998}
        />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10">
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <RecommendSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
