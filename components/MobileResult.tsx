import React, { useEffect, useState } from 'react';
import { Download, Share2, Instagram, Facebook, Sparkles } from 'lucide-react';
import Header from './Header';

// Custom TikTok Icon
const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const MobileResult: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    // In a real app with backend, we would fetch the image by ID from URL params.
    // For this client-side demo, we try to get it from localStorage (works for same-device testing)
    // or fallback to a demo state/placeholder for cross-device visibility.
    const stored = localStorage.getItem('shared_image');
    if (stored) {
      setImageUrl(stored);
    }
  }, []);

  const handleNativeShare = async () => {
    if (!imageUrl) return;

    if (navigator.share) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const file = new File([blob], 'ceo-cartoon.png', { type: 'image/png' });

        await navigator.share({
          title: 'My CEO Cartoon',
          text: 'Check out my AI Business Persona! #CEOCartoonizer',
          files: [file],
        });
      } catch (error) {
        console.error("Share failed:", error);
      }
    } else {
      alert("Please use the Download button to save the image first.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
       <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-center sticky top-0 z-50">
          <div className="flex items-center gap-2 font-bold text-gray-900">
             <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Sparkles size={16} />
             </div>
             CEO Cartoonizer
          </div>
       </div>

       <main className="flex-1 p-4 flex flex-col items-center gap-6 max-w-md mx-auto w-full">
          <div className="text-center space-y-1 mt-4">
             <h1 className="text-2xl font-extrabold text-gray-900">Your Persona</h1>
             <p className="text-gray-500 text-sm">Ready to share with the world.</p>
          </div>

          <div className="w-full aspect-square bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative group">
             {imageUrl ? (
               <img 
                 src={imageUrl} 
                 alt="Generated CEO" 
                 className="w-full h-full object-contain bg-gray-900" 
               />
             ) : (
               <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 text-gray-400 p-8 text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full mb-4 animate-pulse" />
                  <p className="font-medium text-gray-500">Image not found</p>
                  <p className="text-xs mt-2">
                    (Since this is a demo without a server, images don't persist across devices. Try scanning on the same device.)
                  </p>
               </div>
             )}
          </div>

          <div className="w-full space-y-3">
             <button
               onClick={handleNativeShare}
               disabled={!imageUrl}
               className="w-full flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
             >
                <Share2 size={20} />
                Share Now
             </button>

             <a
               href={imageUrl || '#'}
               download="ceo-cartoon.png"
               className={`w-full flex items-center justify-center gap-2 py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-bold text-lg active:bg-gray-50 transition-colors ${!imageUrl ? 'opacity-50 pointer-events-none' : ''}`}
             >
                <Download size={20} />
                Download
             </a>
          </div>

          {/* Social Quick Links visual only */}
          <div className="flex justify-center gap-4 text-gray-400 mt-2">
             <Instagram size={24} />
             <div className="text-gray-400"><TikTokIcon /></div>
             <Facebook size={24} />
          </div>
       </main>
    </div>
  );
};

export default MobileResult;
