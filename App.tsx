import React, { useState, useEffect } from 'react';
import { useAppStore } from './store';
import PreviewContainer from './components/PreviewContainer';
import LinkManager from './components/LinkManager';
import ThemeSelector from './components/ThemeSelector';
import StatsDashboard from './components/StatsDashboard';
import HomeScreen from './components/HomeScreen';
import SEOEditor from './components/SEOEditor';
import InputField from './components/InputField';
import WhiteButton from './components/WhiteButton';
import AIChat from './components/AIChat';
import ShareModal from './components/ShareModal';
import * as Icons from 'lucide-react';
import LZString from 'lz-string';
import { supabase } from './lib/supabase';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'home' | 'edit' | 'themes' | 'stats' | 'seo' | 'preview'>('home');
  const [isPublicMode, setIsPublicMode] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const { profile, setProfile, importData, theme, blocks } = useAppStore();

  // --- Auth & Routing Logic ---
  useEffect(() => {
    const init = async () => {
      const path = window.location.pathname;
      // Check if current path is likely a username (not root, index.html, or a file)
      const isProfilePath = path !== '/' && path !== '/index.html' && !path.includes('.');

      // 1. Handle Public Profile View (No Auth needed for viewers)
      if (isProfilePath) {
        const username = path.substring(1); 
        setIsLoading(true);
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('username', username)
          .single();

        if (data && !error) {
          importData({
            profile: {
              displayName: data.display_name,
              bio: data.bio,
              avatarUrl: data.avatar_url,
            },
            blocks: data.links || [],
            theme: data.theme || {},
          });
          setIsPublicMode(true);
          setIsLoading(false);
          return; // Stop here, viewers don't need to sign in
        }
        // If profile not found, we fall through to Editor mode (or could show 404)
        setIsLoading(false);
      }

      // 2. Handle Editor Mode: Authenticate to allow saving
      // We only try to auth if we are NOT viewing a public profile successfully
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        try {
          const { data, error } = await supabase.auth.signInAnonymously();
          if (error) {
            if (error.message.includes("Anonymous sign-ins are disabled")) {
               console.warn("TapBio Config Warning: Anonymous sign-ins are disabled in Supabase. You won't be able to save until this is enabled.");
            } else {
               console.error("Auth Error:", error.message);
            }
          } else if (data.user) {
            setUserId(data.user.id);
          }
        } catch (e) {
          console.error("Auth Exception:", e);
        }
      } else {
        setUserId(session.user.id);
      }

      // 3. Handle Legacy URL Params (Data sharing via URL code)
      const urlParams = new URLSearchParams(window.location.search);
      const dataParam = urlParams.get('data');

      if (dataParam) {
        try {
          const decompressed = LZString.decompressFromEncodedURIComponent(dataParam);
          if (decompressed) {
            importData(JSON.parse(decompressed));
            setIsPublicMode(true);
            return;
          }
        } catch (e) { console.error(e); }
      }
    };

    init();
  }, [importData]);

  // --- Publish Logic ---
  const handlePublish = async () => {
    if (!userId) {
      alert("Authentication Error: Cannot save profile.\n\nReason: Anonymous sign-ins are disabled in your Supabase project.\n\nFix: Go to Supabase Dashboard > Authentication > Providers > Enable Anonymous Sign-ins.");
      return;
    }

    // Generate a slug from display name or random
    const usernameSlug = profile.displayName.toLowerCase().replace(/\s+/g, '') || `user${Math.floor(Math.random()*1000)}`;
    
    const confirmPublish = window.confirm(`Publish your profile to tapbio.netlify.app/${usernameSlug}?`);
    if (!confirmPublish) return;

    const payload = {
      id: userId, // Matches auth.uid() in your SQL policy
      username: usernameSlug,
      display_name: profile.displayName,
      bio: profile.bio,
      avatar_url: profile.avatarUrl,
      links: blocks,
      theme: theme
    };

    // Upsert to Supabase
    const { error } = await supabase
      .from('profiles')
      .upsert(payload, { onConflict: 'username' });

    if (error) {
      console.error(error);
      alert(`Error publishing: ${error.message}`);
    } else {
      alert(`Published successfully! You can view it at: ${window.location.origin}/${usernameSlug}`);
    }
  };

  const getPublicUrl = () => {
    const currentUrl = new URL(window.location.href);
    const baseUrl = `${currentUrl.origin}${currentUrl.pathname}`;
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    
    // If we have a username slug and we are the owner, use that
    const usernameSlug = profile.displayName.toLowerCase().replace(/\s+/g, '');
    if (usernameSlug && !isPublicMode) {
        return `${cleanBaseUrl}/${usernameSlug}`;
    }

    // Fallback to data param if not published
    const state = useAppStore.getState();
    const dataToShare = {
        profile: state.profile,
        blocks: state.blocks,
        theme: state.theme,
        seo: state.seo
    };
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(dataToShare));
    return `${cleanBaseUrl}?data=${compressed}`;
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

  if (isLoading) {
    return <div className="h-screen w-full flex items-center justify-center bg-white"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (isPublicMode) {
    return <PreviewContainer isMobileView={true} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen onNavigate={(tab) => setActiveTab(tab as any)} onShare={() => setIsShareModalOpen(true)} />;
      case 'edit':
        return (
          <div className="space-y-8 animate-fade-in pb-20">
            <section>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-primary">Profile</h2>
                <button onClick={handlePublish} className="text-xs bg-black text-white px-3 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                  Save to Cloud
                </button>
              </div>
              
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
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
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
        return <PreviewContainer isMobileView={true} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#FAFAFA] text-primary font-sans overflow-hidden">
      
      <div className={`w-full md:w-[500px] lg:w-[600px] flex flex-col h-full border-r border-border bg-white z-10 shadow-sm relative ${activeTab === 'preview' ? 'p-0' : ''}`}>
        
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
              onClick={() => setIsShareModalOpen(true)}
            >
              Share
            </WhiteButton>
          </header>
        )}

        <div className={`flex-1 overflow-y-auto no-scrollbar ${activeTab === 'preview' ? 'p-0' : 'p-8'}`}>
          {renderContent()}
        </div>

        <nav className="h-20 border-t border-border flex items-center justify-around px-2 bg-white/95 backdrop-blur-md sticky bottom-0 z-50 shadow-lg md:shadow-none">
          <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'home' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Home size={20} strokeWidth={activeTab === 'home' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Home</span>
          </button>
          <button onClick={() => setActiveTab('edit')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'edit' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Layers size={20} strokeWidth={activeTab === 'edit' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Editor</span>
          </button>
          <button onClick={() => setActiveTab('themes')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'themes' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Zap size={20} strokeWidth={activeTab === 'themes' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Style</span>
          </button>
          <button onClick={() => setActiveTab('preview')} className={`md:hidden flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'preview' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.Eye size={20} strokeWidth={activeTab === 'preview' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Preview</span>
          </button>
          <button onClick={() => setActiveTab('stats')} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${activeTab === 'stats' ? 'text-black scale-105' : 'text-gray-400 hover:text-gray-600'}`}>
            <Icons.BarChart2 size={20} strokeWidth={activeTab === 'stats' ? 2.5 : 2} />
            <span className="text-[10px] font-medium">Stats</span>
          </button>
        </nav>
      </div>

      <div className="hidden md:block flex-1 bg-[#FAFAFA] relative">
         <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-200 text-xs font-medium text-gray-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            Live Preview
         </div>
         <PreviewContainer />
      </div>

      <AIChat />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} url={getPublicUrl()} />
    </div>
  );
};

export default App;