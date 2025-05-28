"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NavBar } from "@/components/navbar";
import { Lightbulb, Phone, Wrench, Shield, Clock, Zap, MapPin, Mail, Star } from "lucide-react";
import ServiceRequestModal from "@/components/service-request-modal";
import Image from 'next/image';

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    serviceType: '',
    description: ''
  });

  const services = [
    {
      icon: <Lightbulb className="h-10 w-10 text-chart-1" />,
      title: "Residential Electrical",
      description: "Complete home electrical services, from repairs to installations and safety inspections"
    },
    {
      icon: <Wrench className="h-10 w-10 text-chart-2" />,
      title: "Commercial Services",
      description: "Professional electrical solutions for businesses, offices, and industrial facilities"
    },
    {
      icon: <Shield className="h-10 w-10 text-chart-3" />,
      title: "Emergency Services",
      description: "24/7 emergency electrical support when you need it most"
    },
    {
      icon: <Clock className="h-10 w-10 text-chart-4" />,
      title: "Maintenance",
      description: "Regular maintenance and safety inspections to keep your electrical systems running smoothly"
    }
  ];

  const features = [
    {
      icon: <Shield className="h-6 w-6 text-primary" />,
      title: "Licensed & Insured",
      description: "Fully licensed electrical contractor with comprehensive insurance coverage"
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: "24/7 Emergency Service",
      description: "Round-the-clock emergency support for urgent electrical issues"
    },
    {
      icon: <Star className="h-6 w-6 text-primary" />,
      title: "20+ Years Experience",
      description: "Two decades of trusted electrical service in the community"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavBar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center scroll-mt-20" id="hero">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/60 z-10" />
        
        <div className="relative z-20 px-6 lg:px-8 text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
            Your Trusted
            <span className="block text-primary">Electrical Service</span>
            Partner
          </h1>
          <p className="text-xl md:text-2xl leading-relaxed text-white/90 mb-12 max-w-3xl mx-auto">
            Professional electrical services for residential and commercial needs. 
            Available 24/7 for emergencies with over 20 years of trusted experience.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button 
              size="lg" 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-2xl hover:shadow-3xl"
            >
              Schedule Service
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-2 border-white text-white hover:bg-white hover:text-primary backdrop-blur-sm bg-white/10"
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      <ServiceRequestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        theme="dark"
      />

      {/* Services Section */}
      <section id="services" className="py-24 lg:py-32 bg-muted scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Our Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Comprehensive electrical solutions for all your needs, backed by decades of experience and professional expertise
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="bg-card hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg group"
              >
                <CardContent className="pt-8 pb-8 px-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="p-4 bg-primary/10 rounded-full group-hover:bg-primary/20 transition-colors duration-300">
                      {service.icon}
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{service.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 lg:py-32 bg-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
            {features.map((feature, index) => (
              <div key={index} className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-4">
                  <div className="p-3 bg-primary/10 rounded-full">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 lg:py-32 bg-muted scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">About One Way Electric</h2>
                <p className="text-xl leading-relaxed text-muted-foreground mb-6">
                  With over 20 years of experience, One Way Electric has been providing top-notch electrical services to homes and businesses throughout the community.
                </p>
                <p className="text-lg leading-relaxed text-muted-foreground mb-8">
                  Our licensed electricians are committed to safety, quality, and customer satisfaction. We pride ourselves on reliable service, transparent pricing, and professional workmanship that exceeds expectations.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Shield className="h-5 w-5 text-primary" />
                  <span className="font-medium">Fully Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-3">
                  <Star className="h-5 w-5 text-primary" />
                  <span className="font-medium">20+ Years of Experience</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <span className="font-medium">24/7 Emergency Service</span>
                </div>
              </div>
              <Button size="lg" className="mt-8">
                Learn More About Us
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-primary/20 to-primary/5 rounded-2xl overflow-hidden">
                <Image
                  src="/logo.svg"
                  alt="One Way Electric Logo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 lg:py-32 bg-background scroll-mt-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">Contact Us</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Available 24/7 for emergency services. Get in touch for all your electrical needs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-chart-1/10 rounded-full">
                    <Phone className="h-8 w-8 text-chart-1" />
                  </div>
                  <h3 className="text-xl font-bold">Phone</h3>
                  <p className="text-lg font-medium text-primary">(773) 710-9794</p>
                  <p className="text-sm text-muted-foreground">Call anytime for service</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-chart-2/10 rounded-full">
                    <Clock className="h-8 w-8 text-chart-2" />
                  </div>
                  <h3 className="text-xl font-bold">Hours</h3>
                  <p className="text-lg font-medium">24/7 Emergency Service</p>
                  <p className="text-sm text-muted-foreground">Mon-Fri: 8am - 6pm</p>
                </div>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-8 pb-8">
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-4 bg-chart-3/10 rounded-full">
                    <Shield className="h-8 w-8 text-chart-3" />
                  </div>
                  <h3 className="text-xl font-bold">Licensed & Insured</h3>
                  <p className="text-lg font-medium">Fully Certified</p>
                  <p className="text-sm text-muted-foreground">Professional electrical contractor</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-primary/5 rounded-2xl p-12">
            <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't wait for electrical problems to get worse. Contact us today for professional, reliable service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => setIsModalOpen(true)}>
                Schedule Service Now
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="tel:(773) 710-9794">
                  <Phone className="mr-2 h-4 w-4" />
                  Call (773) 710-9794
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary/5 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-8 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-3 rounded-lg">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <div>
                <span className="text-2xl font-bold">One Way Electric</span>
                <p className="text-sm text-muted-foreground">Professional Electrical Services</p>
              </div>
            </div>
            <div className="text-center md:text-right space-y-2">
              <p className="text-muted-foreground">
                © 2024 One Way Electric. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground">
                Licensed, Insured & Trusted Since 2004
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
