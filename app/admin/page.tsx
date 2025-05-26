"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { NavBar } from "@/components/navbar";
import RequestCard from "@/components/request-card";
import { Lightbulb, Wrench, Shield, Clock, Zap, AlertTriangle } from "lucide-react";

type Status = 'Pending' | 'In Progress' | 'Scheduled' | 'Denied' | 'Completed';

type ServiceRequest = {
  id: string;
  serviceType: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  status: Status;
  description: string;
  requestedAt: string;
  isEmergency?: boolean;
  technician?: string;
};

type ApiServiceRequest = {
  customerPhone: string;
  customerName: string;
  requestedAt: string;
  status: string;
  assignedTechnician: string;
  serviceId: string;
  SK: string;
  customerEmail: string;
  description: string;
  PK: string;
  serviceType: string;
};

const allStatuses: Status[] = ['Pending', 'In Progress', 'Scheduled', 'Completed', 'Denied'];

export default function AdminPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch("/api/get-service-requests");
        const data: { success: boolean; requests: ApiServiceRequest[] } = await res.json();

        const mappedRequests: ServiceRequest[] = data.requests.map((item, index) => ({
          id: item.serviceId || String(index),
          serviceType: item.serviceType || "Unknown",
          customerName: item.customerName,
          customerPhone: item.customerPhone,
          customerEmail: item.customerEmail,
          status: item.status as Status,
          description: item.description,
          requestedAt: item.requestedAt,
          isEmergency: item.serviceType?.toLowerCase().includes("emergency"),
          technician: item.assignedTechnician || undefined,
        }));

        setRequests(mappedRequests);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const updateStatus = (id: string, status: Status) => {
    setRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status } : req))
    );
  };

  const sendQuote = (id: string) => {
    const req = requests.find((r) => r.id === id);
    if (!req) return;
    const subject = encodeURIComponent(`Quote for ${req.serviceType}`);
    const body = encodeURIComponent(`Hello ${req.customerName},\n\nHere is the quote for your requested service: ${req.serviceType}.\n\nThanks,\nOne Way Electric`);
    window.location.href = `mailto:${req.customerEmail}?subject=${subject}&body=${body}`;
  };

  const filteredRequests = requests.filter((r) =>
    (serviceFilter === "All" || r.serviceType === serviceFilter) &&
    (statusFilter === "All" || r.status === statusFilter)
  );

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      <p className="mt-4 text-lg text-muted-foreground">Loading service requests...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <AlertTriangle className="h-12 w-12 text-red-500" />
      <p className="mt-4 text-lg text-red-600">Error: {error}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-6">
      <NavBar />
      <h1 className="text-4xl font-bold text-center my-8 text-primary">Admin Service Dashboard</h1>

      {/* Status Tabs */}
      <Tabs defaultValue="All" className="mb-6">
        <TabsList className="flex flex-wrap justify-center">
          <TabsTrigger value="All" onClick={() => setStatusFilter('All')}>All</TabsTrigger>
          {allStatuses.map((status) => (
            <TabsTrigger key={status} value={status} onClick={() => setStatusFilter(status)}>
              {status}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Service Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-6">
        <Button onClick={() => setServiceFilter('All')} variant={serviceFilter === 'All' ? 'default' : 'outline'}>All Services</Button>
        {[...new Set(requests.map((r) => r.serviceType))].map((type) => (
          <Button
            key={type}
            onClick={() => setServiceFilter(type)}
            variant={serviceFilter === type ? 'default' : 'outline'}
          >
            {type}
          </Button>
        ))}
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((req) => (
            <RequestCard
              key={req.id}
              {...req}
              onUpdateStatus={updateStatus}
              onSendQuote={sendQuote}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-muted-foreground text-lg mt-12">
            No requests match the selected filters.
          </p>
        )}
      </div>
    </div>
  );
}
