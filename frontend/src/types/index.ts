// src/types/index.ts

export interface Emotion {
  id: number;
  audio_id: number;
  label: string;
  confidence: number;
  timestamp: string;
}

export interface AlertRead {
  id: number;
  user_id: number;
  message: string;
  created_at: string;
  emotion: Emotion;
}

export interface Audio {
  id: number;
  file_path: string;
  created_at: string;
}

export interface AnalysisResult {
  audio_id: number;
  emotions: Emotion[];
  alerts: AlertRead[];
}
