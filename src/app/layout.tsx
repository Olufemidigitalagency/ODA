import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en" className="light scroll-smooth">
      <body className="bg-white text-zinc-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
