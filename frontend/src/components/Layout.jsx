import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Facebook, Instagram, Linkedin, Menu, X } from "lucide-react";
import BrandMark from "./BrandMark.jsx";
function safeProfileUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : "";
  } catch {
    return "";
  }
}
export function DemoNotice(){const[active,setActive]=useState(()=>Boolean(window.__ARCHIHOME_DEMO__));useEffect(()=>{const activate=()=>setActive(true);window.addEventListener('archihome:demo',activate);return()=>window.removeEventListener('archihome:demo',activate)},[]);return active?<div className="demo-notice">Mode démo local — l’API MySQL est indisponible. Les modifications ne sont pas enregistrées.</div>:null}
export function Header({ settings }) {
  const siteName = settings?.siteName || "Archirani";
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname]);
  return (
    <header className={`topbar${menuOpen ? " menu-open" : ""}`}>
      <Link className="brand" to="/">
        <BrandMark />
        {siteName}
      </Link>
      <button className="mobile-nav-toggle" type="button" aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"} aria-expanded={menuOpen} aria-controls="public-navigation" onClick={() => setMenuOpen((open) => !open)}>
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav id="public-navigation" className={menuOpen ? "is-open" : ""}>
        <NavLink to="/" onClick={() => setMenuOpen(false)}>Accueil</NavLink>
        <NavLink to="/projects" onClick={() => setMenuOpen(false)}>Projets</NavLink>
        <NavLink to="/about">À propos</NavLink>
        <NavLink to="/contact" onClick={() => setMenuOpen(false)}>Contact</NavLink>
      </nav>
    </header>
  );
}
export function Footer({ settings }) {
  const siteName = settings?.siteName || "Archirani";
  const socialLinks = [
    ["LinkedIn", settings?.linkedinUrl, Linkedin],
    ["Instagram", settings?.instagramUrl, Instagram],
    ["Facebook", settings?.facebookUrl, Facebook],
  ].map(([label, value, Icon]) => ({ label, href: safeProfileUrl(value), Icon })).filter((item) => item.href);
  return (
    <footer className="footer">
      <Link className="brand" to="/">
        <BrandMark />
        {siteName}
      </Link>
      <div className="footer-company">
        {settings?.companyAddress && <span>{settings.companyAddress}</span>}
        {settings?.companyEmail && <a href={`mailto:${settings.companyEmail}`}>{settings.companyEmail}</a>}
        {settings?.companyPhone && <a href={`tel:${settings.companyPhone.replace(/[^+\d]/g, "")}`}>{settings.companyPhone}</a>}
      </div>
      <span className="footer-copyright">© {new Date().getFullYear()} {siteName} · Des maisons qui inspirent</span>
      {socialLinks.length > 0 && <nav className="footer-social" aria-label="Réseaux sociaux">{socialLinks.map(({label,href,Icon})=><a key={label} href={href} aria-label={label} title={label} target="_blank" rel="noopener noreferrer"><Icon size={17}/><span>{label}</span></a>)}</nav>}
      <Link to="/contact">Nous contacter</Link>
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
