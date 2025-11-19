'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

// Custom tooltip for charts with better visibility
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 border-2 border-cyan-400 rounded-lg p-4 shadow-2xl backdrop-blur-xl">
        <p className="text-white font-bold mb-2 text-base">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm font-semibold text-white mb-1">
            <span style={{ color: entry.color }}>●</span> {entry.name}: <span className="text-cyan-300">{entry.value}</span>
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Pie Chart for Most Active Days
export function WorkoutDaysPieChart({ data }) {
  const COLORS = ['#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#f97316'];
  
  const chartData = Object.entries(data).map(([name, value]) => ({
    name,
    value
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Donut Chart for Workout Categories
export function WorkoutCategoriesDonutChart({ data }) {
  const COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899'];
  
  const chartData = Object.entries(data).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            verticalAlign="bottom" 
            height={36}
            formatter={(value) => <span className="text-gray-300">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

// Line Chart for Recent Activity
export function ActivityLineChart({ data }) {
  if (!data || data.length === 0) return null;

  // Reverse to show oldest to newest and format data
  const chartData = [...data].reverse().map(d => ({
    date: new Date(d.session_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: d.duration_minutes || 0,
    calories: d.calories_burned || 0
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="date" 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9ca3af"
            style={{ fontSize: '12px' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            formatter={(value) => <span className="text-gray-300">{value}</span>}
          />
          <Line 
            type="monotone" 
            dataKey="duration" 
            stroke="#06b6d4" 
            strokeWidth={3}
            dot={{ fill: '#06b6d4', r: 4 }}
            activeDot={{ r: 6 }}
            name="Duration (min)"
          />
          <Line 
            type="monotone" 
            dataKey="calories" 
            stroke="#10b981" 
            strokeWidth={3}
            strokeDasharray="5 5"
            dot={{ fill: '#10b981', r: 4 }}
            activeDot={{ r: 6 }}
            name="Calories"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
