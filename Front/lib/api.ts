const BASE_URL = "http://localhost:3001/api/v1"

async function fetcher<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: "Error de red" }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }
  return res.json()
}

function authHeaders(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` }
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    fetcher<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  me: (token: string) =>
    fetcher<{ user: any }>("/auth/me", {
      headers: authHeaders(token),
    }),

  // Classify
  classifyImage: (base64Data: string, userId?: number) =>
    fetcher<any>("/classify", {
      method: "POST",
      body: JSON.stringify({ image: base64Data, userId }),
    }),

  // Bins
  getBasureros: () => fetcher<any[]>("/basureros"),

  // Stats
  getStats: () => fetcher<any>("/stats"),
  getImpacto: () => fetcher<any>("/stats/impacto"),
  getAdminStats: (token: string) =>
    fetcher<any>("/stats/admin", { headers: authHeaders(token) }),

  // Ranking
  getRanking: () => fetcher<any[]>("/users/ranking"),

  // Retos
  getRetos: () => fetcher<any[]>("/retos"),
  getRetosUsuario: (userId: number) => fetcher<any[]>(`/retos/usuario/${userId}`),

  // Scan
  scanQR: (token: string, botId: string) =>
    fetcher<any>(`/scan?botId=${botId}`, { headers: authHeaders(token) }),

  // Recompensas
  getRecompensas: () => fetcher<any[]>("/recompensas"),
  getMisCanjes: (token: string) =>
    fetcher<any[]>("/recompensas/mis-canjes", { headers: authHeaders(token) }),
  canjearRecompensa: (token: string, id: number) =>
    fetcher<any>(`/recompensas/canjear/${id}`, {
      method: "POST",
      headers: authHeaders(token),
    }),
}
