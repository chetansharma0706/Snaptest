import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental:{
    serverActions:{
      allowedOrigins:[
        "localhost:3000"
        ,"https://ubiquitous-space-computing-machine-pjj54pxvjq54hg9q-3000.app.github.dev"]
    }
  }
  
};

export default nextConfig;
