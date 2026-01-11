import React, { useState, useEffect } from 'react';
import { useAppStore } from '../store';
import PreviewContainer from './PreviewContainer';
import LinkManager from './LinkManager';
import ThemeSelector from './ThemeSelector';
import StatsDashboard from './StatsDashboard';
import HomeScreen from './HomeScreen';
import SEOEditor from './SEOEditor';
import InputField from './InputField';
import WhiteButton from './WhiteButton';
import AIChat from './AIChat';
import ShareModal from './ShareModal';
import * as Icons from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'edit' | 'themes' | 'stats' | 'seo' | 'preview'>('home');
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const { profile, setProfile } = useAppStore();

  // Check for "public view" query parameter on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'public') {
      setIsPublicMode(true);
    }
  }, []);

  const getPublicUrl = () => {
    // In production, this would be your actual domain
    const baseUrl = window.location.origin + window.location.pathname;
    // Remove trailing slash if present to avoid double slashes
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}?view=public`;
  };

  const handleShare = () => {
    setIsShareModalOpen(true);
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  // If in public mode, strictly render the Mobile Preview
  if (isPublicMode) {
    return <PreviewContainer isMobileView={true} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab as any)} onShare={handleShare} />;
      case 'edit':
        return (
          <div className="space-y-8 animate-fade-in pb-20">
            <section>
              <h2 className="text-xl font-semibold text-primary mb-4">Profile</h2>
              <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-border">
                <div className="relative group w-16 h-16 shrink-0">
                  <div className="w-full h-full bg-accent rounded-full flex items-center justify-center text-secondary overflow-hidden">
                    {profile.avatarUrl ? (
                      <img src={profile.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <Icons.User size={24} />
                    )}
                  </div>
                  <label className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                    <Icons.Upload size={20} className="text-white" />
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarUpload}
                    />
                  </label>
                </div>
                
                <div className="flex-1 space-y-3">
                  <InputField 
                    label="Display Name" 
                    value={profile.displayName} 
                    onChange={(e) => setProfile({ displayName: e.target.value })} 
                    placeholder="e.g. Jane Doe"
                  />
                  <InputField 
                    label="Short Bio" 
                    value={profile.bio} 
                    onChange={(e) => setProfile({ bio: e.target.value })}
                    placeholder="e.g. Digital Artist & Creator"
                  />
                </div>
              </div>
            </section>
            
            <section className="h-[500px]">
               <LinkManager className="h-full" />
            </section>
          </div>
        );
      case 'themes':
        return <ThemeSelector />;
      case 'stats':
        return <StatsDashboard />;
      case 'seo':
        return <SEOEditor />;
      case 'preview':
        // Only visible on mobile
        return <PreviewContainer isMobileView={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-primary font-sans overflow-hidden">
      
      {/* Main Content Area (On Mobile, this is the whole screen. On Desktop, it's the left panel) */}
      <div className={`w-full md:w-[500px] lg:w-[600px] flex flex-col h-full border-r border-border bg-white z-10 shadow-sm relative ${activeTab === 'preview' ? 'p-0' : ''}`}>
        
        {/* Header - Hide if in full screen preview on mobile */}
        {activeTab !== 'preview' && (
          <header className="px-8 py-6 border-b border-border flex justify-between items-center bg-white sticky top-0 z-20">
            <div className="flex items-center gap-2" onClick={() => setActiveTab('home')}>
              <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-sm cursor-pointer">A</div>
              <span className="font-bold text-lg tracking-tight cursor-pointer">AndoKore</span>
            </div>
            <WhiteButton 
              variant="secondary" 
              className="!h-9 text-xs" 
              icon={<Icons.Share size={14} />}
              onClick={handleShare}
            >
              Share
            </WhiteButton>
          </header>
        )}

        {/* Scrollable Content */}
        <div className={`flex-1 overflow-y-auto no-scrollbar ${activeTab === 'preview' ? 'p-0' : 'p-8'}`}>
          {renderContent()}
        </div>

        {/* Bottom Navigation */}
        <nav className="h-20 border-t border-border flex items-center justify-around px-2 bg-white/95 backdrop-blur-md sticky bottom-0 z-50 shadow-lg md:shadow-none">
          <button 
            onClick={() => setActiveTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icons.Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button 
            onClick={() => setActiveTab('edit')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'edit' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icons.Layers size={20} strokeWidth={activeTab === 'edit' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Editor</span>
          </button>
          <button 
            onClick={() => setActiveTab('themes')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'themes' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icons.Zap size={20} strokeWidth={activeTab === 'themes' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Style</span>
          </button>
          
          {/* Mobile Only Preview Button */}
          <button 
            onClick={() => setActiveTab('preview')}
            className={`md:hidden flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'preview' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icons.Eye size={20} strokeWidth={activeTab === 'preview' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>

          <button 
            onClick={() => setActiveTab('stats')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'stats' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Icons.BarChart2 size={20} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </nav>
      </div>

      {/* Right Panel - Live Preview (Hidden on mobile, visible on desktop) */}
      <div className="hidden md:block flex-1 bg-[#FAFAFA] relative">
         <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Live Preview
         </div>
         <PreviewContainer />
      </div>

      {/* AI Assistant */}
      <AIChat />

      {/* Share Modal */}
      <ShareModal 
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        url={getPublicUrl()}
      />
    </div>
  );
};

export default App;