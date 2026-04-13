import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import sharp from 'sharp';

export async function POST(req: NextRequest) {
    try {
        const backendBaseUrl =
            process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : process.env.GEOLOCATE_SERVER_URL;

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

        // Get form data
        const formData = await req.formData();
        const image = formData.get('image');
        const imageData = formData.get('image_data');

        if (!image && !imageData) {
            return NextResponse.json({ error: 'No valid image provided' }, { status: 400 });
        }

        const backendFormData = new FormData();
        if (image) {
            // Preprocess image file: resize to 512x512, convert to JPEG
            const buffer = Buffer.from(await (image as File).arrayBuffer());
            const processedImage = await sharp(buffer)
                .resize({ width: 512, height: 512, fit: 'inside', withoutEnlargement: true })
                .jpeg({ quality: 95 })
                .toBuffer();
            backendFormData.append('image', new Blob([new Uint8Array(processedImage)], { type: 'image/jpeg' }), 'image.jpg');
        }
        if (imageData) {
            // Note: Base64 image_data should be preprocessed client-side (see client instructions)
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

        return NextResponse.json(response.data);
    } catch (error) {
        console.error('Error forwarding request:', error);

        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const message = error.response?.data?.error || 'Failed to geolocate image';

            if (status === 413) {
                return NextResponse.json(
                    {
                        error: 'Image is too large. Please upload an image smaller than 10MB or try a lower resolution.'
                    },
                    { status: 413 }
                );
            }
            if (status === 403) {
                return NextResponse.json({ error: 'CSRF token invalid or expired' }, { status: 403 });
            }
            if (status === 401) {
                return NextResponse.json({ error: 'Invalid API key' }, { status: 401 });
            }
            if (status === 429) {
                return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
            }
            if (status === 400) {
                return NextResponse.json({ error: message }, { status: 400 });
            }
            if (error.code === 'ECONNRESET' || error.code === 'ECONNREFUSED') {
                return NextResponse.json(
                    { error: 'Failed to connect to backend. Ensure the backend is running on http://localhost:5000' },
                    { status: 503 }
                );
            }
        }

        return NextResponse.json({ error: 'Failed to geolocate image' }, { status: 500 });
    }
}
