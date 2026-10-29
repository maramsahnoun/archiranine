import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Mail,
  House,
  Trees,
  Layers3,
  CheckCircle2,
  Download,
  Video,
  Palette,
  Maximize2,
  X,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { api, request } from "./services/api.js";
import {
  Header,
  Footer,
  Loading,
  ErrorState,
  Empty,
  DemoNotice,
} from "./components/Layout.jsx";
import { ProjectCard } from "./components/ProjectCard.jsx";
import HouseViewer from "./components/HouseViewer.jsx";
import HeroHouse from "./components/HeroHouse.jsx";

function useProjects(params = {}) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    let live = true;
    request(api.get("/projects", { params }))
      .then((d) => live && setData(d))
      .catch(
        (e) =>
          live &&
          setError(
            e.response?.data?.message || "Impossible de charger les projets.",
          ),
      );
    return () => {
      live = false;
    };
  }, [JSON.stringify(params)]);
  return { data, error };
}

function Home() {
  const { data, error } = useProjects({ limit: 4, sort: "latest" });
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    request(api.get("/categories"))
      .then(setCategories)
      .catch(() => {});
  }, []);

  const firstProjectWith3d = data?.projects?.find(p => p.model3dUrl) || data?.projects?.[0];

  return (
    <>
      <section className="hero hero-architect">
        <div className="blueprint-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="hero-dot" /> ARCHITECTURE D’INTÉRIEUR & DESIGN D'ESPACE
          </div>
          <h1>
            Sublimer les espaces.<br />Révéler la matière.
          </h1>
          <p>
            Par <strong>Ranine Sahnoun</strong>. Explorez chaque création en 3D interactive, parcourez les plans 2D d'aménagement et visualisez chaque matière avant sa réalisation.
          </p>
          <SearchBar categories={categories} />
          <div className="hero-stats">
            <div>
              <b>3D</b>
              <span>Immersion interactive</span>
            </div>
            <div>
              <b>2D</b>
              <span>Plans d’aménagement</span>
            </div>
            <div>
              <b>HD</b>
              <span>Rendus photoréalistes</span>
            </div>
          </div>
        </div>
        <div className="scene-wrap">
          <div className="scene-glow" />
          <div className="ground-shadow" />
          <div className="hero-badge badge-one">
            <span />{" "}
            <div>
              <b>Projet ArchiRanin</b>
              <br />
              Design & Conception sur-mesure
            </div>
          </div>
          <div className="hero-badge badge-two">
            <span />{" "}
            <div>
              <b>Modélisation 3D</b>
              <br />
              Visite interactive
            </div>
          </div>
          <HeroHouse />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">SÉLECTION ARCHIRANIN</span>
            <h2>Projets & Réalisations</h2>
          </div>
          <Link className="text-link" to="/projects">
            Tous les projets <ArrowRight size={15} />
          </Link>
        </div>
        {error ? (
          <ErrorState message={error} />
        ) : !data ? (
          <Loading />
        ) : data.projects?.length ? (
          <div className="project-grid">
            {data.projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        ) : (
          <Empty />
        )}
      </section>

      <section className="home-viewer">
        <div className="showcase-copy">
          <span className="eyebrow">EXPÉRIENCE 3D INNOVANTE</span>
          <h2>
            Vivez l’espace
            <br />
            avant de le construire.
          </h2>
          <p>
            Manipulez les volumes à 360°, observez les angles de lumière naturelle et découvrez comment chaque pièce est optimisée pour votre quotidien.
          </p>
          <Link className="light-link" to={firstProjectWith3d ? `/projects/${firstProjectWith3d.slug}` : "/projects"}>
            Explorer ce projet en détail <ArrowRight size={15} />
          </Link>
        </div>
        <div className="showcase-model">
          <HouseViewer url={firstProjectWith3d?.model3dUrl} sceneBackground="#20150d" />
        </div>
      </section>

      <section className="values">
        <div>
          <span>01</span>
          <h3>Modélisation 3D Interactive</h3>
          <p>Chaque projet prend vie sous vos yeux avec un contrôle complet à 360°.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Plans 2D d’Aménagement</h3>
          <p>Surfaces, cotes, circulations et dossiers techniques téléchargeables en PDF.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Harmonie & Matières Nobles</h3>
          <p>Palette de textures naturelles, boiseries chaudes et éclairages étudiés.</p>
        </div>
      </section>
    </>
  );
}

