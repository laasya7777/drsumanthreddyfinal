import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";
import { Loader2, CheckCircle2 } from "lucide-react";
import emailjs from "emailjs-com"; // ✅ ADDED

const schema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  phone: z.string().trim().min(5, "Enter a valid phone").max(30),
  email: z.string().trim().email("Enter a valid email").max(255),
  preferred_date: z.string().optional(),
  preferred_time: z.string().max(20).optional(),
  reason: z.string().trim().max(1000).optional(),
});

interface AppointmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AppointmentDialog = ({ open, onOpenChange }: AppointmentDialogProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const fd = new FormData(e.currentTarget);
    const data = {
      name: String(fd.get("name") || ""),
      phone: String(fd.get("phone") || ""),
      email: String(fd.get("email") || ""),
      preferred_date: String(fd.get("preferred_date") || "") || undefined,
      preferred_time: String(fd.get("preferred_time") || "") || undefined,
      reason: String(fd.get("reason") || "") || undefined,
    };

    const parsed = schema.safeParse(data);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }

    setSubmitting(true);

    try {
      // ✅ 1. Save to Supabase
      const { error } = await supabase.from("appointments").insert({
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        preferred_date: parsed.data.preferred_date || null,
        preferred_time: parsed.data.preferred_time || null,
        reason: parsed.data.reason || null,
      });

      if (error) throw error;
// ✅ 1. Send email to USER
emailjs.send(
  "service_4r8aoob",
  "template_iakrgba",
  {
    user_name: parsed.data.name,
    user_email: parsed.data.email,
    user_date: parsed.data.preferred_date,
    user_time: parsed.data.preferred_time,
  },
  "ghnYeknN5j1RZ6T74"
);

// ✅ 2. Send email to ADMIN
emailjs.send(
  "service_4r8aoob",
  "template_itrefca",
  {
    user_name: parsed.data.name,
    user_email: parsed.data.email,
    user_phone: parsed.data.phone,
    user_date: parsed.data.preferred_date,
    user_time: parsed.data.preferred_time,
    message: parsed.data.reason,
  },
  "ghnYeknN5j1RZ6T74"

      ).catch((err) => console.warn("Email failed:", err));

      // ✅ 3. (Optional) Keep your Edge Function
      supabase.functions
        .invoke("notify-admin-appointment", { body: parsed.data })
        .catch((err) => console.warn("Admin notification failed:", err));

      setDone(true);

      setTimeout(() => {
        onOpenChange(false);
        setDone(false);
      }, 2200);

    } catch (err) {
      console.error(err);
      toast.error("Could not submit. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl text-navy">Book an Appointment</DialogTitle>
          <DialogDescription>
            Fill in your details and we'll get back to you shortly.
          </DialogDescription>
        </DialogHeader>

        {done ? (
          <div className="py-10 flex flex-col items-center text-center gap-3">
            <CheckCircle2 className="h-14 w-14 text-sky" />
            <h3 className="font-display text-xl text-navy">Request Received</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Thank you. Our team will contact you to confirm your appointment.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid gap-4 pt-2">
            <div className="grid gap-2">
              <Label htmlFor="name">Full name *</Label>
              <Input id="name" name="name" required maxLength={100} placeholder="Your name" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input id="phone" name="phone" type="tel" required maxLength={30} placeholder="+91 ..." />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email *</Label>
                <Input id="email" name="email" type="email" required maxLength={255} placeholder="you@email.com" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="grid gap-2">
                <Label htmlFor="preferred_date">Preferred date</Label>
                <Input id="preferred_date" name="preferred_date" type="date" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="preferred_time">Preferred time</Label>
                <Input id="preferred_time" name="preferred_time" type="time" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="reason">Reason / message</Label>
              <Textarea id="reason" name="reason" maxLength={1000} rows={3} />
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-11">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Request Appointment"}
            </Button>

            <p className="text-xs text-muted-foreground text-center">
              By submitting, you agree to be contacted regarding this request.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};