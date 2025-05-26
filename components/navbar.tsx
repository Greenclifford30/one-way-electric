'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Phone, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-background/95 backdrop-blur-md border-b shadow-lg' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between py-4 px-4 sm:px-8">
        {/* Logo and Site Name */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Image
              src="/logo.svg"
              alt="One Way Electric Logo"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <span className={`text-xl font-bold transition-colors ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}>
            One Way Electric
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <Link 
            href="#services" 
            className={`text-sm font-medium transition-colors hover:text-primary/80 ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Services
          </Link>
          <Link 
            href="#about" 
            className={`text-sm font-medium transition-colors hover:text-primary/80 ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            About
          </Link>
          <Link 
            href="#contact" 
            className={`text-sm font-medium transition-colors hover:text-primary/80 ${
              isScrolled ? 'text-primary' : 'text-white'
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Call Button */}
        <Button 
          asChild 
          className="hidden md:inline-flex bg-primary hover:bg-primary/90 text-white shadow-lg hover:shadow-xl transition-all duration-300"
        >
          <a href="tel:(773) 710-9794" aria-label="Call One Way Electric">
            <Phone className="mr-2 h-4 w-4" />
            (773) 710-9794
          </a>
        </Button>

        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className={`h-6 w-6 ${isScrolled ? 'text-primary' : 'text-white'}`} />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64">
            <div className="flex flex-col space-y-6 mt-8">
              <Link 
                href="#services" 
                className="text-primary hover:text-primary/80 text-lg font-medium transition-colors"
              >
                Services
              </Link>
              <Link 
                href="#about" 
                className="text-primary hover:text-primary/80 text-lg font-medium transition-colors"
              >
                About
              </Link>
              <Link 
                href="#contact" 
                className="text-primary hover:text-primary/80 text-lg font-medium transition-colors"
              >
                Contact
              </Link>
              <Button asChild className="mt-6 w-full">
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
