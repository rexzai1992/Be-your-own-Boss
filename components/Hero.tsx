import React from 'react';
import { Sparkles, ArrowRight, Briefcase, Rocket, Star, Palette, Crown, Heart } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden bg-gradient-to-b from-blue-50 via-purple-50 to-white font-sans">
      
      {/* Custom Animations Style */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>

      {/* Background Decorative Elements - Playful & Colorful */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Animated Blobs */}
        <div className="absolute top-10 left-[10%] w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-10 right-[10%] w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-10 left-[20%] w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
        <div className="absolute bottom-20 right-[20%] w-60 h-60 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-3000" />

        {/* Floating Icons for 'Kids' Vibe */}
        <div className="absolute top-1/4 left-4 md:left-20 text-yellow-400 animate-bounce delay-700 opacity-80">
            <Star size={40} fill="currentColor" className="drop-shadow-md" />
        </div>
        <div className="absolute bottom-1/3 right-4 md:right-20 text-pink-400 animate-pulse delay-300 opacity-80">
            <Heart size={36} fill="currentColor" className="drop-shadow-md" />
        </div>
        <div className="absolute top-1/3 right-[10%] text-blue-400 animate-bounce delay-1000 opacity-70">
            <Rocket size={32} className="drop-shadow-md" />
        </div>
        <div className="absolute bottom-20 left-[10%] text-purple-400 animate-pulse delay-500 opacity-70">
            <Palette size={36} className="drop-shadow-md" />
        </div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center space-y-8 py-10">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-white border-2 border-indigo-100 shadow-lg text-indigo-600 text-sm font-bold tracking-wide animate-fade-in-up hover:scale-105 transition-transform cursor-default">
          <Crown size={20} className="text-yellow-500 fill-current" />
          <span>#1 AI Business Maker for Kids</span>
        </div>

        {/* Heading */}
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tight leading-none animate-fade-in-up delay-100 drop-shadow-sm">
          Be The <br className="hidden md:block" />
          <span className="relative inline-block mx-2">
             <span className="absolute -inset-2 bg-yellow-300 transform -skew-y-2 rounded-xl opacity-40 blur-sm"></span>
             <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
               Future CEO
             </span>
          </span>
          <span className="text-4xl md:text-6xl lg:text-7xl align-top ml-2 animate-bounce inline-block">🚀</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200 font-medium leading-relaxed px-4">
          Turn your selfie into a <span className="text-indigo-600 font-bold bg-indigo-50 px-2 py-1 rounded-lg">super cool</span> business owner character! 
          Start your dream company today.
        </p>

        {/* CTA Button */}
        <div className="animate-fade-in-up delay-300 pt-6 pb-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-xl font-black rounded-3xl overflow-hidden transition-all shadow-xl hover:shadow-2xl hover:shadow-purple-500/40 hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0 border-[3px] border-white ring-4 ring-purple-100"
          >
            {/* Texture Overlay */}
            <div className="absolute inset-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            {/* Shine Effect */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:animate-shimmer" />
            
            <Briefcase className="w-7 h-7 fill-white/20" />
            <span className="tracking-wide drop-shadow-sm">Start Your Adventure</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Floating Examples (Mockups) - Trading Card Style */}
        <div className="mt-12 flex justify-center gap-4 md:gap-10 perspective-1000 animate-fade-in-up delay-500 px-2">
           {/* Card 1 */}
           <div className="relative w-28 h-36 md:w-44 md:h-60 transform rotate-[-6deg] hover:rotate-0 transition-all duration-500 hover:z-10 hover:scale-110 cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-orange-400 rounded-2xl shadow-lg transform translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
              <div className="absolute inset-0 bg-white rounded-2xl border-4 border-white overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover transition-all duration-500" alt="Large Building" />
              </div>
           </div>

           {/* Card 2 - Center */}
           <div className="relative w-28 h-36 md:w-44 md:h-60 transform rotate-[0deg] hover:rotate-0 transition-all duration-500 hover:z-10 hover:scale-110 -mt-6 cursor-pointer group z-10">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl shadow-lg transform translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
              <div className="absolute inset-0 bg-white rounded-2xl border-4 border-white overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover transition-all duration-500" alt="Example 2" />
              </div>
              <div className="absolute -top-3 -right-3 bg-red-500 text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-bounce border-2 border-white">
                WOW!
              </div>
           </div>

           {/* Card 3 */}
           <div className="relative w-28 h-36 md:w-44 md:h-60 transform rotate-[6deg] hover:rotate-0 transition-all duration-500 hover:z-10 hover:scale-110 cursor-pointer group">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl shadow-lg transform translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform"></div>
              <div className="absolute inset-0 bg-white rounded-2xl border-4 border-white overflow-hidden shadow-inner">
                  <img src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80" className="w-full h-full object-cover transition-all duration-500" alt="Example 3" />
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;