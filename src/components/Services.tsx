// import { Eye, Microscope, Droplet, Activity, Globe, Baby, Glasses } from "lucide-react";
import { Eye, Microscope, Droplet, Activity, Globe, Baby, Glasses, Stethoscope, ScanEye } from "lucide-react";  
const SERVICES = [
  { icon: Eye, title: "Cataract Surgery", desc: "Bladeless phacoemulsification with premium IOL options for crystal-clear vision." },
  { icon: Microscope, title: "LASIK / SMILE", desc: "Wavefront-guided laser vision correction for freedom from glasses." },
  { icon: Droplet, title: "Glaucoma", desc: "Early diagnosis and advanced medical & surgical management." },
  { icon: Activity, title: "Retina Surgery", desc: "Diabetic retinopathy, macular hole and vitreoretinal procedures." },
  { icon: Globe, title: "Cornea Transplant", desc: "DSEK, DMEK and full-thickness corneal grafting." },
  { icon: Baby, title: "Paediatric Eye", desc: "Gentle, child-friendly examination and squint correction." },
  { icon: Glasses, title: "Squint Correction", desc: "Cosmetic and functional alignment for adults and children." },
  {
  icon: Stethoscope,
  title: "General Eye Checkup",
  desc: "Comprehensive vision testing and preventive eye health screening for all ages."
},

{
  icon: ScanEye,
  title: "Diabetic Eye Care",
  desc: "Advanced diabetic retinopathy screening and laser treatment to protect vision."
},
];

export const Services = () => (
  <section id="services" className="py-20 px-5 sm:px-10 gradient-soft">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <span className="inline-block bg-pale text-sky text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-3">
          Our Services
        </span>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] text-navy">Comprehensive Eye Care</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          From routine check-ups to complex surgeries — every service backed by 15+ years of clinical excellence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {SERVICES.map((s) => (
          <div
            key={s.title}
            className="bg-card rounded-2xl p-7 shadow-soft hover:shadow-card hover:-translate-y-1 transition-all duration-300 border border-border/50"
          >
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky to-accent flex items-center justify-center mb-4">
              <s.icon className="h-6 w-6 text-white" />
            </div>
            <h3 className="font-display text-lg text-navy mb-2">{s.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
