/** @type {import('next').NextConfig} */
const nextConfig = {
  // Environment variables
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  },

  // ✅ REMOVED: output: 'standalone' - can cause deployment issues on Vercel
  
  // ✅ SIMPLIFIED: Experimental features
  experimental: {
    optimizeCss: false, // Disable to prevent build issues
  },

  // ✅ FIXED: Image configuration
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "http",
        hostname: "blog-page-panel.onrender.com",
      },
      {
        protocol: "https",
        hostname: "imgur.com",
      },
      {
        protocol: "https",
        hostname: "i.imgur.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    domains: [
      "i.imgur.com",
      "imgur.com",
      "blog-page-panel.onrender.com",
      "images.unsplash.com",
      "plus.unsplash.com",
      "res.cloudinary.com",
    ],
  },

  // ✅ FIXED: Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // ✅ REMOVED: Complex webpack configuration that was causing issues

  // ✅ FIXED: Headers for proper caching
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/:path*.(jpg|jpeg|gif|png|svg|webp|avif|ico|css|js)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/site.webmanifest",
        headers: [
          {
            key: "Content-Type",
            value: "application/manifest+json",
          },
          {
            key: "Cache-Control",
            value: "public, max-age=86400",
          },
        ],
      },
    ];
  },

  // ✅ FIXED: Rewrites
  async rewrites() {
    return [
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap.xml",
      },
      {
        source: "/robots.txt",
        destination: "/api/robots.txt",
      },
      {
        source: "/",
        has: [
          {
            type: "host",
            value: "dashboard.connectingdotserp.com",
          },
        ],
        destination: "/dashboard",
      },
    ];
  },

  // ✅ FIXED: Redirects
  async redirects() {
    return [
      {
        source: "/hr-courses-training-institute-in-pune",
        destination: "/hr-training-course-in-pune",
        permanent: true,
      },
    ];
  },

  // ✅ REMOVED: Invalid options that were causing errors
  // swcMinify: true, // Enabled by default in Next.js 15
  // generateStaticParams: true, // Not a valid config option
  // poweredByHeader: false, // Disabled by default
  // reactStrictMode: true, // Should be set in layout
  // assetPrefix: undefined, // Not needed
  // trailingSlash: false, // Default value
};

export default nextConfig;