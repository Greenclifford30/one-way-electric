"use client";

import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { NavBar } from '@/components/ui/navbar';
import RequestCard from '@/components/ui/request-card';
import { Lightbulb, Wrench, Shield, Clock, Zap, AlertTriangle } from 'lucide-react';

type ServiceRequest = {
    id: string;
    serviceType: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    status: 'Pending' | 'In Progress' | 'Scheduled' | 'Denied' | 'Completed';
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

export default function AdminPage() {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filter, setFilter] = useState<string>('All');

    const serviceTypes = [
        { name: "Residential Electrical", icon: <Lightbulb className="mr-1 w-4 h-4" /> },
        { name: "Commercial Services", icon: <Wrench className="mr-1 w-4 h-4" /> },
        { name: "Emergency Services", icon: <AlertTriangle className="mr-1 w-4 h-4 text-red-500" /> },
        { name: "Maintenance", icon: <Clock className="mr-1 w-4 h-4" /> },
        { name: "Lighting Installation", icon: <Zap className="mr-1 w-4 h-4" /> },
        { name: "Panel Upgrades", icon: <Shield className="mr-1 w-4 h-4" /> },
        { name: "Generator Installation", icon: <Zap className="mr-1 w-4 h-4" /> },
        { name: "Electrical Inspections", icon: <Shield className="mr-1 w-4 h-4" /> }
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
                    customerName: item.customerName || 'Unknown Name',
                    customerPhone: item.customerPhone || 'Unknown Phone',
                    customerEmail: item.customerEmail || 'Unknown Email',
                    status: (item.status as ServiceRequest['status']) || 'Pending',
                    description: item.description || '',
                    requestedAt: item.requestedAt || '',
                    isEmergency: item.serviceType?.toLowerCase().includes('emergency') || false,
                    technician: item.assignedTechnician || undefined,
                }));

                setRequests(mappedRequests);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An unknown error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchRequests();
    }, []);

    const updateStatus = async (requestId: string, status: ServiceRequest['status'], requestedAt: string) => {
        try {
            const res = await fetch('/api/update-service-request-status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(
                    { 
                        serviceId: requestId, 
                        requestedAt, 
                        status 
                    }),
            });
    
            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error || 'Failed to update status');
            }
    
            // Update UI only if successful
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === requestId ? { ...req, status } : req
                )
            );
        } catch (error) {
            console.error('Update failed:', error);
            // Optionally: show a toast or alert to admin
            alert(`Failed to update status: ${(error as Error).message}`);
        }
    };
    

    const sendQuote = (requestId: string) => {
        const request = requests.find((r) => r.id === requestId);
        if (request) {
            const subject = encodeURIComponent(`Quote for ${request.serviceType}`);
            const body = encodeURIComponent(`Hello ${request.customerName},\n\nHere is the quote for your requested service: ${request.serviceType}. Please let us know if you would like to proceed.\n\nThank you,\nOne Way Electric`);
            window.location.href = `mailto:${request.customerEmail}?subject=${subject}&body=${body}`;
        }
    };

    const filteredRequests = filter === 'All' ? requests : requests.filter((req) => req.serviceType === filter);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
                <p className="mt-4 text-lg text-muted-foreground">Loading service requests...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <AlertTriangle className="h-12 w-12 text-red-500" />
                <p className="mt-4 text-lg text-red-600">Error: {error}</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
            <NavBar />
            <h1 className="text-5xl font-extrabold mb-8 text-center text-primary drop-shadow-lg">
                Admin Service Dashboard
            </h1>

            <div className="flex flex-wrap justify-center gap-2 mb-8">
                <Button onClick={() => setFilter('All')} variant={filter === 'All' ? 'default' : 'outline'}>
                    All
                </Button>
                {serviceTypes.map((type) => (
                    <Button
                        key={type.name}
                        onClick={() => setFilter(type.name)}
                        variant={filter === type.name ? 'default' : 'outline'}
                    >
                        {type.icon}
                        {type.name}
                    </Button>
                ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRequests.map((req) => (
                    <div
                        key={req.id}
                        className={`rounded-2xl shadow-lg p-4 bg-card border ${
                            req.isEmergency ? 'border-red-500' : 'border-border'
                        }`}
                    >
                        {req.isEmergency && (
                            <div className="flex items-center text-red-500 mb-2">
                                <AlertTriangle className="mr-1 w-4 h-4" />
                                <span className="text-sm font-semibold">Emergency</span>
                            </div>
                        )}
                        <RequestCard
                            id={req.id}
                            customerName={req.customerName}
                            customerPhone={req.customerPhone}
                            customerEmail={req.customerEmail}
                            serviceType={req.serviceType}
                            status={req.status}
                            description={req.description}
                            requestedAt={req.requestedAt}
                            isEmergency={req.isEmergency}
                            technician={req.technician}
                            onUpdateStatus={(status) => updateStatus(req.id, status as ServiceRequest["status"], req.requestedAt)}
                            onSendQuote={sendQuote}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
