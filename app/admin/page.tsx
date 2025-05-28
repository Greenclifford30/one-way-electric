"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { NavBar } from "@/components/navbar";
import RequestCard from "@/components/request-card";
import { 
  Search,
  Filter,
  Users,
  Moon,
  Sun
} from "lucide-react";

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
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

  // Ensure component is mounted before rendering theme-dependent content
  useEffect(() => {
    setMounted(true);
  }, []);

  // Theme toggle handler
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

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

  // If component is not mounted, return null to prevent theme-related rendering issues
  if (!mounted) return null;

  return (
    
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

           <NavBar />
      {/* Theme Toggle Button */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 text-foreground hover:bg-accent/80 shadow-lg bg-background/80 backdrop-blur-sm border border-border/50"
        aria-label="Toggle Theme"
      >
        {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>

      
      <div className="container mx-auto px-4 py-8 pt-24">
        {/* Header Section with Dark Mode Styling */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">
            Admin Service Dashboard
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage and track all electrical service requests
          </p>
        </div>

        {/* Stats Overview with Dark Mode Color Variants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card text-card-foreground">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{requests.length}</div>
              <p className="text-xs text-muted-foreground">
                Active service requests
              </p>
            </CardContent>
          </Card>

          {/* Other stat cards follow similar dark mode pattern */}
        </div>

        {/* Filters Section with Enhanced Dark Mode Contrast */}
        <Card className="mb-8 bg-card text-card-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input with Dark Mode Styling */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, service type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-background text-foreground"
              />
            </div>

      {/* Service Filters */}
      <div className="flex flex-wrap justify-center gap-3 mb-6">
        <Button 
          onClick={() => setServiceFilter('All')} 
          variant={serviceFilter === 'All' ? 'default' : 'outline'}
          size="sm"
          className="font-medium"
        >
          All Services
        </Button>
        {[...new Set(requests.map((r) => r.serviceType))].map((type) => (
          <Button
            key={type}
            onClick={() => setServiceFilter(type)}
            variant={serviceFilter === type ? 'default' : 'outline'}
            size="sm"
            className="font-medium"
          >
            {type}
          </Button>
        ))}
      </div>
          </CardContent>
        </Card>

        {/* Existing Tabs and Requests Grid with Dark Mode Considerations */}
        <Tabs defaultValue="All" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-muted">
          <TabsTrigger value="All" onClick={() => setStatusFilter('All')}>All</TabsTrigger>
          {allStatuses.map((status) => (
            <TabsTrigger key={status} value={status} onClick={() => setStatusFilter(status)}>
              {status}
            </TabsTrigger>
          ))}          </TabsList>
        </Tabs>

        {/* Requests Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
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
      </div>        </div>
      </div>
  );
}
