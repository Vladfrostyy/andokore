import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Instagram, Download, QrCode, Smartphone, Link as LinkIcon } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, url }) => {
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'guide'>('link');
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My TapBio',
          text: 'Check out my bio link!',
          url: url,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const handleDownloadClick = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirecting...</title>
    <meta http-equiv="refresh" content="0;url=${url}">
    <script>window.location.href = "${url}";</script>
    <style>body{font-family:sans-serif;display:flex;justify-content:center;align-items:center;height:100vh;background:#fafafa;color:#333}</style>
</head>
<body><p>Loading...</p></body>
</html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden z-[70] font-sans"
          >
            {/* Header */}
            <div className="bg-gray-50 border-b border-gray-100 p-4 flex justify-between items-center">
              <h2 className="font-bold text-gray-900">Share Bio</h2>
              <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex p-2 gap-2 bg-white">
              <button 
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'link' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <LinkIcon size={14} /> Link
              </button>
              <button 
                onClick={() => setActiveTab('qr')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'qr' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <QrCode size={14} /> QR Code
              </button>
              <button 
                onClick={() => setActiveTab('guide')}
                className={`flex-1 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-2 transition-all ${activeTab === 'guide' ? 'bg-black text-white shadow-md' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
              >
                <Instagram size={14} /> Guide
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {activeTab === 'link' && (
                <div className="space-y-6">
                  {/* Primary Action: Copy URL */}
                  <div className="space-y-2">
                    <button 
                      onClick={copyToClipboard}
                      className="w-full py-4 bg-black rounded-2xl text-white shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform group"
                    >
                      {copied ? <Check size={20} className="text-green-400" /> : <Copy size={20} className="group-hover:scale-110 transition-transform" />}
                      <span className="font-semibold">{copied ? 'Link Copied!' : 'Copy Profile Link'}</span>
                    </button>
                    <div className="text-center">
                        <span className="text-[10px] text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-100 max-w-full truncate inline-block">
                           {url}
                        </span>
                    </div>
                  </div>

                  {/* Native Share */}
                  <div className="grid grid-cols-1 gap-3">
                    <button 
                      onClick={handleNativeShare}
                      className="py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-primary font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <Smartphone size={16} /> Share via System Dialog
                    </button>
                  </div>

                  {/* Advanced/Hosting */}
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Self Hosting</h3>
                    <button 
                       onClick={handleDownloadClick}
                       className="w-full py-3 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl text-gray-700 font-medium text-sm flex items-center justify-center gap-2 transition-colors"
                     >
                        <Download size={16} />
                        Download Standalone File
                     </button>
                     <p className="text-[10px] text-gray-400 mt-2 text-center">
                       Download 'index.html' and upload to GitHub Pages or Netlify for a custom domain.
                     </p>
                  </div>
                </div>
              )}

              {activeTab === 'qr' && (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-white rounded-2xl border-2 border-gray-100 shadow-sm">
                     {/* QR Code API */}
                     <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`} 
                        alt="QR Code" 
                        className="w-48 h-48 rounded-lg"
                     />
                  </div>
                  <p className="text-sm text-center text-gray-500 max-w-[200px]">
                    Scan to open your bio link immediately on another device.
                  </p>
                  <button onClick={() => setActiveTab('link')} className="text-sm font-semibold text-primary underline">
                    Back to Link
                  </button>
                </div>
              )}

              {activeTab === 'guide' && (
                <div className="space-y-5">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-100 text-blue-900">
                        <div className="bg-white p-2 rounded-full shadow-sm">
                            <Instagram size={18} className="text-pink-600" />
                        </div>
                        <div className="text-xs font-medium">
                            The easiest way to add your link to Instagram.
                        </div>
                    </div>

                    <div className="space-y-4 relative">
                        {/* Connecting Line */}
                        <div className="absolute left-[15px] top-2 bottom-4 w-0.5 bg-gray-100 -z-10"></div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-white">1</div>
                            <div>
                                <h4 className="font-semibold text-sm">Copy Your Link</h4>
                                <p className="text-xs text-gray-500 mt-1">Go to the "Link" tab and click <strong>Copy Profile Link</strong>.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-white">2</div>
                            <div>
                                <h4 className="font-semibold text-sm">Open Instagram</h4>
                                <p className="text-xs text-gray-500 mt-1">Go to your Profile → <strong>Edit Profile</strong>.</p>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center font-bold text-xs shrink-0 ring-4 ring-white">3</div>
                            <div>
                                <h4 className="font-semibold text-sm">Paste & Save</h4>
                                <p className="text-xs text-gray-500 mt-1">Tap <strong>Links</strong> → <strong>Add External Link</strong>. Paste your link there.</p>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => setActiveTab('link')} className="w-full py-3 bg-black text-white rounded-xl text-sm font-semibold mt-2">
                        Get My Link Now
                    </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ShareModal;