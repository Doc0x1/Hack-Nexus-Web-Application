'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    getNewsPosts,
    createNewsPost,
    deleteNewsPost,
    updateNewsPost,
    togglePublishStatus
} from '@/app/admin/news/actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import AdminCard from '@/components/admin/AdminCard';
import CreateNewsPostDialog from './dialogs/CreateNewsPostDialog';
import DeleteNewsPostDialog from './dialogs/DeleteNewsPostDialog';
import { Skeleton } from './ui';
import EditNewsPostDialog from './dialogs/EditNewsPostDialog';

interface NewsPost {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
        name: string | null;
    };
    published: boolean;
    order?: number;
}

export default function AdminNewsPosts() {
    const { toast } = useToast();
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [postToDelete, setPostToDelete] = useState<NewsPost | null>(null);
    const [editingPost, setEditingPost] = useState<NewsPost | null>(null);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            const posts = await getNewsPosts();
            setPosts(posts);
        } catch (err) {
            console.error('Error fetching posts:', err);
            toast({
                title: 'Error',
                description: 'Failed to fetch posts',
                className: 'bg-red-600 text-white'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreatePost = async (formData: FormData) => {
        try {
            const result = await createNewsPost(formData);
            if (result.success && result.post) {
                setPosts([result.post, ...posts]);
                setIsCreatingPost(false);
                toast({
                    title: 'Success',
                    description: 'Post created successfully',
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error creating post:', error);
            toast({
                title: 'Error',
                description: 'Failed to create post',
                className: 'bg-red-600 text-white'
            });
        }
    };

    const handleUpdatePost = async (formData: FormData) => {
        if (!editingPost) return;

        try {
            const result = await updateNewsPost(editingPost.id, formData);
            if (result.success && result.post) {
                setPosts(posts.map(p => (p.id === editingPost.id ? result.post : p)));
                setEditingPost(null);
                toast({
                    title: 'Success',
                    description: 'Post updated successfully',
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error updating post:', error);
            toast({
                title: 'Error',
                description: 'Failed to update post',
                className: 'bg-red-600 text-white'
            });
        }
    };

    const handleDeletePost = async () => {
        if (!postToDelete) return;

        try {
            const result = await deleteNewsPost(postToDelete.id);
            if (result.success) {
                setPosts(posts.filter(p => p.id !== postToDelete.id));
                setPostToDelete(null);
                toast({
                    title: 'Success',
                    description: 'Post deleted successfully',
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete post',
                className: 'bg-red-600 text-white'
            });
        }
    };

    const handlePublishToggle = async (post: NewsPost) => {
        try {
            const result = await togglePublishStatus(post.id, !post.published);
            if (result.success && result.post) {
                setPosts(posts.map(p => (p.id === post.id ? result.post : p)));
                toast({
                    title: 'Success',
                    description: `Post ${result.post.published ? 'published' : 'unpublished'} successfully`,
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error toggling publish:', error);
            toast({
                title: 'Error',
                description: 'Failed to update publish status',
                className: 'bg-red-600 text-white'
            });
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-8 w-48" />
                {[1].map(index => (
                    <Card key={index} className="bg-card/80 backdrop-blur-sm">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <Skeleton className="h-6 w-3/4" />
                                <div className="flex gap-2">
                                    <Skeleton className="h-8 w-8" />
                                    <Skeleton className="h-8 w-8" />
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="mb-2 h-4 w-full" />
                            <Skeleton className="mb-2 h-4 w-3/4" />
                            <Skeleton className="mb-2 h-4 w-1/2" />
                            <div className="mt-4">
                                <Skeleton className="h-4 w-48" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="mr-3 flex items-center justify-between">
                <h2 className="text-2xl font-bold">Latest News</h2>
                <Button variant="outline" className="cursor-pointer" onClick={() => setIsCreatingPost(true)}>
                    <Plus className="h-4 w-4" /> New Post
                </Button>
            </div>
            {posts.length === 0 ? (
                <div className="text-center text-slate-400">No posts found</div>
            ) : (
                posts.map(post => (
                    <AdminCard
                        key={post.id}
                        title={post.title}
                        details={[
                            { label: 'Author', value: post.author.name || 'Anonymous' },
                            { label: 'Date', value: new Date(post.createdAt).toLocaleDateString() },
                            { label: 'Status', value: post.published ? 'Published' : 'Draft' }
                        ]}
                        onEdit={() => setEditingPost(post)}
                        onDelete={() => setPostToDelete(post)}
                        extraActions={[
                            {
                                label: post.published ? 'Unpublish' : 'Publish',
                                onClick: () => handlePublishToggle(post)
                            }
                        ]}
                    >
                        <p className="mt-2 whitespace-pre-wrap text-slate-400">{post.content}</p>
                    </AdminCard>
                ))
            )}

            <CreateNewsPostDialog
                isOpen={isCreatingPost}
                onClose={() => setIsCreatingPost(false)}
                onSubmit={handleCreatePost}
            />

            <EditNewsPostDialog
                isOpen={!!editingPost}
                onClose={() => setEditingPost(null)}
                onSubmit={handleUpdatePost}
                postTitle={editingPost?.title || ''}
                postContent={editingPost?.content || ''}
            />

            <DeleteNewsPostDialog
                isOpen={!!postToDelete}
                onClose={() => setPostToDelete(null)}
                onConfirm={handleDeletePost}
                postTitle={postToDelete?.title || ''}
            />
        </div>
    );
}
