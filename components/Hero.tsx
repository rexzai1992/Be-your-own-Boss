import React from 'react';
import { Sparkles, ArrowRight, Briefcase } from 'lucide-react';

interface HeroProps {
  onStart: () => void;
}

const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-semibold animate-fade-in-up">
          <Sparkles size={16} />
          <span>AI-Powered Business Branding</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight animate-fade-in-up delay-100">
          Be Your Own <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Boss.</span>
        </h1>

        <p className="text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up delay-200">
          Transform your selfie into a high-end, Pixar-style business illustration. 
          Perfect for social media, presentations, and brand storytelling.
        </p>

        <div className="animate-fade-in-up delay-300 pt-4">
          <button 
            onClick={onStart}
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white text-lg font-bold rounded-2xl overflow-hidden transition-all hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1 hover:scale-105 active:scale-95 active:translate-y-0"
          >
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
            <Briefcase className="w-6 h-6" />
            <span>Start Now</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Floating Examples (Mockups) */}
        <div className="mt-16 grid grid-cols-3 gap-4 md:gap-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500 animate-fade-in-up delay-500">
           <div className="h-32 w-24 md:h-48 md:w-36 bg-gray-200 rounded-2xl rotate-[-6deg] shadow-lg border-4 border-white transform hover:scale-110 hover:z-10 transition-transform bg-[url('https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')] bg-cover bg-center"></div>
           <div className="h-32 w-24 md:h-48 md:w-36 bg-gray-200 rounded-2xl rotate-[0deg] shadow-lg border-4 border-white transform hover:scale-110 hover:z-10 transition-transform -mt-6 bg-[url('https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')] bg-cover bg-center"></div>
           <div className="h-32 w-24 md:h-48 md:w-36 bg-gray-200 rounded-2xl rotate-[6deg] shadow-lg border-4 border-white transform hover:scale-110 hover:z-10 transition-transform bg-[url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80')] bg-cover bg-center"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
