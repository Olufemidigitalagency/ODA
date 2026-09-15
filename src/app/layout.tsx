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
    <html lang="en" className="dark scroll-smooth">
      <body className="bg-[#09090b] text-white antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
