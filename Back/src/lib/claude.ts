const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages'

export interface ClassifyResult {
  objeto: string
  categoria: 'organico' | 'reciclable' | 'no_reciclable'
  tipo: 'plastico' | 'vidrio' | 'carton' | 'papel' | 'metal' | 'organico' | 'basura'
  tip: string
  comoReciclar: string
  puntos: number
  confianza: number
}

const PROMPT = `Eres un clasificador de residuos para educacion ambiental en Mexico.
Responde UNICAMENTE con JSON valido, sin markdown, sin texto adicional.

Formato exacto:
{
  "objeto": "nombre del objeto en espanol",
  "categoria": "organico|reciclable|no_reciclable",
  "tipo": "plastico|vidrio|carton|papel|metal|organico|basura",
  "tip": "dato impactante sobre este residuo maximo 90 caracteres",
  "comoReciclar": "instruccion practica de una oracion",
  "puntos": 10,
  "confianza": 95
}

Reglas:
- organico: restos de comida, cascara, plantas, papel sucio
- reciclable: plastico limpio, vidrio, metal, carton limpio, papel limpio
- no_reciclable: unicel, basura mixta, residuos peligrosos
- puntos: 10 si organico o reciclable, 5 si no_reciclable`

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
  if (k.includes('botella') || k.includes('plastico'))
    return { objeto: 'Botella de plastico', categoria: 'reciclable', tipo: 'plastico', tip: 'Tarda 450 anos en degradarse', comoReciclar: 'Enjuaga y deposita en contenedor amarillo', puntos: 10, confianza: 60 }
  if (k.includes('vidrio'))
    return { objeto: 'Envase de vidrio', categoria: 'reciclable', tipo: 'vidrio', tip: 'El vidrio puede reciclarse infinitas veces', comoReciclar: 'Limpia y deposita en contenedor verde', puntos: 10, confianza: 60 }
  if (k.includes('carton') || k.includes('papel'))
    return { objeto: 'Carton o papel', categoria: 'reciclable', tipo: 'carton', tip: 'Una tonelada de papel reciclado salva 17 arboles', comoReciclar: 'Dobla seco y deposita en contenedor azul', puntos: 10, confianza: 60 }
  if (k.includes('lata') || k.includes('metal'))
    return { objeto: 'Lata metalica', categoria: 'reciclable', tipo: 'metal', tip: 'Reciclar aluminio usa 95% menos energia', comoReciclar: 'Aplasta y deposita en contenedor amarillo', puntos: 10, confianza: 60 }
  return { objeto: 'Residuo general', categoria: 'no_reciclable', tipo: 'basura', tip: 'Reduce tu consumo para generar menos basura', comoReciclar: 'Deposita en contenedor de basura general', puntos: 5, confianza: 50 }
}
