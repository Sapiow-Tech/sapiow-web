import type { MetadataRoute } from 'next'

const API_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

// Récupération des ID d'experts depuis Supabase avec la clé Service Role
async function getAllExperts(): Promise<Array<{ id: string; updated_at?: string }>> {
  try {
    const res = await fetch(`${API_URL}/rest/v1/pros?select=id,updated_at`, {
      headers: {
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
      },
      next: { revalidate: 3600 }, // Régénération du cache toutes les heures
    })
    
    if (!res.ok) {
        console.error("Erreur lors de la récupération des pros:", res.status)
        return []
    }
    return await res.json()
  } catch (error) {
    console.error("Erreur catch:", error)
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const SITE_URL = 'https://app.sapiow.com'
  const LOCALES = ['fr', 'en'] as const

  // 1. Pages statiques publiques
  const publicPaths = ['', '/mentions-legales', '/details', '/home']
  const routes: MetadataRoute.Sitemap = []

  publicPaths.forEach((path) => {
    LOCALES.forEach((locale) => {
      routes.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: path === '' ? 1 : 0.8,
      })
    })
  })

  // 2. Fiches experts dynamiques
  const experts = await getAllExperts()
  experts.forEach((expert) => {
    LOCALES.forEach((locale) => {
      routes.push({
        url: `${SITE_URL}/${locale}/details?id=${expert.id}`,
        lastModified: expert.updated_at ? new Date(expert.updated_at) : new Date(),
        changeFrequency: 'daily',
        priority: 0.7,
      })
    })
  })

  return routes
}
