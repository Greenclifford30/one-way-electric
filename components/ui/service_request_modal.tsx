import { ChangeEvent, FormEvent, Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";

type ServiceRequestModalProps = {
  isOpen: boolean;
  onClose: () => void;
  formData: {
    name: string;
    email: string;
    phone: string;
    serviceRequest: string;
  };
  setFormData: Dispatch<SetStateAction<{
    name: string;
    email: string;
    phone: string;
    serviceRequest: string;
  }>>;
  theme?: "light" | "dark";
};

export default function ServiceRequestModal({ isOpen, onClose, formData, setFormData, theme = "light" }: ServiceRequestModalProps) {
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
            name="name"
            placeholder="Your Name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Your Phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-inherit border focus:outline-none focus:ring focus:border-primary"
            required
          />
          <textarea
            name="serviceRequest"
            placeholder="Describe your service request"
            value={formData.serviceRequest}
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
