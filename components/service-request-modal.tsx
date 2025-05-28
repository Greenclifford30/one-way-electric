"use client";

import { ChangeEvent, FormEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";


type ServiceRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: ServiceRequestForm;
  setFormData: Dispatch<SetStateAction<ServiceRequestForm>>;
  theme?: "light" | "dark";
};

type ServiceRequestForm = {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  serviceType: string;
  description: string;
};
export default function ServiceRequestModal({
  isOpen,
  onClose,
  formData,
  setFormData
}: ServiceRequestModalProps) {
  const services = [
    "Residential Electrical",
    "Commercial Services",
    "Emergency Services",
    "Maintenance",
    "Lighting Installation",
    "Panel Upgrades",
    "Generator Installation",
    "Electrical Inspections"
  ];

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "customerPhone") {
      const rawValue = value.replace(/\D/g, '').slice(0, 10);
      let formattedValue = rawValue;

      if (rawValue.length <= 3) formattedValue = rawValue;
      else if (rawValue.length <= 6) formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
      else formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6)}`;

      setFormData(prev => ({ ...prev, [name]: formattedValue }));
      if (formattedValue.trim()) setErrors(prev => ({ ...prev, [name]: "" }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
    if (value.trim()) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const digitsOnly = formData.customerPhone.replace(/\D/g, '');

    if (!formData.customerName.trim()) newErrors.customerName = "Name is required";
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Email is required";
    if (!formData.customerPhone.trim()) newErrors.customerPhone = "Phone is required";
    else if (digitsOnly.length !== 10) newErrors.customerPhone = "Phone number must be 10 digits";
    if (!formData.serviceType.trim()) newErrors.serviceType = "Service type is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await fetch('/api/schedule-service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, requestedAt: new Date().toISOString() })
      });
      if (!response.ok) throw new Error('Failed to schedule service');
      onClose();
    } catch (error) {
      console.error('Error scheduling service:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Request Service</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            name="customerName"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={handleInputChange}
          />
          {errors.customerName && <p className="text-sm text-destructive">{errors.customerName}</p>}

          <Input
            type="email"
            name="customerEmail"
            placeholder="Your Email"
            value={formData.customerEmail}
            onChange={handleInputChange}
          />
          {errors.customerEmail && <p className="text-sm text-destructive">{errors.customerEmail}</p>}

          <Input
            type="tel"
            name="customerPhone"
            placeholder="(123) 456-7890"
            value={formData.customerPhone}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (!/[0-9]/.test(e.key)) e.preventDefault();
            }}
          />
          {errors.customerPhone && <p className="text-sm text-destructive">{errors.customerPhone}</p>}

          <Select onValueChange={(val) => setFormData(prev => ({ ...prev, serviceType: val }))} value={formData.serviceType}>
            <SelectTrigger>
              <SelectValue placeholder="Select Service Type" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service} value={service}>
                  {service}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.serviceType && <p className="text-sm text-destructive">{errors.serviceType}</p>}

          <Textarea
            name="description"
            placeholder="Describe your service request"
            value={formData.description}
            onChange={handleInputChange}
          />
          {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}

          <DialogFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Submit</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
