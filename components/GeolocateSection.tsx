'use client';
import dynamic from 'next/dynamic';
import { FaSatellite } from 'react-icons/fa';
import { fonts } from './fonts';

// Dynamically import Geolocate to prevent server-side rendering
const Geolocate = dynamic(() => import('@/components/Geolocate'), {
    ssr: false,
    loading: () => (
        <div className="bg-card/80 w-full max-w-4xl animate-pulse shadow-lg">
            <div className="p-6">
                <h2 className={`flex items-center gap-2 text-2xl text-cyan-400 ${fonts.sourceCodePro.className}`}>
                    <FaSatellite /> <span className="truncate">Image Geolocator</span>
                </h2>
                <div className="mt-4 h-44 rounded-lg bg-slate-800" />
                <div className="mt-6"></div>
            </div>
        </div>
    )
});

export default function GeolocateSection() {
    return <Geolocate />;
}
