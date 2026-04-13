'use client';

import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Session } from 'next-auth';
import { DiscordUser } from '@/types/discord';
import { redirect } from 'next/navigation';

export default function SubmitEntryForm({ session }: { session: Session | null }) {
    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const validateImageFile = async (file: File): Promise<boolean> => {
        const allowedTypes = ['image/png', 'image/svg+xml'];
        if (!allowedTypes.includes(file.type)) {
            toast({
                title: 'Error',
                description: 'Only PNG or SVG files are allowed.',
                className: 'bg-red-600 text-white'
            });
            return false;
        }

        try {
            if (file.type === 'image/png') {
                // Load PNG into an Image object
                const img = new Image();
                const imgPromise = new Promise((resolve, reject) => {
                    img.onload = resolve;
                    img.onerror = reject;
                });
                img.src = URL.createObjectURL(file);
                await imgPromise;

                if (img.width !== 3000 || img.height !== 3000) {
                    toast({
                        title: 'Error',
                        description: 'PNG images must be exactly 3000x3000 pixels.',
                        className: 'bg-red-600 text-white'
                    });
                    URL.revokeObjectURL(img.src);
                    return false;
                }
                URL.revokeObjectURL(img.src);

                // DPI check (approximate, as browsers don't reliably expose DPI)
                // We'll rely on server-side sharp for accurate DPI validation
            } else if (file.type === 'image/svg+xml') {
                // Read SVG content
                const text = await file.text();
                const parser = new DOMParser();
                const svgDoc = parser.parseFromString(text, 'image/svg+xml');
                const svgElement = svgDoc.querySelector('svg');

                if (!svgElement) {
                    toast({
                        title: 'Error',
                        description: 'Invalid SVG file.',
                        className: 'bg-red-600 text-white'
                    });
                    return false;
                }

                // Check width/height or viewBox
                let width = parseFloat(svgElement.getAttribute('width') || '0');
                let height = parseFloat(svgElement.getAttribute('height') || '0');
                const viewBox = svgElement.getAttribute('viewBox');
                if (viewBox) {
                    const [, , vbWidth, vbHeight] = viewBox.split(/\s+/).map(v => parseFloat(v));
                    if (vbWidth && vbHeight) {
                        width = vbWidth;
                        height = vbHeight;
                    }
                }

                if (width !== 3000 || height !== 3000) {
                    toast({
                        title: 'Error',
                        description: 'SVG images must have dimensions of 3000x3000 units.',
                        className: 'bg-red-600 text-white'
                    });
                    return false;
                }
            }
            return true;
        } catch (error) {
            console.error('Client-side validation error:', error);
            toast({
                title: 'Error',
                description: 'Failed to validate image file.',
                className: 'bg-red-600 text-white'
            });
            return false;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session || !session.accessToken) {
            redirect('/?unauthenticated=true');
        }

        if (!file || !title || !description) {
            toast({
                title: 'Error',
                description: 'Please fill in all fields.',
                className: 'bg-red-600 text-white'
            });
            return;
        }

        // Validate file
        const isValidFile = await validateImageFile(file);
        if (!isValidFile) {
            setIsSubmitting(false);
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('title', title);
        formData.append('description', description);

        try {
            // Fetch user data from /api/user
            const userResponse = await fetch('/api/user');

            if (!userResponse.ok) {
                const errorText = await userResponse.text();
                console.error('Failed to fetch user data:', errorText);
                throw new Error(errorText || 'Failed to fetch user data');
            }

            const userData: DiscordUser = await userResponse.json();
            if (!userData.id || !userData.username || !userData.discriminator) {
                throw new Error('Invalid user data');
            }

            // Append userData to FormData
            formData.append('userData', JSON.stringify(userData));

            // Submit to /api/submit-entry
            const submitResponse = await fetch('/api/submit-entry', {
                method: 'POST',
                body: formData
            });

            const result = await submitResponse.json();
            if (!submitResponse.ok) {
                throw new Error(result.error || 'Submission failed');
            }

            toast({
                title: 'Success',
                description: result.message,
                className: 'bg-green-600 text-white'
            });

            if (result.warnings) {
                result.warnings.forEach((warning: string) => {
                    toast({
                        title: 'Warning',
                        description: warning,
                        className: 'bg-yellow-600 text-white'
                    });
                });
            }

            // Reset form
            setFile(null);
            setTitle('');
            setDescription('');
        } catch (error) {
            console.error('Submission error:', error);
            toast({
                title: 'Error',
                description: error instanceof Error ? error.message : 'Failed to submit entry.',
                className: 'bg-red-600 text-white'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!session || !session.accessToken) {
        redirect('/?unauthenticated=true');
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="file" className="mb-2 block text-white">
                    Upload File (PNG or SVG, 3000x3000 pixels, 300 DPI)
                </label>
                <input
                    type="file"
                    id="file"
                    accept="image/png,image/svg+xml"
                    onChange={async e => {
                        const selectedFile = e.target.files?.[0] || null;
                        if (selectedFile) {
                            const isValid = await validateImageFile(selectedFile);
                            setFile(isValid ? selectedFile : null);
                            if (!isValid) {
                                e.target.value = ''; // Clear input
                            }
                        } else {
                            setFile(null);
                        }
                    }}
                    className="block w-full rounded bg-gray-800 p-2 text-white"
                    disabled={isSubmitting}
                />
            </div>
            <div>
                <label htmlFor="title" className="mb-2 block text-white">
                    Title (5–25 characters)
                </label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className="block w-full rounded bg-gray-800 p-2 text-white"
                    disabled={isSubmitting}
                    required
                />
            </div>
            <div>
                <label htmlFor="description" className="mb-2 block text-white">
                    Description (50–500 characters)
                </label>
                <textarea
                    id="description"
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    className="block w-full rounded bg-gray-800 p-2 text-white"
                    disabled={isSubmitting}
                    required
                />
            </div>
            <button
                type="submit"
                className="rounded bg-sky-400 px-4 py-2 text-white hover:bg-sky-500 disabled:bg-gray-500"
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Submitting...' : 'Submit Entry'}
            </button>
        </form>
    );
}
