import type { Metadata } from 'next';
import { IBM_Plex_Mono, Manrope, Space_Grotesk } from 'next/font/google';
import '@/styles/globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Contecsa - Sistema de Inteligencia de Datos',
  description: 'Agente IA conversacional + Dashboard para gestion de compras y proyectos',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${plexMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
