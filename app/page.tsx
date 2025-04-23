"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb, Phone, Wrench, Shield, Clock, Zap } from "lucide-react";
import { useState } from "react";

export default function Home() {
  const services = [
    {
      icon: <Lightbulb className="h-8 w-8 text-chart-1" />,
      title: "Residential Electrical",
      description: "Complete home electrical services, from repairs to installations"
    },
    {
      icon: <Wrench className="h-8 w-8 text-chart-2" />,
      title: "Commercial Services",
      description: "Professional electrical solutions for businesses"
    },
    {
      icon: <Shield className="h-8 w-8 text-chart-3" />,
      title: "Emergency Services",
      description: "24/7 emergency electrical support"
    },
    {
      icon: <Clock className="h-8 w-8 text-chart-4" />,
      title: "Maintenance",
      description: "Regular maintenance and safety inspections"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div 
          className="absolute inset-0 bg-cover bg-center z-0"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80')",
            filter: "brightness(0.3)"
          }}
        />
        <div className="relative z-10 px-6 lg:px-8">
          <nav className="flex items-center justify-between py-6">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold text-primary">One Way Electric</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#services" className="text-primary hover:text-primary/80">Services</a>
              <a href="#about" className="text-primary hover:text-primary/80">About</a>
              <a href="#contact" className="text-primary hover:text-primary/80">Contact</a>
            </div>
            <Button className="hidden md:block">
              <Phone className="mr-2 h-4 w-4" /> (555) 123-4567
            </Button>
          </nav>

          <div className="mx-auto max-w-3xl py-32 sm:py-48">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-6xl">
                Your Trusted Electrical Service Partner
              </h1>
              <p className="mt-6 text-lg leading-8 text-primary/80">
                Professional electrical services for residential and commercial needs. Available 24/7 for emergencies.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button size="lg">Schedule Service</Button>
                <Button variant="outline" size="lg">Learn More</Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div id="services" className="py-24 bg-muted">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Services</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Comprehensive electrical solutions for all your needs
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((service, index) => (
              <Card key={index} className="bg-card">
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    {service.icon}
                    <h3 className="mt-4 text-lg font-semibold">{service.title}</h3>
                    <p className="mt-2 text-muted-foreground">{service.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* About Section */}
      <div id="about" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About One Way Electric</h2>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                With over 20 years of experience, One Way Electric has been providing top-notch electrical services to homes and businesses. Our licensed electricians are committed to safety, quality, and customer satisfaction.
              </p>
              <div className="mt-8">
                <Button>Learn More About Us</Button>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2069&q=80"
                alt="Electrician at work"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-muted py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Available 24/7 for emergency services
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Phone className="h-8 w-8 text-chart-1" />
                  <h3 className="mt-4 text-lg font-semibold">Phone</h3>
                  <p className="mt-2">(555) 123-4567</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Clock className="h-8 w-8 text-chart-2" />
                  <h3 className="mt-4 text-lg font-semibold">Hours</h3>
                  <p className="mt-2">24/7 Emergency Service</p>
                  <p>Mon-Fri: 8am - 6pm</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Shield className="h-8 w-8 text-chart-3" />
                  <h3 className="mt-4 text-lg font-semibold">Licensed & Insured</h3>
                  <p className="mt-2">Fully licensed electrical contractor</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center">
              <Zap className="h-8 w-8 text-primary" />
              <span className="ml-2 text-2xl font-bold">One Way Electric</span>
            </div>
            <div className="mt-8 md:mt-0">
              <p className="text-center md:text-right text-muted-foreground">
                © 2024 One Way Electric. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}