'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { ArrowLeft, CheckCircle, Circle, Calendar, Clock, Flame, Plus } from 'lucide-react';
import DashboardNavbar from '@/components/DashboardNavbar';

const Ballpit = dynamic(() => import('@/components/Ballpit'), { ssr: false });

export default function PlanDetailPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id;

  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showExercisesModal, setShowExercisesModal] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [selectedDay, setSelectedDay] = useState(1);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    fetchPlanProgress(token);
  }, [planId]);

  const fetchPlanProgress = async (token) => {
    try {
      const response = await fetch(`http://localhost:5000/api/plans/${planId}/progress`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();
      if (data.success) {
        setProgress(data.progress);
        setSelectedWeek(data.progress.current_week);
        setSelectedDay(data.progress.current_day);
      }
    } catch (error) {
      console.error('Error fetching plan progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompletePlan = async () => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5000/api/plans/${planId}/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchPlanProgress(token);
    } catch (error) {
      console.error('Error completing plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Plan not found</div>
      </div>
    );
  }

  const planData = progress.plan_data;
  const totalWeeks = planData.program_length || 12;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
      {/* Ballpit Background */}
      <div className="fixed inset-0 z-0">
        <Ballpit 
          followCursor={false}
          count={150}
          colors={[0x000000, 0x1e3a8a, 0x06b6d4, 0x3b82f6]}
          size0={1.5}
          minSize={0.3}
          maxSize={0.8}
          gravity={0.3}
          friction={0.998}
        />
      </div>

      {/* Content */}
      <div className="relative z-10">
      {/* Navbar */}
      <DashboardNavbar />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        {/* Plan Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link
              href="/dashboard"
              className="p-2 hover:bg-white/10 rounded-lg transition"
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white">{progress.plan_title}</h1>
              <p className="text-gray-300 text-lg">Week {progress.current_week}, Day {progress.current_day}</p>
            </div>
            {!progress.completed && (
              <button
                onClick={handleCompletePlan}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-green-500/50"
              >
                Mark as Completed
              </button>
            )}
          </div>
        </div>
        {/* Plan Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Goal"
            value={planData.goal}
          />
          <InfoCard
            icon={<Calendar className="w-5 h-5" />}
            label="Level"
            value={planData.level}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5" />}
            label="Duration"
            value={`${planData.program_length} weeks`}
          />
          <InfoCard
            icon={<Clock className="w-5 h-5" />}
            label="Time/Workout"
            value={`${planData.time_per_workout} min`}
          />
        </div>

        {/* Progress Stats */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
          <h3 className="text-xl font-bold text-white mb-4">Your Progress</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Sessions</p>
              <p className="text-3xl font-bold text-white">{progress.total_sessions || 0}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-white">
                {progress.total_sessions ? Math.round((progress.total_sessions / (totalWeeks * 5)) * 100) : 0}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-sm mb-1">Status</p>
              <p className="text-3xl font-bold text-white">
                {progress.completed ? '✅ Completed' : '🏃 Active'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex gap-4 flex-wrap">
          <button
            onClick={() => setShowLogModal(true)}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Log Today's Workout
          </button>
          <button
            onClick={() => setShowExercisesModal(true)}
            className="px-6 py-3 bg-white/10 text-white rounded-full font-semibold hover:bg-white/20 transition flex items-center gap-2 border border-white/20"
          >
            <Calendar className="w-5 h-5" />
            View All Exercises
          </button>
        </div>

        {/* Workout History */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <h3 className="text-xl font-bold text-white mb-4">Workout History</h3>
          {progress.sessions && progress.sessions.length > 0 ? (
            <div className="space-y-4">
              {progress.sessions.map((session) => (
                <SessionCard key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">No workouts logged yet. Start your first session!</p>
          )}
        </div>
      </div>

      {/* Log Workout Modal */}
      {showLogModal && (
        <LogWorkoutModal
          planId={planId}
          currentWeek={selectedWeek}
          currentDay={selectedDay}
          planData={progress.plan_data}
          onClose={() => setShowLogModal(false)}
          onSuccess={() => {
            setShowLogModal(false);
            const token = localStorage.getItem('token');
            fetchPlanProgress(token);
          }}
        />
      )}

      {/* Exercises Modal */}
      {showExercisesModal && (
        <ExercisesModal
          planData={progress.plan_data}
          onClose={() => setShowExercisesModal(false)}
        />
      )}
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex items-center gap-2 mb-2 text-gray-400">
        {icon}
        <span className="text-sm">{label}</span>
      </div>
      <p className="text-white font-semibold capitalize">{value}</p>
    </div>
  );
}

function SessionCard({ session }) {
  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      <div className="flex justify-between items-start mb-2">
        <div>
          <p className="text-white font-semibold">
            Week {session.week_number}, Day {session.day_number}
          </p>
          <p className="text-gray-400 text-sm">{session.session_date}</p>
        </div>
        <CheckCircle className="w-5 h-5 text-green-400" />
      </div>
      <div className="grid grid-cols-3 gap-4 mt-3">
        <div>
          <p className="text-gray-400 text-xs">Duration</p>
          <p className="text-white font-semibold">{session.duration_minutes} min</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Calories</p>
          <p className="text-white font-semibold">{session.calories_burned || 0}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Exercises</p>
          <p className="text-white font-semibold">{session.exercises_logged || 0}</p>
        </div>
      </div>
      {session.notes && (
        <p className="text-gray-400 text-sm mt-2 italic">{session.notes}</p>
      )}
    </div>
  );
}

function ExercisesModal({ planData, onClose }) {
  const exercises = planData.exercises || [];
  
  // Group exercises by week and day
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const week = exercise.week || 1;
    const day = exercise.day || 1;
    const key = `Week ${week}, Day ${day}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(exercise);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-4xl w-full border border-white/20 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-slate-900 pb-4">
          <h3 className="text-2xl font-bold text-white">Complete Exercise List</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-lg transition"
          >
            <span className="text-white text-2xl">×</span>
          </button>
        </div>

        <div className="space-y-6">
          {Object.entries(groupedExercises).map(([key, dayExercises]) => (
            <div key={key} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 className="text-lg font-semibold text-cyan-400 mb-3">{key}</h4>
              <div className="space-y-2">
                {dayExercises.map((exercise, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                    <div className="flex-1">
                      <p className="text-white font-medium">{exercise.name}</p>
                      <p className="text-gray-400 text-sm">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.intensity && ` • ${exercise.intensity} intensity`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function LogWorkoutModal({ planId, currentWeek, currentDay, planData, onClose, onSuccess }) {
  // Ensure we have valid numbers
  const safeWeek = Number(currentWeek) || 1;
  const safeDay = Number(currentDay) || 1;
  
  const [formData, setFormData] = useState({
    week_number: safeWeek,
    day_number: safeDay,
    duration_minutes: 30,
    calories_burned: 200,
    notes: ''
  });
  const [loading, setLoading] = useState(false);

  // Get exercises for current week and day
  const todaysExercises = (planData.exercises || []).filter(
    ex => ex.week === safeWeek && ex.day === safeDay
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    const today = new Date().toISOString().split('T')[0];

    try {
      const response = await fetch('http://localhost:5000/api/sessions/log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          plan_id: parseInt(planId),
          session_date: today,
          ...formData,
          exercises: []
        })
      });

      const data = await response.json();
      if (data.success) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error logging workout:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full border border-white/20 my-8">
        <h3 className="text-2xl font-bold text-white mb-4">Log Workout Session</h3>
        
        {/* Today's Exercises */}
        {todaysExercises.length > 0 && (
          <div className="mb-6 bg-white/5 rounded-xl p-4 border border-white/10">
            <h4 className="text-lg font-semibold text-cyan-400 mb-3">
              Today's Exercises (Week {safeWeek}, Day {safeDay})
            </h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {todaysExercises.map((exercise, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                  <div>
                    <p className="text-white font-medium">{exercise.name}</p>
                    <p className="text-gray-400 text-sm">
                      {exercise.sets} sets × {exercise.reps} reps
                    </p>
                  </div>
                  <span className="text-cyan-400 text-sm">{exercise.intensity}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">Week</label>
              <input
                type="number"
                min="1"
                value={formData.week_number || ''}
                onChange={(e) => setFormData({ ...formData, week_number: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">Day</label>
              <input
                type="number"
                min="1"
                value={formData.day_number || ''}
                onChange={(e) => setFormData({ ...formData, day_number: parseInt(e.target.value) || 1 })}
                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Duration (minutes)</label>
            <input
              type="number"
              min="1"
              value={formData.duration_minutes || ''}
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Calories Burned</label>
            <input
              type="number"
              min="0"
              value={formData.calories_burned || ''}
              onChange={(e) => setFormData({ ...formData, calories_burned: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-2">Notes (optional)</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white"
              rows="3"
              placeholder="How did it go?"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50 disabled:opacity-50 disabled:hover:scale-100"
            >
              {loading ? 'Logging...' : 'Log Workout'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
