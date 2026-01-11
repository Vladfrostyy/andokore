import React from 'react';
import { useAppStore } from '../store';
import InputField from './InputField';
import * as Icons from 'lucide-react';

const SEOEditor: React.FC = () => {
  const { seo, setSEO } = useAppStore();

  return (
    <div className="animate-fade-in space-y-6">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
          <Icons.Search className="text-blue-500 shrink-0" size={20} />
          <div>
              <h3 className="text-sm font-semibold text-blue-900">SEO Preview</h3>
              <p className="text-xs text-blue-700 mt-1">
                  This is how your link will appear in Google Search and link previews on social media (TikTok, Twitter).
              </p>
          </div>
      </div>

      <div className="p-4 border border-border rounded-xl bg-white shadow-sm">
          <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 rounded-full bg-gray-200"></div>
              <span className="text-xs text-gray-500">andokore.bio</span>
          </div>
          <div className="text-lg text-blue-600 hover:underline cursor-pointer font-medium mb-1 truncate">
              {seo.pageTitle || "Your Page Title"}
          </div>
          <div className="text-sm text-gray-600 line-clamp-2">
              {seo.metaDescription || "This is a description of your bio page. Keep it under 160 characters for best results."}
          </div>
      </div>

      <section className="space-y-4">
        <InputField 
            label="Page Title" 
            value={seo.pageTitle}
            onChange={(e) => setSEO({ pageTitle: e.target.value })}
            placeholder="e.g. Jane Doe | Digital Artist"
        />
        <div className="space-y-1">
            <label className="text-xs font-medium text-secondary ml-1">Meta Description</label>
            <textarea
                value={seo.metaDescription}
                onChange={(e) => setSEO({ metaDescription: e.target.value })}
                placeholder="A brief description of who you are..."
                rows={4}
                className="w-full p-3 bg-accent rounded-xl border border-transparent text-primary placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-none"
            />
            <div className="text-right text-[10px] text-gray-400">
                {seo.metaDescription.length}/160
            </div>
        </div>
      </section>
    </div>
  );
};

export default SEOEditor;