function SearchBar({ categories }) {
  const [q, setQ] = useState(""),
    [cat, setCat] = useState("");
  const nav = useNavigate();
  return (
    <form
      className="search-bar"
      onSubmit={(e) => {
        e.preventDefault();
        const p = new URLSearchParams();
        if (q) p.set("search", q);
        if (cat) p.set("category", cat);
        nav(`/projects?${p}`);
      }}
    >
      <Search size={16} />
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Rechercher une villa, un style, un aménagement…"
      />
      <select value={cat} onChange={(e) => setCat(e.target.value)}>
        <option value="">Toutes les catégories</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <button aria-label="Rechercher">
        <ArrowRight size={17} />
      </button>
    </form>
  );
}

function Projects() {
  const [search, setSearch] = useState(
      new URLSearchParams(location.search).get("search") || "",
    ),
    [category, setCategory] = useState(
      new URLSearchParams(location.search).get("category") || "",
    ),
    [categories, setCategories] = useState([]);
  const { data, error } = useProjects({ search, category, limit: 24 });
  useEffect(() => {
    request(api.get("/categories"))
      .then(setCategories)
      .catch(() => {});
  }, []);
  return (
    <section className="section listing">
      <div className="section-header">
        <div>
          <span className="eyebrow">PORTFOLIO</span>
          <h1>Tous nos projets d'architecture</h1>
        </div>
      </div>
      <div className="filters">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher par nom, style, mot-clé…"
          />
        </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">Toutes les catégories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      {error ? (
        <ErrorState message={error} />
      ) : !data ? (
        <Loading />
      ) : data.projects.length ? (
        <>
          <div className="project-grid">
            {data.projects.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
          <p className="pagination-note">{data.pagination.total} projet(s) répertorié(s)</p>
        </>
      ) : (
        <Empty />
      )}
    </section>
  );
}

