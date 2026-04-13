'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function getNewsPosts() {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        throw new Error('Unauthorized');
    }

    return prisma.newsPost.findMany({
        include: {
            author: true
        },
        orderBy: [{ order: 'asc' }, { createdAt: 'desc' }]
    });
}

export async function getNewsPost(id: string) {
    const session = await auth();
    if (!session?.user?.isAdmin) {
        throw new Error('Unauthorized');
    }

    return prisma.newsPost.findUnique({
        where: { id },
        include: {
            author: true
        }
    });
}

export async function createNewsPost(formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return { success: false, error: 'Title and content are required' };
        }

        // First, ensure the user exists
        const user = await prisma.user.upsert({
            where: { email: session.user.email! },
            update: {
                name: session.user.name || null,
                image: session.user.image || null
            },
            create: {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.name || null,
                image: session.user.image || null
            }
        });

        // Then create the post
        const maxOrder = await prisma.newsPost.aggregate({
            _max: {
                order: true
            }
        });

        const nextOrder = (maxOrder._max.order ?? -1) + 1;

        const post = await prisma.newsPost.create({
            data: {
                title,
                content,
                order: nextOrder,
                author: {
                    connect: {
                        id: user.id
                    }
                }
            },
            include: {
                author: true
            }
        });

        revalidatePath('/admin/news');
        revalidateTag('publicNewsPosts');
        return { success: true, post };
    } catch (error) {
        console.error('Error creating news post:', error);
        return { success: false, error: 'Failed to create news post' };
    }
}

export async function updateNewsPost(id: string, formData: FormData) {
    try {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        const title = formData.get('title') as string;
        const content = formData.get('content') as string;

        if (!title || !content) {
            return { success: false, error: 'Title and content are required' };
        }

        const post = await prisma.newsPost.update({
            where: { id },
            data: {
                title,
                content
            },
            include: {
                author: true
            }
        });

        revalidatePath('/admin/news');
        revalidateTag('publicNewsPosts');
        return { success: true, post };
    } catch (error) {
        console.error('Error updating news post:', error);
        return { success: false, error: 'Failed to update news post' };
    }
}

export async function deleteNewsPost(id: string) {
    try {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.newsPost.delete({
            where: { id }
        });

        revalidatePath('/admin/news');
        revalidateTag('publicNewsPosts');
        return { success: true };
    } catch (error) {
        console.error('Error deleting news post:', error);
        return { success: false, error: 'Failed to delete news post' };
    }
}

export async function getPublicNewsPosts() {
    return prisma.newsPost.findMany({
        where: {
            published: true
        },
        orderBy: [{ order: 'asc' }, { publishedAt: 'desc' }],
        include: {
            author: {
                select: {
                    name: true
                }
            }
        }
    });
}

export async function reorderNewsPosts(orderUpdates: { id: string; order: number }[]) {
    try {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        await prisma.$transaction(
            orderUpdates.map(({ id, order }) =>
                prisma.newsPost.update({
                    where: { id },
                    data: { order } as any
                })
            )
        );

        revalidatePath('/admin/news');
        revalidateTag('publicNewsPosts');
        return { success: true };
    } catch (error) {
        console.error('Error reordering news posts:', error);
        return { success: false, error: 'Failed to reorder posts' };
    }
}

export async function togglePublishStatus(id: string, publish: boolean) {
    try {
        const session = await auth();
        if (!session?.user?.isAdmin) {
            return { success: false, error: 'Unauthorized' };
        }

        const post = await prisma.newsPost.update({
            where: { id },
            data: {
                published: publish,
                publishedAt: publish ? new Date() : null
            },
            include: {
                author: true
            }
        });

        revalidatePath('/admin/news');
        revalidateTag('publicNewsPosts');
        return { success: true, post };
    } catch (error) {
        console.error('Error toggling publish status:', error);
        return { success: false, error: 'Failed to update publish status' };
    }
}
