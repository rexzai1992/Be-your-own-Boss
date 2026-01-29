import React, { useState } from 'react';
import { Send, User, Building2, Store, ArrowRight, Sparkles, IceCream, PawPrint, Gamepad2, BookOpen, PenTool, Palette, Rocket, Wand2, Heart } from 'lucide-react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import ResultCard from './components/ResultCard';
import AdminDashboard from './components/AdminDashboard';
import Hero from './components/Hero';
import VirtualKeyboard from './components/VirtualKeyboard';
import SupportButton from './components/SupportButton';
import { generateCartoonImage, DEFAULT_PROMPT_TEMPLATE } from './services/aiService';
import { AppStatus, CartoonRequest, ImageFile, AppSettings, AppView } from './types';

const DEFAULT_SETTINGS: AppSettings = {
  provider: 'gemini',
  apiKey: '',
  model: 'gemini-2.5-flash-image',
  aspectRatio: '1:1',
  useCorsProxy: true,
  promptTemplate: DEFAULT_PROMPT_TEMPLATE,
  whatsappApiKey: 'GcCqTlEjxghF7MHtaxCwBeN1NX3ud7',
  whatsappSender: '',
  whatsappMessageTemplate: 'Hello! Here is your generated CEO Cartoon. You can view your result and start your business journey at https://aigenius.com.my. Thank you!'
};

