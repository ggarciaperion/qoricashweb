import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/dashboard/',
          '/admin/',
          '/offline',
        ],
      },
    ],
    sitemap: 'https://www.qoricash.pe/sitemap.xml',
    host: 'https://www.qoricash.pe',
  };
}
