import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Instagram, Linkedin, Menu, X, MessageCircle, ArrowUpRight } from "lucide-react";
import BrandMark from "./BrandMark.jsx";

function safeProfileUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}

export function DemoNotice() {
  const [active, setActive] = useState(() => Boolean(window.__ARCHIHOME_DEMO__));
  useEffect(() => {
    const activate = () => setActive(true);
    window.addEventListener("archihome:demo", activate);
    return () => window.removeEventListener("archihome:demo", activate);
  }, []);
  return active ? (
    <div className="demo-notice">
      Mode démo actif. Connecté à la base de données Supabase.
    </div>
  ) : null;
}

export function Header({ settings }) {
  const siteName = settings?.site_name || settings?.siteName || "ArchiRanin";
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setMenuOpen(false), [location.pathname]);

  return (
    <header className={`topbar${menuOpen ? " menu-open" : ""}`}>
      <Link className="brand" to="/">
        <BrandMark />
        <span className="brand-text">
          <strong>{siteName}</strong>
          <span className="brand-sub">Architecte d’Intérieur</span>
        </span>
      </Link>
      <nav id="public-navigation" className={menuOpen ? "is-open" : ""}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>
          Accueil
        </NavLink>
        <NavLink to="/projects" onClick={() => setMenuOpen(false)}>
          Projets & 3D
        </NavLink>
        <NavLink to="/about" onClick={() => setMenuOpen(false)}>
          À propos
        </NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>
          Contact
        </NavLink>
        <Link
          to="/contact?sujet=devis"
          className="nav-cta-quote mobile-only-cta"
          onClick={() => setMenuOpen(false)}
        >
          Demander un devis <ArrowUpRight size={14} />
        </Link>
      </nav>
      <div className="topbar-actions">
        <Link to="/contact?sujet=devis" className="nav-cta-quote desktop-only-cta">
          <span>Demander un devis</span>
          <ArrowUpRight size={14} />
        </Link>
        <button
          className="mobile-nav-toggle"
          type="button"
          aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

export function FloatingWhatsApp({ settings }) {
  const rawWhatsapp = settings?.whatsapp_number || settings?.whatsapp || "+21646412009";
  const digits = rawWhatsapp.replace(/[^0-9]/g, "") || "21646412009";
  const message = encodeURIComponent(
    "Bonjour ArchiRanin, je souhaite demander un devis / discuter d'un projet d'architecture d'intérieur."
  );
  const href = `https://wa.me/${digits}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-fab"
      aria-label="Discuter sur WhatsApp"
      title="Discuter avec Ranine Sahnoun sur WhatsApp"
    >
      <span className="whatsapp-fab-pulse" aria-hidden="true" />
      <svg
        viewBox="0 0 32 32"
        width="26"
        height="26"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.004 3.2c-7.068 0-12.8 5.732-12.8 12.8 0 2.258.59 4.462 1.71 6.404L3.2 28.8l6.56-1.692a12.74 12.74 0 0 0 6.244 1.628h.006c7.066 0 12.79-5.732 12.79-12.8 0-3.42-1.332-6.636-3.75-9.054A12.712 12.712 0 0 0 16.004 3.2zm0 23.376h-.004a10.6 10.6 0 0 1-5.404-1.48l-.388-.23-4.016 1.036 1.072-3.916-.252-.402a10.574 10.574 0 0 1-1.636-5.654c0-5.862 4.77-10.63 10.634-10.63 2.84 0 5.51 1.106 7.518 3.116a10.562 10.562 0 0 1 3.112 7.52c0 5.864-4.772 10.64-10.636 10.64zm5.834-7.964c-.32-.16-1.892-.934-2.186-1.04-.292-.108-.506-.16-.72.16-.212.32-.826 1.04-1.012 1.254-.186.212-.372.24-.692.08-.32-.16-1.35-.498-2.572-1.586-.95-.848-1.592-1.896-1.778-2.216-.186-.32-.02-.492.14-.652.144-.144.32-.372.48-.558.16-.186.212-.32.32-.534.106-.212.054-.4-.026-.56-.08-.16-.72-1.734-.986-2.374-.26-.624-.524-.54-.72-.55-.186-.008-.4-.01-.612-.01s-.56.08-.852.4c-.294.32-1.12 1.094-1.12 2.668s1.146 3.094 1.306 3.308c.16.212 2.256 3.444 5.466 4.83.764.33 1.36.526 1.824.674.766.244 1.464.21 2.016.128.614-.092 1.892-.774 2.16-1.52.266-.746.266-1.386.186-1.52-.08-.134-.292-.214-.612-.374z" />
      </svg>
      <span className="whatsapp-fab-label">WhatsApp</span>
    </a>
  );
}

export function Footer({ settings }) {
  const siteName = settings?.site_name || settings?.siteName || "ArchiRanin";
  const email = settings?.company_email || settings?.companyEmail || "sahnounranine8@gmail.com";
  const phone = settings?.company_phone || settings?.companyPhone || "+216 46 412 009";
  const address = settings?.company_address || settings?.companyAddress || "Tunis, Tunisie";
  const linkedin = settings?.linkedin_url || settings?.linkedinUrl || "https://www.linkedin.com/in/ranine-sahnoun-08470a247";
  const instagram = settings?.instagram_url || settings?.instagramUrl;
  const whatsapp = settings?.whatsapp_number || settings?.whatsapp || "+21646412009";

  const socialLinks = [
    ["LinkedIn", linkedin, Linkedin],
    ["Instagram", instagram, Instagram],
    ["WhatsApp", whatsapp ? `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}` : "", MessageCircle],
  ]
    .map(([label, value, Icon]) => ({ label, href: safeProfileUrl(value), Icon }))
    .filter((item) => item.href);

  return (
    <footer className="footer">
      <Link className="brand" to="/">
        <BrandMark />
        <span>{siteName}</span>
      </Link>
      <div className="footer-company">
        {address && <span>{address}</span>}
        {email && <a href={`mailto:${email}`}>{email}</a>}
        {phone && <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>}
        {whatsapp && (
          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="whatsapp-pill"
            style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "#25D366" }}
          >
            <MessageCircle size={15} /> WhatsApp Direct: {phone}
          </a>
        )}
      </div>
      <span className="footer-copyright">
        © {new Date().getFullYear()} {siteName} · Ranine Sahnoun · Architecture d’Intérieur & Design 3D
      </span>
      {socialLinks.length > 0 && (
        <nav className="footer-social" aria-label="Réseaux sociaux">
          {socialLinks.map(({ label, href, Icon }) => (
            <a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer">
              <Icon size={17} />
              <span>{label}</span>
            </a>
          ))}
        </nav>
      )}
      <Link to="/contact">Prendre rendez-vous</Link>
    </footer>
  );
}

export function Loading() {
  return <div className="state">Chargement des projets…</div>;
}

export function ErrorState({ message = "Une erreur est survenue." }) {
  return <div className="state error">{message}</div>;
}

export function Empty({ children = "Aucun projet publié pour le moment." }) {
  return <div className="state">{children}</div>;
}
