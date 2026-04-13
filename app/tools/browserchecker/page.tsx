'use client';

import BrowserCheckerModal from '@/components/modals/BrowserCheckerModal';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { HNButton } from '@/components/ui/custom-button';
import { BrowserInfo } from '@/types/toolTypes';
import { useState } from 'react';

export default function BrowserChecker() {
    const [browserInfo, setBrowserInfo] = useState<BrowserInfo[]>([]);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const getOSVersionFromUserAgent = () => {
        const userAgent = navigator.userAgent;
        const osRegex = /Windows NT (\d+\.\d+)/;
        const match = userAgent.match(osRegex);
        return match ? `Windows NT ${match[1]}` : 'Unknown OS';
    };

    const getBrowserInfo = () => {
        // GPU Information Using WebGL
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl');
        if (gl) {
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            const vendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Not Available';
            const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Not Available';
            const unmaskedVendor = debugInfo ? gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) : 'Not Available';
            const unmaskedRenderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Not Available';
            const gpu = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'Not Available';

            return {
                vendor: vendor,
                renderer: renderer,
                unmaskedVendor: unmaskedVendor,
                unmaskedRenderer: unmaskedRenderer,
                gpu: gpu
            };
        } else {
            return {
                vendor: 'Not Available',
                renderer: 'Not Available',
                unmaskedVendor: 'Not Available',
                unmaskedRenderer: 'Not Available',
                gpu: 'Not Available'
            };
        }
    };

    const displayBrowserInfo = () => {
        setIsAnalyzing(true);
        const info: BrowserInfo[] = [];

        setTimeout(() => {
            // Browser and Operating System
            info.push({ key: 'Browser Version', value: navigator.userAgent });
            info.push({ key: 'Operating System', value: navigator.platform });
            // Operating System Version (from User-Agent)
            info.push({ key: 'Operating System Version', value: getOSVersionFromUserAgent() });

            // Screen Size and Device Pixel Ratio
            info.push({ key: 'Screen Size', value: `${screen.width}x${screen.height}` });
            info.push({
                key: 'Device Pixel Ratio',
                value: window.devicePixelRatio
            });
            // Battery Status
            (navigator as any).getBattery().then((battery: any) => {
                info.push({ key: 'Battery Level', value: `${Math.round(battery.level * 100)}%` });
                info.push({ key: 'Battery Charging', value: battery.charging ? 'Yes' : 'No' });
            });

            // Browser Information Using WebGL
            const {
                vendor: vendor,
                renderer: renderer,
                unmaskedVendor: unmaskedVendor,
                unmaskedRenderer: unmaskedRenderer,
                gpu: gpu
            } = getBrowserInfo();
            info.push({ key: 'Vendor', value: vendor });
            info.push({ key: 'Renderer', value: renderer });
            info.push({ key: 'Unmasked Vendor', value: unmaskedVendor });
            info.push({ key: 'Unmasked Renderer', value: unmaskedRenderer });
            info.push({ key: 'Graphics Card', value: gpu });

            // Device Orientation
            info.push({ key: 'Device Orientation', value: screen.orientation.type });

            // Zoom Level (Approximation)
            info.push({ key: 'Zoom Level', value: `${Math.round(window.devicePixelRatio * 100)}%` });

            // Number of CPU Cores
            info.push({ key: 'CPU Cores', value: navigator.hardwareConcurrency });

            // Time Zone
            info.push({ key: 'Time Zone', value: Intl.DateTimeFormat().resolvedOptions().timeZone });

            setBrowserInfo(info);
            setIsAnalyzing(false);
            setModalIsOpen(true);
        }, 1000);
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-lg px-4">
                <Card className="bg-card">
                    <CardHeader className="text-center">
                        <CardTitle>Browser Checker</CardTitle>
                        <CardDescription>
                            The info below is shown to ensure you know what the target website might log about you.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-left">
                        <div className="text-center text-xl">
                            <p className="text-xl font-bold underline">DISCLAIMER</p>
                            <p className="font-bold">NOTHING SHOWN IS STORED.</p>
                        </div>
                    </CardContent>
                    <CardFooter className="justify-center">
                        <HNButton
                            variant="outline"
                            className={`${isAnalyzing ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            onClick={displayBrowserInfo}
                            disabled={isAnalyzing}
                        >
                            {isAnalyzing ? 'Checking Browser...' : 'Check Browser Info'}
                        </HNButton>
                    </CardFooter>
                </Card>
            </div>
            <BrowserCheckerModal
                isOpen={modalIsOpen}
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
                browserInfo={browserInfo}
            />
        </div>
    );
}
