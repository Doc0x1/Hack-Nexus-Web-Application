'use client';

import { useState, useRef, useEffect } from 'react';
import { CardContent, CardHeader, CardTitle } from '@components/ui';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L, { LatLngBoundsExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { FaClipboard, FaCloudUploadAlt, FaFileImage, FaPercentage, FaSatellite } from 'react-icons/fa';
import { Separator } from './ui/separator';
import { fonts } from './fonts';
import { geolocateImage } from '@/app/actions/geolocate-actions';

// Fix Leaflet marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
});

interface Prediction {
    location: string;
    confidence: number;
}

interface Coordinate {
    lat: number;
    lon: number;
}

// Component to control map bounds
function MapController({ coordinates }: { coordinates: Coordinate[] }) {
    const map = useMap();

    useEffect(() => {
        if (coordinates.length > 0) {
            const lats = coordinates.map(coord => coord.lat);
            const lons = coordinates.map(coord => coord.lon);
            const latSpread = Math.max(...lats) - Math.min(...lats);
            const lonSpread = Math.max(...lons) - Math.min(...lons);
            let padding = 1.0;
            if (latSpread < 1 && lonSpread < 1) {
                padding = 0.2;
            } else if (latSpread < 5 && lonSpread < 5) {
                padding = 0.5;
            }
            const bounds: LatLngBoundsExpression = [
                [Math.min(...lats) - padding, Math.min(...lons) - padding],
                [Math.max(...lats) + padding, Math.max(...lons) + padding]
            ];
            map.fitBounds(bounds); // Always fit bounds for new coordinates
        }
    }, [coordinates, map]);

    return null;
}

