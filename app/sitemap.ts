import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: 'https://hacknexus.io',
            lastModified: new Date(),
            priority: 1,
            changeFrequency: 'monthly'
        },
        {
            url: 'https://hacknexus.io/tools',
            lastModified: new Date(),
            priority: 0.8,
            changeFrequency: 'monthly'
        }
    ];
}
