import Image from 'next/image';
import { Phone, Menu } from 'lucide-react';
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="flex items-center justify-between py-6 px-4 sm:px-8" role="navigation" aria-label="Main navigation">
      <div className="flex items-center">
        <Link href="/" className="flex items-center hover:opacity-80">
          <Image
            src="/logo.png"
            alt="One Way Electric Logo"
            width={48}
            height={48}
            className="object-contain"
          />
          <span className="ml-2 text-2xl font-bold text-primary">One Way Electric</span>
        </Link>
      </div>

      <div className="hidden md:flex space-x-6">
        <a href="#services" className="text-primary hover:text-primary/80 transition-colors">Services</a>
        <a href="#about" className="text-primary hover:text-primary/80 transition-colors">About</a>
        <a href="#contact" className="text-primary hover:text-primary/80 transition-colors">Contact</a>
        <Link href="/admin" className="text-primary hover:text-primary/80 transition-colors">
          Admin
        </Link>
      </div>

      <a
        href="tel:(773) 710-9794"
        className="hidden md:inline-flex items-center bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/90 transition-colors"
        aria-label="Call One Way Electric"
      >
        <Phone className="mr-2 h-4 w-4" /> (773) 710-9794
      </a>

      {/* Mobile hamburger icon placeholder (ready for future expansion) */}
      <button className="md:hidden p-2 text-primary hover:text-primary/80 focus:outline-none focus:ring-2 focus:ring-primary rounded" aria-label="Open menu">
        <Menu className="h-6 w-6" />
      </button>
    </nav>
  );
}
