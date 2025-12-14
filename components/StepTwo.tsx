import React, { useRef, useState } from 'react';
import { PRESET_GARMENTS } from '../constants';
import { ImageAsset } from '../types';
import { Upload, Sparkles, Loader2 } from 'lucide-react';
import { generateGarmentImage } from '../services/geminiService';

interface StepTwoProps {
  selectedGarmentId: string | null;
  customGarments: ImageAsset[];
  onSelect: (asset: ImageAsset) => void;
  onAddCustomGarment: (asset: ImageAsset) => void;
  onNext: () => void;
  onBack: () => void;
}

export const StepTwo: React.FC<StepTwoProps> = ({ 
  selectedGarmentId, 
  customGarments,
  onSelect, 
  onAddCustomGarment,
  onNext,
  onBack
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const newAsset: ImageAsset = {
            id: `upload-garment-${Date.now()}`,
            url: e.target.result as string,
          };
          onAddCustomGarment(newAsset);
          onSelect(newAsset);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setError(null);
    try {
      const base64Image = await generateGarmentImage(prompt);
      const newAsset: ImageAsset = {
        id: `gen-garment-${Date.now()}`,
        url: base64Image,
        isGenerated: true
      };
      onAddCustomGarment(newAsset);
      onSelect(newAsset);
      setPrompt('');
    } catch (err) {
      setError('生成失败，请重试');
    } finally {
      setIsGenerating(false);
    }
  };

  const allGarments = [...customGarments, ...PRESET_GARMENTS];

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">第二步：选择或生成服装</h2>
        <div className="flex gap-2">
           <button 
            onClick={onBack}
            className="px-4 py-2 rounded-full font-medium text-slate-600 hover:bg-slate-100 transition-colors"
          >
            上一步
          </button>
          <button 
            onClick={onNext}
            disabled={!selectedGarmentId}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedGarmentId 
                ? 'bg-slate-900 text-white hover:bg-slate-700 shadow-lg' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            下一步
          </button>
        </div>
      </div>

      {/* Generator Input */}
      <div className="mb-8 bg-gradient-to-r from-violet-50 to-indigo-50 p-4 rounded-xl border border-violet-100">
        <label className="block text-sm font-semibold text-violet-900 mb-2">AI 设计服装 (Nano Banana)</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例如：一件红色的丝绸晚礼服，带金色刺绣"
            className="flex-1 px-4 py-2 rounded-lg border-2 border-violet-100 focus:border-violet-500 focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
          />
          <button
            onClick={handleGenerate}
            disabled={isGenerating || !prompt.trim()}
            className="bg-violet-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-violet-700 disabled:opacity-50 flex items-center gap-2 transition-colors"
          >
            {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
            生成
          </button>
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[400px] overflow-y-auto gallery-scroll pr-2">
        {/* Upload Button */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="aspect-[3/4] border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-violet-500 hover:bg-violet-50 transition-colors group"
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileUpload}
          />
          <div className="p-4 bg-slate-100 rounded-full group-hover:bg-violet-100 transition-colors mb-2">
            <Upload className="text-slate-500 group-hover:text-violet-600" />
          </div>
          <span className="text-sm font-medium text-slate-600 group-hover:text-violet-600">上传服装图</span>
        </div>

        {/* Garment List */}
        {allGarments.map((garment) => (
          <div 
            key={garment.id}
            onClick={() => onSelect(garment)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-slate-50 group transition-all duration-300 ${
              selectedGarmentId === garment.id ? 'ring-4 ring-violet-500 ring-offset-2' : 'hover:scale-105'
            }`}
          >
            <img 
              src={garment.url} 
              alt="Garment" 
              className="w-full h-full object-contain p-2"
            />
            {garment.isGenerated && (
               <div className="absolute top-2 right-2 bg-violet-500 text-white text-[10px] px-1.5 py-0.5 rounded shadow">
                 AI
               </div>
            )}
            {selectedGarmentId === garment.id && (
              <div className="absolute inset-0 border-4 border-violet-500 rounded-xl pointer-events-none" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};