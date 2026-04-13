'use client';

import { capitalize } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from './ui/breadcrumb';
import Link from 'next/link';
import { fonts } from './fonts';
import { FaSlash } from 'react-icons/fa';

export default function ToolsBreadcrumb() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(segment => segment);

    // Get the current tool name from the last segment and capitalize it
    const currentTool =
        pathSegments.length > 1 ? capitalize(pathSegments[pathSegments.length - 1].replace(/-/g, ' ')) : '';

    return (
        <Breadcrumb className="mb-6 flex flex-col items-center justify-center">
            <BreadcrumbList
                className={`bg-card rounded-xl px-4 py-2 text-2xl font-bold text-sky-400 shadow-md ${fonts.jetBrainsMono.className}`}
            >
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link href="/tools">Tools</Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                {currentTool && (
                    <>
                        <BreadcrumbSeparator>
                            <FaSlash />
                        </BreadcrumbSeparator>
                        <BreadcrumbItem>{currentTool}</BreadcrumbItem>
                    </>
                )}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
