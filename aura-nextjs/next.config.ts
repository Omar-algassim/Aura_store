import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "res.cloudinary.com",
      "localhost",
      process.env.SERVER_HOST_NAME || "192.168.8.7",
    ],
  },
};

import removeImports from "next-remove-imports";
export default removeImports()(nextConfig);
