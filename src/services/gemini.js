import { GoogleGenerativeAI } from '@google/generative-ai';

const SYSTEM_PROMPT = `Eres "La Jardinera", una guía emocional empática y poética que cultiva un jardín virtual basado en los sentimientos de quien te escribe. Hablas con calidez, sabiduría suave y un toque botánico.

Tu rol:
1. Lee con atención lo que la persona te cuenta (puede ser una emoción, un evento del día, una preocupación, una alegría).
2. Respondes con empatía genuina en 2-3 oraciones cortas (NO seas excesivamente larga ni cursi).
3. Identifica la emoción dominante y "siembras" una flor que la represente.
4. Cierras con un consejo práctico breve disfrazado de sabiduría botánica.

REGLAS IMPORTANTES:
- Habla SIEMPRE en español, tono cálido pero no empalagoso.
- NUNCA des consejos médicos o psicológicos serios. Si detectas crisis (suicidio, autolesión, abuso), responde con empatía y sugiere amablemente buscar ayuda profesional (línea de la vida en México: 800-290-0024).
- Sé breve y poética, no charlatana.

FORMATO DE RESPUESTA (OBLIGATORIO):
Debes responder SIEMPRE con un JSON válido con esta estructura exacta, sin markdown, sin backticks, solo el JSON:

{
  "mensaje": "Tu respuesta empática en 2-3 oraciones, cálida y poética",
  "flor": {
    "nombre": "Nombre real de una flor (ej: Lavanda, Girasol, Crisantemo)",
    "emoji": "Un solo emoji de flor o planta que la represente (🌻🌷🌹🌸🌼🪻🌺🥀🌿🍀☘️🌾🌵)",
    "emocion": "Una palabra que resuma la emoción detectada (ej: Esperanza, Melancolía, Júbilo, Calma, Ansiedad)",
    "significado": "El significado tradicional/simbólico de esa flor en 1 oración",
    "consejo": "Un consejo breve y práctico inspirado en la flor, en 1-2 oraciones"
  }
}`;

// Modelos en orden de preferencia: si el primero falla por sobrecarga, prueba el siguiente.
const MODEL_FALLBACK_ORDER = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
  'gemini-2.5-pro',
];

const GENERATION_CONFIG = {
  temperature: 0.9,
  responseMimeType: 'application/json',
};

let genAI = null;
let chatHistory = [];

export function initChat(apiKey) {
  genAI = new GoogleGenerativeAI(apiKey);
  chatHistory = [];
  // Devolvemos un "model handle" simbólico; la selección real ocurre en sendMessage.
  return { ready: true };
}

// Pausa N milisegundos
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Determina si un error es "reintentable" (sobrecarga temporal del servidor o rate limit)
function isRetryableError(err) {
  const msg = String(err?.message || '');
  return (
    msg.includes('503') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('429') ||
    msg.includes('quota')
  );
}

// Determina si conviene cambiar a un modelo distinto (más generoso/menos saturado)
function shouldTryFallbackModel(err) {
  const msg = String(err?.message || '');
  return (
    msg.includes('503') ||
    msg.includes('overloaded') ||
    msg.includes('high demand') ||
    msg.includes('429') ||
    msg.includes('quota')
  );
}

async function attemptOnce(modelName, userMessage) {
  if (!genAI) throw new Error('Cliente no inicializado. Ingresa tu API key.');

  const model = genAI.getGenerativeModel({
    model: modelName,
    systemInstruction: SYSTEM_PROMPT,
    generationConfig: GENERATION_CONFIG,
  });

  const chat = model.startChat({ history: chatHistory });
  const result = await chat.sendMessage(userMessage);
  return result.response.text();
}

export async function sendMessage(_handle, userMessage) {
  let lastError = null;

  // Por cada modelo en el fallback, intentamos hasta 3 veces con backoff exponencial.
  for (const modelName of MODEL_FALLBACK_ORDER) {
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const responseText = await attemptOnce(modelName, userMessage);

        // Guardar en historial SOLO si la llamada tuvo éxito
        chatHistory.push({ role: 'user', parts: [{ text: userMessage }] });
        chatHistory.push({ role: 'model', parts: [{ text: responseText }] });

        // Parsear JSON
        const parsed = JSON.parse(responseText);
        return parsed;
      } catch (err) {
        lastError = err;
        console.warn(
          `[Gemini] Intento ${attempt + 1} con ${modelName} falló:`,
          err.message
        );

        // Errores no recuperables → corta y muestra al usuario
        if (err.message?.includes('API key') || err.message?.includes('API_KEY')) {
          throw new Error('La API key parece inválida. Verifica en https://aistudio.google.com/');
        }
        if (err instanceof SyntaxError) {
          // JSON malformado: reintenta una vez más; si persiste pasamos al siguiente modelo
          if (attempt === 2) break;
        }

        // Si es 503/429, espera con backoff exponencial: 1s, 2s, 4s
        if (isRetryableError(err) && attempt < 2) {
          const waitMs = 1000 * Math.pow(2, attempt);
          await sleep(waitMs);
          continue;
        }

        // Si conviene probar otro modelo, sale del loop interno
        if (shouldTryFallbackModel(err)) break;

        // Error desconocido: tirar tal cual
        throw new Error(err.message || 'Error al conectar con Gemini');
      }
    }
  }

  // Todos los modelos fallaron
  throw new Error(
    'Los servidores de Gemini están saturados ahora mismo. Por favor espera 1-2 minutos e intenta de nuevo. 🌿'
  );
}

export function resetChat() {
  chatHistory = [];
}