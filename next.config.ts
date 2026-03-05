import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export para Vercel (ou usar serverless se preferir)
  output: 'export',
  distDir: 'dist',
  
  // Desabilitar otimização de imagens (não funciona em static export)
  images: {
    unoptimized: true,
  },
  
  // Configurações de trailing slash
  trailingSlash: true,
};

export default nextConfig;
