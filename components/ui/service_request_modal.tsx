import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

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

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className={`relative rounded-lg shadow-lg w-full max-w-md p-6 ${containerClass}`}>
        <h2 className="text-xl font-semibold mb-4">Request Service</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="customerName"
            placeholder="Your Name"
            value={formData.customerName}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <input
            type="email"
            name="customerEmail"
            placeholder="Your Email"
            value={formData.customerEmail}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <input
            type="tel"
            name="customerPhone"
            placeholder="Your Phone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <select
            name="serviceType"
            value={formData.serviceType}
            onChange={handleInputChange}
            className={`w-full p-2 rounded border focus:outline-none focus:ring focus:border-primary 
              ${theme === "dark" ? "bg-background text-foreground border-gray-700" : "bg-white text-black border-gray-300"}`}
            required
          >
            <option value="" disabled>Select Service Type</option>
            {services.map((service, index) => (
              <option key={index} value={service}>{service}</option>
            ))}
          </select>

          <textarea
            name="description"
            placeholder="Describe your service request"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
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
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
