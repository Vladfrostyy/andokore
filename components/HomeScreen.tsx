import React from 'react';
import { useAppStore } from '../store';
import * as Icons from 'lucide-react';
import { ThemeSettings } from '../types';

interface HomeScreenProps {
  onNavigate: (tab: 'edit' | 'themes' | 'stats' | 'seo') => void;
  onShare: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigate, onShare }) => {
  const { profile, blocks, setTheme } = useAppStore();
  const hasLinks = blocks.length > 0;

  const handleTemplateClick = (preset: ThemeSettings['preset']) => {
    setTheme({ preset });
    onNavigate('edit');
  };

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      {/* Header */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-primary tracking-tight">
          Welcome back, {profile.displayName.split(' ')[0] || 'Creator'}.
        </h1>
        <p className="text-secondary">One link to rule your digital world.</p>
      </section>

      {/* Hero CTA */}
      <section>
        <button
            onClick={() => onNavigate('edit')}
            className="w-full h-32 bg-primary rounded-3xl flex flex-col items-center justify-center gap-3 text-white shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 group"
        >
            <div className="p-3 bg-white/10 rounded-full group-hover:bg-white/20 transition-colors">
                <Icons.Sparkles size={24} />
            </div>
            <span className="font-semibold text-lg">Build Your TapBio</span>
        </button>
      </section>

      {/* Connect Instagram CTA */}
      <section>
         <button 
            onClick={onShare}
            className="w-full p-4 rounded-2xl bg-gradient-to-r from-pink-50 to-purple-50 border border-purple-100 flex items-center justify-between group hover:shadow-sm transition-all"
         >
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-purple-600 shadow-sm">
                     <Icons.Instagram size={20} />
                 </div>
                 <div className="text-left">
                     <h3 className="font-semibold text-primary text-sm">Connect to Instagram</h3>
                     <p className="text-xs text-secondary">Get more traffic from your bio.</p>
                 </div>
             </div>
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-gray-400 group-hover:text-purple-600 transition-colors">
                 <Icons.ArrowRight size={16} />
             </div>
         </button>
      </section>

      {/* Analytics Widget (Conditional) */}
      {hasLinks && (
        <section onClick={() => onNavigate('stats')} className="cursor-pointer group">
             <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-primary">Quick Stats</h3>
                <div className="p-1 rounded-full group-hover:bg-gray-100 transition-colors">
                     <Icons.ChevronRight size={16} className="text-secondary" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-border rounded-2xl shadow-sm group-hover:border-gray-300 transition-colors">
                    <div className="text-secondary text-xs font-medium uppercase tracking-wider mb-1">Total Views</div>
                    <div className="flex items-end gap-2">
                        <span className="text-2xl font-bold text-primary">2.4k</span>
                        <span className="text-xs text-green-500 font-medium mb-1">↑ 12%</span>
                    </div>
                </div>
                <div className="p-5 bg-white border border-border rounded-2xl shadow-sm group-hover:border-gray-300 transition-colors">
                     <div className="text-secondary text-xs font-medium uppercase tracking-wider mb-1">Top Block</div>
                     <div className="text-sm font-semibold text-primary truncate">
                        {blocks[0]?.title || 'Portfolio'}
                     </div>
                     <div className="text-xs text-secondary mt-1">142 interactions</div>
                </div>
             </div>
        </section>
      )}

      {/* Template Carousel */}
      <section>
        <h3 className="font-semibold text-primary mb-4">Start with a Template</h3>
        <div className="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-8 px-8">
            {[
                { id: 'classic', name: 'Minimal White', bg: 'bg-white border border-gray-200' },
                { id: 'soft', name: 'Soft Shadow', bg: 'bg-gray-50' },
                { id: 'glass', name: 'Glassmorphism', bg: 'bg-gradient-to-br from-gray-100 to-white border border-white' }
            ].map((t) => (
                <button
                    key={t.id}
                    onClick={() => handleTemplateClick(t.id as any)}
                    className={`min-w-[140px] h-[160px] rounded-2xl p-4 flex flex-col justify-between items-start hover:scale-105 active:scale-95 transition-all shadow-sm ${t.bg} shrink-0`}
                >
                    <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center">
                        <Icons.Layout size={16} className="text-primary opacity-50" />
                    </div>
                    <span className="font-medium text-sm text-primary">{t.name}</span>
                </button>
            ))}
        </div>
      </section>

      {/* Support Creator */}
      <section className="p-6 bg-[#F9F9F9] border border-border rounded-3xl">
        <div className="flex items-start gap-4 mb-6">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                <Icons.Code2 size={20} className="text-gray-500" />
            </div>
            <div>
                <h3 className="font-semibold text-primary text-sm mb-1">Support AndoKore</h3>
                <p className="text-xs text-secondary leading-relaxed">
                    Hi, I'm the developer of TapBio. I build these tools for the community. If you love the app, consider supporting my work at AndoKore.
                </p>
            </div>
        </div>
        <div className="flex gap-3">
            {['$2', '$5', '$10'].map(amount => (
                <button 
                    key={amount}
                    onClick={() => alert(`Redirecting to payment for ${amount}...`)}
                    className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors shadow-sm text-primary active:bg-gray-100"
                >
                    {amount}
                </button>
            ))}
        </div>
      </section>
    </div>
  );
};

export default HomeScreen;