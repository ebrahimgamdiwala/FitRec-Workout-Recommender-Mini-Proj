'use client';

import { useState } from 'react';
import GlassCard from './GlassCard';

export default function RecommendSection() {
  const [formData, setFormData] = useState({
    fitnessLevel: 'intermediate',
    goal: 'muscle',
    duration: '45',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would integrate with your recommendation API
  };

  return (
    <section id="recommend" className="relative z-10 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Get Your Personalized Plan
          </h2>
          <p className="text-xl text-gray-300">
            Answer a few questions and let our AI create the perfect workout for you
          </p>
        </div>

        <GlassCard hover={false} className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Fitness Level */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                What's your fitness level?
              </label>
              <div className="grid grid-cols-3 gap-3">
                {['beginner', 'intermediate', 'advanced'].map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setFormData({ ...formData, fitnessLevel: level })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      formData.fitnessLevel === level
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                What's your primary goal?
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'weight-loss', label: 'Weight Loss' },
                  { value: 'muscle', label: 'Build Muscle' },
                  { value: 'endurance', label: 'Endurance' },
                  { value: 'flexibility', label: 'Flexibility' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      formData.goal === goal.value
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                How much time can you dedicate? (minutes)
              </label>
              <input
                type="range"
                min="15"
                max="120"
                step="15"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="text-center mt-2 text-2xl font-bold text-cyan-400">
                {formData.duration} minutes
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-2xl shadow-cyan-500/50 text-lg"
            >
              Generate My Workout Plan
            </button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
}
