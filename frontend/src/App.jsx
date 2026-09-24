import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate, useParams } from "react-router-dom";
import {
  Search,
  ArrowRight,
  ArrowUpRight,
  Mail,
  House,
  Trees,
  Layers3,
  CheckCircle2,
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
  return (
    <>
      <section className="hero hero-architect">
        <div className="blueprint-grid" aria-hidden="true" />
        <div className="hero-copy">
          <div className="hero-eyebrow"><span className="hero-dot" /> Architecture pensée pour vous</div>
          <h1>Des maisons<br />qui prennent vie.</h1>
          <p>Explorez des projets d’architecture moderne en 3D, consultez les plans 2D et découvrez chaque détail avant la première pierre.</p>
          <SearchBar categories={categories} />
          <div className="hero-stats">
            <div><b>3D</b><span>Visite interactive</span></div>
            <div><b>2D</b><span>Plans détaillés</span></div>
            <div><b>PDF</b><span>Documents à consulter</span></div>
          </div>
        </div>
        <div className="scene-wrap">
          <div className="scene-glow" />
          <div className="ground-shadow" />
          <div className="hero-badge badge-one"><span /> <div><b>Projet conçu</b><br/>Détails architecturaux</div></div>
          <div className="hero-badge badge-two"><span /> <div><b>Vue immersive</b><br/>Explorez en 3D</div></div>
          <HeroHouse />
        </div>
      </section>
      <section className="section">
        <div className="section-header">
          <div>
            <span className="eyebrow">SÉLECTION ARCHIRANI</span>
            <h2>Projets récents</h2>
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
          <span className="eyebrow">DU PLAN À LA MAISON</span>
          <h2>
            Voyez l’espace
            <br />
            autrement.
          </h2>
          <p>
            Parcourez les volumes, observez les façades et imaginez votre futur
            lieu de vie.
          </p>
          <Link className="light-link" to="/projects">
            Explorer les projets <ArrowRight size={15} />
          </Link>
        </div>
        <div className="showcase-model">
          <HouseViewer />
        </div>
      </section>
      <section className="values">
        <div>
          <span>01</span>
          <h3>Des plans lisibles</h3>
          <p>Surfaces et niveaux présentés avec clarté.</p>
        </div>
        <div>
          <span>02</span>
          <h3>Une visite immersive</h3>
          <p>Manipulez le modèle 3D directement dans le navigateur.</p>
        </div>
        <div>
          <span>03</span>
          <h3>Un accompagnement humain</h3>
          <p>Parlons ensemble de votre prochain projet.</p>
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
        placeholder="Rechercher un projet…"
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
          <span className="eyebrow">BIBLIOTHÈQUE</span>
          <h1>Tous nos projets</h1>
        </div>
      </div>
      <div className="filters">
        <label>
          <Search size={16} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nom, style…"
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
          <p className="pagination-note">{data.pagination.total} projet(s)</p>
        </>
      ) : (
        <Empty />
      )}
    </section>
  );
}
function Detail() {
  const { slug } = useParams(),
    [data, setData] = useState(null),
    [error, setError] = useState(""),
    [notFound, setNotFound] = useState(false),
    [tab, setTab] = useState("3d");
  useEffect(() => {
    let live = true;
    request(api.get(`/projects/${slug}`))
      .then((p) => {
        if (!live) return;
        setData(p);
        document.title = `${p.title} — Archirani`;
        document.querySelector('meta[name="description"]')?.setAttribute("content", p.shortDescription || p.description?.slice(0, 155) || p.title);
        document.querySelector('link[rel="canonical"]')?.setAttribute("href", window.location.href);
        document.querySelector('meta[property="og:title"]')?.setAttribute("content", p.title);
        api.post(`/projects/${p.id}/view`).catch(() => {});
      })
      .catch((e) => {
        if (!live) return;
        if (e.response?.status === 404) setNotFound(true);
        else setError(e.response?.data?.message || "Impossible de charger ce projet.");
      });
    return () => { live = false; };
  }, [slug]);
  useEffect(() => () => {
    document.title = "Archirani — Des maisons qui inspirent";
    document.querySelector('link[rel="canonical"]')?.setAttribute("href", window.location.origin);
  }, []);
  if (notFound) return <NotFound />;
  if (error) return <section className="section"><ErrorState message={error} /><Link to="/projects">Retour aux projets</Link></section>;
  if (!data) return <Loading />;
  const cover = data.coverImage || data.images?.[0]?.imageUrl;
  return (
    <main className="detail-wrap">
      <div className="crumb"><Link to="/">Accueil</Link><span>›</span><Link to="/projects">Projets</Link><span>›</span><b>{data.title}</b></div>
      <div className="detail-grid">
        <div className="detail-copy">
          <span className="pill">{data.category || data.style || "Projet"}</span>
          <h1>{data.title}</h1>
          <div className="detail-meta">
            <span><House size={15}/>{data.surface || "—"} m² habitables</span>
            <span><Trees size={15}/>Terrain : {data.landSurface || "—"} m²</span>
            <span><Layers3 size={15}/>{data.floors || 1} étage{Number(data.floors) === 1 ? "" : "s"}</span>
          </div>
          <p>{data.shortDescription || data.description}</p>
          <div className="action-row"><Link className="button outline" to={`/contact?project=${encodeURIComponent(data.title)}`}><Mail size={15}/>Contacter notre équipe</Link></div>
        </div>
        <div className="detail-image" role="img" aria-label={`Photo de ${data.title}`} style={cover ? {backgroundImage:`url("${cover}")`} : undefined}/>
      </div>
      {data.images?.length > 1 && <div className="detail-image-grid">{data.images.slice(1, 4).map((i) => <img key={i.id} src={i.imageUrl} alt={i.altText || data.title}/>)}</div>}
      <section className="detail-section">
        <div className="tabbar" role="tablist" aria-label="Contenu du projet">
          <button role="tab" aria-selected={tab === "3d"} className={tab === "3d" ? "active" : ""} onClick={() => setTab("3d")}>Vue 3D</button>
          <button role="tab" aria-selected={tab === "plans"} className={tab === "plans" ? "active" : ""} onClick={() => setTab("plans")}>Plan 2D</button>
          <button role="tab" aria-selected={tab === "gallery"} className={tab === "gallery" ? "active" : ""} onClick={() => setTab("gallery")}>Galerie</button>
        </div>
        <div className="detail-viewer-layout">
          <div className="detail-viewer-main">
            {tab === "3d" ? <HouseViewer url={data.model3dUrl} sceneBackground="#f7f9fb"/> : tab === "plans" ? (
              <div id="plans" className="plans-grid">{data.plans?.length ? data.plans.map((p) => <article key={p.id} className="plan-card"><h3>{p.floorName}</h3>{p.imageUrl && <img src={p.imageUrl} alt={p.floorName} />}{p.pdfUrl && <iframe className="plan-pdf-view" src={p.pdfUrl} title={`Plan ${p.floorName}`}/>}</article>) : <Empty>Les plans de ce projet ne sont pas encore disponibles.</Empty>}</div>
            ) : <div className="gallery-grid">{data.images?.length ? data.images.map((i) => <img key={i.id} src={i.imageUrl} alt={i.altText || data.title}/>) : <Empty>Aucune image de galerie pour le moment.</Empty>}</div>}
          </div>
          <aside className="detail-sideinfo">
            <h2>Informations du projet</h2>
            <div><span>Surface habitable</span><b>{data.surface || "—"} m²</b></div>
            <div><span>Surface terrain</span><b>{data.landSurface || "—"} m²</b></div>
            <div><span>Nombre d’étages</span><b>{data.floors || 1}</b></div>
            <div><span>Style</span><b>{data.style || data.category || "—"}</b></div>
            {data.location && <div><span>Localisation</span><b>{data.location}</b></div>}
            <Link className="button primary" to={`/contact?project=${encodeURIComponent(data.title)}`}><Mail size={14}/>Contacter</Link>
          </aside>
        </div>
      </section>
      <section className="section description"><span className="eyebrow">LE PROJET</span><h2>Une maison pensée pour vivre.</h2><p>{data.description || data.shortDescription}</p></section>
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
  return (
    <section className="section form-page">
      <span className="eyebrow">PARLONS DE VOTRE PROJET</span>
      <h1>Contactez notre équipe.</h1>
      <p>Décrivez-nous votre idée, nous vous répondrons rapidement.</p>
      <div className="contact-layout">
      <div className="contact-form-column">
      {done ? (
        <div className="success-box">
          <CheckCircle2 /> Merci, votre message a bien été envoyé.
        </div>
      ) : (
        <form className="contact-form" onSubmit={submit}>
          <div className="form-two">
            <label>
              Nom
              <input name="name" required minLength="2" />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
          </div>
          <div className="form-two">
            <label>
              Téléphone
              <input name="phone" type="tel" />
            </label>
            <label>
              Sujet
              <input name="subject" defaultValue={project} />
            </label>
          </div>
          <label>
            Votre message
            <textarea name="message" required minLength="10" rows="6" />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button className="button primary">
            Envoyer le message <ArrowRight size={15} />
          </button>
        </form>
      )}
      </div>
      <aside className="contact-info">
        <span className="eyebrow">NOS COORDONNÉES</span>
        <h2>{settings?.siteName || "Archirani"}</h2>
        <p>Vous pouvez aussi nous joindre directement.</p>
        {settings?.companyEmail && <a href={`mailto:${settings.companyEmail}`}><Mail size={16}/><span><small>Email</small>{settings.companyEmail}</span></a>}
        {settings?.companyPhone && <a href={`tel:${settings.companyPhone.replace(/[^+\d]/g, "")}`}><ArrowRight size={16}/><span><small>Téléphone</small>{settings.companyPhone}</span></a>}
        {settings?.companyAddress && <div className="contact-address"><House size={16}/><span><small>Adresse</small>{settings.companyAddress}</span></div>}
      </aside>
      </div>
    </section>
  );
}
function About() {
  return (
    <section className="section about-page">
      <span className="eyebrow">À PROPOS D’ARCHIRANI</span>
      <h1>L’architecture à portée de regard.</h1>
      <p>
        Archirani rassemble des projets de maisons et d’espaces extérieurs pour
        vous aider à imaginer, comparer et préparer votre futur lieu de vie.
      </p>
      <Link className="button primary" to="/projects">
        Découvrir les projets <ArrowRight size={15} />
      </Link>
    </section>
  );
}
function NotFound() {
  return (
    <main className="not-found-page">
      <div className="not-found-copy">
        <span className="not-found-code"><i/> ERREUR 404</span>
        <h1>Cette page<br/>n’existe pas.</h1>
        <p>L’adresse est incorrecte ou la page a été déplacée. Retrouvez facilement les projets Archirani.</p>
        <div className="not-found-actions">
          <Link className="button primary" to="/">Retour à l’accueil <ArrowRight size={15}/></Link>
          <Link className="button outline" to="/projects">Voir les projets</Link>
        </div>
      </div>
      <div className="not-found-art" aria-hidden="true"><span>404</span><div><House size={42}/></div></div>
    </main>
  );
}
export default function App() {
  const [settings,setSettings]=useState({siteName:"Archirani",companyEmail:"",companyPhone:"",companyAddress:"",linkedinUrl:"",instagramUrl:"",facebookUrl:""});
  useEffect(()=>{let alive=true;request(api.get("/settings")).then(data=>alive&&setSettings(data)).catch(()=>{});return()=>{alive=false}},[]);
  return (
    <>
      <Header settings={settings} />
      <DemoNotice />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<Detail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact settings={settings} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer settings={settings} />
    </>
  );
}
