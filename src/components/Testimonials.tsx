import { Star } from "lucide-react";

const TESTIMONIALS = [
  { name: "Ramesh K.", role: "Cataract Patient", initial: "R", color: "bg-blue", text: "Dr Reddy performed my cataract surgery and I could see clearly the very next day. His calm demeanour and skill put me completely at ease. Highly recommend!" },
  { name: "Priya M.", role: "LASIK Patient", initial: "P", color: "bg-sky", text: "I had LASIK surgery and now I have perfect 20/20 vision! The procedure was painless and the staff were incredibly professional throughout the entire process." },
  { name: "Sunita B.", role: "Paediatric Parent", initial: "S", color: "bg-navy", text: "My son's squint was corrected with excellent results. Dr Sumanth Reddy has a wonderful way with children — patient, gentle and reassuring. We are truly grateful." },
];

export const Testimonials = () => (
  <section id="testimonials" className="py-20 px-5 sm:px-10 bg-background">
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-14">
        <span className="inline-block bg-pale text-sky text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-3">
          Testimonials
        </span>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] text-navy">What Our Patients Say</h2>
        <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
          Thousands of patients trust Dr J Sumanth Reddy with their precious vision.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t) => (
          <article key={t.name} className="gradient-card rounded-2xl p-7 shadow-soft">
            <div className="text-4xl text-accent font-display leading-none mb-3">"</div>
            <p className="text-sm text-foreground leading-relaxed mb-5">{t.text}</p>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-full ${t.color} text-white flex items-center justify-center font-bold`}>
                {t.initial}
              </div>
              <div className="flex-1">
                <strong className="block text-sm text-navy">{t.name}</strong>
                <span className="text-xs text-muted-foreground">{t.role}</span>
              </div>
              <div className="flex gap-0.5 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-current" />
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
);
