"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, User, AlertTriangle, Phone, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export type Status = 'Pending' | 'In Progress' | 'Scheduled' | 'Denied' | 'Completed';

type RequestCardProps = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: string;
  status: Status;
  description: string;
  requestedAt: string;
  isEmergency?: boolean;
  technician?: string;
  onUpdateStatus: (id: string, status: Status) => void;
  onSendQuote: (id: string) => void;
};

const statusConfig = {
  'Pending': { 
    variant: 'secondary' as const, 
    bgColor: 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800',
    textColor: 'text-yellow-800 dark:text-yellow-200'
  },
  'In Progress': { 
    variant: 'default' as const, 
    bgColor: 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800',
    textColor: 'text-blue-800 dark:text-blue-200'
  },
  'Scheduled': { 
    variant: 'secondary' as const, 
    bgColor: 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-800',
    textColor: 'text-purple-800 dark:text-purple-200'
  },
  'Denied': { 
    variant: 'destructive' as const, 
    bgColor: 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800',
    textColor: 'text-red-800 dark:text-red-200'
  },
  'Completed': { 
    variant: 'default' as const, 
    bgColor: 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800',
    textColor: 'text-green-800 dark:text-green-200'
  }
};

const statusOptions: Status[] = ['Pending', 'Scheduled', 'In Progress', 'Completed', 'Denied'];

export default function RequestCard({
  id,
  customerName,
  customerPhone,
  customerEmail,
  serviceType,
  status,
  description,
  requestedAt,
  isEmergency = false,
  onUpdateStatus,
  onSendQuote,
}: RequestCardProps) {
  const [selectedStatus, setSelectedStatus] = useState<Status>(status);
  const [confirming, setConfirming] = useState<Status | null>(null);

  const handleStatusChange = async (newStatus: string) => {
    if (!statusOptions.includes(newStatus as Status)) return;
    const newTypedStatus = newStatus as Status;
  
    // Prevent invalid transitions
    if (status === "Completed" || status === "Denied") {
      toast.warning("Status cannot be changed once it's completed or denied.");
      return;
    }
  
    if (newTypedStatus === "Completed" || newTypedStatus === "Denied") {
      setConfirming(newTypedStatus);
      return;
    }
  
    try {
      const response = await fetch(`/api/service-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: newTypedStatus })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      setSelectedStatus(newTypedStatus);
      onUpdateStatus(id, newTypedStatus);
      toast.success(`Status updated to ${newTypedStatus}`);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };
  

  const confirmStatusUpdate = async () => {
    if (!confirming) return;
  
    try {
      const response = await fetch(`/api/service-request/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ status: confirming })
      });
  
      if (!response.ok) {
        throw new Error("Failed to update status");
      }
  
      setSelectedStatus(confirming);
      onUpdateStatus(id, confirming);
      toast.success(`Status updated to ${confirming}`);
      setConfirming(null);
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const config = statusConfig[status];

  return (
    <Card
      className={`transition-all duration-300 hover:scale-[1.02] hover:shadow-xl rounded-xl border-2 ${
        isEmergency 
          ? 'border-red-500 bg-red-50 dark:bg-red-900/10 shadow-red-100 dark:shadow-red-900/20' 
          : `${config.bgColor} hover:shadow-lg`
      }`}
    >
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <CardTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {customerName}
            </CardTitle>
            {isEmergency && (
              <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-white font-semibold">
                <AlertTriangle className="mr-1 h-3 w-3" />
                EMERGENCY
              </Badge>
            )}
          </div>
          <Badge variant={config.variant} className={`${config.textColor} font-medium px-3 py-1`}>
            {status}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Service Information */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="font-medium text-foreground">Service:</span>
            <span className="text-muted-foreground">{serviceType}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-foreground">Requested:</span>
            <span className="text-muted-foreground">
              {new Date(requestedAt).toLocaleDateString()} at {new Date(requestedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <h4 className="font-medium text-foreground">Description:</h4>
          <p className="text-sm text-muted-foreground leading-relaxed bg-background/50 p-3 rounded-lg border">
            {description}
          </p>
        </div>

        {/* Customer Contact */}
        <div className="bg-background/50 p-4 rounded-lg border space-y-3">
          <h4 className="font-medium text-foreground mb-2">Customer Contact</h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${customerEmail}`} className="text-primary hover:underline">
                {customerEmail}
              </a>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-primary" />
              <a href={`tel:${customerPhone}`} className="text-primary hover:underline">
                {customerPhone}
              </a>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3 pt-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Update Status:</label>
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            onClick={() => onSendQuote(id)}
            className="w-full"
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Quote
          </Button>
        </div>
      </CardContent>

      {/* Confirm dialog for irreversible status updates */}
      {confirming && (
        <Dialog open={!!confirming} onOpenChange={() => setConfirming(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Confirm status change to "{confirming}"?
              </DialogTitle>
            </DialogHeader>
            <p className="text-muted-foreground">
              This action cannot be undone. The request status will be permanently changed to {confirming}.
            </p>
            <DialogFooter className="mt-4">
              <Button variant="outline" onClick={() => setConfirming(null)}>
                Cancel
              </Button>
              <Button onClick={confirmStatusUpdate}>Confirm</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
