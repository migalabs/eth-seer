/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX ? `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/` : undefined,
};

module.exports = nextConfig;
