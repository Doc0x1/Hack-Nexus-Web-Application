'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
    getNewsPosts,
    createNewsPost,
    deleteNewsPost,
    updateNewsPost,
    togglePublishStatus,
    reorderNewsPosts
} from './actions';
import { ScrollArea } from '@/components/ui/scroll-area';
import AdminCard from '@/components/admin/AdminCard';
import CreateNewsPostDialog from '@/components/dialogs/CreateNewsPostDialog';
import EditNewsPostDialog from '@/components/dialogs/EditNewsPostDialog';
import DeleteNewsPostDialog from '@/components/dialogs/DeleteNewsPostDialog';
import { Reorder } from 'motion/react';

interface NewsPost {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
        name: string | null;
    };
    published: boolean;
    order: number;
}

export default function NewsPage() {
    const { toast } = useToast();
    const [posts, setPosts] = useState<NewsPost[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [editingPost, setEditingPost] = useState<NewsPost | null>(null);
    const [deletingPost, setDeletingPost] = useState<NewsPost | null>(null);

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
                description: 'Failed to load news posts',
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
                    description: 'News post created successfully',
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error creating news post:', error);
            toast({
                title: 'Error',
                description: 'Failed to create news post',
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

    const handleDeletePost = async (postId: string) => {
        try {
            const result = await deleteNewsPost(postId);
            if (result.success) {
                setPosts(posts.filter(post => post.id !== postId));
                setDeletingPost(null);
                toast({
                    title: 'Success',
                    description: 'News post deleted successfully',
                    className: 'bg-green-600 text-white'
                });
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            console.error('Error deleting news post:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete news post',
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
            console.error('Error toggling publish status:', error);
            toast({
                title: 'Error',
                description: 'Failed to update publish status',
                className: 'bg-red-600 text-white'
            });
        }
    };

    const handleReorder = async (newPosts: NewsPost[]) => {
        setPosts(newPosts);

        try {
            await reorderNewsPosts(newPosts.map((post, index) => ({ id: post.id, order: index })));
        } catch (error) {
            console.error('Failed to persist order:', error);
            toast({
                title: 'Error',
                description: 'Failed to save post order',
                className: 'bg-red-600 text-white'
            });
        }
    };

    if (isLoading) {
        return <div className="p-8 text-center text-slate-400">Loading posts...</div>;
    }

    return (
        <div className="p-8">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">News Management</h1>
                </div>
                <Button variant="outline" className="cursor-pointer" onClick={() => setIsCreatingPost(true)}>
                    New Post
                </Button>
            </div>

            <Card className="">
                <CardHeader>
                    <CardTitle>News Posts</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-20rem)]">
                        <Reorder.Group axis="y" values={posts} onReorder={handleReorder} className="space-y-4 pr-4">
                            {posts.length === 0 ? (
                                <p className="text-center text-slate-400">No news posts available.</p>
                            ) : (
                                posts.map(post => (
                                    <Reorder.Item key={post.id} value={post} className="list-none">
                                        <AdminCard
                                            title={post.title}
                                            details={[
                                                { label: 'Author', value: post.author.name || 'Anonymous' },
                                                { label: 'Date', value: new Date(post.createdAt).toLocaleDateString() },
                                                { label: 'Status', value: post.published ? 'Published' : 'Draft' }
                                            ]}
                                            onEdit={() => setEditingPost(post)}
                                            onDelete={() => setDeletingPost(post)}
                                            extraActions={[
                                                {
                                                    label: post.published ? 'Unpublish' : 'Publish',
                                                    onClick: () => handlePublishToggle(post)
                                                }
                                            ]}
                                        >
                                            <p className="mt-2 whitespace-pre-wrap text-slate-400">{post.content}</p>
                                        </AdminCard>
                                    </Reorder.Item>
                                ))
                            )}
                        </Reorder.Group>
                    </ScrollArea>
                </CardContent>
            </Card>

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
                isOpen={!!deletingPost}
                postTitle={deletingPost?.title || ''}
                onClose={() => setDeletingPost(null)}
                onConfirm={() => deletingPost && handleDeletePost(deletingPost.id)}
            />
        </div>
    );
}
