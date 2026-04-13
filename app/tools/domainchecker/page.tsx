'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@components/ui/card';
import DomainCheckerModal from '@/components/modals/DomainCheckerModal';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { getLinks } from '@/lib/utils';
import { HNButton } from '@/components/ui/custom-button';

interface LinkData {
    url: string;
    description: string;
}

export default function DomainChecker() {
    const [domain, setDomain] = useState<string>('');
    const [linksData, setLinksData] = useState<LinkData[]>([]);
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    const cleanDomain = (input: string): string => {
        return input.replace(/(^\w+:|^)\/\//, '');
    };

    const generateLinks = () => {
        if (domain) {
            const cleanedDomain = cleanDomain(domain);
            // Validate the cleaned domain
            const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!domainPattern.test(cleanedDomain)) {
                setError('Incorrect domain entered');
                setLoading(false);
                return;
            }
            setError(''); // Clear any previous error
            setLoading(true); // Set loading state to true
            setLinksData([]); // Clear previous links

            setTimeout(() => {
                const links = getLinks(cleanedDomain);
                setLinksData(links);
                setModalIsOpen(true);
                setLoading(false);
            }, 1000);
        } else {
            setError('Please enter a valid domain.');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading) {
            e.preventDefault();
            if (debounceTimeout.current) {
                clearTimeout(debounceTimeout.current);
            }
            debounceTimeout.current = setTimeout(generateLinks, 300); // Debounce for 300ms
        }
    };

    return (
        <div className="flex items-center justify-center">
            <div className="w-full max-w-lg px-4">
                <Card className="bg-card">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg">Domain Checker</CardTitle>
                        <CardDescription>Enter the url without http:// or https://</CardDescription>
                    </CardHeader>
                    <CardContent className="gap-2 text-left">
                        <Label htmlFor="domain" className="pb-1">
                            Domain
                        </Label>
                        <Input
                            id="domain"
                            placeholder="Enter domain..."
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <p className={`text-red-500 ${!error && 'invisible'}`}>{error}</p>
                    </CardContent>
                    <CardFooter className="justify-center">
                        {loading ? (
                            <HNButton variant="outline" type="button">
                                <LoadingSpinner />
                            </HNButton>
                        ) : (
                            <HNButton variant="outline" className="cursor-pointer" onClick={generateLinks}>
                                Generate Links
                            </HNButton>
                        )}
                    </CardFooter>
                </Card>
            </div>
            <DomainCheckerModal
                isOpen={modalIsOpen}
                linksData={linksData ?? []}
                onRequestClose={() => {
                    setModalIsOpen(false);
                }}
            />
        </div>
    );
}
