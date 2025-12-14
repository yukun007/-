import React from 'react';
import { Step } from '../types';
import { User, Shirt, Wand2 } from 'lucide-react';

interface TopVisualizerProps {
  currentStep: Step;
  personUrl: string | null;
  garmentUrl: string | null;
  resultUrl: string | null;
}

export const TopVisualizer: React.FC<TopVisualizerProps> = ({ 
  currentStep, 
  personUrl, 
  garmentUrl, 
  resultUrl 
}) => {
  
  const getCardStyle = (isActive: boolean, hasImage: boolean) => {
    let base = "relative w-1/3 aspect-[3/4] rounded-2xl shadow-xl transition-all duration-700 ease-out transform border-4 ";
    
    // Active/Highlight state
    if (isActive) {
      base += "border-violet-500 scale-105 z-20 ";
    } else {
      base += "border-white/50 scale-95 z-10 opacity-80 ";
    }

    // Tilt effect (defaults, can be overridden by hover in CSS if needed, but we keep it static-ish for the 3D look)
    return base;
  };

  return (
    <div className="w-full max-w-4xl mx-auto h-64 md:h-80 flex justify-center items-center gap-4 perspective-1000 mb-8 py-4">
      
      {/* Card 1: Person */}
      <div 
        className={`${getCardStyle(currentStep === Step.SelectPerson, !!personUrl)} -rotate-6 translate-y-2 origin-bottom-right bg-gradient-to-br from-blue-50 to-white overflow-hidden`}
      >
        {personUrl ? (
          <img src={personUrl} alt="Person" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <User size={48} />
            <span className="text-sm mt-2 font-medium">选择人物</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          步骤 1
        </div>
      </div>

      {/* Card 2: Garment */}
      <div 
        className={`${getCardStyle(currentStep === Step.SelectGarment, !!garmentUrl)} -translate-y-2 z-30 bg-gradient-to-br from-purple-50 to-white overflow-hidden`}
      >
        {garmentUrl ? (
          <img src={garmentUrl} alt="Garment" className="w-full h-full object-contain p-2" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Shirt size={48} />
            <span className="text-sm mt-2 font-medium">选择服装</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          步骤 2
        </div>
      </div>

      {/* Card 3: Result */}
      <div 
        className={`${getCardStyle(currentStep === Step.GenerateResult, !!resultUrl)} rotate-6 translate-y-2 origin-bottom-left bg-gradient-to-br from-indigo-50 to-white overflow-hidden`}
      >
        {resultUrl ? (
          <img src={resultUrl} alt="Result" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
            <Wand2 size={48} />
            <span className="text-sm mt-2 font-medium">生成结果</span>
          </div>
        )}
        <div className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded backdrop-blur-sm">
          步骤 3
        </div>
      </div>

    </div>
  );
};