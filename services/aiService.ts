import { GoogleGenAI } from "@google/genai";
import { CartoonRequest, ImageFile, AppSettings, AspectRatio } from "../types";

export const DEFAULT_PROMPT_TEMPLATE = `Use the attached selfie image and recreate it exactly as it is. Do NOT alter any facial features, expressions, skin tone, hairstyle, or face shape. The face must be identical to the selfie. You may change the background, clothing, accessories, and environment as described:

Create a high-quality, semi-realistic 3D illustration of a confident {{gender}} business owner / CEO named {{personName}}, standing professionally near their business {{businessName}}, which is a {{businessType}}. 
  
Concept/Vibe: {{style}}.

Pose & Posture: The person is upright with a confident, leadership posture. Hands can be relaxed at sides or lightly crossed. Convey a successful entrepreneur vibe. 
Positioning: IMPORTANT - The person must stand slightly to the side so they do NOT block the business signboard. The business name "{{businessName}}" on the sign must be fully visible and readable.
Appearance & Outfit: Well-groomed, smart casual or professional business attire suitable for a CEO. No phone or other distracting props. 
Background & Environment: Modern, clean, and welcoming storefront or business workspace. Bright, balanced lighting, realistic commercial area feel. 
Art Style: High-end 3D animated movie style with realistic textures, lighting, and materials. A blend of stylized character design with realistic rendering. Sharp focus, high detail, vibrant yet professional colors. Professional, premium branding aesthetic. 

Maintain photorealistic quality, natural lighting, and high detail. The face must remain 100% accurate and recognizable.`;

// Helper to construct the prompt from template
const buildPrompt = (request: CartoonRequest, template: string) => {
  let prompt = template || DEFAULT_PROMPT_TEMPLATE;
  
  // Replace variables
  prompt = prompt.replace(/{{personName}}/g, request.personName || '');
  prompt = prompt.replace(/{{gender}}/g, request.gender || '');
  prompt = prompt.replace(/{{businessName}}/g, request.businessName || '');
  prompt = prompt.replace(/{{businessType}}/g, request.businessType || '');
  prompt = prompt.replace(/{{style}}/g, request.style || '');
  
  return prompt;
};

// Helper to map 1:1, 16:9 etc to OpenAI resolutions
const getOpenAIResolution = (ratio: AspectRatio): string => {
  switch (ratio) {
    case '1:1': return "1024x1024";
    case '16:9': return "1792x1024";
    case '9:16': return "1024x1792";
    default: return "1024x1024"; // DALL-E 3 supports limited resolutions. Fallback to square.
  }
};

const PROXY_URL = "https://corsproxy.io/?";

const fetchWithProxy = async (url: string, options: RequestInit, useProxy: boolean = false) => {
  const finalUrl = useProxy ? `${PROXY_URL}${url}` : url;
  return fetch(finalUrl, options);
};

export const generateCartoonImage = async (
  request: CartoonRequest,
  referenceImage: ImageFile,
  settings: AppSettings
): Promise<string> => {
  switch (settings.provider) {
    case 'gemini':
      return generateWithGemini(request, referenceImage, settings);
    case 'openai':
      return generateWithOpenAI(request, settings);
    case 'replicate':
      return generateWithReplicate(request, referenceImage, settings);
    default:
      throw new Error(`Unsupported provider: ${settings.provider}`);
  }
};

const generateWithGemini = async (
  request: CartoonRequest,
  referenceImage: ImageFile,
  settings: AppSettings
): Promise<string> => {
  // Use user provided key or fallback to env
  const apiKey = settings.apiKey || process.env.API_KEY;
  if (!apiKey) throw new Error("API Key is missing for Gemini");

  const ai = new GoogleGenAI({ apiKey });
  const modelName = settings.model || 'gemini-2.5-flash-image';
  const aspectRatio = settings.aspectRatio || "1:1";
  
  // Use custom template or fallback
  const promptTemplate = settings.promptTemplate || DEFAULT_PROMPT_TEMPLATE;
  const prompt = buildPrompt(request, promptTemplate);

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { text: prompt },
          {
            inlineData: {
              data: referenceImage.base64,
              mimeType: referenceImage.mimeType,
            },
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
        }
      }
    });

    let imageUrl = '';
    if (response.candidates && response.candidates[0].content && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString = part.inlineData.data;
          imageUrl = `data:image/png;base64,${base64EncodeString}`;
          break;
        }
      }
    }

    if (!imageUrl) {
      throw new Error("No image generated. The model might have returned text instead.");
    }

    return imageUrl;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

