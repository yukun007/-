import React from 'react';
import { GenerationHistory } from '../types';

interface GalleryProps {
  history: GenerationHistory[];
}

export const Gallery: React.FC<GalleryProps> = ({ history }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-12 mb-12 px-4">
      <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span className="w-2 h-6 bg-violet-500 rounded-full"></span>
        历史记录
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {history.map((item) => (
          <div key={item.id} className="group relative aspect-[3/4] bg-white rounded-xl shadow-sm hover:shadow-md transition-all overflow-hidden border border-slate-100">
             <img 
               src={item.resultUrl} 
               alt="Historical Result" 
               className="w-full h-full object-cover"
             />
             {/* Hover Overlay with mini previews of source */}
             <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-2 gap-2">
               <div className="flex gap-1">
                 <img src={item.personUrl} className="w-8 h-10 object-cover rounded border border-white/50" alt="src-person" />
                 <img src={item.garmentUrl} className="w-8 h-10 object-contain bg-white rounded border border-white/50" alt="src-garment" />
               </div>
               <a 
                 href={item.resultUrl}
                 download={`nano-history-${item.id}.png`}
                 className="text-xs text-white underline hover:text-violet-300"
               >
                 下载
               </a>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};