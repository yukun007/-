import React, { useEffect, useState } from 'react';
import { generateTryOnResult, urlToBase64 } from '../services/geminiService';
import { Loader2, Wand2, Download, RotateCcw } from 'lucide-react';

interface StepThreeProps {
  personUrl: string;
  garmentUrl: string;
  resultUrl: string | null;
  onResultGenerated: (url: string) => void;
  onBack: () => void;
  onRestart: () => void;
}

export const StepThree: React.FC<StepThreeProps> = ({ 
  personUrl, 
  garmentUrl, 
  resultUrl, 
  onResultGenerated,
  onBack,
  onRestart
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processGeneration = async () => {
    if (resultUrl) return; // Already generated

    setLoading(true);
    setError(null);

    try {
      // 1. Convert URLs to Base64 (needed if they are preset URLs)
      const personB64 = personUrl.startsWith('data:') ? personUrl : await urlToBase64(personUrl);
      const garmentB64 = garmentUrl.startsWith('data:') ? garmentUrl : await urlToBase64(garmentUrl);

      // 2. Call Gemini
      const generatedImage = await generateTryOnResult(personB64, garmentB64);
      onResultGenerated(generatedImage);
    } catch (err) {
      console.error(err);
      setError("AI 换装失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  // Auto-trigger generation on mount if no result yet
  useEffect(() => {
    if (!resultUrl && !loading) {
      processGeneration();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 animate-fade-in text-center">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">第三步：AI 换装结果</h2>
        <div className="flex gap-2">
           {!loading && (
             <button 
              onClick={onBack}
              className="px-4 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              调整
            </button>
           )}
           <button 
              onClick={onRestart}
              className="px-4 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors flex items-center gap-1"
            >
              <RotateCcw size={16} />
              重来
            </button>
        </div>
      </div>

      <div className="min-h-[400px] flex flex-col items-center justify-center bg-slate-50 rounded-2xl border-2 border-slate-100 relative overflow-hidden">
        
        {loading && (
          <div className="flex flex-col items-center gap-4 z-10">
            <div className="relative">
              <div className="absolute inset-0 bg-violet-400 rounded-full blur-xl opacity-20 animate-pulse"></div>
              <Loader2 className="animate-spin text-violet-600" size={64} />
            </div>
            <p className="text-slate-600 font-medium animate-pulse">
              Nano Banana 正在施展魔法...
              <br/>
              <span className="text-sm text-slate-400">生成过程可能需要几秒钟</span>
            </p>
          </div>
        )}

        {error && !loading && (
          <div className="text-center p-8">
            <p className="text-red-500 mb-4">{error}</p>
            <button 
              onClick={processGeneration}
              className="px-6 py-2 bg-violet-600 text-white rounded-full hover:bg-violet-700 transition-colors flex items-center gap-2 mx-auto"
            >
              <Wand2 size={18} />
              重试
            </button>
          </div>
        )}

        {resultUrl && !loading && (
          <div className="relative w-full h-full group">
             <img 
               src={resultUrl} 
               alt="Try-on Result" 
               className="max-h-[600px] w-auto mx-auto shadow-2xl rounded-lg"
             />
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <a 
                 href={resultUrl} 
                 download="nano-style-tryon.png"
                 className="px-6 py-3 bg-white text-slate-900 rounded-full shadow-lg font-bold hover:bg-slate-100 flex items-center gap-2"
               >
                 <Download size={20} />
                 下载图片
               </a>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};