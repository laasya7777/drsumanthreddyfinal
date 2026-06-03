import { MapPin, Phone, Mail, ExternalLink } from "lucide-react";

const CLINIC_ADDRESS =
  "Dr Agarwals Eye Hospital, 19 Air Bypass Rd, near Passport Office, STV Nagar, Tirupati, Andhra Pradesh 517501";
const MAPS_LINK = "https://maps.app.goo.gl/LXDJRx92t36FM7YS6";
const MAPS_EMBED = `https://maps.google.com/maps?q=${encodeURIComponent(
  CLINIC_ADDRESS,
)}&t=&z=16&ie=UTF8&iwloc=&output=embed`;

export const Contact = () => (
  <section id="contact" className="py-20 px-5 sm:px-10 gradient-soft">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <span className="inline-block bg-pale text-sky text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-3">
          Contact Us
        </span>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] text-navy">
          Find Us & Get in Touch
        </h2>
        <p className="text-muted-foreground mt-3">
          We are here to help. Visit our clinic or reach us directly.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-card rounded-2xl p-7 text-center shadow-soft">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-accent flex items-center justify-center mx-auto mb-4">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-display text-lg text-navy mb-2">Our Location</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Dr Agarwals Eye Hospital<br />
            19 Air Bypass Rd, near Passport Office<br />
            STV Nagar, Tirupati<br />
            Andhra Pradesh – 517501
          </p>
        </div>

        <div className="bg-card rounded-2xl p-7 text-center shadow-soft">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-accent flex items-center justify-center mx-auto mb-4">
            <Phone className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-display text-lg text-navy mb-2">Call Us</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <a href="tel:+919866188256" className="text-sky hover:underline block text-base font-semibold">
              +91 98661 88256
            </a>
            <span className="text-xs">Mon – Sat: 9 AM – 6 PM</span>
          </p>
        </div>

        <div className="bg-card rounded-2xl p-7 text-center shadow-soft">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-accent flex items-center justify-center mx-auto mb-4">
            <Mail className="h-6 w-6 text-white" />
          </div>
          <h3 className="font-display text-lg text-navy mb-2">Email Us</h3>
          <p className="text-sm text-muted-foreground leading-relaxed break-words">
            <a href="mailto:drsumanthreddy9@gmail.com" className="text-sky hover:underline block text-base font-semibold">
              drsumanthreddy9@gmail.com
            </a>
          </p>
        </div>
      </div>

      {/* Google Map */}
      <div className="rounded-2xl overflow-hidden shadow-card border border-border bg-card">
        <div className="flex items-center justify-between px-5 py-3 bg-navy text-white">
          <span className="text-sm font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-accent" /> Clinic Location
          </span>
          <a
            href={MAPS_LINK}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.preventDefault();
              window.open(MAPS_LINK, "_blank", "noopener,noreferrer");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:text-white transition"
          >
            Open in Google Maps <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <iframe
          title="Clinic location on Google Maps"
          src={MAPS_EMBED}
          width="100%"
          height="400"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    </div>
  </section>
);
