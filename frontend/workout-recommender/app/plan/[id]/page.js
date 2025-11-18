'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import GlassCard from '../../../components/GlassCard';

export default function PlanDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params?.id;

  const [plan, setPlan] = useState(null);
  const [similarPlans, setSimilarPlans] = useState([]);
  const [userId, setUserId] = useState(null);
  const [tracking, setTracking] = useState(null);
  const [trackerValue, setTrackerValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get plan from localStorage
    const savedPlan = localStorage.getItem('selected_plan');
    if (savedPlan) {
      const planData = JSON.parse(savedPlan);
      
      // Fetch full plan details with all exercises from backend
      fetch(`http://localhost:5000/api/plan/${encodeURIComponent(planData.title)}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setPlan(d.plan);
          } else {
            setPlan(planData); // fallback to saved plan
          }
        })
        .catch((err) => {
          console.error('Error fetching full plan:', err);
          setPlan(planData); // fallback to saved plan
        });
    }

    // Get user ID
    const stored = localStorage.getItem('fitrec_user_id');
    if (stored) {
      setUserId(stored);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (plan && userId) {
      // Fetch tracking data
      fetch(`http://localhost:5000/api/tracking?user_id=${userId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            const trackingEntry = d.tracking.find((t) => t.title === plan.title);
            if (trackingEntry) {
              setTracking(trackingEntry);
              setTrackerValue(trackingEntry.current_progress || 0);
            }
          }
        })
        .catch((err) => console.error('Error fetching tracking:', err));

      // Fetch similar plans
      fetch('http://localhost:5000/api/select_plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, title: plan.title }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d.success) {
            setSimilarPlans(d.similar || []);
            if (!tracking) {
              setTracking(d.tracking);
            }
          }
        })
        .catch((err) => console.error('Error fetching similar plans:', err));
    }
  }, [plan, userId]);

  const handleUpdateProgress = async (value, note) => {
    if (!userId || !plan) return;
    try {
      const res = await fetch('http://localhost:5000/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: userId, 
          title: plan.title, 
          progress: value, 
          note: note || '' 
        }),
      });
      const d = await res.json();
      if (d.success) {
        setTracking(d.tracking);
        setTrackerValue(d.tracking.current_progress || 0);
      } else {
        setError(d.error || 'Failed to update progress');
      }
    } catch (err) {
      setError('Failed to reach server to update tracking');
      console.error(err);
    }
  };

  const handleSelectPlan = (newPlan) => {
    localStorage.setItem('selected_plan', JSON.stringify(newPlan));
    router.push(`/plan/${encodeURIComponent(newPlan.title)}`);
    // Reload page with new plan
    window.location.href = `/plan/${encodeURIComponent(newPlan.title)}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-2xl mb-4">No plan selected</p>
          <button
            onClick={() => router.push('/')}
            className="px-6 py-3 bg-cyan-500 text-white rounded-full font-semibold hover:opacity-90"
          >
            Go Back to Recommendations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-blue-900 to-gray-900 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => router.push('/')}
          className="mb-6 px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all"
        >
          ← Back to Recommendations
        </button>

        {/* Plan Details */}
        <GlassCard className="p-8 mb-8">
          <h1 className="text-4xl font-bold text-cyan-400 mb-4">{plan.title}</h1>
          <p className="text-gray-300 text-lg mb-6">{plan.description}</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Goal</p>
              <p className="text-white font-semibold text-lg">{plan.goal}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Level</p>
              <p className="text-white font-semibold text-lg">{plan.level}</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Duration</p>
              <p className="text-white font-semibold text-lg">{plan.program_length} weeks</p>
            </div>
            <div className="text-center p-4 bg-white/5 rounded-lg">
              <p className="text-gray-400 text-sm">Time/Workout</p>
              <p className="text-white font-semibold text-lg">{plan.time_per_workout} min</p>
            </div>
          </div>

          {/* Sample Exercises */}
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-2xl font-bold text-white mb-4">
              Sample Exercises ({plan.total_exercises} total)
            </h3>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {plan.exercises && plan.exercises.map((ex, exIndex) => (
                <div key={exIndex} className="bg-white/5 p-4 rounded-lg">
                  <p className="text-cyan-300 font-semibold text-lg">{ex.name}</p>
                  <p className="text-gray-400">
                    Week {ex.week}, Day {ex.day} • {ex.sets} sets × {ex.reps} reps • 
                    Intensity: {ex.intensity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Progress Tracking */}
        <GlassCard className="p-8 mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Track Your Progress</h2>
          
          {tracking && (
            <div className="mb-6 p-4 bg-cyan-500/20 rounded-lg border border-cyan-500/50">
              <p className="text-gray-300 text-lg">Current Progress</p>
              <p className="text-white font-bold text-4xl">{tracking.current_progress || 0}%</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-gray-300 text-lg mb-3">Update Progress (0 - 100%)</label>
            <input 
              type="range" 
              min="0" 
              max="100" 
              step="1" 
              value={trackerValue}
              onChange={(e) => setTrackerValue(e.target.value)} 
              className="w-full h-3 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-500"
            />
            <div className="text-center text-cyan-400 font-bold text-3xl mt-3">{trackerValue}%</div>
            
            <div className="flex gap-4 mt-6">
              <button 
                onClick={() => handleUpdateProgress(parseFloat(trackerValue), '')} 
                className="flex-1 px-6 py-3 bg-linear-to-r from-green-500 to-green-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Save Progress
              </button>
              <button 
                onClick={() => {
                  setTrackerValue(0);
                  handleUpdateProgress(0, 'Reset');
                }} 
                className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
              >
                Reset Progress
              </button>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Progress History</h3>
            {!tracking || !tracking.progress || tracking.progress.length === 0 ? (
              <p className="text-gray-300">No progress recorded yet. Start tracking by updating your progress above.</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tracking.progress.slice().reverse().map((p, i) => (
                  <div key={i} className="flex justify-between items-center bg-white/5 p-4 rounded-lg">
                    <div className="text-gray-300">{new Date(p.date).toLocaleString()}</div>
                    <div className="text-white font-bold text-xl">{p.value}%</div>
                    {p.note && <div className="text-gray-400 text-sm italic">{p.note}</div>}
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
              {error}
            </div>
          )}
        </GlassCard>

        {/* Similar Plans */}
        {similarPlans.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Similar Workout Plans</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {similarPlans.map((s, si) => (
                <GlassCard key={si} className="p-6 hover:scale-105 transition-transform">
                  <h3 className="text-2xl font-bold text-cyan-300 mb-3">{s.title}</h3>
                  <p className="text-gray-300 mb-4">{s.description}</p>
                  
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-2 bg-white/5 rounded">
                      <p className="text-gray-400 text-sm">Goal</p>
                      <p className="text-white font-semibold">{s.goal}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <p className="text-gray-400 text-sm">Level</p>
                      <p className="text-white font-semibold">{s.level}</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <p className="text-gray-400 text-sm">Duration</p>
                      <p className="text-white font-semibold">{s.program_length} weeks</p>
                    </div>
                    <div className="p-2 bg-white/5 rounded">
                      <p className="text-gray-400 text-sm">Time</p>
                      <p className="text-white font-semibold">{s.time_per_workout} min</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => handleSelectPlan(s)} 
                    className="w-full px-6 py-3 bg-linear-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform"
                  >
                    Select This Plan
                  </button>
                </GlassCard>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
