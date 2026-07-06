import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://www.qoricash.pe';
  const now = new Date();

  return [
    { url: `${base}`,                        lastModified: now, changeFrequency: 'daily',   priority: 1.0 },
    { url: `${base}/empresa`,                lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${base}/crear-cuenta`,           lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${base}/login`,                  lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${base}/noticias`,               lastModified: now, changeFrequency: 'daily',   priority: 0.8 },
    { url: `${base}/mercado-en-vivo`,        lastModified: now, changeFrequency: 'hourly',  priority: 0.7 },
    { url: `${base}/servicios`,              lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/sobre-nosotros`,         lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/preguntas-frecuentes`,   lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${base}/libro-reclamaciones`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/politica-privacidad`,    lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/politica-cookies`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${base}/terminos-condiciones`,   lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ];
}