function Detail({ siteName = "ArchiRanin" }) {
  const { slug } = useParams(),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [notFound, setNotFound] = useState(false),
    [tab, setTab] = useState("3d"),
    [activeModalImage, setActiveModalImage] = useState(null);

  useEffect(() => {
    let live = true;
    request(api.get(`/projects/${slug}`))
      .then((p) => {
        if (!live) return;
        setData(p);
        document.title = `${p.title} | ${siteName} - Architecte d'Intérieur`;
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute(
            "content",
            p.shortDescription || p.description?.slice(0, 155) || p.title,
          );
        document
          .querySelector('link[rel="canonical"]')
          ?.setAttribute("href", window.location.href);
        document
          .querySelector('meta[property="og:title"]')
          ?.setAttribute("content", `${p.title} | ${siteName}`);
        document
          .querySelector('meta[property="og:image"]')
          ?.setAttribute("content", p.coverImage || "");
        api.post(`/projects/${p.id}/view`).catch(() => {});
      })
      .catch((e) => {
        if (!live) return;
        if (e.response?.status === 404) setNotFound(true);
        else
          setError(
            e.response?.data?.message || "Impossible de charger ce projet.",
          );
      });
    return () => {
      live = false;
    };
  }, [slug, siteName]);

  useEffect(
    () => () => {
      document.title = `${siteName} | Architecte d’Intérieur`;
      document
        .querySelector('link[rel="canonical"]')
        ?.setAttribute("href", window.location.origin);
    },
    [siteName],
  );

  if (notFound) return <NotFound />;
  if (error)
    return (
      <section className="section">
        <ErrorState message={error} />
        <Link to="/projects">Retour aux projets</Link>
      </section>
    );
  if (!data) return <Loading />;
  const cover = data.coverImage || data.images?.[0]?.imageUrl;

  const projectColors = [
    { hex: "#c0ab94", name: "Travertin & Sable" },
    { hex: "#896130", name: "Chêne Doré" },
    { hex: "#49321d", name: "Noyer Ébène" },
    { hex: "#8c6232", name: "Ambre Chaud" },
    { hex: "#614e3e", name: "Taupe Minéral" },
  ];

  return (
    <main className="detail-wrap">
      <div className="crumb">
        <Link to="/">Accueil</Link>
        <span>›</span>
        <Link to="/projects">Projets</Link>
        <span>›</span>
        <b>{data.title}</b>
      </div>

      <div className="detail-grid">
        <div className="detail-copy">
          <span className="pill">{data.category || data.style || "Architecture"}</span>
          <h1>{data.title}</h1>
          <div className="detail-meta">
            <span>
              <House size={15} />
              {data.surface || "—"} m² habitables
            </span>
            <span>
              <Trees size={15} />
              Terrain : {data.landSurface || "—"} m²
            </span>
            <span>
              <Layers3 size={15} />
              {data.floors || 1} niveau{Number(data.floors) === 1 ? "" : "x"}
            </span>
          </div>
          <p>{data.shortDescription || data.description}</p>
          <div className="action-row" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <Link
              className="button primary"
              to={`/contact?project=${encodeURIComponent(data.title)}`}
            >
              <Mail size={15} /> Discuter de ce projet
            </Link>
            <a
              href={`https://wa.me/21646412009?text=${encodeURIComponent(`Bonjour Ranine, je m’intéresse au projet ${data.title}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="button outline"
              style={{ color: "#25D366", borderColor: "#25D366" }}
            >
              <MessageCircle size={15} /> WhatsApp Direct
            </a>
          </div>
        </div>
        <div
          className="detail-image"
          role="img"
          aria-label={`Photo de ${data.title}`}
          style={cover ? { backgroundImage: `url("${cover}")` } : undefined}
        />
      </div>

      {data.images?.length > 1 && (
        <div className="detail-image-grid">
          {data.images.slice(1, 4).map((i) => (
            <div
              key={i.id}
              style={{ position: "relative", cursor: "pointer", height: "100%" }}
              onClick={() => setActiveModalImage(i.imageUrl)}
            >
              <img
                src={i.imageUrl}
                alt={i.altText || data.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <span
                style={{
                  position: "absolute",
                  bottom: 8,
                  right: 8,
                  background: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  fontSize: "10px",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <Maximize2 size={12} /> Agrandir
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Architectural Palette Bar */}
      <section style={{ maxWidth: "1320px", margin: "25px auto 10px", padding: "0 5.4vw" }}>
        <div
          style={{
            background: "#faf7f4",
            border: "1px solid #ede5dd",
            borderRadius: "8px",
            padding: "16px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "15px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Palette size={18} color="#896130" />
            <div>
              <b style={{ fontSize: "12px", color: "#49321d" }}>Harmonie & Palette de Matières</b>
              <div style={{ fontSize: "11px", color: "#7d7065" }}>Nuancier sélectionné pour ce projet</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
            {projectColors.map((c) => (
              <div key={c.hex} style={{ display: "flex", alignItems: "center", gap: "6px" }} title={`${c.name} (${c.hex})`}>
                <span
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                    backgroundColor: c.hex,
                    border: "1px solid rgba(0,0,0,0.1)",
                    display: "inline-block",
                  }}
                />
                <span style={{ fontSize: "11px", color: "#49321d", fontWeight: "500" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="detail-section">
        <div className="tabbar" role="tablist" aria-label="Contenu du projet">
          <button
            role="tab"
            aria-selected={tab === "3d"}
            className={tab === "3d" ? "active" : ""}
            onClick={() => setTab("3d")}
          >
            Modèle 3D Interactif
          </button>
          <button
            role="tab"
            aria-selected={tab === "plans"}
            className={tab === "plans" ? "active" : ""}
            onClick={() => setTab("plans")}
          >
            Plans 2D ({data.plans?.length || 0})
          </button>
          <button
            role="tab"
            aria-selected={tab === "gallery"}
            className={tab === "gallery" ? "active" : ""}
            onClick={() => setTab("gallery")}
          >
            Galerie Rendus ({data.images?.length || 0})
          </button>
          {data.videoUrl && (
            <button
              role="tab"
              aria-selected={tab === "video"}
              className={tab === "video" ? "active" : ""}
              onClick={() => setTab("video")}
            >
              <Video size={13} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} />
              Visite Vidéo
            </button>
          )}
        </div>

        <div className="detail-viewer-layout">
          <div className="detail-viewer-main">
            {tab === "3d" ? (
              <HouseViewer url={data.model3dUrl} sceneBackground="#1f1813" />
            ) : tab === "plans" ? (
              <div id="plans" className="plans-grid">
                {data.plans?.length ? (
                  data.plans.map((p) => (
                    <article key={p.id} className="plan-card" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      <h3>{p.floorName}</h3>
                      {p.imageUrl && (
                        <img
                          src={p.imageUrl}
                          alt={p.floorName}
                          style={{ cursor: "pointer", borderRadius: "4px" }}
                          onClick={() => setActiveModalImage(p.imageUrl)}
                        />
                      )}
                      {p.pdfUrl && (
                        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                          <iframe
                            className="plan-pdf-view"
                            src={p.pdfUrl}
                            title={`Plan ${p.floorName}`}
                            style={{ height: "260px", width: "100%", border: "1px solid #ede5dd", borderRadius: "4px" }}
                          />
                          <a
                            href={p.pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="button outline"
                            style={{ justifyContent: "center", fontSize: "11px", gap: "6px" }}
                          >
                            <Download size={14} /> Télécharger le plan PDF
                          </a>
                        </div>
                      )}
                    </article>
                  ))
                ) : (
                  <Empty>Les plans de ce projet ne sont pas encore disponibles.</Empty>
                )}
              </div>
            ) : tab === "video" && data.videoUrl ? (
              <div style={{ borderRadius: "8px", overflow: "hidden", background: "#000", aspectRatio: "16/9" }}>
                {data.videoUrl.endsWith(".mp4") ? (
                  <video src={data.videoUrl} controls style={{ width: "100%", height: "100%" }} />
                ) : (
                  <iframe src={data.videoUrl} title="Visite vidéo" style={{ width: "100%", height: "100%", border: 0 }} allowFullScreen />
                )}
              </div>
            ) : (
              <div className="gallery-grid">
                {data.images?.length ? (
                  data.images.map((i) => (
                    <div
                      key={i.id}
                      style={{ position: "relative", cursor: "pointer", overflow: "hidden", borderRadius: "6px" }}
                      onClick={() => setActiveModalImage(i.imageUrl)}
                    >
                      <img
                        src={i.imageUrl}
                        alt={i.altText || data.title}
                        style={{ width: "100%", height: "220px", objectFit: "cover" }}
                      />
                    </div>
                  ))
                ) : (
                  <Empty>Aucune image de galerie pour le moment.</Empty>
                )}
              </div>
            )}
          </div>

          <aside className="detail-sideinfo">
            <h2>Fiche Technique</h2>
            <div>
              <span>Surface habitable</span>
              <b>{data.surface || "—"} m²</b>
            </div>
            <div>
              <span>Surface terrain</span>
              <b>{data.landSurface || "—"} m²</b>
            </div>
            <div>
              <span>Niveaux</span>
              <b>{data.floors || 1}</b>
            </div>
            <div>
              <span>Chambres</span>
              <b>{data.bedrooms || "—"}</b>
            </div>
            <div>
              <span>Salles d'eau</span>
              <b>{data.bathrooms || "—"}</b>
            </div>
            <div>
              <span>Style</span>
              <b>{data.style || data.category || "—"}</b>
            </div>
            {data.location && (
              <div>
                <span>Localisation</span>
                <b>{data.location}</b>
              </div>
            )}
            <Link
              className="button primary"
              to={`/contact?project=${encodeURIComponent(data.title)}`}
            >
              <Mail size={14} /> Demander un devis
            </Link>
          </aside>
        </div>
      </section>

      <section className="section description">
        <span className="eyebrow">CONCEPTION ARCHITECTURALE</span>
        <h2>La vision du projet</h2>
        <p>{data.description || data.shortDescription}</p>
      </section>

      {/* Lightbox Modal */}
      {activeModalImage && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(10, 8, 6, 0.92)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
          onClick={() => setActiveModalImage(null)}
        >
          <button
            onClick={() => setActiveModalImage(null)}
            style={{
              position: "absolute",
              top: "20px",
              right: "20px",
              background: "#3d2a19",
              color: "#fff",
              border: 0,
              borderRadius: "50%",
              width: "40px",
              height: "40px",
              display: "grid",
              placeItems: "center",
            }}
          >
            <X size={20} />
          </button>
          <img
            src={activeModalImage}
            alt="Vue agrandie"
            style={{ maxHeight: "90vh", maxWidth: "90vw", objectFit: "contain", borderRadius: "6px" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </main>
  );
}

function Contact({ settings }) {
  const [done, setDone] = useState(false),
    [error, setError] = useState("");
  const project = new URLSearchParams(location.search).get("project") || "";

  async function submit(e) {
    e.preventDefault();
    setError("");
    const f = new FormData(e.currentTarget);
    try {
      await request(api.post("/messages", Object.fromEntries(f)));
      setDone(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Votre message n’a pas pu être envoyé.",
      );
    }
  }

  const email = settings?.company_email || settings?.companyEmail || "sahnounranine8@gmail.com";
  const phone = settings?.company_phone || settings?.companyPhone || "+216 46 412 009";
  const whatsapp = settings?.whatsapp_number || "+21646412009";

  return (
    <section className="section form-page">
      <span className="eyebrow">VOTRE PROJET SUR-MESURE</span>
      <h1>Parlons de vos espaces.</h1>
      <p>
        Vous avez un projet d'aménagement, de rénovation ou de construction ? Contactez <strong>Ranine Sahnoun</strong> pour échanger sur vos envies et recevoir un accompagnement personnalisé.
      </p>

      <div className="contact-layout">
        <div className="contact-form-column">
          {done ? (
            <div className="success-box">
              <CheckCircle2 /> Merci, votre message a bien été transmis. Ranine Sahnoun vous répondra dans les plus brefs délais.
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="form-two">
                <label>
                  Votre Nom & Prénom
                  <input name="name" required minLength="2" placeholder="Ex: Sarah Ben Salem" />
                </label>
                <label>
                  Email
                  <input type="email" name="email" required placeholder="nom@exemple.com" />
                </label>
              </div>
              <div className="form-two">
                <label>
                  Téléphone
                  <input name="phone" type="tel" placeholder="+216 ..." />
                </label>
                <label>
                  Sujet du projet
                  <input name="subject" defaultValue={project} placeholder="Ex: Aménagement villa contemporaine" />
                </label>
              </div>
              <label>
                Détails de votre projet
                <textarea
                  name="message"
                  required
                  minLength="10"
                  rows="6"
                  placeholder="Décrivez votre projet : type de bien, surface, style recherché, délais souhaités..."
                />
              </label>
              {error && <p className="form-error">{error}</p>}
              <button className="button primary">
                Envoyer ma demande <ArrowRight size={15} />
              </button>
            </form>
          )}
        </div>

        <aside className="contact-info">
          <span className="eyebrow">CONTACT DIRECT</span>
          <h2>ArchiRanin</h2>
          <p>Ranine Sahnoun · Architecte d’Intérieur</p>

          <a
            href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "#25D36615",
              color: "#128C7E",
              padding: "12px 16px",
              borderRadius: "6px",
              fontWeight: "600",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            <MessageCircle size={18} />
            <span>
              <small style={{ display: "block", fontSize: "10px", opacity: 0.8 }}>WhatsApp direct</small>
              {phone}
            </span>
          </a>

          {email && (
            <a href={`mailto:${email}`}>
              <Mail size={16} />
              <span>
                <small>Email</small>
                {email}
              </span>
            </a>
          )}
          {phone && (
            <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>
              <ArrowRight size={16} />
              <span>
                <small>Téléphone</small>
                {phone}
              </span>
            </a>
          )}
          <div className="contact-address">
            <House size={16} />
            <span>
              <small>Localisation</small>
              Tunis, Tunisie & International
            </span>
          </div>
        </aside>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section about-page">
      <span className="eyebrow">À PROPOS D’ARCHIRANIN</span>
      <h1>L’équilibre parfait entre volume, lumière et matière.</h1>
      <p>
        Fondé par <strong>Ranine Sahnoun</strong>, le studio <strong>ArchiRanin</strong> conçoit des intérieurs singuliers et intemporels. Notre approche associe la rigueur technique des plans 2D d’aménagement à la puissance visuelle de la modélisation 3D interactive photoréaliste.
      </p>
      <p>
        Chaque projet fait l’objet d’une recherche minutieuse de matériaux : pierre naturelle, boiseries chaleureuses, menuiseries épurées et palettes chromatiques apaisantes, afin de créer des lieux de vie uniques qui vous ressemblent.
      </p>
      <div style={{ display: "flex", gap: "12px", marginTop: "25px" }}>
        <Link className="button primary" to="/projects">
          Explorer les réalisations <ArrowRight size={15} />
        </Link>
        <Link className="button outline" to="/contact">
          Nous contacter
        </Link>
      </div>
    </section>
  );
}

function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-copy">
        <span className="not-found-code">
          <i /> ERREUR 404
        </span>
        <h1>Cette page<br />n’existe pas.</h1>
        <p>L’adresse demandée est introuvable. Retrouvez facilement nos créations d'architecture d'intérieur.</p>
        <div className="not-found-actions">
          <Link className="button primary" to="/">
            Retour à l’accueil <ArrowRight size={15} />
          </Link>
          <Link className="button outline" to="/projects">
            Voir les projets
          </Link>
        </div>
      </div>
      <div className="not-found-art" aria-hidden="true">
        <span>404</span>
        <div>
          <House size={42} />
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [settings, setSettings] = useState({
    siteName: "ArchiRanin",
    site_name: "ArchiRanin",
    companyEmail: "sahnounranine8@gmail.com",
    companyPhone: "+216 46 412 009",
    companyAddress: "Tunis, Tunisie",
    linkedinUrl: "https://www.linkedin.com/in/ranine-sahnoun-08470a247",
    whatsapp: "+21646412009",
  });
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    request(api.get("/settings"))
      .then((data) => {
        if (!alive || !data) return;
        setSettings({
          siteName: data.site_name || data.siteName || "ArchiRanin",
          site_name: data.site_name || data.siteName || "ArchiRanin",
          companyEmail: data.company_email || data.companyEmail || "sahnounranine8@gmail.com",
          companyPhone: data.company_phone || data.companyPhone || "+216 46 412 009",
          companyAddress: data.company_address || data.companyAddress || "Tunis, Tunisie",
          linkedinUrl: data.linkedin_url || data.linkedinUrl || "https://www.linkedin.com/in/ranine-sahnoun-08470a247",
          instagramUrl: data.instagram_url || data.instagramUrl,
          whatsapp: data.whatsapp_number || "+21646412009",
        });
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (/^\/projects\/[^/]+/.test(location.pathname)) return;
    const name = settings.siteName || "ArchiRanin";
    document.title = `${name} | Architecte d’Intérieur & Design d'Espace`;
    document
      .querySelector('meta[property="og:site_name"]')
      ?.setAttribute("content", name);
    document
      .querySelector('meta[property="og:title"]')
      ?.setAttribute("content", `${name} | Architecte d’Intérieur`);
  }, [settings.siteName, location.pathname]);

  return (
    <>
      <Header settings={settings} />
      <DemoNotice />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route
          path="/projects/:slug"
          element={<Detail siteName={settings.siteName} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact settings={settings} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer settings={settings} />
    </>
  );
}
