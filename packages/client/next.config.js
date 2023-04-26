/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    assetPrefix: process.env.NEXT_PUBLIC_ASSET_PREFIX ? `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/` : undefined,
    basePath: process.env.NEXT_PUBLIC_ASSET_PREFIX || undefined,
	output: 'standalone', //PROD: https://nextjs.org/docs/advanced-features/output-file-tracing
};

module.exports = nextConfig;
