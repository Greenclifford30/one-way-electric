"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NavBar } from "@/components/navbar";
import RequestCard from "@/components/request-card";
import { 
  Lightbulb, 
  Wrench, 
  Shield, 
  Clock, 
  Zap, 
  AlertTriangle, 
  Search,
  Filter,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  PlayCircle
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

const statusConfig = {
  'Pending': { icon: Clock, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  'In Progress': { icon: PlayCircle, color: 'bg-blue-100 text-blue-800 border-blue-200' },
  'Scheduled': { icon: Calendar, color: 'bg-purple-100 text-purple-800 border-purple-200' },
  'Completed': { icon: CheckCircle, color: 'bg-green-100 text-green-800 border-green-200' },
  'Denied': { icon: XCircle, color: 'bg-red-100 text-red-800 border-red-200' }
};

export default function AdminPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [serviceFilter, setServiceFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<Status | 'All'>('All');
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredRequests = requests.filter((r) => {
    const matchesService = serviceFilter === "All" || r.serviceType === serviceFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesService && matchesStatus && matchesSearch;
  });

  const getStatusCounts = () => {
    return allStatuses.reduce((acc, status) => {
      acc[status] = requests.filter(r => r.status === status).length;
      return acc;
    }, {} as Record<Status, number>);
  };

  const statusCounts = getStatusCounts();
  const totalRequests = requests.length;
  const emergencyRequests = requests.filter(r => r.isEmergency).length;

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      <p className="mt-4 text-lg text-muted-foreground">Loading service requests...</p>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <CardTitle className="text-red-600">Error Loading Data</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            Admin Service Dashboard
          </h1>
          <p className="text-lg text-slate-600">
            Manage and track all electrical service requests
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalRequests}</div>
              <p className="text-xs text-muted-foreground">
                Active service requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Emergency</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{emergencyRequests}</div>
              <p className="text-xs text-muted-foreground">
                Urgent requests
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <PlayCircle className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{statusCounts['In Progress']}</div>
              <p className="text-xs text-muted-foreground">
                Currently active
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{statusCounts['Completed']}</div>
              <p className="text-xs text-muted-foreground">
                Successfully finished
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Filters Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search */}
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by customer name, service type, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1"
              />
            </div>

            {/* Status and Service Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status-filter">Filter by Status</Label>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as Status | 'All')}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Statuses</SelectItem>
                    {allStatuses.map((status) => (
                      <SelectItem key={status} value={status}>
                        {status} ({statusCounts[status]})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service-filter">Filter by Service</Label>
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select service type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Services</SelectItem>
                    {[...new Set(requests.map((r) => r.serviceType))].map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Tabs */}
        <Tabs defaultValue="All" className="mb-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
            <TabsTrigger 
              value="All" 
              onClick={() => setStatusFilter('All')}
              className="flex items-center gap-2"
            >
              All ({totalRequests})
            </TabsTrigger>
            {allStatuses.map((status) => {
              const StatusIcon = statusConfig[status].icon;
              return (
                <TabsTrigger 
                  key={status} 
                  value={status} 
                  onClick={() => setStatusFilter(status)}
                  className="flex items-center gap-2"
                >
                  <StatusIcon className="h-4 w-4" />
                  {status} ({statusCounts[status]})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-sm">
              {filteredRequests.length} of {totalRequests} requests
            </Badge>
            {searchTerm && (
              <Badge variant="secondary">
                Search: "{searchTerm}"
              </Badge>
            )}
            {statusFilter !== 'All' && (
              <Badge variant="secondary">
                Status: {statusFilter}
              </Badge>
            )}
            {serviceFilter !== 'All' && (
              <Badge variant="secondary">
                Service: {serviceFilter}
              </Badge>
            )}
          </div>
          
          {(searchTerm || statusFilter !== 'All' || serviceFilter !== 'All') && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('All');
                setServiceFilter('All');
              }}
            >
              Clear Filters
            </Button>
          )}
        </div>

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
            <Card className="col-span-full">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Search className="h-12 w-12 text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">No requests found</CardTitle>
                <CardDescription className="text-center">
                  {searchTerm || statusFilter !== 'All' || serviceFilter !== 'All' 
                    ? "Try adjusting your filters or search terms"
                    : "No service requests available at the moment"
                  }
                </CardDescription>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