const generateWithOpenAI = async (
  request: CartoonRequest,
  settings: AppSettings
): Promise<string> => {
  const apiKey = settings.apiKey;
  if (!apiKey) throw new Error("API Key is required for OpenAI");

  const promptTemplate = settings.promptTemplate || DEFAULT_PROMPT_TEMPLATE;
  const basePrompt = buildPrompt(request, promptTemplate);
  // OpenAI DALL-E 3 does not support image-to-image variations in the same way.
  // We strictly use text-to-image here.
  const prompt = basePrompt + " Note: Generate a generic character matching the description as no reference image can be used in this mode.";
  
  const size = getOpenAIResolution(settings.aspectRatio);

  const response = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: settings.model || 'dall-e-3',
      prompt: prompt,
      n: 1,
      size: size,
      response_format: "b64_json"
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`OpenAI Error: ${errorData.error?.message || response.statusText}`);
  }

  const data = await response.json();
  const b64 = data.data[0].b64_json;
  return `data:image/png;base64,${b64}`;
};

const generateWithReplicate = async (
  request: CartoonRequest,
  referenceImage: ImageFile,
  settings: AppSettings
): Promise<string> => {
  const apiKey = settings.apiKey;
  if (!apiKey) throw new Error("API Key is required for Replicate");

  const model = settings.model || "black-forest-labs/flux-schnell";
  const aspectRatio = settings.aspectRatio || "1:1";
  const useProxy = settings.useCorsProxy ?? true; // Default to true if undefined
  
  const promptTemplate = settings.promptTemplate || DEFAULT_PROMPT_TEMPLATE;
  const prompt = buildPrompt(request, promptTemplate);

  // 1. Create Prediction
  const startResponse = await fetchWithProxy("https://api.replicate.com/v1/predictions", {
    method: "POST",
    headers: {
      "Authorization": `Token ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      version: model.includes(':') ? model.split(':')[1] : undefined,
      input: {
        prompt: prompt,
        aspect_ratio: aspectRatio,
      },
    }),
  }, useProxy);

  if (!startResponse.ok) {
     const errorData = await startResponse.json().catch(() => ({ detail: startResponse.statusText }));
     throw new Error(`Replicate Error: ${errorData.detail || startResponse.statusText}`);
  }

  let prediction = await startResponse.json();
  // Ensure we get a valid polling URL. Replicate usually returns `urls.get`.
  const pollUrl = prediction.urls?.get;

  if (!pollUrl) {
      throw new Error("Replicate did not return a polling URL");
  }

  // 2. Poll for result
  while (prediction.status !== "succeeded" && prediction.status !== "failed" && prediction.status !== "canceled") {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const pollResponse = await fetchWithProxy(pollUrl, {
      headers: {
        "Authorization": `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    }, useProxy);
    
    if (!pollResponse.ok) {
       // If polling fails, try to continue or throw?
       // Sometimes proxies timeout. Let's throw for now.
       throw new Error(`Polling failed: ${pollResponse.statusText}`);
    }

    prediction = await pollResponse.json();
  }

  if (prediction.status === "failed") {
    throw new Error(`Replicate generation failed: ${prediction.error}`);
  }

  // Replicate returns a URL.
  // Note: If using proxy, the image URL might also be CORS restricted if used in a canvas, 
  // but for <img src> it's usually fine unless specific headers are needed.
  return prediction.output[0];
};
