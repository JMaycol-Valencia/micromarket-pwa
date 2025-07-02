import type React from "react";
import type { Metadata } from "next/dist/types";
import "./globals.css";


export const metadata: Metadata = {
  title: "Sistema de Ventas - Micromercado",
  description: "Sistema completo de gestión para micromercados",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon-192x192.png" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
