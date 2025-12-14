export interface ImageAsset {
  id: string;
  url: string;
  isGenerated?: boolean;
}

export enum Step {
  SelectPerson = 1,
  SelectGarment = 2,
  GenerateResult = 3
}

export interface GenerationHistory {
  id: string;
  personUrl: string;
  garmentUrl: string;
  resultUrl: string;
  timestamp: number;
}