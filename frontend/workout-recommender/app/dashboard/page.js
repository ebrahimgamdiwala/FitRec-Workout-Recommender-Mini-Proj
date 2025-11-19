'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Activity, Calendar, Flame, TrendingUp, Dumbbell, Clock, Target, Award } from 'lucide-react';
import { WorkoutDaysPieChart, WorkoutCategoriesDonutChart, ActivityLineChart } from '@/components/Charts';
import DashboardNavbar from '@/components/DashboardNavbar';

const Ballpit = dynamic(() => import('@/components/Ballpit'), { ssr: false });

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);
  const [showTargetModal, setShowTargetModal] = useState(false);
  const [targets, setTargets] = useState({
    weekly_workouts: 4,
    weekly_minutes: 180,
    weekly_calories: 1500
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    
    // Load saved targets only once
    const savedTargets = localStorage.getItem('workout_targets');
    if (savedTargets) {
      setTargets(JSON.parse(savedTargets));
    }
    
    // Check if this is initial load or period change
    const isInitialLoad = !stats;
    fetchDashboardData(token, isInitialLoad);
  }, [period]);

  const saveTargets = (newTargets) => {
    setTargets(newTargets);
    localStorage.setItem('workout_targets', JSON.stringify(newTargets));
    setShowTargetModal(false);
  };

  const fetchDashboardData = async (token, isInitialLoad = false) => {
    if (isInitialLoad) {
      setLoading(true);
    }
    
    try {
      // Fetch statistics
      const statsRes = await fetch(`http://localhost:5000/api/dashboard/stats?days=${period}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const statsData = await statsRes.json();
      if (statsData.success) {
        setStats(statsData.stats);
      }

      // Fetch saved plans only on initial load
      if (isInitialLoad) {
        const plansRes = await fetch('http://localhost:5000/api/plans', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const plansData = await plansRes.json();
        if (plansData.success) {
          setPlans(plansData.plans);
        }
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">
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
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-10">
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
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Welcome back, {user?.name}! 💪</h1>
          <p className="text-gray-300 text-lg">Here's your fitness journey overview</p>
        </div>

        {/* Period Selector */}
        <div className="mb-6 flex gap-2 items-center">
          {[7, 30, 90].map((days) => (
            <button
              key={days}
              onClick={() => {
                console.log('Setting period to:', days);
                setPeriod(days);
              }}
              disabled={loading}
              className={`px-4 py-2 rounded-full transition ${
                period === days
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/50'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {days} Days
            </button>
          ))}
          {loading && (
            <div className="ml-3 flex items-center gap-2 text-cyan-400">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-cyan-400 border-t-transparent"></div>
              <span className="text-sm">Loading...</span>
            </div>
          )}
        </div>
          <button
            onClick={() => setShowTargetModal(true)}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-purple-500/50 flex items-center gap-2"
          >
            <Target className="w-4 h-4" />
            Set Targets
          </button>
        </div>

        {/* Stats Grid */}
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-white mb-4">Last {period} Days Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Dumbbell className="w-8 h-8" />}
            title="Total Workouts"
            value={stats?.total_workouts || 0}
            color="from-cyan-500 to-blue-500"
          />
          <StatCard
            icon={<Clock className="w-8 h-8" />}
            title="Total Minutes"
            value={stats?.total_minutes || 0}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            icon={<Flame className="w-8 h-8" />}
            title="Calories Burned"
            value={stats?.total_calories || 0}
            color="from-orange-500 to-red-500"
          />
          <StatCard
            icon={<Award className="w-8 h-8" />}
            title="Current Streak"
            value={`${stats?.current_streak || 0} days`}
            color="from-green-500 to-emerald-500"
          />
        </div>

        {/* Progress Line Chart */}
        {stats?.recent_workouts && stats.recent_workouts.length > 0 && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 mb-8">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              Recent Activity (Last {Math.min(period, 7)} Days)
            </h3>
            <ActivityLineChart data={stats.recent_workouts} />
          </div>
        )}

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Most Active Days - Pie Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-6 h-6" />
              Most Active Days ({period} Days)
            </h3>
            {stats?.most_active_day ? (
              <WorkoutDaysPieChart data={stats.workouts_by_day} />
            ) : (
              <p className="text-gray-400 text-center py-8">No workout data yet</p>
            )}
          </div>

          {/* Workout Categories - Donut Chart */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <Target className="w-6 h-6" />
              Workout Categories ({period} Days)
            </h3>
            {stats?.categories && Object.keys(stats.categories).length > 0 ? (
              <WorkoutCategoriesDonutChart data={stats.categories} />
            ) : (
              <p className="text-gray-400 text-center py-8">No workout data yet</p>
            )}
          </div>
        </div>

        {/* Saved Plans */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-6 h-6" />
              Your Workout Plans
            </h3>
            <Link
              href="/"
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
            >
              Find New Plans
            </Link>
          </div>

          {plans.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <PlanCard key={plan.id} plan={plan} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-4">You haven't saved any workout plans yet</p>
              <Link
                href="/"
                className="inline-block px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-full font-semibold hover:scale-105 transition-transform shadow-lg shadow-cyan-500/50"
              >
                Discover Workout Plans
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-gray-300 text-sm mb-1">{title}</h3>
      <p className="text-3xl font-bold text-white">{value}</p>
    </div>
  );
}

function PlanCard({ plan }) {
  const planData = plan.plan_data;
  
  return (
    <Link href={`/plan/${plan.id}`}>
      <div className="bg-white/5 rounded-xl p-4 border border-white/10 hover:bg-white/10 transition cursor-pointer">
        <div className="flex justify-between items-start mb-2">
          <h4 className="text-white font-semibold line-clamp-1">{plan.plan_title}</h4>
          {plan.completed && (
            <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded">
              Completed
            </span>
          )}
        </div>
        <div className="space-y-1 text-sm text-gray-400">
          <p>Goal: <span className="text-gray-300">{planData.goal}</span></p>
          <p>Level: <span className="text-gray-300">{planData.level}</span></p>
          <p>Week {plan.current_week}, Day {plan.current_day}</p>
        </div>
      </div>
    </Link>
  );
}

function PieChart({ data }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const colors = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];
  
  let currentAngle = -90;
  const slices = Object.entries(data).map(([key, value], idx) => {
    const percentage = (value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      key,
      value,
      percentage,
      startAngle,
      angle,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {slices.map((slice, idx) => {
          const x1 = 50 + 45 * Math.cos((slice.startAngle * Math.PI) / 180);
          const y1 = 50 + 45 * Math.sin((slice.startAngle * Math.PI) / 180);
          const x2 = 50 + 45 * Math.cos(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const y2 = 50 + 45 * Math.sin(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const largeArc = slice.angle > 180 ? 1 : 0;

          return (
            <path
              key={idx}
              d={`M 50 50 L ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} Z`}
              fill={slice.color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>
    </div>
  );
}

function DonutChart({ data }) {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const colors = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6'];
  
  let currentAngle = -90;
  const slices = Object.entries(data).map(([key, value], idx) => {
    const percentage = (value / total) * 100;
    const angle = (percentage / 100) * 360;
    const startAngle = currentAngle;
    currentAngle += angle;
    
    return {
      key,
      value,
      percentage,
      startAngle,
      angle,
      color: colors[idx % colors.length]
    };
  });

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 100 100" className="transform -rotate-90">
        {/* Outer ring */}
        {slices.map((slice, idx) => {
          const x1 = 50 + 45 * Math.cos((slice.startAngle * Math.PI) / 180);
          const y1 = 50 + 45 * Math.sin((slice.startAngle * Math.PI) / 180);
          const x2 = 50 + 45 * Math.cos(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const y2 = 50 + 45 * Math.sin(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const x3 = 50 + 30 * Math.cos(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const y3 = 50 + 30 * Math.sin(((slice.startAngle + slice.angle) * Math.PI) / 180);
          const x4 = 50 + 30 * Math.cos((slice.startAngle * Math.PI) / 180);
          const y4 = 50 + 30 * Math.sin((slice.startAngle * Math.PI) / 180);
          const largeArc = slice.angle > 180 ? 1 : 0;

          return (
            <path
              key={idx}
              d={`M ${x1} ${y1} A 45 45 0 ${largeArc} 1 ${x2} ${y2} L ${x3} ${y3} A 30 30 0 ${largeArc} 0 ${x4} ${y4} Z`}
              fill={slice.color}
              className="hover:opacity-80 transition-opacity"
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold text-white">{total}</p>
          <p className="text-xs text-gray-400">Sessions</p>
        </div>
      </div>
    </div>
  );
}

function LineChart({ data }) {
  if (!data || data.length === 0) return null;

  // Reverse to show oldest to newest
  const sortedData = [...data].reverse();
  const maxDuration = Math.max(...sortedData.map(d => d.duration_minutes || 0), 1);
  const maxCalories = Math.max(...sortedData.map(d => d.calories_burned || 0), 1);

  const width = 100;
  const height = 60;
  const padding = 5;

  // Ensure we have at least 2 points for the line
  if (sortedData.length < 2) {
    return (
      <div className="text-center text-gray-400 py-8">
        Need at least 2 workouts to show trends
      </div>
    );
  }

  // Create points for duration line
  const durationPoints = sortedData.map((d, i) => {
    const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.duration_minutes || 0) / maxDuration) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  // Create points for calories line
  const caloriesPoints = sortedData.map((d, i) => {
    const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
    const y = height - padding - ((d.calories_burned || 0) / maxCalories) * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="space-y-4">
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-32">
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line
            key={i}
            x1={padding}
            y1={padding + (i * (height - 2 * padding) / 4)}
            x2={width - padding}
            y2={padding + (i * (height - 2 * padding) / 4)}
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="0.5"
          />
        ))}

        {/* Duration line */}
        <polyline
          points={durationPoints}
          fill="none"
          stroke="#06b6d4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Duration points */}
        {sortedData.map((d, i) => {
          const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((d.duration_minutes || 0) / maxDuration) * (height - 2 * padding);
          // Ensure values are valid numbers
          if (isNaN(x) || isNaN(y)) return null;
          return (
            <circle
              key={`duration-${i}`}
              cx={x}
              cy={y}
              r="1.5"
              fill="#06b6d4"
            />
          );
        })}

        {/* Calories line */}
        <polyline
          points={caloriesPoints}
          fill="none"
          stroke="#10b981"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="3,3"
        />

        {/* Calories points */}
        {sortedData.map((d, i) => {
          const x = padding + (i / (sortedData.length - 1)) * (width - 2 * padding);
          const y = height - padding - ((d.calories_burned || 0) / maxCalories) * (height - 2 * padding);
          // Ensure values are valid numbers
          if (isNaN(x) || isNaN(y)) return null;
          return (
            <circle
              key={`calories-${i}`}
              cx={x}
              cy={y}
              r="1.5"
              fill="#10b981"
            />
          );
        })}
      </svg>

      {/* Legend */}
      <div className="flex justify-center gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-cyan-500" />
          <span className="text-gray-300">Duration (min)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0.5 bg-emerald-500 border-dashed" style={{ borderTop: '2px dashed' }} />
          <span className="text-gray-300">Calories</span>
        </div>
      </div>

      {/* Date labels */}
      <div className="flex justify-between text-xs text-gray-400 px-2">
        {sortedData.map((d, i) => {
          if (i === 0 || i === sortedData.length - 1) {
            const date = new Date(d.session_date);
            return (
              <span key={i}>
                {date.getMonth() + 1}/{date.getDate()}
              </span>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
