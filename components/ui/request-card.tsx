"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, XCircle, Mail, User, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

type RequestCardProps = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  serviceType: string;
  status: 'Pending' | 'In Progress' | 'Scheduled' | 'Denied' | 'Completed';
  description: string;
  requestedAt: string;
  isEmergency?: boolean;
  technician?: string;
  onUpdateStatus: (id: string, status: 'Pending' | 'In Progress' | 'Scheduled' | 'Denied' | 'Completed') => void;
  onSendQuote: (id: string) => void;
};

const getBadgeVariant = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'secondary';
    case 'In Progress':
      return 'default';
    case 'Scheduled':
      return 'default';
    case 'Denied':
      return 'destructive';
    case 'Completed':
      return 'default';
    default:
      return 'outline';
  }
};

const getCardBgColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-900/40';
    case 'In Progress':
      return 'bg-blue-900/40';
    case 'Scheduled':
      return 'bg-yellow-900/40';
    case 'Denied':
      return 'bg-red-900/40';
    case 'Completed':
      return 'bg-green-900/40';
    default:
      return 'bg-muted';
  }
};

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
  return (
    <Card
      className={`transition transform hover:scale-[1.02] hover:shadow-lg ${getCardBgColor(status)} ${
        isEmergency ? "border-red-500" : "border-border"
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
          {status !== "Completed" && (
            <Button size="sm" onClick={() => onUpdateStatus(id, "Completed")}>
              <CheckCircle className="mr-1 w-4 h-4" />
              Mark Completed
            </Button>
          )}
          <Button size="sm" variant="outline" onClick={() => onSendQuote(id)}>
            Send Quote
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onUpdateStatus(id, "Denied")}>
            <XCircle className="mr-1 w-4 h-4" />
            Cancel
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
