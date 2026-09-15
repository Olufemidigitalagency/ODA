'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center justify-center p-6 text-center">
      <span className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">404 ERROR</span>
      <h1 className="text-6xl font-black uppercase text-white tracking-tight mb-4">PAGE NOT FOUND</h1>
      <p className="text-zinc-400 text-sm font-light max-w-md mb-8">
        The requested page could not be located. Return to the home experience below.
      </p>
      <Link
        href="/"
        className="px-8 py-3.5 rounded-full bg-white text-black font-semibold text-xs uppercase tracking-wider hover:bg-zinc-200 transition-colors shadow-lg"
      >
        Back to Home
      </Link>
    </div>
  );
}
