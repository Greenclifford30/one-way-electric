'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function NavBar() {
  return (
    <header className="bg-background border-b">
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-8">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center gap-2 hover:opacity-80">
          <Image
            src="/logo.png"
            alt="One Way Electric Logo"
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="text-xl font-bold text-primary">One Way Electric</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="#services" className="text-sm font-medium text-primary hover:text-primary/80">
            Services
          </Link>
          <Link href="#about" className="text-sm font-medium text-primary hover:text-primary/80">
            About
          </Link>
          <Link href="#contact" className="text-sm font-medium text-primary hover:text-primary/80">
            Contact
          </Link>
        </nav>

        {/* Call Button */}
        <Button asChild className="hidden md:inline-flex">
          <a href="tel:(773) 710-9794" aria-label="Call One Way Electric">
            <Phone className="mr-2 h-4 w-4" />
            (773) 710-9794
          </a>
        </Button>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6 text-primary" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col space-y-4 mt-8">
              <Link href="#services" className="text-primary hover:text-primary/80">
                Services
              </Link>
              <Link href="#about" className="text-primary hover:text-primary/80">
                About
              </Link>
              <Link href="#contact" className="text-primary hover:text-primary/80">
                Contact
              </Link>
              <Button asChild className="mt-4">
                <a href="tel:(773) 710-9794">
                  <Phone className="mr-2 h-4 w-4" />
                  (773) 710-9794
                </a>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
