import { useState } from "react";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Banner } from "@/components/Banner";
import { AppointmentDialog } from "@/components/AppointmentDialog";
import { Gallery } from "@/components/Gallery";
import { Eye, Microscope, Droplet, Activity, Globe, Baby, Glasses, Instagram, Facebook, Youtube, X,Linkedin } from "lucide-react";

const STRIP = [
  { Icon: Eye, label: "Cataract Surgery" },
  { Icon: Microscope, label: "LASIK / SMILE" },
  { Icon: Droplet, label: "Glaucoma" },
  { Icon: Activity, label: "Retina Surgeries" },
  { Icon: Globe, label: "Cornea Transplant" },
  { Icon: Baby, label: "Paediatric Eye" },
  { Icon: Glasses, label: "Squint Correction" },
];

const Index = () => {
  const [open, setOpen] = useState(false);
  return (
    <main className="min-h-screen bg-background">
      <Header onBookClick={() => setOpen(true)} />
      <Hero onBookClick={() => setOpen(true)} />

      {/* Services strip */}
      <div className="bg-navy py-5 px-5 sm:px-10">
        <div className="max-w-6xl mx-auto flex gap-8 overflow-x-auto no-scrollbar justify-start lg:justify-center flex-nowrap">
          {STRIP.map(({ Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-white/70 whitespace-nowrap text-sm">
              <Icon className="h-4 w-4 text-accent" /> {label}
            </div>
          ))}
        </div>
      </div>

      <About />
      <Services />

      <Gallery />

      <Testimonials />
      <Contact />
      <Banner onBookClick={() => setOpen(true)} />

      <footer className="bg-navy-deep px-5 sm:px-10 py-10 text-center text-white/50 text-sm">
        <div className="max-w-6xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-3">
            {[
              { Icon: Instagram, href: "https://www.instagram.com/drjsumanthreddy/", label: "Instagram" },
              { Icon: Youtube, href: "https://www.youtube.com/channel/UCivshx63o9MdQiIA9ORzWhQ", label: "YouTube" },
              {
  Icon: Facebook,
  href: "https://www.facebook.com/profile.php?id=61589439452928",
  label: "Facebook",
},

{
  Icon: X,
  href: "https://x.com/DrJSumanthReddy",
  label: "X",
},

{
  Icon: Linkedin,
  href: "https://www.linkedin.com/in/drjsumanthreddy/",
  label: "LinkedIn",
},
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(href, "_blank", "noopener,noreferrer");
                }}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 flex items-center justify-center text-white/70 hover:text-accent transition"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
          <div className="space-y-1">
            <p>
              © 2026 <strong className="text-white/80">Dr J Sumanth Reddy</strong> – Eye Specialist
              &amp; Surgeon. All rights reserved.
            </p>
            <p className="text-white/40">Hyderabad, Telangana | Designed with ❤ for better vision</p>
          </div>
        </div>
      </footer>

      <AppointmentDialog open={open} onOpenChange={setOpen} />
    </main>
  );
};

export default Index;
