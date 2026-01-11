import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useAppStore } from '../store';
import { LinkBlock } from '../types';

const StatsDashboard: React.FC = () => {
  const { blocks } = useAppStore();

  // Mock data generation
  const data = [
    { name: 'Mon', views: 120 },
    { name: 'Tue', views: 230 },
    { name: 'Wed', views: 180 },
    { name: 'Thu', views: 340 },
    { name: 'Fri', views: 290 },
    { name: 'Sat', views: 450 },
    { name: 'Sun', views: 390 },
  ];

  const clickableBlocks = blocks.filter(b => b.type === 'link') as LinkBlock[];

  const linkPerformance = clickableBlocks.map(link => ({
    name: link.title,
    clicks: Math.floor(Math.random() * 500) + 50, // Mock clicks
  })).sort((a, b) => b.clicks - a.clicks);

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-6 bg-white rounded-2xl border border-border">
          <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold mb-1">Total Views</h3>
          <p className="text-3xl font-bold text-primary">2,000</p>
          <span className="text-xs text-green-500 font-medium">+12% this week</span>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-border">
          <h3 className="text-secondary text-xs uppercase tracking-wider font-semibold mb-1">CTR</h3>
          <p className="text-3xl font-bold text-primary">4.8%</p>
          <span className="text-xs text-secondary font-medium">Avg. click rate</span>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border h-[300px]">
        <h3 className="text-primary font-semibold mb-6">Views Overview</h3>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#666' }} dy={10} />
            <Tooltip 
              cursor={{ fill: '#F5F5F7' }}
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="views" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === data.length - 1 ? '#1A1A1A' : '#E5E5E5'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-border">
        <h3 className="text-primary font-semibold mb-4">Top Links</h3>
        <div className="space-y-4">
          {linkPerformance.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent text-xs font-bold text-secondary">
                  {idx + 1}
                </span>
                <span className="font-medium text-sm text-primary">{item.name}</span>
              </div>
              <span className="text-sm text-secondary font-medium">{item.clicks} clicks</span>
            </div>
          ))}
          {linkPerformance.length === 0 && (
              <div className="text-center text-sm text-secondary opacity-50 py-4">No clickable links active.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StatsDashboard;