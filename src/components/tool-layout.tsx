'use client';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import './tool-pages.css';

export default function ToolLayout({ label, title, description, children }: { label: string; title: string; description: string; children: React.ReactNode }) {
  return <main className="tool-page">
    <header className="tool-header">
      <Link href="/"><Image src="/brand/akacons-logo.png" alt="AKACONS" width={1680} height={645} priority /></Link>
      <Link href="/"><ArrowLeft size={17}/> Về website</Link>
    </header>
    <section className="tool-hero"><small>{label}</small><h1>{title}</h1><p>{description}</p></section>
    {children}
  </main>;
}
