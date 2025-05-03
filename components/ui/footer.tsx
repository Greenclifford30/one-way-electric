// components/Footer.tsx
import Image from 'next/image'
import { /* other imports */ } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-background py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center">
            <Image
              src="/logo.png"
              alt="One Way Electric Logo"
              width={48}
              height={48}
              className="object-contain"
            />
            <span className="ml-2 text-2xl font-bold">
              One Way Electric
            </span>
          </div>
          {/* ...rest of your footer content... */}
        </div>
      </div>
    </footer>
  )
}
