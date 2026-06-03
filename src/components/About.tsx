export const About = () => (
  <section id="about" className="py-20 px-5 sm:px-10">
    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span className="inline-block bg-pale text-sky text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-4">
          About Us
        </span>
        <h2 className="font-display text-[clamp(28px,3.8vw,42px)] text-navy leading-tight mb-5">
          A Lifetime Dedicated<br />to <span className="text-sky">Eye Health</span>
        </h2>
        <p className="text-muted-foreground leading-relaxed mb-4">
          Dr J Sumanth Reddy is a fellowship-trained ophthalmologist with over 15 years of clinical
          expertise. He has performed more than 25,000 successful eye surgeries and is widely
          recognised for his patient-first approach and surgical precision.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          His clinic is equipped with the latest diagnostic technology — from OCT imaging to
          wavefront-guided LASIK — ensuring every patient receives world-class care tailored to
          their unique vision needs.
        </p>

        <div className="flex flex-wrap gap-8 mt-8">
          {[
            { n: "15+", l: "Years Exp." },
            { n: "25k+", l: "Surgeries" },
            { n: "98%", l: "Success Rate" },
          ].map((s) => (
            <div key={s.l}>
              <div className="font-display text-3xl text-navy font-bold">
                {s.n.replace(/[+%k]/, "")}
                <span className="text-base text-accent">{s.n.match(/[+%k]+$/)?.[0] || ""}</span>
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="gradient-card rounded-3xl p-10 text-center shadow-soft">
        <div className="w-24 h-24 mx-auto rounded-full bg-white/70 flex items-center justify-center mb-5 shadow-soft">
          <span className="text-5xl">👁</span>
        </div>
        <h3 className="font-display text-2xl text-navy mb-3">Our Mission</h3>
        <p className="text-muted-foreground leading-relaxed">
          To provide compassionate, advanced and affordable eye care to every patient — restoring
          vision and transforming lives one surgery at a time.
        </p>
      </div>
    </div>
  </section>
);
