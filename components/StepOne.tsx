import React, { useRef } from 'react';
import { PRESET_PEOPLE } from '../constants';
import { ImageAsset } from '../types';
import { Upload } from 'lucide-react';

interface StepOneProps {
  selectedPersonId: string | null;
  onSelect: (asset: ImageAsset) => void;
  onNext: () => void;
}

export const StepOne: React.FC<StepOneProps> = ({ selectedPersonId, onSelect, onNext }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          onSelect({
            id: `upload-${Date.now()}`,
            url: e.target.result as string,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-3xl shadow-lg p-6 animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">第一步：选择模特</h2>
        <button 
          onClick={onNext}
          disabled={!selectedPersonId}
          className={`px-6 py-2 rounded-full font-semibold transition-all ${
            selectedPersonId 
              ? 'bg-slate-900 text-white hover:bg-slate-700 shadow-lg' 
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          下一步
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
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
          <span className="text-sm font-medium text-slate-600 group-hover:text-violet-600">上传照片</span>
        </div>

        {/* Preset List */}
        {PRESET_PEOPLE.map((person) => (
          <div 
            key={person.id}
            onClick={() => onSelect(person)}
            className={`relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 ${
              selectedPersonId === person.id ? 'ring-4 ring-violet-500 ring-offset-2' : 'hover:scale-105'
            }`}
          >
            <img 
              src={person.url} 
              alt="Person" 
              className="w-full h-full object-cover"
            />
            {selectedPersonId === person.id && (
              <div className="absolute inset-0 bg-violet-500/20 backdrop-blur-[1px] flex items-center justify-center">
                <div className="bg-white rounded-full p-1">
                  <div className="w-3 h-3 bg-violet-500 rounded-full" />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};