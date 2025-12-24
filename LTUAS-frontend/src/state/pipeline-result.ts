import { atom } from "jotai";

export interface MellowResult {
    success: boolean;
    inference?: string | string[];
    error?: string;
    soft_prompt_used?: string;
}

export interface ClapInference {
    dominant_sound: string;
    dominant_confidence: number;
    top_sounds?: Array<{
        sound: string;
        confidence: number;
    }>;
    all_scores?: Record<string, number>;
}

export interface SpeechInference {
    has_speech: boolean;
    language?: string;
    text?: string;
    duration?: number;
    segments?: Array<{
        id: number;
        seek: number;
        start: number;
        end: number;
        text: string;
        tokens?: number[];
        temperature?: number;
        avg_logprob?: number;
        compression_ratio?: number;
        no_speech_prob?: number;
    }>;
}

export interface PipelineMetadata {
    audio_file: string;
    processing_time_seconds: number;
    timestamp: string;
    user_prompt?: string | null;
}

export interface PipelineResult {
    clap_inf?: ClapInference;
    speech_inf?: SpeechInference;
    mellow_inf?: MellowResult;
    metadata?: PipelineMetadata;
    soft_prompts?: Record<string, string>;
}

export const pipelineResultAtom = atom<PipelineResult | null>(null);
