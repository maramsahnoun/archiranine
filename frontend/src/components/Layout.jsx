import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Menu, X, MessageCircle } from "lucide-react";
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
      </nav>
    </header>
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
