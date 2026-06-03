import g1 from "@/assets/gallery-1.jpeg";
import g2 from "@/assets/gallery-2.jpeg";
import g3 from "@/assets/gallery-3.jpeg";
import g4 from "@/assets/gallery-4.jpeg";
import g5 from "@/assets/gallery-5.jpeg";
import g6 from "@/assets/gallery-6.jpeg";
import g7 from "@/assets/gallery-7.jpeg";
import g8 from "@/assets/gallery-8.jpeg";

const PHOTOS = [
  { src: g1, alt: "Dr Sumanth Reddy examining a patient at the slit lamp", caption: "Slit-lamp examination" },
  { src: g2, alt: "Detailed slit-lamp eye examination of a patient in uniform", caption: "Comprehensive screening" },
  { src: g6, alt: "Dr Sumanth Reddy in the consultation room", caption: "Consultation room" },
  { src: g4, alt: "Doctor consulting a patient with diagnostic equipment", caption: "Patient consultation" },
  { src: g5, alt: "Dr Sumanth Reddy with the WaveLight LASIK laser system", caption: "LASIK suite" },
  { src: g8, alt: "Doctor beside the femtosecond laser platform", caption: "Femtosecond platform" },
  { src: g3, alt: "Dr Sumanth Reddy in the surgical preparation area", caption: "Surgical prep" },
  { src: g7, alt: "Dr Sumanth Reddy with international patients post-treatment", caption: "International patients" },
];

export const Gallery = () => {
  return (
    <section id="gallery" className="py-20 px-5 sm:px-10 bg-background">
      <div className="max-w-6xl mx-auto text-center">
        <span className="inline-block bg-pale text-sky text-[11px] tracking-[2px] uppercase px-4 py-1.5 rounded-full mb-3">
          Gallery
        </span>
        <h2 className="font-display text-[clamp(28px,4vw,42px)] text-navy mb-3">Eye Care in Action</h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-10">
          A glimpse into our state-of-the-art clinic and the precision of modern eye care.
        </p>

        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {PHOTOS.map((p, idx) => (
            <figure
              key={idx}
              className="mb-5 break-inside-avoid group relative overflow-hidden rounded-2xl shadow-soft bg-muted"
            >
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-transparent p-4 text-left">
                <span className="text-white text-xs sm:text-sm font-medium tracking-wide opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {p.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};