const BUSINESS_TYPES = [
  { label: 'Ice Cream', value: 'Ice Cream Shop', icon: IceCream, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
  { label: 'Pet Shop', value: 'Pet Shop', icon: PawPrint, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
  { label: 'Gaming', value: 'Gaming Lounge', icon: Gamepad2, color: 'text-violet-500', bg: 'bg-violet-50', border: 'border-violet-200' },
  { label: 'Bookstore', value: 'Bookstore', icon: BookOpen, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
];

const STYLES = [
  { label: 'Colorful', value: 'Colorful & Vibrant', icon: Palette, color: 'text-cyan-500', bg: 'bg-cyan-50', border: 'border-cyan-200' },
  { label: 'Futuristic', value: 'Futuristic & Sci-Fi', icon: Rocket, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
  { label: 'Fantasy', value: 'Magical Fantasy', icon: Wand2, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
  { label: 'Girlie', value: 'Cute & Girlie', icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
];

function App() {
  const [currentView, setCurrentView] = useState<AppView>('LANDING');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  
  // Form State
  const [step, setStep] = useState(0); 
  const [formData, setFormData] = useState<CartoonRequest>({
    personName: '',
    gender: '',
    businessName: '',
    businessType: '',
    style: ''
  });
  const [image, setImage] = useState<ImageFile | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Custom Input State
  const [isCustomBusinessType, setIsCustomBusinessType] = useState(false);
  const [isCustomStyle, setIsCustomStyle] = useState(false);
  
  // Keyboard State
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [activeField, setActiveField] = useState<keyof CartoonRequest | null>(null);

  // Settings Management
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('ceo_cartoonizer_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new fields are populated if they didn't exist in old saves
        // Force the hardcoded API key to ensure it is always used, overriding legacy local storage data
        return { ...DEFAULT_SETTINGS, ...parsed, whatsappApiKey: DEFAULT_SETTINGS.whatsappApiKey };
      }
      return DEFAULT_SETTINGS;
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });

  const handleSettingsSave = (newSettings: AppSettings) => {
    // Ensure we don't accidentally lose the API key if the admin dashboard sends back something else
    const safeSettings = { ...newSettings, whatsappApiKey: DEFAULT_SETTINGS.whatsappApiKey };
    setSettings(safeSettings);
    localStorage.setItem('ceo_cartoonizer_settings', JSON.stringify(safeSettings));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleVirtualInput = (value: string) => {
    if (activeField) {
      setFormData(prev => ({ ...prev, [activeField]: value }));
    }
  };

  const handleNext = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsKeyboardOpen(false);
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setIsKeyboardOpen(false);
    if (step === 0) {
      setCurrentView('LANDING');
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (!image) return;

    setIsKeyboardOpen(false);
    setStatus(AppStatus.GENERATING);
    try {
      // Small delay to allow UI to update
      await new Promise(resolve => setTimeout(resolve, 500));
      const url = await generateCartoonImage(formData, image, settings);
      setResultUrl(url);
      setStatus(AppStatus.SUCCESS);
    } catch (error) {
      console.error(error);
      alert("Error: " + (error instanceof Error ? error.message : "Unknown error"));
      setStatus(AppStatus.ERROR);
    }
  };

  const handleReset = () => {
    setStatus(AppStatus.IDLE);
    setResultUrl(null);
    setStep(0);
    setFormData({ personName: '', gender: '', businessName: '', businessType: '', style: '' });
    setImage(null);
    setIsKeyboardOpen(false);
    setIsCustomBusinessType(false);
    setIsCustomStyle(false);
  };

  const handleGenderSelect = (gender: string) => {
    setFormData(prev => ({ ...prev, gender }));
    handleNext();
  };

  const handleBusinessTypeSelect = (type: string) => {
    setFormData(prev => ({ ...prev, businessType: type }));
    setIsCustomBusinessType(false);
    handleNext();
  };

  const handleStyleSelect = (style: string) => {
    setFormData(prev => ({ ...prev, style }));
    setIsCustomStyle(false);
    handleNext();
  };

  // Render Step Content
  const renderStep = () => {
    switch(step) {
      case 0: // Name
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label htmlFor="personName" className="block text-xl font-bold text-gray-900 mb-2">
                What's your full name?
              </label>
              <p className="text-gray-500 text-sm mb-6">This will be the CEO of the company.</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="personName"
                  id="personName"
                  value={formData.personName}
                  onChange={handleInputChange}
                  onFocus={() => { setActiveField('personName'); setIsKeyboardOpen(true); }}
                  autoFocus
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                  placeholder="e.g. Sarah Johnson"
                  onKeyDown={(e) => e.key === 'Enter' && formData.personName && handleNext()}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleNext()}
                disabled={!formData.personName}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 1: // Gender
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-xl font-bold text-gray-900 mb-2">
                Select your gender
              </label>
              <p className="text-gray-500 text-sm mb-6">This helps us style the character correctly.</p>
              
              <div className="grid grid-cols-2 gap-4">
                 <button
                  onClick={() => handleGenderSelect('Male')}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3
                    ${formData.gender === 'Male' 
                      ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'}`}
                 >
                   <span className="text-4xl">👨‍💼</span>
                   <span className="font-bold">Male</span>
                 </button>
                 <button
                  onClick={() => handleGenderSelect('Female')}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-3
                    ${formData.gender === 'Female' 
                      ? 'border-pink-500 bg-pink-50 text-pink-700 ring-2 ring-pink-200' 
                      : 'border-gray-200 hover:border-pink-300 hover:bg-gray-50'}`}
                 >
                   <span className="text-4xl">👩‍💼</span>
                   <span className="font-bold">Female</span>
                 </button>
              </div>
            </div>
            <div className="flex gap-3 mt-4">
               <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );
      case 2: // Business Name
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label htmlFor="businessName" className="block text-xl font-bold text-gray-900 mb-2">
                What's your business name?
              </label>
              <p className="text-gray-500 text-sm mb-6">We'll put this on the storefront signage.</p>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building2 className="h-6 w-6 text-gray-400" />
                </div>
                <input
                  type="text"
                  name="businessName"
                  id="businessName"
                  value={formData.businessName}
                  onChange={handleInputChange}
                  onFocus={() => { setActiveField('businessName'); setIsKeyboardOpen(true); }}
                  autoFocus
                  className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                  placeholder="e.g. Green Leaf Cafe"
                  onKeyDown={(e) => e.key === 'Enter' && formData.businessName && handleNext()}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleNext()}
                disabled={!formData.businessName}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 3: // Business Type (With Icons)
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label htmlFor="businessType" className="block text-xl font-bold text-gray-900 mb-2">
                What type of business is it?
              </label>
              <p className="text-gray-500 text-sm mb-6">Select a category or enter your own.</p>
              
              {!isCustomBusinessType ? (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {BUSINESS_TYPES.map((type) => (
                    <button
                      key={type.label}
                      onClick={() => handleBusinessTypeSelect(type.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                        bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50
                      `}
                    >
                       <div className={`p-2 rounded-full ${type.bg} ${type.color}`}>
                          <type.icon size={24} />
                       </div>
                       <span className="font-bold text-gray-700">{type.label}</span>
                    </button>
                  ))}
                   <button
                      onClick={() => { setIsCustomBusinessType(true); setFormData(prev => ({...prev, businessType: ''})); }}
                      className="col-span-2 p-4 rounded-xl border-2 border-dashed border-gray-300 transition-all flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 text-gray-500"
                    >
                       <PenTool size={20} />
                       <span className="font-medium">Enter Custom Type</span>
                    </button>
                </div>
              ) : (
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Store className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="businessType"
                    id="businessType"
                    value={formData.businessType}
                    onChange={handleInputChange}
                    onFocus={() => { setActiveField('businessType'); setIsKeyboardOpen(true); }}
                    autoFocus
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                    placeholder="e.g. Coffee Shop, Tech Startup"
                    onKeyDown={(e) => e.key === 'Enter' && formData.businessType && handleNext()}
                  />
                  <button 
                    onClick={() => setIsCustomBusinessType(false)}
                    className="absolute inset-y-0 right-4 text-xs text-blue-600 font-medium hover:underline"
                  >
                    Back to choices
                  </button>
                </div>
              )}

            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleNext()}
                disabled={!formData.businessType}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 4: // Concept / Style
        return (
          <div className="space-y-6 animate-fade-in-up">
            <div>
              <label className="block text-xl font-bold text-gray-900 mb-2">
                Choose a Concept
              </label>
              <p className="text-gray-500 text-sm mb-6">What vibe should the illustration have?</p>
              
              {!isCustomStyle ? (
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {STYLES.map((s) => (
                    <button
                      key={s.label}
                      onClick={() => handleStyleSelect(s.value)}
                      className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-2
                        bg-white border-gray-200 hover:border-blue-300 hover:bg-gray-50
                      `}
                    >
                       <div className={`p-2 rounded-full ${s.bg} ${s.color}`}>
                          <s.icon size={24} />
                       </div>
                       <span className="font-bold text-gray-700">{s.label}</span>
                    </button>
                  ))}
                   <button
                      onClick={() => { setIsCustomStyle(true); setFormData(prev => ({...prev, style: ''})); }}
                      className="col-span-2 p-4 rounded-xl border-2 border-dashed border-gray-300 transition-all flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 text-gray-500"
                    >
                       <PenTool size={20} />
                       <span className="font-medium">Enter Custom Concept</span>
                    </button>
                </div>
              ) : (
                <div className="relative mb-4">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Sparkles className="h-6 w-6 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="style"
                    id="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    onFocus={() => { setActiveField('style'); setIsKeyboardOpen(true); }}
                    autoFocus
                    className="block w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:ring-blue-500 focus:border-blue-500 text-lg transition-colors"
                    placeholder="e.g. Minimalist, Retro, Cyberpunk"
                    onKeyDown={(e) => e.key === 'Enter' && formData.style && handleNext()}
                  />
                  <button 
                    onClick={() => setIsCustomStyle(false)}
                    className="absolute inset-y-0 right-4 text-xs text-blue-600 font-medium hover:underline"
                  >
                    Back to choices
                  </button>
                </div>
              )}

            </div>
            <div className="flex gap-3">
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => handleNext()}
                disabled={!formData.style}
                className="flex-1 flex items-center justify-center gap-2 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-all"
              >
                Next <ArrowRight size={20} />
              </button>
            </div>
          </div>
        );
      case 5: // Photo Input & Generate
        return (
          <div className="space-y-6 animate-fade-in-up">
             <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Snap Your Photo</h3>
                <p className="text-gray-500 text-sm mb-6">We need a clear selfie for the character.</p>
                <ImageUploader image={image} onImageChange={setImage} />
             </div>
             
             <div className="flex gap-3 pt-4">
              <button
                onClick={handleBack}
                className="px-6 py-4 border-2 border-gray-200 rounded-xl text-gray-600 font-bold hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={!image || status === AppStatus.GENERATING}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform
                  ${(!image || status === AppStatus.GENERATING)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-xl hover:-translate-y-0.5'
                  }`}
              >
                 {status === AppStatus.GENERATING ? (
                    'Generating...'
                  ) : (
                    <>
                      <Send size={20} />
                      Generate Magic
                    </>
                  )}
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  const isResultActive = status !== AppStatus.IDLE || !!resultUrl;

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-32">
      
      {/* Header is ONLY shown on Landing Page now */}
      {currentView === 'LANDING' && (
        <Header onOpenSettings={() => setShowSettings(true)} />
      )}

      <AdminDashboard 
        isOpen={showSettings} 
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={handleSettingsSave}
      />

      {/* Support Button - Hides when keyboard is open to prevent overlap */}
      <SupportButton isKeyboardOpen={isKeyboardOpen} settings={settings} />

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        isVisible={isKeyboardOpen}
        value={activeField ? formData[activeField] : ''}
        onChange={handleVirtualInput}
        onClose={() => setIsKeyboardOpen(false)}
        onEnter={() => handleNext()}
        title={activeField ? activeField.replace(/([A-Z])/g, ' $1').trim() : 'Input'}
      />

      {currentView === 'LANDING' ? (
        <Hero onStart={() => setCurrentView('APP')} />
      ) : (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 animate-fade-in">
          
          {isResultActive ? (
            // WIDENED CONTAINER FOR SPLIT RESULT VIEW
            <div className="max-w-6xl mx-auto animate-fade-in">
                {/* Result View - Full Page */}
                <ResultCard 
                  status={status} 
                  resultUrl={resultUrl} 
                  onReset={handleReset} 
                  settings={settings} 
                  request={formData}
                />
            </div>
          ) : (
             <div className="max-w-2xl mx-auto">
                {/* Wizard View */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 lg:p-8 min-h-[500px] flex flex-col justify-between relative overflow-hidden">
                  <div>
                     {/* Progress Indicator */}
                     <div className="flex items-center gap-1.5 mb-8">
                        {[0, 1, 2, 3, 4, 5].map(i => (
                          <div 
                            key={i} 
                            className={`h-1.5 flex-1 rounded-full transition-colors ${i <= step ? 'bg-blue-600' : 'bg-gray-200'}`}
                          />
                        ))}
                     </div>
                     
                     {/* Form Content */}
                     {renderStep()}
                  </div>
                </div>
             </div>
          )}

        </main>
      )}
    </div>
  );
}

export default App;