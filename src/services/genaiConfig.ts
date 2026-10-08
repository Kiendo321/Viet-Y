import { GoogleGenAI } from '@google/genai';

export function genaiSettings(env: NodeJS.ProcessEnv = process.env) {
  const vertexai = env.GOOGLE_GENAI_USE_VERTEXAI?.toLowerCase() === 'true';
  const project = env.GOOGLE_CLOUD_PROJECT || env.GCLOUD_PROJECT;
  const location = env.GOOGLE_CLOUD_LOCATION || 'global';
  const apiKey = env.GEMINI_API_KEY?.trim();
  return {
    vertexai, project, location,
    provider: vertexai ? 'vertex_ai' : 'gemini_api',
    configured: vertexai ? Boolean(project) : Boolean(apiKey && apiKey !== 'MY_GEMINI_API_KEY'),
    apiKey: vertexai ? undefined : apiKey,
  };
}

export function createGenaiClient(): GoogleGenAI | null {
  const config = genaiSettings();
  if (!config.configured) return null;
  return config.vertexai
    ? new GoogleGenAI({ vertexai: true, project: config.project, location: config.location })
    : new GoogleGenAI({ vertexai: false, apiKey: config.apiKey });
}
