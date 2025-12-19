import React, { useMemo } from 'react';
import { Claim } from '../types';
import ClaimCard from './ClaimCard';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, 
  PieChart, Pie, Legend 
} from 'recharts';
import { Activity, Layers, Tag } from 'lucide-react';

interface DashboardProps {
  claims: Claim[];
}

const COLORS = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#60a5fa', '#a78bfa', '#f87171'];

const Dashboard: React.FC<DashboardProps> = ({ claims }) => {
  const stats = useMemo(() => {
    const total = claims.length;
    const avgSignificance = claims.reduce((acc, c) => acc + c.significance, 0) / total;
    const predictions = claims.filter(c => c.is_prediction).length;
    
    // Category Count
    const catMap: Record<string, number> = {};
    claims.forEach(c => {
      catMap[c.category] = (catMap[c.category] || 0) + 1;
    });
    const categoryData = Object.keys(catMap).map(k => ({ name: k, value: catMap[k] }));

    // Significance Distribution
    const sigMap: Record<number, number> = {};
    claims.forEach(c => {
        const bucket = Math.floor(c.significance);
        sigMap[bucket] = (sigMap[bucket] || 0) + 1;
    });
    const sigData = Object.keys(sigMap).map(k => ({ score: k, count: sigMap[Number(k)] }));

    return { total, avgSignificance, predictions, categoryData, sigData };
  }, [claims]);

  if (claims.length === 0) return null;

  return (
    <div className="w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-indigo-500/20 rounded-lg">
            <Layers className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Total Insights</p>
            <p className="text-2xl font-bold text-slate-100">{stats.total}</p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-emerald-500/20 rounded-lg">
            <Activity className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Avg. Impact Score</p>
            <p className="text-2xl font-bold text-slate-100">{stats.avgSignificance.toFixed(1)}<span className="text-sm text-slate-500">/10</span></p>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex items-center gap-4">
          <div className="p-3 bg-amber-500/20 rounded-lg">
            <Tag className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <p className="text-slate-400 text-sm font-medium">Predictions</p>
            <p className="text-2xl font-bold text-slate-100">{stats.predictions}</p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[300px]">
          <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
            Category Distribution
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {stats.categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 min-h-[300px]">
          <h3 className="text-slate-200 font-semibold mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Significance Breakdown
          </h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.sigData}>
                <XAxis dataKey="score" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#334155', opacity: 0.2}}
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f1f5f9' }}
                />
                <Bar dataKey="count" fill="#34d399" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Grid of Cards */}
      <h3 className="text-xl font-bold text-white mb-6">Detailed Breakdown</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-12">
        {claims.map((claim, idx) => (
          <ClaimCard key={idx} claim={claim} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
