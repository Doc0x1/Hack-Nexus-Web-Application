'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import CreateNewsPostDialog from '@/components/dialogs/CreateNewsPostDialog';
import EditNewsPostDialog from '@/components/dialogs/EditNewsPostDialog';
import DeleteNewsPostDialog from '@/components/dialogs/DeleteNewsPostDialog';
import { createNewsPost, updateNewsPost, deleteNewsPost } from '@/app/admin/news/actions';
import { useToast } from '@/components/ui/use-toast';
import { FaEdit, FaTrash } from 'react-icons/fa';

interface NewsPost {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    author: {
        name: string | null;
    };
}

interface NewsPostsCardProps {
    post?: NewsPost;
    isAdmin?: boolean;
}

export default function NewsPostsCard({ post, isAdmin }: NewsPostsCardProps) {
    const { toast } = useToast();
    const router = useRouter();
    const [isCreatingPost, setIsCreatingPost] = useState(false);
    const [isEditingPost, setIsEditingPost] = useState(false);
    const [isDeletingPost, setIsDeletingPost] = useState(false);

    const handleCreatePost = async (formData: FormData) => {
        try {
            const result = await createNewsPost(formData);
            if (result.success && result.post) {
                setIsCreatingPost(false);
                router.refresh();
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
        if (!post) return;

        try {
            const result = await updateNewsPost(post.id, formData);
            if (result.success && result.post) {
                setIsEditingPost(false);
                router.refresh();
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
        if (!post) return;

        try {
            const result = await deleteNewsPost(post.id);
            if (result.success) {
                setIsDeletingPost(false);
                router.refresh();
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

    if (!post) {
        return (
            <>
                {isAdmin && (
                    <Button variant="outline" className="cursor-pointer" onClick={() => setIsCreatingPost(true)}>
                        <Plus className="h-4 w-4" /> New Post
                    </Button>
                )}

                <CreateNewsPostDialog
                    isOpen={isCreatingPost}
                    onClose={() => setIsCreatingPost(false)}
                    onSubmit={handleCreatePost}
                />
            </>
        );
    }

    return (
        <>
            <Card key={post.id} className="bg-card/80 gap-4 rounded-xl border shadow-2xl backdrop-blur-sm">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>{post.title}</CardTitle>
                        {isAdmin && (
                            <div className="">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsEditingPost(true)}
                                    className="text-blue-400 hover:text-blue-300"
                                >
                                    <FaEdit />
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsDeletingPost(true)}
                                    className="text-red-400 hover:text-red-300"
                                >
                                    <FaTrash />
                                </Button>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{post.content}</p>
                    <p className="mt-4 text-sm text-gray-400">
                        Posted by {post.author.name || 'Anonymous'} on {new Date(post.createdAt).toLocaleDateString()}
                    </p>
                </CardContent>
            </Card>

            <EditNewsPostDialog
                isOpen={isEditingPost}
                onClose={() => setIsEditingPost(false)}
                onSubmit={handleUpdatePost}
                postTitle={post.title}
                postContent={post.content}
            />

            <DeleteNewsPostDialog
                isOpen={isDeletingPost}
                onClose={() => setIsDeletingPost(false)}
                onConfirm={handleDeletePost}
                postTitle={post.title}
            />
        </>
    );
}
