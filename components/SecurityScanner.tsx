'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@components/ui/card';
import { LoadingSpinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SecurityData {
    whois?: { registrar: string; created: string; expires: string };
    dns?: { a: string[]; mx: string[]; ns: string[] };
    subdomains?: string[];
    security?: { virusTotal: { malicious: number }; shodan: { openPorts: number[] } };
}

interface ApiError {
    message: string;
}

const fetchSecurityData = async (domain: string): Promise<{ data: SecurityData; error: ApiError | null }> => {
    const cleanedDomain = domain.replace(/(^\w+:|^)\/\//, '');
    const result: SecurityData = {};
    let error: ApiError | null = null;

    try {
        // WHOIS API
        if (process.env.NEXT_PUBLIC_WHOIS_API_KEY) {
            const whoisResponse = await fetch(`https://api.whois.com/v1/whois?domain=${cleanedDomain}`, {
                headers: { Authorization: `Bearer ${process.env.NEXT_PUBLIC_WHOIS_API_KEY}` }
            });
            if (whoisResponse.ok) {
                const whoisData = await whoisResponse.json();
                result.whois = {
                    registrar: whoisData.registrar || 'N/A',
                    created: whoisData.created || 'N/A',
                    expires: whoisData.expires || 'N/A'
                };
            }
        }

        // DNS API (SecurityTrails)
        if (process.env.NEXT_PUBLIC_SECURITYTRAILS_API_KEY) {
            const dnsResponse = await fetch(`https://api.securitytrails.com/v1/domain/${cleanedDomain}/dns`, {
                headers: { APIKEY: process.env.NEXT_PUBLIC_SECURITYTRAILS_API_KEY }
            });
            if (dnsResponse.ok) {
                const dnsData = await dnsResponse.json();
                result.dns = {
                    a: dnsData.a_records || [],
                    mx: dnsData.mx_records || [],
                    ns: dnsData.ns_records || []
                };
            }

            const subdomainsResponse = await fetch(
                `https://api.securitytrails.com/v1/domain/${cleanedDomain}/subdomains`,
                { headers: { APIKEY: process.env.NEXT_PUBLIC_SECURITYTRAILS_API_KEY } }
            );
            if (subdomainsResponse.ok) {
                const subdomainsData = await subdomainsResponse.json();
                result.subdomains = subdomainsData.subdomains || [];
            }
        }

        // Security Scan (VirusTotal + Shodan)
        if (process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY && process.env.NEXT_PUBLIC_SHODAN_API_KEY) {
            const vtResponse = await fetch(`https://www.virustotal.com/api/v3/domains/${cleanedDomain}`, {
                headers: { 'x-apikey': process.env.NEXT_PUBLIC_VIRUSTOTAL_API_KEY }
            });
            const shodanResponse = await fetch(
                `https://api.shodan.io/dns/domain/${cleanedDomain}?key=${process.env.NEXT_PUBLIC_SHODAN_API_KEY}`
            );
            if (vtResponse.ok && shodanResponse.ok) {
                const vtData = await vtResponse.json();
                const shodanData = await shodanResponse.json();
                result.security = {
                    virusTotal: { malicious: vtData.data.attributes.last_analysis_stats.malicious || 0 },
                    shodan: { openPorts: shodanData.ports || [] }
                };
            }
        }
    } catch (err) {
        error = { message: 'Failed to fetch security data. Please try again later.' };
    }

    return { data: result, error };
};

export default function SecurityScanner() {
    const [domain, setDomain] = useState<string>('');
    const [securityData, setSecurityData] = useState<SecurityData>({});
    const [error, setError] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

    const cleanDomain = (input: string): string => {
        return input.replace(/(^\w+:|^)\/\//, '');
    };

    const scanDomain = async () => {
        if (domain) {
            const cleanedDomain = cleanDomain(domain);
            const domainPattern = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!domainPattern.test(cleanedDomain)) {
                setError('Invalid domain entered');
                return;
            }
            setError('');
            setLoading(true);
            setSecurityData({});

            const { data, error } = await fetchSecurityData(cleanedDomain);
            setSecurityData(data);
            if (error) {
                setError(error.message);
            }
            setLoading(false);
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
            debounceTimeout.current = setTimeout(scanDomain, 300);
        }
    };

    return (
        <div className="flex grow flex-col">
            <div className="mt-8 flex flex-col items-center justify-center">
                <Card className="w-1/2 bg-card/90">
                    <CardHeader className="text-center">
                        <CardTitle className="text-lg">Security Scanner</CardTitle>
                        <CardDescription>Enter a domain to scan for security and pentesting insights</CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-2 text-left">
                        <Label htmlFor="domain">Domain</Label>
                        <Input
                            id="domain"
                            placeholder="e.g., example.com"
                            value={domain}
                            onChange={e => setDomain(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        {error && (
                            <Alert variant="destructive">
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                    <CardFooter className="justify-center">
                        {loading ? (
                            <Button variant="outline" type="button">
                                <LoadingSpinner />
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={scanDomain}>
                                Scan Domain
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
            {Object.keys(securityData).length > 0 && (
                <div className="mx-auto mt-8 w-3/4">
                    <Tabs defaultValue="whois" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                            <TabsTrigger value="whois">WHOIS</TabsTrigger>
                            <TabsTrigger value="dns">DNS</TabsTrigger>
                            <TabsTrigger value="subdomains">Subdomains</TabsTrigger>
                            <TabsTrigger value="security">Security</TabsTrigger>
                        </TabsList>
                        <TabsContent value="whois">
                            <Card>
                                <CardHeader>
                                    <CardTitle>WHOIS Information</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {securityData.whois ? (
                                        <div className="space-y-2">
                                            <p>
                                                <strong>Registrar:</strong> {securityData.whois.registrar}
                                            </p>
                                            <p>
                                                <strong>Created:</strong> {securityData.whois.created}
                                            </p>
                                            <p>
                                                <strong>Expires:</strong> {securityData.whois.expires}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>No WHOIS data available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="dns">
                            <Card>
                                <CardHeader>
                                    <CardTitle>DNS Records</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {securityData.dns ? (
                                        <div className="space-y-2">
                                            <p>
                                                <strong>A Records:</strong> {securityData.dns.a.join(', ') || 'None'}
                                            </p>
                                            <p>
                                                <strong>MX Records:</strong> {securityData.dns.mx.join(', ') || 'None'}
                                            </p>
                                            <p>
                                                <strong>NS Records:</strong> {securityData.dns.ns.join(', ') || 'None'}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>No DNS data available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="subdomains">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Subdomains</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {securityData.subdomains && securityData.subdomains.length > 0 ? (
                                        <ul className="list-disc pl-5">
                                            {securityData.subdomains.map((sub, index) => (
                                                <li key={index}>
                                                    {sub}.{cleanDomain(domain)}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No subdomains found.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="security">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Security Scans</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {securityData.security ? (
                                        <div className="space-y-2">
                                            <p>
                                                <strong>VirusTotal Malicious Reports:</strong>{' '}
                                                {securityData.security.virusTotal.malicious}
                                            </p>
                                            <p>
                                                <strong>Shodan Open Ports:</strong>{' '}
                                                {securityData.security.shodan.openPorts.join(', ') || 'None'}
                                            </p>
                                        </div>
                                    ) : (
                                        <p>No security scan data available.</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            )}
        </div>
    );
}
