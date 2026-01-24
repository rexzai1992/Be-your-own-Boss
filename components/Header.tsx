import React from 'react';
import { Briefcase, Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-2 rounded-lg text-white">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 leading-none">CEO Cartoonizer</h1>
            <p className="text-xs text-gray-500 font-medium">Powered by Gemini 2.5</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenSettings}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            title="Admin Settings"
          >
            <Settings size={20} />
          </button>
          <div className="flex items-center gap-2 text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1.5 rounded-full border border-blue-100">
            <Sparkles size={16} />
            <span className="hidden sm:inline">Professional Edition</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
