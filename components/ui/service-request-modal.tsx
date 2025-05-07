import { ChangeEvent, FormEvent, Dispatch, SetStateAction, useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type ServiceRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    description: string;
  };
  setFormData: Dispatch<SetStateAction<{
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    serviceType: string;
    description: string;
  }>>;
  theme?: "light" | "dark";
};

export default function ServiceRequestModal({
  isOpen,
  onClose,
  formData,
  setFormData,
  theme = "light"
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
      const rawValue = value.replace(/\D/g, '').slice(0, 10); // only 10 digits max
  
      let formattedValue = rawValue;
      if (rawValue.length <= 3) {
        formattedValue = rawValue;
      } else if (rawValue.length <= 6) {
        formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3)}`;
      } else {
        formattedValue = `(${rawValue.slice(0, 3)}) ${rawValue.slice(3, 6)}-${rawValue.slice(6)}`;
      }
  
      setFormData((prev) => ({ ...prev, [name]: formattedValue }));
      if (formattedValue.trim()) {
        setErrors((prev) => ({ ...prev, [name]: "" }));
      }
      return;
    }
  
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (value.trim()) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  
  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    const digitsOnly = formData.customerPhone.replace(/\D/g, '');
  
    if (!formData.customerName.trim()) newErrors.customerName = "Name is required";
    if (!formData.customerEmail.trim()) newErrors.customerEmail = "Email is required";
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = "Phone is required";
    } else if (digitsOnly.length !== 10) {
      newErrors.customerPhone = "Phone number must be exactly 10 digits";
    }
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
        body: JSON.stringify({
          ...formData,
          requestedAt: new Date().toISOString()
        })
      });
      if (!response.ok) throw new Error('Failed to schedule service');
      console.log('Service scheduled successfully');
      onClose();
    } catch (error) {
      console.error('Error scheduling service:', error);
    }
  };

  if (!isOpen) return null;

  const containerClass = theme === "dark"
    ? "bg-background text-foreground border border-gray-700"
    : "bg-white text-black border border-gray-300";

  const baseInputClass = `w-full p-2 rounded bg-inherit border focus:outline-none focus:ring-2 focus:ring-primary`;
  const getInputClass = (field: string) =>
    `${baseInputClass} ${errors[field] ? "border-red-500" : "border-gray-300"}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={`relative rounded-2xl shadow-2xl w-full max-w-md p-6 ${containerClass}`}>
        <h2 className="text-2xl font-bold mb-4 text-center">Request Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="customerName"
              placeholder="Your Name"
              value={formData.customerName}
              onChange={handleInputChange}
              className={getInputClass("customerName")}
            />
            {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName}</p>}
          </div>
          <div>
            <input
              type="email"
              name="customerEmail"
              placeholder="Your Email"
              value={formData.customerEmail}
              onChange={handleInputChange}
              className={getInputClass("customerEmail")}
            />
            {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail}</p>}
          </div>
          <div>
          <input
  type="tel"
  name="customerPhone"
  placeholder="(123) 456-7890"
  value={formData.customerPhone}
  onChange={handleInputChange}
  onKeyPress={(e) => {
    if (!/[0-9]/.test(e.key)) { // only allow digits
      e.preventDefault();
    }
  }}
  className={getInputClass("customerPhone")}
/>

            {errors.customerPhone && <p className="text-red-500 text-sm mt-1">{errors.customerPhone}</p>}
          </div>
          <div className="relative">
            <select
              name="serviceType"
              value={formData.serviceType}
              onChange={handleInputChange}
              className={`${getInputClass("serviceType")} appearance-none pr-10`}
            >
              <option value="" disabled>Select Service Type</option>
              {services.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-500">
              ▼
            </div>
            {errors.serviceType && <p className="text-red-500 text-sm mt-1">{errors.serviceType}</p>}
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Describe your service request"
              value={formData.description}
              onChange={handleInputChange}
              className={getInputClass("description")}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Submit
            </Button>
          </div>
        </form>
        <button
          aria-label="Close modal"
          className="absolute top-3 right-3 text-gray-400 hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
