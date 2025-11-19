'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import GlassCard from './GlassCard';

export default function RecommendSection() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fitnessLevel: 'intermediate',
    goal: 'muscle',
    equipment: 'gym',
    duration: '45',
    programLength: '12',
  });

  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [savingPlan, setSavingPlan] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handleSavePlan = async (plan) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    setSavingPlan(plan.title);
    try {
      const response = await fetch('http://localhost:5000/api/plans/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_title: plan.title,
          plan_data: plan
        })
      });

      const data = await response.json();
      if (data.success) {
        // Redirect to dashboard without alert
        router.push('/dashboard');
      } else {
        // Only show error alerts
        alert(data.error || 'Failed to save plan');
      }
    } catch (error) {
      console.error('Error saving plan:', error);
      alert('Failed to save plan');
    } finally {
      setSavingPlan(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: formData.goal,
          level: formData.fitnessLevel,
          equipment: formData.equipment,
          max_time: parseInt(formData.duration),
          max_length: parseInt(formData.programLength),
        }),
      });

      const data = await response.json();

      if (data.success) {
        setRecommendations(data.recommendations);
      } else {
        setError(data.error || 'Failed to get recommendations');
      }
    } catch (err) {
      setError('Failed to connect to the server. Make sure the backend is running on port 5000.');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlan = (plan) => {
    // Save plan to localStorage and navigate to details page
    localStorage.setItem('selected_plan', JSON.stringify(plan));
    
    // Get or create user ID
    let uid = localStorage.getItem('fitrec_user_id');
    if (!uid) {
      uid = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('fitrec_user_id', uid);
    }
    
    // Navigate to plan details page
    router.push(`/plan/${encodeURIComponent(plan.title)}`);
  };

  return (
    <section id="recommend" className="relative z-10 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-white mb-4">
            Get Your Personalized Plan
          </h2>
          <p className="text-xl text-gray-300">
            Answer a few questions and get the perfect workout plan for you
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
                        ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
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
                  { value: 'muscle', label: 'Build Muscle' },
                  { value: 'strength', label: 'Strength' },
                  { value: 'endurance', label: 'Endurance' },
                  { value: 'flexibility', label: 'Flexibility' },
                  { value: 'cardio', label: 'Cardio' },
                  { value: 'fat loss', label: 'Fat Loss' },
                ].map((goal) => (
                  <button
                    key={goal.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, goal: goal.value })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      formData.goal === goal.value
                        ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {goal.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Available Equipment
              </label>
              <div className="grid grid-cols-2 gap-3">
                {['gym', 'home', 'bodyweight', 'minimal'].map((equip) => (
                  <button
                    key={equip}
                    type="button"
                    onClick={() => setFormData({ ...formData, equipment: equip })}
                    className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                      formData.equipment === equip
                        ? 'bg-linear-to-r from-cyan-500 to-blue-600 text-white scale-105 shadow-lg shadow-cyan-500/50'
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                  >
                    {equip.charAt(0).toUpperCase() + equip.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Program Length */}
            <div>
              <label className="block text-lg font-semibold text-white mb-3">
                Program Length (weeks)
              </label>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={formData.programLength}
                onChange={(e) => setFormData({ ...formData, programLength: e.target.value })}
                className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
              />
              <div className="text-center mt-2 text-2xl font-bold text-cyan-400">
                {formData.programLength} weeks
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
              disabled={loading}
              className="w-full px-8 py-4 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform duration-300 shadow-2xl shadow-cyan-500/50 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Generating...' : 'Generate My Workout Plan'}
            </button>

            {/* Error Message */}
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
                {error}
              </div>
            )}
          </form>
        </GlassCard>

        {/* Recommendations Display */}
        {recommendations.length > 0 && (
          <div className="mt-12 space-y-6">
            <h3 className="text-3xl font-bold text-white text-center mb-8">
              Your Personalized Recommendations
            </h3>
            
            {recommendations.map((rec, index) => (
              <GlassCard key={index} className="p-6 hover:scale-102 transition-transform">
                <h4 className="text-2xl font-bold text-cyan-400 mb-3">{rec.title}</h4>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Goal</p>
                    <p className="text-white font-semibold">{rec.goal}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Level</p>
                    <p className="text-white font-semibold">{rec.level}</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Duration</p>
                    <p className="text-white font-semibold">{rec.program_length} weeks</p>
                  </div>
                  <div className="text-center p-3 bg-white/5 rounded-lg">
                    <p className="text-gray-400 text-sm">Time/Workout</p>
                    <p className="text-white font-semibold">{rec.time_per_workout} min</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{rec.description}</p>

                <div className="border-t border-white/10 pt-4">
                  <p className="text-gray-400 mb-3">
                    Total Exercises: <span className="text-white font-semibold">{rec.total_exercises}</span>
                  </p>
                </div>
                
                <div className="mt-4 flex gap-3">
                  {isAuthenticated ? (
                    <>
                      <button
                        onClick={() => handleSavePlan(rec)}
                        disabled={savingPlan === rec.title}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg disabled:opacity-50"
                      >
                        {savingPlan === rec.title ? 'Saving...' : 'Save & Start Plan'}
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => router.push('/login')}
                      className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
                    >
                      Login to Save Plan
                    </button>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
