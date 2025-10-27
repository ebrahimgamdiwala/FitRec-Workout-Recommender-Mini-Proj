'use client';

import GlassCard from './GlassCard';
import { Activity, Target, TrendingUp, Zap } from 'lucide-react';

export default function FeaturesSection() {
  const features = [
    {
      icon: <Target className="w-12 h-12" />,
      title: 'Personalized Plans',
      description: 'Get workout recommendations tailored to your fitness level and goals.',
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: 'Track Progress',
      description: 'Monitor your journey and celebrate every milestone achieved.',
    },
    {
      icon: <TrendingUp className="w-12 h-12" />,
      title: 'Smart Analytics',
      description: 'AI-powered insights to optimize your training routine.',
    },
    {
      icon: <Zap className="w-12 h-12" />,
      title: 'Quick Results',
      description: 'Efficient workouts designed to maximize your time and effort.',
    },
  ];

  return (
    <section id="features" className="relative z-10 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Why Choose FitRec?
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your personal AI-powered fitness companion designed to help you achieve your goals
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <GlassCard key={index}>
              <div className="text-cyan-400 mb-4">
                {feature.icon}
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-300">
                {feature.description}
              </p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  );
}
