import React from 'react';
import { Delete, Check, X, ArrowUp } from 'lucide-react';

interface VirtualKeyboardProps {
  isVisible: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onEnter: () => void;
  title?: string;
}

const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ 
  isVisible, 
  value, 
  onChange, 
  onClose, 
  onEnter,
  title 
}) => {
  if (!isVisible) return null;

  const rows = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
  ];

  const handleKeyPress = (key: string) => {
    onChange(value + key);
  };

  const handleBackspace = () => {
    onChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    onChange(value + ' ');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white p-2 pb-6 z-[60] shadow-2xl rounded-t-2xl animate-slide-up select-none touch-none">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 mb-2 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title || 'Input'}</span>
        <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-800 transition-colors">
          <X size={20} />
        </button>
      </div>

      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        {/* Row 1 (Numbers) */}
        <div className="flex gap-1 justify-center">
          {rows[0].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-10 w-8 sm:w-10 rounded bg-gray-700 hover:bg-gray-600 active:bg-blue-600 font-bold text-lg transition-colors shadow-sm"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Row 2 (QWERTY) */}
        <div className="flex gap-1 justify-center">
          {rows[1].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-12 w-8 sm:w-10 rounded bg-gray-700 hover:bg-gray-600 active:bg-blue-600 font-bold text-lg transition-colors shadow-sm"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Row 3 (ASD...) */}
        <div className="flex gap-1 justify-center px-4">
          {rows[2].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-12 w-8 sm:w-10 rounded bg-gray-700 hover:bg-gray-600 active:bg-blue-600 font-bold text-lg transition-colors shadow-sm"
            >
              {key}
            </button>
          ))}
        </div>

        {/* Row 4 (ZXC... + Actions) */}
        <div className="flex gap-1 justify-center px-2">
          <button
            className="h-12 px-3 rounded bg-gray-800 text-gray-500 font-bold text-sm flex items-center justify-center cursor-default"
          >
            <ArrowUp size={18} />
          </button>
          
          {rows[3].map(key => (
            <button
              key={key}
              onClick={() => handleKeyPress(key)}
              className="h-12 w-8 sm:w-10 rounded bg-gray-700 hover:bg-gray-600 active:bg-blue-600 font-bold text-lg transition-colors shadow-sm"
            >
              {key}
            </button>
          ))}

          <button
            onClick={handleBackspace}
            className="h-12 px-3 sm:px-4 rounded bg-gray-800 hover:bg-red-900/50 active:bg-red-900 text-white transition-colors flex items-center justify-center"
          >
            <Delete size={20} />
          </button>
        </div>

        {/* Space & Enter */}
        <div className="flex gap-2 justify-center mt-1 px-2">
           <button
            onClick={handleSpace}
            className="h-12 flex-[2] max-w-xs rounded bg-gray-700 hover:bg-gray-600 active:bg-blue-600 text-white font-medium flex items-center justify-center transition-colors"
          >
            Space
          </button>
          <button
            onClick={onEnter}
            className="h-12 flex-1 max-w-[120px] rounded bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-lg"
          >
            <span>Next</span>
            <Check size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VirtualKeyboard;