export default function Geolocate() {
    const [file, setFile] = useState<File | null>(null);
    const [imageData, setImageData] = useState<string | null>(null);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFile = e.dataTransfer.files[0];
        if (!droppedFile) return;
        if (droppedFile && ['image/png', 'image/jpeg', 'image/webp'].includes(droppedFile.type)) {
            setFile(droppedFile);
            setImageData(null);
            handleUpload(droppedFile, null);
        } else {
            setError('Please upload a valid image (PNG, JPG, or WebP)');
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;
        if (selectedFile && ['image/png', 'image/jpeg', 'image/webp'].includes(selectedFile.type)) {
            setFile(selectedFile);
            setImageData(null);
            handleUpload(selectedFile, null);
        } else {
            setError('Please upload a valid image (PNG, JPG, or WebP)');
        }
    };

    const handlePaste = async (e: ClipboardEvent) => {
        const items = e.clipboardData?.items;
        if (!items) return;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                if (blob) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        const base64data = reader.result as string;
                        setImageData(base64data);
                        setFile(null);
                        handleUpload(null, base64data);
                    };
                    reader.readAsDataURL(blob);
                    break;
                }
            }
        }
    };

    const handleUpload = async (uploadFile: File | null, uploadImageData: string | null) => {
        setLoading(true);
        setError(null);
        const formData = new FormData();
        if (uploadFile) {
            formData.append('image', uploadFile);
        }
        if (uploadImageData) {
            formData.append('image_data', uploadImageData);
        }

        try {
            const result = await geolocateImage(formData);
            if (result.success) {
                setPredictions(result.data.predictions);
                setCoordinates(result.data.coordinates);
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to geolocate image. Please try again.');
            if (fileInputRef.current) fileInputRef.current.value = '';
        } finally {
            setLoading(false);
            setFile(null);
            setImageData(null);
        }
    };

    useEffect(() => {
        document.addEventListener('paste', handlePaste);
        return () => {
            document.removeEventListener('paste', handlePaste);
        };
    }, []);

    const markerColors = ['red', 'blue', 'green'];
    const markerIcons = ['1', '2', '3'];

    return (
        <>
            <CardHeader>
                <CardTitle
                    className={`flex items-center gap-2 text-sm text-cyan-400 md:text-lg lg:text-2xl ${fonts.sourceCodePro.className}`}
                >
                    <FaSatellite /> <span className="lg:truncate">Image Geolocator</span>
                </CardTitle>
                <Separator className="mb-3" />
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center">
                <div
                    className={`w-full place-items-center rounded-lg border-2 border-dashed p-4 text-center transition-colors duration-300 ${
                        loading
                            ? 'text-muted bg-card animate-pulse'
                            : isDragging
                              ? 'bg-accent border-cyan-400'
                              : 'bg-card hover:bg-accent border-cyan-600 hover:cursor-pointer'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    role="region"
                    aria-label="Drag and drop image upload"
                    onClick={() => {
                        if (!loading) fileInputRef.current?.click();
                    }}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png,image/jpeg,image/webp"
                        className="hidden"
                    />
                    <div className="mb-4 flex text-cyan-400">
                        {file ? (
                            <FaFileImage className="mr-2" />
                        ) : imageData ? (
                            <FaClipboard className="mr-2" />
                        ) : (
                            <FaCloudUploadAlt />
                        )}

                        {file ? (
                            file.name
                        ) : imageData ? (
                            'Image pasted from clipboard'
                        ) : (
                            <div>
                                <span className="xl:text-nowrap">Drag & Drop an image or click to upload</span>
                                <span className="mt-2 block text-sm text-gray-400">
                                    You can also press Ctrl+V to paste an image from clipboard
                                </span>
                            </div>
                        )}
                    </div>
                    {loading && (
                        <p className="mt-4 text-center text-cyan-400">
                            <i className="fas fa-spinner fa-spin mr-2"></i>
                            Analyzing image and predicting locations...
                        </p>
                    )}
                </div>
                {error && (
                    <p className="mt-4 rounded bg-red-900/20 p-2 text-center text-red-400">
                        <i className="fas fa-exclamation-circle mr-2"></i>
                        {error}
                    </p>
                )}
                {predictions.length > 0 && (
                    <>
                        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                {predictions.map((pred, index) => (
                                    <div key={index} className="rounded-lg bg-gray-900 p-4">
                                        <h3 className="flex items-center gap-2 text-cyan-400">
                                            <span
                                                className={`flex h-5 w-5 items-center justify-center rounded-full text-sm font-semibold text-white ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-blue-500' : 'bg-green-500'}`}
                                            >
                                                {index + 1}
                                            </span>
                                            {pred.location}
                                        </h3>
                                        <p className="mt-1 flex items-center text-xs text-gray-400">
                                            <FaPercentage className="mr-1" />
                                            Confidence: {parseFloat((pred.confidence * 100).toFixed(2)) * 100}%
                                        </p>
                                    </div>
                                ))}
                            </div>
                            <div className="h-96 overflow-hidden rounded-lg border border-cyan-600">
                                <MapContainer
                                    center={[0, 0]} // Default center, dynamically adjusted by MapController
                                    zoom={9}
                                    style={{ height: '100%', width: '100%' }}
                                >
                                    <TileLayer
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    />
                                    <MapController coordinates={coordinates} />
                                    {coordinates.map((coord, index) => (
                                        <Marker
                                            key={index}
                                            position={[coord.lat, coord.lon]}
                                            icon={L.divIcon({
                                                className: 'custom-icon',
                                                html: `<div style="width: 30px; height: 30px; border-radius: 50%; background-color: ${markerColors[index]}; color: white; text-align: center; line-height: 30px; font-weight: bold; font-size: 14px; box-shadow: 0 0 10px rgba(0,0,0,0.5);">${markerIcons[index]}</div>`,
                                                iconSize: [30, 30],
                                                iconAnchor: [15, 15]
                                            })}
                                        >
                                            <Popup>
                                                #{index + 1}: {predictions[index].location}
                                                <br />
                                                Confidence:{' '}
                                                {parseFloat((predictions[index].confidence * 100).toFixed(2)) * 100}%
                                            </Popup>
                                        </Marker>
                                    ))}
                                </MapContainer>
                            </div>
                        </div>
                    </>
                )}
                <p className="mt-6 text-center text-sm text-gray-400">
                    Powered by GeoCLIP: Analyzes images to predict their geographic location.
                </p>
            </CardContent>
        </>
    );
}
