import React from 'react';
import { Download, RefreshCw, MessageCircle } from 'lucide-react';
import { AppStatus } from '../types';

interface ResultCardProps {
  status: AppStatus;
  resultUrl: string | null;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ status, resultUrl, onReset }) => {
  
  const handleWhatsAppShare = async () => {
    if (!resultUrl) return;

    // 1. Try Native Sharing (Best for Mobile)
    if (navigator.share && navigator.canShare) {
      try {
        const response = await fetch(resultUrl);
        const blob = await response.blob();
        const file = new File([blob], 'ceo-cartoon.png', { type: 'image/png' });

        if (navigator.canShare({ files: [file] })) {
             await navigator.share({
                files: [file],
                // Some apps ignore text when sharing files, but we include it just in case
             });
             return;
        }
      } catch (error) {
        console.log('Native file share failed/cancelled, falling back...', error);
      }
    }

    // 2. Fallback: Open WhatsApp Web (Best for Desktop)
    // Note: We cannot attach the image programmatically via URL on WhatsApp Web.
    // We just open the chat and ask user to drag/drop or paste.
    const text = "Check out my new CEO Persona!";
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
    alert("Opening WhatsApp... Please save the image and attach it to your message manually.");
  };

  if (status === AppStatus.IDLE) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-gray-50 border border-gray-200 rounded-2xl p-8 text-center text-gray-400">
        <div className="w-24 h-24 bg-gray-100 rounded-full mb-6 flex items-center justify-center">
          <div className="w-16 h-16 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Create Magic?</h3>
        <p className="max-w-xs mx-auto text-sm">Fill in your details and upload a selfie to generate your CEO cartoon.</p>
      </div>
    );
  }

  if (status === AppStatus.GENERATING) {
    return (
      <div className="h-full min-h-[500px] flex flex-col items-center justify-center bg-white border border-gray-200 rounded-2xl p-8 text-center relative overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 opacity-50" />
        <div className="relative z-10 flex flex-col items-center">
          <div className="relative">
            <div className="w-24 h-24 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl animate-pulse">🎨</span>
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mt-6 mb-2">Creating Masterpiece...</h3>
          <p className="text-gray-500 max-w-sm mx-auto text-lg">Our AI is applying the final touches to your business scene.</p>
        </div>
      </div>
    );
  }

  if (status === AppStatus.ERROR) {
    return (
      <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="text-red-500 w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">Generation Failed</h3>
        <p className="text-gray-600 mb-6">Something went wrong while communicating with the AI. Please try again.</p>
        <button
          onClick={onReset}
          className="px-6 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-2xl animate-fade-in min-h-[700px]">
      
      {/* Left Column: Image Preview */}
      <div className="flex-[3] bg-gray-900 relative flex items-center justify-center p-4 lg:p-8 overflow-hidden group">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20" />
        {resultUrl && (
          <img 
            src={resultUrl} 
            alt="Generated CEO" 
            className="w-full h-full object-contain max-h-[75vh] shadow-2xl rounded-lg transform transition-transform duration-500 group-hover:scale-[1.01]"
          />
        )}
      </div>
      
      {/* Right Column: Actions */}
      <div className="flex-[2] bg-white p-6 lg:p-10 flex flex-col justify-between border-l border-gray-100 relative">
        
        <div>
          <div className="flex items-center gap-2 mb-3 text-green-600 font-bold uppercase tracking-wider text-xs">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Generation Complete
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-3 leading-tight">Your CEO Persona</h2>
          <p className="text-gray-500">
            Share your new look with your network.
          </p>
        </div>

        {/* Primary Actions */}
        <div className="space-y-4">
           
           <button 
             onClick={handleWhatsAppShare}
             className="w-full flex items-center justify-center gap-3 px-6 py-5 bg-[#25D366] text-white font-bold text-xl rounded-2xl hover:bg-[#20bd5a] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 group"
           >
             <MessageCircle size={24} className="fill-current" />
             Share on WhatsApp
           </button>

           <div className="h-px bg-gray-100 my-4" />

           <div className="grid grid-cols-2 gap-4">
            <a
              href={resultUrl || '#'}
              download="ceo-cartoon.png"
              className="flex items-center justify-center gap-2 px-4 py-4 bg-gray-900 text-white font-bold text-lg rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Download size={20} />
              Save
            </a>
            
            <button
              onClick={onReset}
              className="flex items-center justify-center gap-2 px-4 py-4 bg-white border-2 border-gray-200 text-gray-600 font-bold text-lg rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              <RefreshCw size={20} />
              New
            </button>
           </div>
        </div>

      </div>
    </div>
  );
};

export default ResultCard;