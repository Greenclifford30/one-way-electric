"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, User, AlertTriangle } from "lucide-react";
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

const getBadgeVariant = (status: Status) => {
  switch (status) {
    case 'Pending': return 'secondary';
    case 'In Progress':
    case 'Scheduled':
    case 'Completed': return 'default';
    case 'Denied': return 'destructive';
    default: return 'outline';
  }
};

const getCardBgColor = (status: Status) => {
  switch (status) {
    case 'Pending': return 'bg-yellow-900/40';
    case 'In Progress': return 'bg-blue-900/40';
    case 'Scheduled': return 'bg-yellow-900/40';
    case 'Denied': return 'bg-red-900/40';
    case 'Completed': return 'bg-green-900/40';
    default: return 'bg-muted';
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
  

  return (
    <Card
      className={`transition transform hover:scale-[1.02] hover:shadow-lg ${getCardBgColor(status)} ${isEmergency ? "border-red-500" : "border-border"
        } rounded-xl`}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-semibold text-primary">{customerName}</h3>
          <Badge variant={getBadgeVariant(status)}>{status}</Badge>
        </div>

        {isEmergency && (
          <div className="flex items-center text-red-400 text-sm mb-2">
            <AlertTriangle className="mr-1 w-4 h-4" />
            Emergency Request
          </div>
        )}

        <p className="text-sm text-muted-foreground mb-1">
          <strong>Service:</strong> {serviceType}
        </p>
        <p className="text-sm text-muted-foreground mb-1">
          <strong>Requested At:</strong> {new Date(requestedAt).toLocaleString()}
        </p>
        <p className="text-sm text-muted-foreground mb-3">
          <strong>Description:</strong> {description}
        </p>

        <div className="text-sm text-muted-foreground mb-3 space-y-1">
          <p>
            <Mail className="inline w-4 h-4 mr-1" />
            {customerEmail}
          </p>
          <p>
            <User className="inline w-4 h-4 mr-1" />
            {customerPhone}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Select value={selectedStatus} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]" />
            <SelectContent>
              {statusOptions.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>


          <Button size="sm" variant="outline" onClick={() => onSendQuote(id)}>
            Send Quote
          </Button>
        </div>
      </CardContent>

      <Dialog open={!!confirming} onOpenChange={() => setConfirming(null)}>
        <DialogContent>
          <div>
            <DialogHeader>
              <DialogTitle>Confirm Status Change</DialogTitle>
            </DialogHeader>
            <p>Are you sure you want to mark this request as <strong>{confirming}</strong>?</p>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirming(null)}>Cancel</Button>
              <Button variant="destructive" onClick={confirmStatusUpdate}>Confirm</Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>


    </Card>
  );
}
