import { Phone, Mail } from "lucide-react";

interface BannerProps {
  onBookClick: () => void;
}

export const Banner = ({ onBookClick }: BannerProps) => (
  <section className="py-20 px-5 sm:px-10 gradient-hero relative overflow-hidden">
    
    {/* Background Icon */}
    <div className="absolute right-10 top-1/2 -translate-y-1/2 text-[200px] opacity-[0.06] pointer-events-none select-none hidden md:block">
      👁
    </div>

    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-10 items-center relative">

      {/* Left Content */}
      <div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 mb-7">
          {[
            { n: "15", s: "+", l: "Years Expertise" },
            { n: "10k", s: "+", l: "Surgeries Done" },
            { n: "98", s: "%", l: "Success Rate" },
          ].map((it) => (
            <div key={it.l}>
              <div className="font-display text-[clamp(36px,5vw,58px)] text-white font-bold leading-none">
                {it.n}
                <span className="text-[0.5em] text-sky-300">
                  {it.s}
                </span>
              </div>

              <div className="text-xs text-white/60 uppercase tracking-wider mt-1">
                {it.l}
              </div>
            </div>
          ))}
        </div>

        {/* Heading */}
        <h2 className="font-display text-[clamp(26px,3.5vw,40px)] text-white leading-tight mb-3">
          15 Years of Trusted
          <br />
          Eye Care Excellence
        </h2>

        {/* Description */}
        <p className="text-white/75 leading-relaxed max-w-lg">
          Trusted by thousands of families across Hyderabad.
          Book your consultation today and take
          the first step toward better vision.
        </p>
      </div>

      {/* Right Buttons */}
      <div className="flex flex-col items-start gap-4 lg:items-end">

        {/* Book Appointment Button */}
        <button
          onClick={onBookClick}
          className="inline-flex items-center gap-3 bg-white text-navy px-9 py-4 rounded-full text-base font-bold shadow-soft hover:-translate-y-0.5 transition cursor-pointer"
        >
          <Mail className="h-5 w-5" />
          Book Appointment
        </button>

        {/* Get Assistance Button */}
      {/* Get Assistance Button */}
{/* Get Assistance Button */}
<a
  href="https://wa.me/919866188256"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center gap-2 bg-transparent text-white border-2 border-white/40 hover:border-white px-8 py-3.5 rounded-full text-sm font-medium transition cursor-pointer"
>
  <Phone className="h-4 w-4" />
  Get Assistance Now
</a>

        {/* Timing */}
        <p className="text-white/55 text-xs">
          Available Mon–Sat | 9 AM – 6 PM
        </p>
      </div>
    </div>
  </section>
);