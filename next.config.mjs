// @ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'hacknex.io',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: '*.hacknex.io',
                pathname: '**'
            },
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                pathname: '**'
            }
        ]
    },
    cleanDistDir: true,
    reactStrictMode: true,
    experimental: {
        serverActions: {
            bodySizeLimit: '50mb'
        }
    }
};

export default nextConfig;
