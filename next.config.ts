/* eslint-disable @typescript-eslint/no-require-imports */
// No uses el tipo NextConfig aquí
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Otras opciones de configuración aquí si las tienes
}

module.exports = withPWA(nextConfig)