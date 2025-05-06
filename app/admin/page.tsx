"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { NavBar } from '@/components/ui/navbar';

type ServiceRequest = {
    id: string;
    serviceType: string;
    contactName: string;
    contactPhone: string;
    contactEmail: string;
    status: 'Pending' | 'In Progress' | 'Scheduled' | 'Denied';
    description: string;
    requestedAt: string;
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

export default function AdminPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    const serviceTypes = [
        "Residential Electrical",
        "Commercial Services",
        "Emergency Services",
        "Maintenance",
        "Lighting Installation",
        "Panel Upgrades",
        "Generator Installation",
        "Electrical Inspections"
    ];

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/get-service-requests');
                const data: { success: boolean; requests: ApiServiceRequest[] } = await response.json();

                const loadedRequests = Array.isArray(data.requests) ? data.requests : [];

                const mappedRequests: ServiceRequest[] = loadedRequests.map((item, index) => ({
                    id: item.serviceId || String(index),
                    serviceType: item.serviceType || 'Unknown Service',
                    contactName: item.customerName || 'Unknown Name',
                    contactPhone: item.customerPhone || 'Unknown Phone',
                    contactEmail: item.customerEmail || 'Unknown Email',
                    status: (item.status as ServiceRequest['status']) || 'Pending',
                    description: item.description || '',
                    requestedAt: item.requestedAt || '',
                }));

                setRequests(mappedRequests);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const handleApprove = (requestId: string) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: 'In Progress' } : req
            )
        );
    };

    const handleDeny = (requestId: string) => {
        setRequests((prev) =>
            prev.map((req) =>
                req.id === requestId ? { ...req, status: 'Denied' } : req
            )
        );
    };

    const handleSendQuote = (requestId: string) => {
        const request = requests.find((r) => r.id === requestId);
        if (request) {
            const subject = encodeURIComponent(`Quote for ${request.serviceType}`);
            const body = encodeURIComponent(`Hello ${request.contactName},%0D%0A%0D%0AHere is the quote for your requested service: ${request.serviceType}. Please let us know if you would like to proceed.%0D%0A%0D%0AThank you,%0D%0AOne Way Electric`);
            window.location.href = `mailto:${request.contactEmail}?subject=${subject}&body=${body}`;
        }
    };

    const filteredRequests = filter === 'All' ? requests : requests.filter((req) => req.serviceType === filter);

    const getBorderClass = (serviceType: string) => {
        if (serviceType.toLowerCase().includes('emergency')) {
            return 'border-red-500';
        }
        return 'border-primary';
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-muted-foreground">Loading service requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
            <NavBar />
            <h1 className="text-4xl font-extrabold mb-6 text-center text-primary">Admin Service Dashboard</h1>

            <div className="flex flex-wrap justify-center gap-2 mb-6">
                <Button
                    onClick={() => setFilter('All')}
                    variant={filter === 'All' ? 'default' : 'outline'}
                    className={`text-sm px-4 py-2 rounded-full ${filter === 'All' ? 'bg-primary text-white' : 'bg-muted text-primary border-2 border-primary hover:bg-primary hover:text-white'}`}
                >
                    All
                </Button>
                {serviceTypes.map((type) => (
                    <Button
                        key={type}
                        onClick={() => setFilter(type)}
                        variant={filter === type ? 'default' : 'outline'}
                        className={`text-sm px-4 py-2 rounded-full ${filter === type ? 'bg-primary text-white' : 'bg-muted text-primary border-2 border-primary hover:bg-primary hover:text-white'}`}
                    >
                        {type}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                    <Card key={req.id} className={`bg-card rounded-2xl border-2 ${getBorderClass(req.serviceType)} shadow-lg hover:shadow-2xl hover:scale-105 transform transition-all duration-300`}>
                        <CardContent className="p-6 flex flex-col gap-4">
                            <div className="text-center">
                                <h2 className="text-xl font-semibold text-primary mb-1">{req.serviceType}</h2>
                                <p className="text-muted-foreground text-sm">Requested by {req.contactName}</p>
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
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${req.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : req.status === 'In Progress' ? 'bg-green-100 text-green-800' : req.status === 'Denied' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                                    {req.status}
                                </span>
                            </div>

                            <div className="mt-4 flex flex-col gap-2">
                                {req.status !== 'In Progress' && req.status !== 'Denied' && (
                                    <Button onClick={() => handleApprove(req.id)} className="w-full bg-green-600 hover:bg-green-700">
                                        <CheckCircle className="h-4 w-4 mr-2" /> Approve
                                    </Button>
                                )}
                                {req.status !== 'Denied' && req.status !== 'In Progress' && (
                                    <Button onClick={() => handleDeny(req.id)} variant="destructive" className="w-full">
                                        <XCircle className="h-4 w-4 mr-2" /> Deny
                                    </Button>
                                )}
                                <Button onClick={() => handleSendQuote(req.id)} className="w-full bg-blue-600 hover:bg-blue-700">
                                    <DollarSign className="h-4 w-4 mr-2" /> Send Quote
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
