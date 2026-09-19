import {UniversalEmotion} from "./expressions";

export interface VideoContributionPayload {
    selectedEmotion: UniversalEmotion;
    videoFile: File | null;
    consentGiven: boolean;
    notes?:  string;
}

export interface ConsentAuditRecord {
  id: string;
  consentVersion: string; // ex: 'v1.0'
  agreedAt: string; // ISO string
  ipHash?: string;
  userAgent: string;
  videoChecksum: string; // Hash SHA-256 do arquivo de vídeo
  selectedEmotion: UniversalEmotion;
}

export type ContributionStep = "select_emotion" | "upload_video" | "consent" | "review" | "success";