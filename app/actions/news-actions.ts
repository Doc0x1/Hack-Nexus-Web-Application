'use server';

import { unstable_cache } from 'next/cache';
import { getPublicNewsPosts } from '@/app/admin/news/actions';

export const getCachedPublicNewsPosts = unstable_cache(
    async () => {
        return getPublicNewsPosts();
    },
    ['publicNewsPosts'],
    { revalidate: 3600, tags: ['publicNewsPosts'] }
);
