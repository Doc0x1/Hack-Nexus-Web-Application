'use server';

import axios from 'axios';
import { unstable_cache } from 'next/cache';
import sharp from 'sharp';

export const getGeolocation = unstable_cache(
    async (formData: FormData) => {
        return await geolocateImage(formData);
    },
    ['geolocate'],
    { revalidate: 3600 }
);

export async function geolocateImage(formData: FormData) {
    try {
        const backendBaseUrl = process.env.GEOLOCATE_SERVER_URL;

        // Fetch CSRF token
        const csrfResponse = await axios.get(`${backendBaseUrl}/api/get-csrf-token`, {
            headers: {
                'X-API-Key': process.env.GEOLOCATE_API_KEY
            },
            timeout: 10000 // 10 seconds for CSRF token fetch
        });

        const csrfToken = csrfResponse.data.csrf_token;
        if (!csrfToken) {
            throw new Error('Failed to retrieve CSRF token');
        }

        const image = formData.get('image');
        const imageData = formData.get('image_data');

        if (!image && !imageData) {
            throw new Error('No valid image provided');
        }

        const backendFormData = new FormData();
        if (image) {
            // Preprocess image file: resize to 512x512, convert to JPEG
            const buffer = Buffer.from(await (image as File).arrayBuffer());
            const processedImage = await sharp(buffer)
                .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 95 })
                .toBuffer();
            backendFormData.append('image', new Blob([processedImage], { type: 'image/jpeg' }), 'image.jpg');
        }
        if (imageData) {
            backendFormData.append('image_data', imageData);
        }

        // Send geolocate request
        const response = await axios.post(`${backendBaseUrl}/api/geolocate`, backendFormData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'X-API-Key': process.env.GEOLOCATE_API_KEY,
                'X-CSRF-Token': csrfToken
            },
            timeout: 90000 // 90 seconds for GeoCLIP processing
        });

        return { success: true, data: response.data };
    } catch (error) {
        console.error('Error in geolocate action:', error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.error || 'Failed to geolocate image';

            if (status === 413) {
                throw new Error(
                    'Image is too large. Please upload an image smaller than 10MB or try a lower resolution.'
                );
            }
            if (status === 403) {
                throw new Error('CSRF token invalid or expired');
            }
            if (status === 401) {
                throw new Error('Invalid API key');
            }
            if (status === 429) {
                throw new Error('Rate limit exceeded');
            }
            if (status === 400) {
                throw new Error(message);
            }
            if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                throw new Error('Failed to connect to backend. Ensure the backend is running on http://localhost:5000');
            }
        }

        throw new Error('Failed to geolocate image');
    }
}
