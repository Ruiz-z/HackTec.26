const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClassifyResult {
  objeto: string
  categoria: 'reciclable' | 'error'
  tipo: 'plastico' | 'papel' | 'aluminio' | 'error'
  tip: string
  comoReciclar: string
  puntos: number
  confianza: number
}

const PROMPT = `Eres un clasificador de residuos para educacion ambiental en Mexico.
SOLO clasificas estos 3 materiales: plastico, papel y aluminio. Cualquier otro residuo debe marcarse como error.
Responde UNICAMENTE con JSON valido, sin markdown, sin texto adicional.

Formato exacto:
{
  "objeto": "nombre del objeto en espanol",
  "categoria": "reciclable|error",
  "tipo": "plastico|papel|aluminio|error",
  "tip": "dato impactante sobre este residuo maximo 90 caracteres",
  "comoReciclar": "instruccion practica de una oracion",
  "puntos": 10,
  "confianza": 95
}

Reglas:
- reciclable SOLO para plastico, papel o aluminio
- error para CUALQUIER otro residuo (vidrio, metal, carton, organico, basura, electronico, etc)
- puntos: 10 si es reciclable, 0 si es error`

export async function classifyImage(base64Image: string): Promise<ClassifyResult> {
  const response = await fetch(ANTHROPIC_API_URL, {
    method: 'POST',
    headers: {
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: { type: 'base64', media_type: 'image/jpeg', data: base64Image },
          },
          { type: 'text', text: PROMPT },
        ],
      }],
    }),
  })

  if (!response.ok) throw new Error(`Claude API error ${response.status}`)

  const data = await response.json() as { content: { text: string }[] }
  const clean = data.content[0].text.replace(/```json|```/g, '').trim()
  return JSON.parse(clean) as ClassifyResult
}

export function classifyOffline(keyword: string): ClassifyResult {
  const k = keyword.toLowerCase()
  if (k.includes('plastico') || k.includes('botella') || k.includes('pet'))
    return { objeto: 'Botella de plastico', categoria: 'reciclable', tipo: 'plastico', tip: 'Tarda 450 anos en degradarse', comoReciclar: 'Enjuaga y deposita en contenedor amarillo', puntos: 10, confianza: 60 }
  if (k.includes('papel') || k.includes('hoja') || k.includes('periodico'))
    return { objeto: 'Papel', categoria: 'reciclable', tipo: 'papel', tip: 'Una tonelada de papel reciclado salva 17 arboles', comoReciclar: 'Dobla seco y deposita en contenedor azul', puntos: 10, confianza: 60 }
  if (k.includes('aluminio') || k.includes('lata') || k.includes('metal'))
    return { objeto: 'Lata de aluminio', categoria: 'reciclable', tipo: 'aluminio', tip: 'Reciclar aluminio usa 95% menos energia', comoReciclar: 'Aplasta y deposita en contenedor amarillo', puntos: 10, confianza: 60 }
  return { objeto: 'Residuo no admitido', categoria: 'error', tipo: 'error', tip: 'Solo aceptamos plastico, papel y aluminio', comoReciclar: 'Retira el residuo y separalo correctamente', puntos: 0, confianza: 100 }
}
