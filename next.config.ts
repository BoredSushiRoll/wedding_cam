import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bypasses the local LAN firewall for your phone
  allowedDevOrigins: ['192.168.0.89']
};

export default nextConfig;
