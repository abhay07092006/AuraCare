/** @type {import('next').NextConfig} */
const isGithubActions = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_EXPORT === 'true';

const nextConfig = {
  ...(isGithubActions ? {
    output: 'export',
    basePath: '/AuraCare',
    assetPrefix: '/AuraCare',
    images: { unoptimized: true },
  } : {}),
};

export default nextConfig;
