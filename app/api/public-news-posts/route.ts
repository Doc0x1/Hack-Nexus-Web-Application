import { NextResponse } from 'next/server';
import { getCachedPublicNewsPosts } from '@/app/actions/news-actions';

export async function GET() {
    try {
        const posts = await getCachedPublicNewsPosts();
        return NextResponse.json(posts);
    } catch (error) {
        console.error('Error fetching cached news posts:', error);
        return NextResponse.json({ error: 'Failed to fetch news posts' }, { status: 500 });
    }
}
