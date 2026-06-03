import { useEffect, useState } from "react";
import heroClinic from "@/assets/hero-clinic.jpg";
import heroIris from "@/assets/hero-iris.jpg";
import heroSurgery from "@/assets/hero-surgery.jpg";
import heroCornea from "@/assets/hero-cornea.jpg";
import heroRetina from "@/assets/hero-retina.jpg";
import heroPaediatric from "@/assets/hero-paediatric.jpg";
import { Award, ArrowRight, Phone } from "lucide-react";

const SLIDES = [
  { img: heroClinic, label: "Cataract Surgery" },
  { img: heroIris, label: "LASIK / SMILE" },
  { img: heroSurgery, label: "Glaucoma Treatment" },
  { img: heroCornea, label: "Cornea Transplant" },
  { img: heroRetina, label: "Retina Care" },
  { img: heroPaediatric, label: "Paediatric Eye Care" },
];

interface HeroProps {
  onBookClick: () => void;
}

export const Hero = ({ onBookClick }: HeroProps) => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setI((p) => (p + 1) % SLIDES.length);
    }, 5000);

    return () => clearInterval(t);
  }, []);

  return (
    <section
      id="hero"
      className="relative mt-[62px] lg:mt-[106px] h-[calc(100svh-62px)] lg:h-[calc(100svh-106px)] min-h-[520px] overflow-hidden bg-navy"
    >
      {/* Background Slides */}
      {SLIDES.map((s, idx) => (
        <div
          key={idx}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={s.img}
            alt={s.label}
            className={`w-full h-full object-cover transition-transform ease-out ${
              idx === i
                ? "scale-100 duration-[6000ms]"
                : "scale-110 duration-0"
            }`}
            loading={idx === 0 ? "eager" : "lazy"}
            width={1920}
            height={1280}
          />

          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-navy/65" />

          {/* Slide Label */}
          <div className="absolute top-6 right-4 sm:top-8 sm:right-10 bg-white/10 border border-white/20 text-sky-300 text-[11px] tracking-[2px] uppercase px-3 sm:px-4 py-1.5 rounded-full backdrop-blur">
            {s.label}
          </div>
        </div>
      ))}

      {/* Hero Content */}
      <div className="relative z-10 h-full flex items-center px-5 sm:px-10 lg:px-20">
        <div className="max-w-2xl text-white">
          {/* Experience Badge */}
          <div className="inline-flex items-center gap-2 bg-accent/20 border border-accent/40 text-sky-300 text-[10px] sm:text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-5 animate-fade-up">
            <Award className="h-3.5 w-3.5" />
            15+ Years of Excellence
          </div>

          {/* Main Heading */}
          <h1
            className="font-display text-[clamp(34px,5.5vw,62px)] leading-[1.1] mb-4 animate-fade-up"
            style={{ animationDelay: "0.15s" }}
          >
            Restoring <span className="text-sky-300">Vision</span>,
            <br />
            Transforming Lives
          </h1>

          {/* Description */}
          <p
            className="text-base sm:text-lg text-white/75 leading-relaxed mb-8 max-w-xl animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            Fellowship-trained ophthalmologist offering world-class cataract,
            LASIK, glaucoma and retina care — backed by 25,000+ successful
            surgeries.
          </p>

          {/* Buttons */}
          <div
            className="flex flex-wrap gap-3 animate-fade-up"
            style={{ animationDelay: "0.45s" }}
          >
            {/* Book Appointment Button */}
            <button
              onClick={onBookClick}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-sky to-accent text-white px-7 py-3 rounded-full text-sm font-semibold hover:-translate-y-0.5 transition shadow-glow cursor-pointer"
            >
              Book Appointment
              <ArrowRight className="h-4 w-4" />
            </button>

            {/* Call Now Button */}
            <a
  href="https://wa.me/919866188256"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/30 hover:border-white px-7 py-3 rounded-full text-sm font-semibold transition cursor-pointer"
>
  <Phone className="h-4 w-4" />
  Call Now
</a>
          </div>
        </div>
      </div>

      {/* Slider Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {SLIDES.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`h-2 rounded-full transition-all ${
              idx === i ? "bg-white w-7" : "bg-white/40 w-2"
            }`}
            aria-label={`Slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
};