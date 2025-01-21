import { BaseUrl as BackendHost } from "@/constants/api-constants";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["res.cloudinary.com", "localhost", BackendHost],
  },
};

export default nextConfig;
