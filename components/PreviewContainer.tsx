import React, { useState } from 'react';
import { useAppStore } from '../store';
import * as Icons from 'lucide-react';
import { LucideIcon } from 'lucide-react';
import { PageBlock } from '../types';

const PreviewContainer: React.FC = () => {
  const { profile, blocks, theme } = useAppStore();

  const getFontClass = (type: 'header' | 'body') => {
    const fontName = type === 'header' ? theme.fontHeader : theme.fontBody;
    switch (fontName) {
      case 'serif': return 'font-serif';
      case 'mono': return 'font-mono';
      default: return 'font-sans';
    }
  };

  // --- Background Engine Logic ---
  const renderBackground = () => {
    const { backgroundType, backgroundValue, backgroundBlur, backgroundOverlayOpacity } = theme;

    const overlay = (
      <div 
        className="absolute inset-0 pointer-events-none z-0 transition-all duration-300"
        style={{
          backdropFilter: `blur(${backgroundBlur}px)`,
          WebkitBackdropFilter: `blur(${backgroundBlur}px)`,
          backgroundColor: `rgba(0,0,0,${backgroundOverlayOpacity})`
        }}
      />
    );

    switch (backgroundType) {
      case 'image':
        return (
          <>
            <div className="absolute inset-0 z-0">
               <img src={backgroundValue} alt="bg" className="w-full h-full object-cover" />
            </div>
            {overlay}
          </>
        );
      case 'video':
        return (
           <>
             <div className="absolute inset-0 z-0">
                <video src={backgroundValue} autoPlay loop muted playsInline className="w-full h-full object-cover" />
             </div>
             {overlay}
           </>
        );
      case 'gradient':
        return (
           <div 
             className="absolute inset-0 z-0 bg-gradient-to-br"
             style={{ background: backgroundValue }} // Expecting CSS gradient string
           >
             {overlay}
           </div>
        );
      default: // color
        return (
          <div 
            className="absolute inset-0 z-0 transition-colors duration-300" 
            style={{ backgroundColor: backgroundValue }} 
          >
             {theme.backgroundTexture === 'noise' && (
                 <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>
             )}
             {theme.backgroundTexture === 'dots' && (
                 <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
             )}
          </div>
        );
    }
  };

  // --- Style Generation ---
  const getCardStyle = () => {
      // Calculate opacity for transparency
      // We assume white bg for cards for now, but apply alpha
      const rgba = `rgba(255, 255, 255, ${theme.buttonTransparency})`;

      return {
          borderRadius: `${theme.borderRadius}px`,
          boxShadow: `0 4px ${theme.shadowBlur || 20}px rgba(0,0,0,${theme.shadowOpacity})`,
          border: theme.preset === 'classic' ? '1px solid #e5e5e5' : 'none',
          backgroundColor: rgba,
          backdropFilter: theme.buttonTransparency < 1 ? 'blur(10px)' : 'none',
          WebkitBackdropFilter: theme.buttonTransparency < 1 ? 'blur(10px)' : 'none',
      };
  };

  const getAnimationClass = (anim?: string) => {
      switch (anim) {
          case 'pulse': return 'animate-pulse-slow';
          case 'shake': return 'animate-shake-slow';
          case 'glow': return 'animate-glow';
          default: return '';
      }
  };

  const renderIcon = (iconName: string) => {
    // @ts-ignore
    const Icon = Icons[iconName] as LucideIcon;
    return Icon ? <Icon size={18} /> : <Icons.Link size={18} />;
  };

  // --- Utility Blocks Logic ---
  const CopyButton = ({ block }: { block: any }) => {
      const [copied, setCopied] = useState(false);
      const handleCopy = () => {
          // In a real iframe context, this might need parent permission, but here it's same domain
          navigator.clipboard.writeText(block.content);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      };
      return (
        <button 
            onClick={handleCopy}
            className={`w-full p-4 flex items-center justify-between group cursor-pointer hover:brightness-95 transition-all ${getAnimationClass(block.animation)}`}
            style={getCardStyle()}
        >
            <div className="flex items-center gap-3">
                <Icons.Copy size={18} />
                <div className="text-left">
                    <span className={`block font-medium text-sm ${getFontClass('body')}`}>{block.label}</span>
                    <span className="text-xs opacity-60 font-mono">{block.content}</span>
                </div>
            </div>
            <div className={`text-xs px-2 py-1 rounded bg-black text-white transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
                {block.successMessage || 'Copied!'}
            </div>
        </button>
      )
  };

  const VCardButton = ({ block }: { block: any }) => {
      const generateVCard = () => {
          const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${block.fullName}
TEL:${block.phone || ''}
EMAIL:${block.email || ''}
END:VCARD`;
          const blob = new Blob([vcard], { type: 'text/vcard' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${block.fullName}.vcf`;
          a.click();
      };
      return (
          <button
            onClick={generateVCard}
            className={`w-full p-4 flex items-center justify-center gap-2 group cursor-pointer hover:brightness-95 transition-all ${getAnimationClass(block.animation)}`}
            style={{...getCardStyle(), backgroundColor: '#1A1A1A', color: 'white'}} // Dark button for contrast
          >
             <Icons.Contact size={18} />
             <span className="font-medium text-sm">{block.buttonLabel}</span>
          </button>
      );
  };

  const renderBlock = (block: PageBlock) => {
      const cardStyle = getCardStyle();

      switch (block.type) {
          case 'link':
              return (
                <a 
                    href={block.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full p-4 flex items-center justify-between group cursor-pointer hover:scale-[1.01] transition-transform duration-200 ${getAnimationClass(block.animation)}`}
                    style={cardStyle}
                >
                    <div className="flex items-center gap-3">
                    {renderIcon(block.icon)}
                    <span className={`font-medium text-sm ${getFontClass('body')}`}>{block.title}</span>
                    </div>
                    <Icons.ExternalLink size={14} className="opacity-50" />
                </a>
              );
          case 'countdown':
              const timeLeft = new Date(block.targetDate).getTime() - Date.now();
              const days = Math.max(0, Math.floor(timeLeft / (1000 * 60 * 60 * 24)));
              return (
                  <div className={`w-full p-6 bg-primary text-white text-center flex flex-col gap-2 ${getAnimationClass(block.animation)}`} style={{ ...cardStyle, backgroundColor: '#1A1A1A', color: 'white' }}>
                      <span className="text-xs uppercase tracking-widest opacity-80">{block.title}</span>
                      <div className="text-3xl font-bold font-mono">
                         {days} <span className="text-sm font-normal">DAYS LEFT</span>
                      </div>
                  </div>
              );
          case 'poll':
              return (
                  <div className={`w-full p-5 flex flex-col gap-3 ${getAnimationClass(block.animation)}`} style={cardStyle}>
                      <span className={`font-semibold text-sm ${getFontClass('body')}`}>{block.question}</span>
                      <div className="flex gap-2">
                          <button className="flex-1 py-2 bg-gray-50/50 rounded-lg text-xs font-medium border border-gray-100/50 hover:bg-gray-100 transition-colors">
                              {block.optionA}
                          </button>
                          <button className="flex-1 py-2 bg-gray-50/50 rounded-lg text-xs font-medium border border-gray-100/50 hover:bg-gray-100 transition-colors">
                              {block.optionB}
                          </button>
                      </div>
                  </div>
              );
          case 'tip':
              return (
                <div className={`w-full p-4 bg-green-50 border border-green-100 flex items-center justify-between gap-3 text-green-900 ${getAnimationClass(block.animation)}`} style={{ ...cardStyle, borderColor: '#dcfce7', backgroundColor: '#f0fdf4' }}>
                    <div className="flex items-center gap-3">
                        <Icons.HeartHandshake size={18} />
                        <span className="font-medium text-sm">Support me on {block.service}</span>
                    </div>
                    <button className="bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-700">
                        Tip
                    </button>
                </div>
              );
          case 'image':
              return (
                  <div className={`w-full overflow-hidden ${getAnimationClass(block.animation)}`} style={{ ...cardStyle, padding: 0 }}>
                      <img src={block.url} alt={block.alt} className="w-full h-auto block" />
                      {block.caption && <div className="p-2 text-center text-xs opacity-60">{block.caption}</div>}
                  </div>
              );
          case 'gallery':
              return (
                  <div className={`w-full overflow-x-auto no-scrollbar flex gap-2 ${getAnimationClass(block.animation)}`}>
                      {block.images.map((img, idx) => (
                          <img 
                            key={idx} 
                            src={img} 
                            className="h-32 w-auto rounded-xl object-cover shrink-0" 
                            style={{ borderRadius: `${theme.borderRadius}px` }} 
                          />
                      ))}
                  </div>
              );
          case 'copy':
              return <CopyButton block={block} />;
          case 'vcard':
              return <VCardButton block={block} />;
          default:
              return null;
      }
  };

  return (
    <div className="flex justify-center items-center h-full p-4 md:p-8 overflow-hidden bg-gray-100">
      {/* Phone Mockup Frame */}
      <div className="relative w-[320px] h-[640px] bg-white rounded-[40px] shadow-2xl border-[8px] border-gray-900 overflow-hidden shrink-0 z-0">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
        
        {/* Screen Content Wrapper */}
        <div className="relative w-full h-full bg-white overflow-hidden rounded-[32px]">
            
            {/* Background Layer */}
            {renderBackground()}

            {/* Scrollable Content */}
            <div className={`relative w-full h-full overflow-y-auto no-scrollbar pt-12 pb-8 px-6 flex flex-col items-center z-10`}>
            
                {/* Profile Section */}
                <div className="flex flex-col items-center mb-8 w-full text-center">
                    <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-white/50 shadow-sm">
                    <img src={profile.avatarUrl || 'https://picsum.photos/200'} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <h1 className={`text-xl font-bold mb-1 ${getFontClass('header')} mix-blend-hard-light`}>{profile.displayName || 'Display Name'}</h1>
                    <p className={`text-sm opacity-80 max-w-[240px] ${getFontClass('body')} mix-blend-hard-light`}>{profile.bio || 'Your short bio goes here.'}</p>
                </div>

                {/* Blocks Section */}
                <div className="w-full space-y-3">
                    {blocks.filter(b => b.visible).map(block => (
                    <div key={block.id} className="w-full">
                        {renderBlock(block)}
                    </div>
                    ))}
                    {blocks.filter(b => b.visible).length === 0 && (
                    <div className="text-center py-10 opacity-40 text-sm">
                        No visible blocks.
                    </div>
                    )}
                </div>

                {/* Footer Branding */}
                <div className="mt-auto pt-8 pb-4 text-[10px] font-medium tracking-wide text-[#BDBDBD] text-center w-full">
                    Powered by AndoKore
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewContainer;