"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, CheckCircle } from "lucide-react";
import { NavBar } from '@/components/ui/navbar';

type ServiceRequest = {
  id: number;
  serviceType: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  status: 'Pending' | 'In Progress';
};

const mockRequests: ServiceRequest[] = [
  {
    id: 1,
    serviceType: "Residential Electrical",
    contactName: "John Doe",
    contactPhone: "555-123-4567",
    contactEmail: "john.doe@example.com",
    status: "Pending"
  },
  {
    id: 2,
    serviceType: "Commercial Services",
    contactName: "Jane Smith",
    contactPhone: "555-987-6543",
    contactEmail: "jane.smith@example.com",
    status: "Pending"
  }
];

export default function AdminPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);

  useEffect(() => {
    setRequests(mockRequests);
  }, []);

  const handleApprove = (requestId: number) => {
    setRequests((prev) =>
      prev.map((req) =>
        req.id === requestId ? { ...req, status: 'In Progress' } : req
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <NavBar></NavBar>
      <h1 className="text-4xl font-extrabold mb-10 text-center text-primary">Admin Service Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((req) => (
          <Card key={req.id} className="bg-card shadow-xl rounded-2xl hover:shadow-2xl transition-shadow">
            <CardContent className="p-6 flex flex-col gap-4">
              <div className="text-center">
                <h2 className="text-xl font-semibold text-primary mb-2">{req.serviceType}</h2>
                <p className="text-muted-foreground">Requested by {req.contactName}</p>
              </div>

              <div className="flex justify-center gap-4 text-sm">
                <a href={`tel:${req.contactPhone}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                  <Phone className="h-4 w-4" /> {req.contactPhone}
                </a>
                <a href={`mailto:${req.contactEmail}`} className="flex items-center gap-1 text-blue-600 hover:underline">
                  <Mail className="h-4 w-4" /> {req.contactEmail}
                </a>
              </div>

              <div className="text-center mt-2">
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {req.status}
                </span>
              </div>

              {req.status !== 'In Progress' && (
                <Button onClick={() => handleApprove(req.id)} className="mt-4 w-full bg-primary hover:bg-primary/90">
                  <CheckCircle className="h-4 w-4 mr-2" /> Approve
                </Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
