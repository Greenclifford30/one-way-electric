// components/NavBar.tsx
import Image from 'next/image'
import { Button } from "@/components/ui/button";
import { Phone } from 'lucide-react'
import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="flex items-center justify-between py-6">
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="One Way Electric Logo"
          width={48}
          height={48}
          className="object-contain"
        />
        <span className="ml-2 text-2xl font-bold text-primary">
          One Way Electric
        </span>

      </div>
      <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-primary hover:text-primary/80">Services</a>
              <a href="#about" className="text-primary hover:text-primary/80">About</a>
              <a href="#contact" className="text-primary hover:text-primary/80">Contact</a>
              <Link
                  href="/admin"
                  className="text-primary hover:text-primary/80"
                >
                  Admin
              </Link>
            </div>
            <Button className="hidden md:block">
              <Phone className="mr-2 h-4 w-4" /> (555) 123-4567
            </Button>
    </nav>
  )
}
