export interface CartoonRequest {
  personName: string;
  gender: string;
  businessName: string;
  businessType: string;
  style: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export enum AppStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export type AiProvider = 'gemini' | 'openai' | 'replicate';

export type AspectRatio = '1:1' | '16:9' | '9:16' | '4:3' | '3:4';

export interface AppSettings {
  provider: AiProvider;
  apiKey: string;
  model: string;
  aspectRatio: AspectRatio;
  useCorsProxy: boolean;
  promptTemplate: string;
  whatsappApiKey: string;
  whatsappSender: string;
  whatsappMessageTemplate: string;
}

export type AppView = 'LANDING' | 'APP';
