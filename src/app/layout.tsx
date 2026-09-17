import type { Metadata } from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'ODA — Olufemi Digital Agency',
  description: 'High-contrast luxury creative agency crafting bespoke photography, videography, content creation, and graphic design.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/logo-circle.png',
    apple: '/logo-circle.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable} light scroll-smooth`}>
      <body className="bg-white text-zinc-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
