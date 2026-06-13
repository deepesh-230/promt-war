import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Brain, Activity, Moon, Clock } from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState({ wellnessScore: 82, trends: [], insights: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedJournals = JSON.parse(localStorage.getItem('mindmate_journals') || '[]');
    // Mock mood trends for simplicity since we removed the mood entry form for now
    const mockTrends = [
      { date: 'Mon', score: 70 },
      { date: 'Tue', score: 75 },
      { date: 'Wed', score: 65 },
      { date: 'Thu', score: 80 },
      { date: 'Fri', score: 85 },
      { date: 'Sat', score: 90 },
      { date: 'Sun', score: 82 },
    ];

    let latestInsights = ["Try meditating for 5 minutes before bed.", "Great job maintaining 8 hours of sleep!"];
    if (savedJournals.length > 0 && savedJournals[0].analysis?.recommendations) {
      latestInsights = savedJournals[0].analysis.recommendations;
    }

    setData({
      wellnessScore: 82,
      trends: mockTrends,
      insights: latestInsights
    });
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center mt-20">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-white">Welcome back, Student</h1>
        <p className="text-slate-400 mt-1">Here is your wellness overview.</p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-secondary p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Wellness Score</h3>
            <Brain className="text-primary" />
          </div>
          <div className="text-4xl font-bold text-white">{data.wellnessScore}/100</div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-secondary p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Stress Level</h3>
            <Activity className="text-red-400" />
          </div>
          <div className="text-2xl font-semibold text-white">Moderate</div>
        </motion.div>
        
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-secondary p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Avg Sleep</h3>
            <Moon className="text-accent" />
          </div>
          <div className="text-2xl font-semibold text-white">6.5 hrs</div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4 }} className="bg-secondary p-6 rounded-2xl border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-slate-400 font-medium">Study Time</h3>
            <Clock className="text-orange-400" />
          </div>
          <div className="text-2xl font-semibold text-white">8 hrs/day</div>
        </motion.div>
      </div>

      {/* Chart & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-secondary p-6 rounded-2xl border border-slate-800">
          <h3 className="text-xl font-bold mb-6 text-white">Wellness Trend</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
                <Line type="monotone" dataKey="score" stroke="#22c55e" strokeWidth={3} dot={{ r: 4, fill: '#22c55e' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-secondary p-6 rounded-2xl border border-slate-800 flex flex-col">
          <h3 className="text-xl font-bold mb-6 text-white">AI Recommendations</h3>
          <div className="flex-1 space-y-4">
            {data.insights.length > 0 ? data.insights.map((insight, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 rounded-xl border border-slate-800/50 text-sm text-slate-300">
                {insight}
              </div>
            )) : (
              <div className="text-slate-500 italic">No recommendations available yet. Log your journal to get insights.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
