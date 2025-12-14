import React, { useState } from 'react';
import { ImageAsset, Step, GenerationHistory } from './types';
import { TopVisualizer } from './components/TopVisualizer';
import { StepOne } from './components/StepOne';
import { StepTwo } from './components/StepTwo';
import { StepThree } from './components/StepThree';
import { Gallery } from './components/Gallery';

const App: React.FC = () => {
  const [step, setStep] = useState<Step>(Step.SelectPerson);
  
  // Selections
  const [selectedPerson, setSelectedPerson] = useState<ImageAsset | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<ImageAsset | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  
  // Data
  const [customGarments, setCustomGarments] = useState<ImageAsset[]>([]);
  const [history, setHistory] = useState<GenerationHistory[]>([]);

  // Handlers
  const handlePersonSelect = (asset: ImageAsset) => {
    setSelectedPerson(asset);
  };

  const handleGarmentSelect = (asset: ImageAsset) => {
    setSelectedGarment(asset);
  };

  const handleAddCustomGarment = (asset: ImageAsset) => {
    setCustomGarments(prev => [asset, ...prev]);
  };

  const handleResultGenerated = (url: string) => {
    setResultUrl(url);
    // Add to history
    if (selectedPerson && selectedGarment) {
      const newHistoryItem: GenerationHistory = {
        id: Date.now().toString(),
        personUrl: selectedPerson.url,
        garmentUrl: selectedGarment.url,
        resultUrl: url,
        timestamp: Date.now()
      };
      setHistory(prev => [newHistoryItem, ...prev]);
    }
  };

  const handleRestart = () => {
    setStep(Step.SelectPerson);
    setSelectedPerson(null);
    setSelectedGarment(null);
    setResultUrl(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-violet-600 to-indigo-600">
              NanoStyle
            </span>
            <span className="px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold">BETA</span>
          </div>
          <div className="text-sm text-slate-500 font-medium">
             AI 虚拟换装
          </div>
        </div>
      </header>

      <main className="px-4 pt-8">
        {/* Dynamic Visualizer (Tilted Cards) */}
        <TopVisualizer 
          currentStep={step}
          personUrl={selectedPerson?.url || null}
          garmentUrl={selectedGarment?.url || null}
          resultUrl={resultUrl}
        />

        {/* Action Area */}
        <div className="mt-8">
          {step === Step.SelectPerson && (
            <StepOne 
              selectedPersonId={selectedPerson?.id || null}
              onSelect={handlePersonSelect}
              onNext={() => setStep(Step.SelectGarment)}
            />
          )}

          {step === Step.SelectGarment && (
            <StepTwo 
              selectedGarmentId={selectedGarment?.id || null}
              customGarments={customGarments}
              onSelect={handleGarmentSelect}
              onAddCustomGarment={handleAddCustomGarment}
              onNext={() => setStep(Step.GenerateResult)}
              onBack={() => setStep(Step.SelectPerson)}
            />
          )}

          {step === Step.GenerateResult && selectedPerson && selectedGarment && (
            <StepThree 
              personUrl={selectedPerson.url}
              garmentUrl={selectedGarment.url}
              resultUrl={resultUrl}
              onResultGenerated={handleResultGenerated}
              onBack={() => setStep(Step.SelectGarment)}
              onRestart={handleRestart}
            />
          )}
        </div>

        {/* Gallery */}
        <Gallery history={history} />
      </main>
    </div>
  );
};

export default App;