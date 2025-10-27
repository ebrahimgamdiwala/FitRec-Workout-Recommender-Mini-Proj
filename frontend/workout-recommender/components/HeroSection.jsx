'use client';

import Image from 'next/image';
import TypewriterText from './TypewriterText';
import GlassCard from './GlassCard';

export default function HeroSection() {
  const typewriterTexts = [
    'Your Perfect Workout',
    'Personalized Training',
    'Fitness Goals',
    'Better Results',
  ];

  return (
    <section id="home" className="relative z-10 min-h-screen flex items-center justify-center px-4 pt-32 pb-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <GlassCard hover={false} className="inline-block mb-6">
              <span className="text-sm font-semibold text-cyan-400">
                ✨ AI-Powered Fitness
              </span>
            </GlassCard>

            <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Discover{' '}
              <span className="inline-block min-w-[400px] bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                <TypewriterText texts={typewriterTexts} speed={150} deleteSpeed={100} pauseTime={2000} />
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0">
              Get personalized workout recommendations powered by advanced AI. 
              Transform your fitness journey with plans tailored just for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-2xl shadow-cyan-500/50">
                Get Your Workout Plan
              </button>
              <button className="px-8 py-4 backdrop-blur-xl bg-white/10 border border-white/20 text-white rounded-full font-semibold hover:bg-white/20 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mt-12 max-w-lg mx-auto lg:mx-0">
              <GlassCard hover={false} className="text-center p-4">
                <div className="text-3xl font-bold text-cyan-400">500+</div>
                <div className="text-sm text-gray-300 mt-1">Workouts</div>
              </GlassCard>
              <GlassCard hover={false} className="text-center p-4">
                <div className="text-3xl font-bold text-cyan-400">10k+</div>
                <div className="text-sm text-gray-300 mt-1">Users</div>
              </GlassCard>
              <GlassCard hover={false} className="text-center p-4">
                <div className="text-3xl font-bold text-cyan-400">95%</div>
                <div className="text-sm text-gray-300 mt-1">Success</div>
              </GlassCard>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <GlassCard className="overflow-hidden p-0 border-4">
              <div className="relative h-[500px] w-full">
                <Image
                  src="/herosection-workout.jpg"
                  alt="Workout Hero"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </GlassCard>

            {/* Floating Elements */}
            <div className="absolute -top-6 -right-6 hidden lg:block">
              <GlassCard hover={false} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    💪
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Strength</div>
                    <div className="text-xs text-gray-400">Training</div>
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="absolute -bottom-6 -left-6 hidden lg:block">
              <GlassCard hover={false} className="p-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    🔥
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Cardio</div>
                    <div className="text-xs text-gray-400">Burn Calories</div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
