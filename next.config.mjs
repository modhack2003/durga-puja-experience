/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'node:url'
const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  turbopack: { root: fileURLToPath(new URL('.', import.meta.url)) },
  devIndicators: false,
}
export default nextConfig
