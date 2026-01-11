import React from 'react';
import { useAppStore } from '../store';
import { ThemeSettings } from '../types';
import * as Icons from 'lucide-react';
import InputField from './InputField';

const ThemeSelector: React.FC = () => {
  const { theme, setTheme } = useAppStore();

  const presets: { id: ThemeSettings['preset']; name: string; }[] = [
    { id: 'classic', name: 'Classic' },
    { id: 'soft', name: 'Soft' },
    { id: 'glass', name: 'Glass' },
  ];

  return (
    <div className="space-y-8 h-full overflow-y-auto pb-20 no-scrollbar pr-2">
      <section>
        <h2 className="text-xl font-semibold text-primary mb-4 flex items-center gap-2">
            <Icons.Zap size={20} className="text-yellow-500" />
            Quick Presets
        </h2>
        <div className="grid grid-cols-3 gap-3 mb-8">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => setTheme({ preset: p.id })}
              className={`p-3 rounded-xl border text-sm font-medium transition-all ${
                theme.preset === p.id 
                  ? 'border-black bg-black text-white' 
                  : 'border-border bg-white text-primary hover:bg-gray-50'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </section>

      {/* Background Studio */}
      <section className="bg-white p-5 rounded-2xl border border-border space-y-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Icons.Image size={18} className="text-blue-500" />
            Background Studio
        </h2>
        
        <div className="flex gap-2">
            {(['color', 'image', 'video', 'gradient'] as const).map(type => (
                <button
                    key={type}
                    onClick={() => setTheme({ backgroundType: type })}
                    className={`flex-1 py-2 text-xs rounded-lg border capitalize transition-all ${
                        theme.backgroundType === type
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-secondary border-border hover:bg-gray-50'
                    }`}
                >
                    {type}
                </button>
            ))}
        </div>

        <InputField 
            value={theme.backgroundValue}
            onChange={(e) => setTheme({ backgroundValue: e.target.value })}
            placeholder={
                theme.backgroundType === 'color' ? 'Hex Color (#FFFFFF)' :
                theme.backgroundType === 'gradient' ? 'linear-gradient(...)' :
                'Media URL (https://...)'
            }
        />

        <div className="space-y-4 pt-2">
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold uppercase text-secondary">Blur Overlay</label>
                    <span className="text-xs text-primary">{theme.backgroundBlur}px</span>
                </div>
                <input 
                    type="range" min="0" max="20" value={theme.backgroundBlur} 
                    onChange={(e) => setTheme({ backgroundBlur: Number(e.target.value) })}
                    className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
            <div>
                <div className="flex justify-between mb-2">
                    <label className="text-xs font-semibold uppercase text-secondary">Dimmer Opacity</label>
                    <span className="text-xs text-primary">{(theme.backgroundOverlayOpacity * 100).toFixed(0)}%</span>
                </div>
                <input 
                    type="range" min="0" max="0.9" step="0.1" value={theme.backgroundOverlayOpacity} 
                    onChange={(e) => setTheme({ backgroundOverlayOpacity: Number(e.target.value) })}
                    className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
            </div>
        </div>
      </section>

      {/* Component Styles */}
      <section className="bg-white p-5 rounded-2xl border border-border space-y-4">
        <h2 className="text-lg font-semibold text-primary flex items-center gap-2">
            <Icons.Sliders size={18} className="text-purple-500" />
            Block Styling
        </h2>

        <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-secondary">Border Radius</label>
                <span className="text-xs text-primary">{theme.borderRadius}px</span>
            </div>
            <input 
                type="range" min="0" max="30" value={theme.borderRadius} 
                onChange={(e) => setTheme({ borderRadius: Number(e.target.value) })}
                className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-secondary">Shadow Intensity</label>
                <span className="text-xs text-primary">{(theme.shadowOpacity * 100).toFixed(0)}%</span>
            </div>
            <input 
                type="range" min="0" max="0.2" step="0.01" value={theme.shadowOpacity} 
                onChange={(e) => setTheme({ shadowOpacity: Number(e.target.value) })}
                className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-secondary">Shadow Depth</label>
                <span className="text-xs text-primary">{theme.shadowBlur || 20}px</span>
            </div>
            <input 
                type="range" min="0" max="60" value={theme.shadowBlur || 20} 
                onChange={(e) => setTheme({ shadowBlur: Number(e.target.value) })}
                className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>

        <div>
            <div className="flex justify-between mb-2">
                <label className="text-xs font-semibold uppercase text-secondary">Button Transparency</label>
                <span className="text-xs text-primary">{(theme.buttonTransparency * 100).toFixed(0)}%</span>
            </div>
            <input 
                type="range" min="0.1" max="1" step="0.1" value={theme.buttonTransparency} 
                onChange={(e) => setTheme({ buttonTransparency: Number(e.target.value) })}
                className="w-full accent-black h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
        </div>
      </section>

      {/* Typography & Texture */}
      <section>
        <h2 className="text-lg font-semibold text-primary mb-4">Typography & Texture</h2>
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-xs text-secondary mb-1 block">Header Font</label>
                    <select 
                        value={theme.fontHeader}
                        onChange={(e) => setTheme({ fontHeader: e.target.value })}
                        className="w-full p-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black"
                    >
                        <option value="sans">System Sans</option>
                        <option value="serif">Elegant Serif</option>
                        <option value="mono">Code Mono</option>
                    </select>
                </div>
                <div>
                    <label className="text-xs text-secondary mb-1 block">Body Font</label>
                    <select 
                        value={theme.fontBody}
                        onChange={(e) => setTheme({ fontBody: e.target.value })}
                        className="w-full p-2 bg-white border border-border rounded-lg text-sm outline-none focus:border-black"
                    >
                        <option value="sans">System Sans</option>
                        <option value="serif">Elegant Serif</option>
                        <option value="mono">Code Mono</option>
                    </select>
                </div>
            </div>
            <div className="flex gap-3 pt-2">
                {(['none', 'noise', 'dots'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTheme({ backgroundTexture: t })}
                        className={`flex-1 py-2 rounded-lg border text-xs capitalize ${
                            theme.backgroundTexture === t
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white text-secondary border-border'
                        }`}
                    >
                        {t}
                    </button>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeSelector;