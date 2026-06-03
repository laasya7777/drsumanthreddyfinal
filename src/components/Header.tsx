import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  Instagram,
  Youtube,
  Facebook,
  Twitter,
  Linkedin,
} from "lucide-react";

import logo from "@/assets/logo.jpeg";

const NAV = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "services", label: "Services" },
  { id: "gallery", label: "Gallery" },
  { id: "blog", label: "Blog", route: "/blog" as const },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
];

interface HeaderProps {
  onBookClick: () => void;
}

export const Header = ({ onBookClick }: HeaderProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState("hero");

  const location = useLocation();
  const navigate = useNavigate();

  const onHome = location.pathname === "/";

  useEffect(() => {
    if (!onHome) {
      setActive(location.pathname.startsWith("/blog") ? "blog" : "");
      return;
    }

    const onScroll = () => {
      const fromTop = window.scrollY + 140;
      let current = "hero";

      for (const item of NAV) {
        if ((item as { route?: string }).route) continue;

        const el = document.getElementById(item.id);

        if (el && el.offsetTop <= fromTop) {
          current = item.id;
        }
      }

      setActive(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [onHome, location.pathname]);

  const go = (item: { id: string; route?: string }) => {
    setMobileOpen(false);

    if (item.route) {
      navigate(item.route);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (!onHome) {
      navigate(`/#${item.id}`);
      return;
    }

    const el = document.getElementById(item.id);

    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 90;

      window.scrollTo({
        top: y,
        behavior: "smooth",
      });

      if (location.hash !== `#${item.id}`) {
        history.replaceState(null, "", `#${item.id}`);
      }
    }
  };

  useEffect(() => {
    if (onHome && location.hash) {
      const id = location.hash.slice(1);

      const el = document.getElementById(id);

      if (el) {
        const y = el.getBoundingClientRect().top + window.scrollY - 90;

        window.scrollTo({
          top: y,
          behavior: "smooth",
        });
      }
    }
  }, [onHome, location.hash]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-navy/95 backdrop-blur-lg shadow-lg">

      {/* Top Header */}
      <div className="flex items-center justify-between px-4 sm:px-8 h-[62px] border-b border-white/10">

        {/* Logo */}
        <button
          onClick={() => go({ id: "hero" })}
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-white border-2 border-accent/60 shadow-glow shrink-0">
            <img
              src={logo}
              alt="Dr J Sumanth Reddy logo"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center text-left">
            <strong className="block font-display text-sm sm:text-base text-white leading-tight">
              Dr J Sumanth Reddy
            </strong>

            <span className="text-[11px] text-accent font-semibold tracking-[2px] uppercase mt-0.5">
              Eye Specialist
            </span>
          </div>
        </button>

        {/* Desktop Socials */}
        <div className="hidden sm:flex items-center gap-2 md:gap-3">

          {[
            {
              Icon: Instagram,
              href: "https://www.instagram.com/drjsumanthreddy/",
              label: "Instagram",
            },

            {
              Icon: Youtube,
              href: "https://www.youtube.com/channel/UCivshx63o9MdQiIA9ORzWhQ",
              label: "YouTube",
            },

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
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/50 flex items-center justify-center text-white/70 hover:text-accent transition"
            >
              <Icon className="h-4 w-4" />
            </a>
          ))}

          {/* Book Button */}
          <button
            onClick={onBookClick}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sky to-accent text-white px-5 py-2 rounded-full text-sm font-semibold hover:opacity-90 transition shadow-glow"
          >
            Book Appointment
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileOpen((s) => !s)}
          className="md:hidden p-2 text-white"
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center justify-center gap-1 h-11 bg-white/5 px-8">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => go(n)}
            className={`text-xs uppercase tracking-wider font-medium px-4 py-1.5 rounded-md transition ${
              active === n.id
                ? "text-white bg-accent/20"
                : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            {n.label}
          </button>
        ))}
      </nav>

      {/* Mobile Navigation */}
      {mobileOpen && (
        <nav className="md:hidden flex flex-col gap-1 px-4 py-3 bg-navy-deep border-t border-white/10">

          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => go(n)}
              className={`text-left px-4 py-3 rounded-md text-sm uppercase tracking-wider font-medium transition ${
                active === n.id
                  ? "text-white bg-accent/20"
                  : "text-white/80 hover:bg-white/10"
              }`}
            >
              {n.label}
            </button>
          ))}

          <button
            onClick={() => {
              setMobileOpen(false);
              onBookClick();
            }}
            className="mt-2 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-sky to-accent text-white px-5 py-3 rounded-full text-sm font-semibold"
          >
            Book Appointment
          </button>
        </nav>
      )}
    </header>
  );
};