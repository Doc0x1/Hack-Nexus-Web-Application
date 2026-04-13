import { getCachedPublicNewsPosts } from '@/app/actions/news-actions';
import NewsPostsCard from './NewsPostsCard';
import { Session } from 'next-auth';

interface NewsPostsProps {
    session: Session | null;
}

export default async function NewsPosts({ session }: NewsPostsProps) {
    const posts = await getCachedPublicNewsPosts();
    const isAdmin = session?.user?.isAdmin;

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Latest News</h2>
            {isAdmin && <NewsPostsCard isAdmin={isAdmin} />}
            {posts.length === 0 ? (
                <p>No news posts available.</p>
            ) : (
                posts.map(post => <NewsPostsCard key={post.id} post={post} isAdmin={isAdmin} />)
            )}
        </div>
    );
}
