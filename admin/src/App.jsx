import { useCallback, useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  PanelsTopLeft,
  Box,
  Images,
  Mail,
  Settings,
  LogOut,
  Plus,
  Eye,
  Pencil,
  Trash2,
  ArrowUpRight,
  Search,
  CheckCircle2,
  Upload,
  Menu,
  X,
  ChevronRight,
} from "lucide-react";
import { api, request } from "./services/api.js";
import BrandMark from "./components/BrandMark.jsx";
const nav = [
  ["/", "Tableau de bord", LayoutDashboard],
  ["/projects", "Projets", FolderKanban],
  ["/categories", "Catégories", Tags],
  ["/plans", "Plans 2D", PanelsTopLeft],
  ["/models", "Modèles 3D", Box],
  ["/gallery", "Galerie", Images],
  ["/messages", "Messages", Mail],
  ["/settings", "Paramètres", Settings],
];
function SignIn({ onLogin, setupRequired }) {
  const [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const d = await request(api.post("/auth/login", { email, password }));
      onLogin(d.admin);
    } catch (e) {
      setError(
        e.response?.data?.message ||
          "Connexion impossible. Vérifiez vos identifiants.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="login-page">
      <div className="login-story">
        <div className="login-brand"><BrandMark /><span>Archirani</span></div>
        <span className="eyebrow">VOTRE ESPACE DE TRAVAIL</span>
        <h1>Chaque projet<br/>commence ici.</h1>
        <p>Retrouvez vos projets, plans, modèles 3D et demandes clients dans un espace conçu pour votre équipe.</p>
        <div className="story-foot">ARCHITECTURE · PROJETS · 3D</div>
      </div>
      <form className="login-card" onSubmit={submit}>
        <span className="eyebrow">ESPACE SÉCURISÉ</span>
        <h1>Bienvenue</h1>
        <p>Connectez-vous pour gérer vos projets.</p>
        <label>
          Email
          <input
            type="email"
            autoComplete="username"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@archirani.local"
          />
        </label>
        <label>
          Mot de passe
          <input
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Votre mot de passe"
          />
        </label>
        {error && <div className="alert error">{error}</div>}
        <button className="button blue" disabled={busy}>
          {busy ? "Connexion…" : "Se connecter"}
        </button>
        {setupRequired && <Link className="auth-switch" to="/setup">Première connexion ? Créer le compte administrateur</Link>}
        <small>Votre session utilise un cookie sécurisé HttpOnly.</small>
      </form>
      <div className="login-footer">ARCHIRANI · ADMINISTRATION</div>
    </main>
  );
}
function Setup({ onCreated, setupRequired }) {
  const [form,setForm]=useState({name:"",email:"",password:"",confirm:""}),[error,setError]=useState(""),[busy,setBusy]=useState(false);
  async function submit(e){e.preventDefault();setError("");if(form.password.length<12){setError("Choisissez un mot de passe d’au moins 12 caractères.");return}if(form.password!==form.confirm){setError("Les mots de passe ne correspondent pas.");return}setBusy(true);try{const d=await request(api.post("/auth/setup",{name:form.name,email:form.email,password:form.password}));onCreated(d.admin)}catch(e){setError(e.response?.data?.message||"Création impossible. Vérifiez la connexion à la base de données.")}finally{setBusy(false)}}
  return <main className="login-page"><div className="login-story"><div className="login-brand"><BrandMark/><span>Archirani</span></div><span className="eyebrow">VOTRE ESPACE DE TRAVAIL</span><h1>Chaque projet<br/>commence ici.</h1><p>Centralisez vos maisons, plans, modèles 3D et demandes clients dans un espace conçu pour votre équipe.</p><div className="story-foot">ARCHITECTURE · PROJETS · 3D</div></div><form className="login-card" onSubmit={submit}><span className="eyebrow">CONFIGURATION SÉCURISÉE</span><h1>Créer l’accès admin</h1><p>Ce formulaire sert uniquement à créer le premier compte. Il se ferme après sa création.</p>{!setupRequired&&<div className="alert error">La configuration initiale est déjà terminée. <Link to="/">Retour à la connexion</Link></div>}<label>Nom<input required maxLength="120" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Votre nom"/></label><label>Email<input type="email" autoComplete="email" required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="vous@entreprise.fr"/></label><label>Mot de passe<input type="password" autoComplete="new-password" minLength="12" required value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="12 caractères minimum"/></label><label>Confirmer le mot de passe<input type="password" autoComplete="new-password" required value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} placeholder="Répétez le mot de passe"/></label>{error&&<div className="alert error">{error}</div>}<button className="button blue" disabled={busy||!setupRequired}>{busy?"Création…":"Créer le compte et ouvrir le tableau de bord"}</button><Link className="auth-switch" to="/">J’ai déjà un compte</Link></form><div className="login-footer">ARCHIRANI · ADMINISTRATION</div></main>
}
function Shell({ admin, onLogout }) {
  const [menu, setMenu] = useState(false);
  const [demo, setDemo] = useState(() => Boolean(window.__ARCHIHOME_DEMO__));
  useEffect(() => { const activate=()=>setDemo(true);window.addEventListener("archihome:demo",activate);return()=>window.removeEventListener("archihome:demo",activate); }, []);
  return (
    <div className="admin-shell">
      <aside className={`sidebar ${menu ? "open" : ""}`}>
        <Link to="/" className="side-brand">
          <BrandMark />
          Archirani
        </Link>
        <div className="side-label">ESPACE DE TRAVAIL</div>
        <nav>
          {nav.map(([to, label, Icon]) => (
            <NavLink
              end={to === "/"}
              key={to}
              to={to}
              onClick={() => setMenu(false)}
            >
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <a
            href={import.meta.env.VITE_PUBLIC_URL || "http://localhost:5173"}
            target="_blank"
            rel="noreferrer"
          >
            <ArrowUpRight size={15} /> Voir le site
          </a>
          <button onClick={onLogout}>
            <LogOut size={15} /> Se déconnecter
          </button>
        </div>
      </aside>
      {menu && (
        <button
          className="mobile-scrim"
          onClick={() => setMenu(false)}
          aria-label="Fermer le menu"
        />
      )}
      <div className="admin-area">
        <header className="admin-bar">
          <button
            className="mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-label="Menu"
          >
            {menu ? <X /> : <Menu />}
          </button>
          <div className="breadcrumbs">
            Archirani <ChevronRight size={13} /> Administration
          </div>
          <div className="profile">
            <span className="avatar">
              {admin.name?.[0]?.toUpperCase() || "A"}
            </span>
            <span>{admin.name}</span>
            <small>Administrateur</small>
          </div>
        </header>
        {demo&&<div className="demo-banner">Mode démo local — données temporaires, non enregistrées dans MySQL.</div>}
        <div className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/new" element={<ProjectForm />} />
            <Route path="/projects/:id/edit" element={<ProjectForm />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/messages" element={<Messages />} />
            <Route
              path="/plans"
              element={<AssetPage type="plans" title="Plans 2D" />}
            />
            <Route
              path="/models"
              element={<AssetPage type="models" title="Modèles 3D" />}
            />
            <Route
              path="/gallery"
              element={<AssetPage type="gallery" title="Galerie" />}
            />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
function App() {
  const [admin, setAdmin] = useState(null),
    [checking, setChecking] = useState(true), [setupRequired,setSetupRequired]=useState(false);
  const refresh = useCallback(
    async () => {try{const d=await request(api.get("/auth/me"));setAdmin(d.admin)}catch{setAdmin(null);try{const status=await request(api.get("/auth/setup-status"));setSetupRequired(Boolean(status.required))}catch{setSetupRequired(false)}}finally{setChecking(false)}},
    [],
  );
  useEffect(() => {
    refresh();
  }, [refresh]);
  async function logout() {
    try {
      await request(api.post("/auth/logout"));
    } finally {
      setAdmin(null);
    }
  }
  if (checking) return <div className="loading-screen">Archirani</div>;
  return admin ? (
    <Shell admin={admin} onLogout={logout} />
  ) : (
    <Routes><Route path="/setup" element={<Setup onCreated={setAdmin} setupRequired={setupRequired}/>} /><Route path="*" element={<SignIn onLogin={setAdmin} setupRequired={setupRequired}/>} /></Routes>
  );
}
function useLoad(url, deps = []) {
  const [data, setData] = useState(null),
    [error, setError] = useState("");
  const reload = useCallback(() => {
    setError("");
    return request(api.get(url))
      .then(setData)
      .catch((e) =>
        setError(
          e.response?.data?.message || "Impossible de charger les données.",
        ),
      );
  }, [url]);
  useEffect(() => {
    reload();
  }, [reload, ...deps]);
  return { data, error, reload, setData };
}
function PageHeading({ eyebrow, title, description, action }) {
  return (
    <div className="page-heading">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action}
    </div>
  );
}
function Dashboard() {
  const { data: stats, error: e } = useLoad("/admin/dashboard/stats"),
    { data: recent } = useLoad("/admin/dashboard/recent-projects"),
    { data: popular } = useLoad("/admin/dashboard/popular-projects"),
    { data: views } = useLoad("/admin/dashboard/views");
  const viewMax = Math.max(1, ...(views || []).map((point) => Number(point.total)));
  return (
    <>
      <PageHeading
        eyebrow="VUE D’ENSEMBLE"
        title="Tableau de bord"
        description="Bonjour, voici un aperçu de votre site."
      />
      <div className="metric-grid">
        {[
          ["Total des projets", stats?.total ?? "—", "▣", "blue"],
          ["Projets publiés", stats?.published ?? "—", "✓", "green"],
          ["Brouillons", stats?.drafts ?? "—", "◷", "orange"],
          ["Visites", stats?.views ?? "—", "◉", "purple"],
        ].map(([name, value, icon, color]) => (
          <div className="metric" key={name}>
            <span className={`metric-icon ${color}`}>{icon}</span>
            <div>
              <small>{name}</small>
              <strong>{value}</strong>
            </div>
          </div>
        ))}
      </div>
      {e && <div className="alert error">{e}</div>}
      <div className="dash-columns">
        <section className="panel">
          <div className="panel-heading">
            <h2>Projets récents</h2>
            <Link to="/projects">
              Voir tout <ArrowUpRight size={14} />
            </Link>
          </div>
          <ProjectTable projects={recent || []} />
          <div className="views-chart-panel">
            <div className="panel-heading"><h2>Visites des 7 derniers jours</h2></div>
            <div className="views-chart">{(views || []).map((point) => <div className="view-column" key={String(point.date)}><b>{point.total}</b><i style={{height:`${Math.max(5,Number(point.total)/viewMax*100)}%`}}/><small>{new Date(point.date).toLocaleDateString('fr-FR',{weekday:'short'})}</small></div>)}</div>
            {!views?.length&&<small className="chart-empty">Les visites apparaîtront ici.</small>}
          </div>
        </section>
        <div className="dash-right">
          <section className="panel">
            <div className="panel-heading">
              <h2>Les plus consultés</h2>
            </div>
            {popular?.map((p) => (
              <div className="popular-row" key={p.id}>
                <div
                  className="thumb"
                  style={{
                    backgroundImage: p.coverImage
                      ? `url(${p.coverImage})`
                      : undefined,
                  }}
                />
                <span>
                  {p.title}
                  <small>{p.views} vues</small>
                </span>
                <ArrowUpRight size={14} />
              </div>
            ))}
          </section>
          <section className="panel">
            <div className="panel-heading">
              <h2>Messages</h2>
              <Link to="/messages">Consulter</Link>
            </div>
            <p className="panel-note">
              <Mail size={17} /> {stats?.unread ?? 0} message(s) non lu(s)
            </p>
          </section>
        </div>
      </div>
    </>
  );
}
function ProjectTable({ projects }) {
  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Projet</th>
            <th>Catégorie</th>
            <th>Surface</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr key={p.id}>
              <td>
                <div className="project-cell">
                  <div
                    className="thumb"
                    style={{
                      backgroundImage: p.coverImage
                        ? `url(${p.coverImage})`
                        : undefined,
                    }}
                  />
                  <Link to={`/projects/${p.id}/edit`}>{p.title}</Link>
                </div>
              </td>
              <td>{p.category || "—"}</td>
              <td>{p.surface ? `${p.surface} m²` : "—"}</td>
              <td>
                <Status value={p.status} />
              </td>
              <td className="actions">
                <Link to={`/projects/${p.id}/edit`} aria-label="Modifier">
                  <Pencil size={15} />
                </Link>
                <a
                  href={`${import.meta.env.VITE_PUBLIC_URL || "http://localhost:5173"}/projects/${p.slug}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Voir"
                >
                  <Eye size={15} />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {projects.length === 0 && (
        <div className="table-empty">
          Aucun projet. Créez votre premier projet.
        </div>
      )}
    </div>
  );
}
function Status({ value }) {
  return (
    <span className={`status ${value}`}>
      {value === "published"
        ? "Publié"
        : value === "archived"
          ? "Archivé"
          : "Brouillon"}
    </span>
  );
}
function Projects() {
  const { data, error, reload } = useLoad("/admin/projects?limit=100");
  const [search, setSearch] = useState("");
  async function status(id, action) {
    try {
      await request(api.patch(`/admin/projects/${id}/${action}`));
      reload();
    } catch (e) {
      alert(e.response?.data?.message || "Action impossible");
    }
  }
  async function remove(id) {
    if (!confirm("Supprimer définitivement ce projet et ses images/plans ?"))
      return;
    try {
      await request(api.delete(`/admin/projects/${id}`));
      reload();
    } catch (e) {
      alert(e.response?.data?.message || "Suppression impossible");
    }
  }
  const projects = (data?.projects || []).filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeading
        eyebrow="CONTENU"
        title="Projets"
        description="Créez et gérez les projets visibles sur le site public."
        action={
          <Link className="button blue" to="/projects/new">
            <Plus size={16} /> Ajouter un projet
          </Link>
        }
      />
      <section className="panel">
        <div className="panel-heading">
          <h2>
            Tous les projets <span className="count">{projects.length}</span>
          </h2>
          <label className="table-search">
            <Search size={15} />
            <input
              placeholder="Rechercher un projet"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </label>
        </div>
        {error && <div className="alert error">{error}</div>}
        <ProjectTable projects={projects} />
        <div className="project-manage">
          {projects.map((p) => (
            <div key={p.id}>
              <span>{p.title}</span>
              <div>
                {p.status === "published" ? (
                  <button onClick={() => status(p.id, "unpublish")}>
                    Dépublier
                  </button>
                ) : (
                  <button onClick={() => status(p.id, "publish")}>
                    Publier
                  </button>
                )}
                <button onClick={() => status(p.id, "archive")}>
                  Archiver
                </button>
                <Link to={`/projects/${p.id}/edit`}>Modifier</Link>
                <button className="danger-text" onClick={() => remove(p.id)}>
                  <Trash2 size={14} /> Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
function ProjectForm() {
  const nav = useNavigate();
  const editing = location.pathname.includes("/edit"),
    id = location.pathname.split("/").at(-2);
  const [form, setForm] = useState({
      title: "",
      shortDescription: "",
      description: "",
      categoryId: "",
      style: "",
      surface: "",
      landSurface: "",
      floors: 1,
      bedrooms: 0,
      bathrooms: 0,
      garage: false,
      location: "",
      status: "draft",
    }),
    [categories, setCategories] = useState([]),
    [images, setImages] = useState([]),
    [model, setModel] = useState(null),
    [plans, setPlans] = useState([]),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    request(api.get("/admin/categories"))
      .then(setCategories)
      .catch(() => {});
    if (editing)
      request(api.get(`/admin/projects/${id}`))
        .then((p) => {
          setForm({
            ...p,
            categoryId: p.categoryId || "",
            surface: p.surface || "",
            landSurface: p.landSurface || "",
          });
          setImages(p.images || []);
        })
        .catch((e) =>
          setMessage(e.response?.data?.message || "Projet introuvable."),
        );
  }, [id, editing]);
  function change(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    try {
      const payload = {
        ...form,
        categoryId: Number(form.categoryId),
        surface: form.surface === "" ? null : Number(form.surface),
        landSurface: form.landSurface === "" ? null : Number(form.landSurface),
        floors: Number(form.floors),
        bedrooms: Number(form.bedrooms),
        bathrooms: Number(form.bathrooms),
      };
      const d = await request(
        editing
          ? api.put(`/admin/projects/${id}`, payload)
          : api.post("/admin/projects", payload),
      );
      const projectId = editing ? id : d.id;
      if (model) {
        const fd = new FormData();
        fd.append("model", model);
        await request(api.post(`/admin/projects/${projectId}/model`, fd));
      }
      if (images.length && images[0] instanceof File) {
        const fd = new FormData();
        images
          .filter((x) => x instanceof File)
          .forEach((x) => fd.append("images", x));
        await request(api.post(`/admin/projects/${projectId}/images`, fd));
      }
      if (plans.length) {
        const fd = new FormData();
        plans.forEach((x) => fd.append("plans", x));
        await request(api.post(`/admin/projects/${projectId}/plans`, fd));
      }
      if (form.status === "published")
        await request(api.patch(`/admin/projects/${projectId}/publish`));
      nav("/projects");
    } catch (e) {
      setMessage(
        e.response?.data?.message ||
          "Enregistrement impossible. Vérifiez les champs et les fichiers.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="GESTION DE PROJET"
        title={editing ? "Modifier le projet" : "Ajouter un projet"}
        description="Renseignez les informations, les fichiers et le statut de publication."
      />
      <form onSubmit={submit}>
        <div className="wizard-steps">
          <span className="current">1　Informations générales</span>
          <span>2　Modèle 3D</span>
          <span>3　Plans 2D</span>
          <span>4　Galerie</span>
          <span>5　Publication</span>
        </div>
        <section className="panel form-panel">
          <h2>Informations générales</h2>
          <div className="form-grid">
            <label>
              Nom du projet *
              <input
                name="title"
                required
                minLength="2"
                maxLength="200"
                value={form.title}
                onChange={change}
              />
            </label>
            <label>
              Catégorie *
              <select
                required
                name="categoryId"
                value={form.categoryId}
                onChange={change}
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="wide">
              Description courte
              <input
                name="shortDescription"
                maxLength="500"
                value={form.shortDescription || ""}
                onChange={change}
              />
            </label>
            <label className="wide">
              Description
              <textarea
                name="description"
                rows="5"
                value={form.description || ""}
                onChange={change}
              />
            </label>
            <label>
              Surface habitable (m²)
              <input
                name="surface"
                type="number"
                min="0"
                value={form.surface}
                onChange={change}
              />
            </label>
            <label>
              Surface du terrain (m²)
              <input
                name="landSurface"
                type="number"
                min="0"
                value={form.landSurface}
                onChange={change}
              />
            </label>
            <label>
              Nombre d’étages
              <input
                name="floors"
                type="number"
                min="1"
                value={form.floors}
                onChange={change}
              />
            </label>
            <label>
              Style
              <input name="style" value={form.style || ""} onChange={change} />
            </label>
            <label>
              Chambres
              <input
                name="bedrooms"
                type="number"
                min="0"
                value={form.bedrooms}
                onChange={change}
              />
            </label>
            <label>
              Salles de bain
              <input
                name="bathrooms"
                type="number"
                min="0"
                value={form.bathrooms}
                onChange={change}
              />
            </label>
            <label>
              Lieu
              <input
                name="location"
                value={form.location || ""}
                onChange={change}
              />
            </label>
            <label className="check-label">
              <input
                name="garage"
                type="checkbox"
                checked={Boolean(form.garage)}
                onChange={change}
              />{" "}
              Garage
            </label>
          </div>
        </section>
        <section className="panel form-panel">
          <h2>Modèle 3D</h2>
          <FileDrop
            label="Choisir un modèle GLB/GLTF"
            accept=".glb,.gltf,model/gltf-binary,model/gltf+json"
            files={model ? [model] : []}
            onChange={(x) => setModel(x[0] || null)}
          />
        </section>
        <section className="panel form-panel">
          <h2>Plans 2D</h2>
          <FileDrop
            label="Ajouter des plans ou PDF"
            accept="image/png,image/jpeg,image/webp,application/pdf"
            files={plans}
            onChange={setPlans}
            multiple
          />
        </section>
        <section className="panel form-panel">
          <h2>Galerie du projet</h2>
          <FileDrop
            label="Ajouter des photos"
            accept="image/png,image/jpeg,image/webp"
            files={images.filter((x) => x instanceof File)}
            onChange={setImages}
            multiple
          />
          <div className="existing-images">
            {images
              .filter((x) => !(x instanceof File))
              .map((im) => (
                <img key={im.id} src={im.imageUrl} alt={im.altText || ""} />
              ))}
          </div>
        </section>
        <section className="panel form-panel">
          <h2>Publication</h2>
          <label>
            Statut
            <select
              name="status"
              value={form.status || "draft"}
              onChange={change}
            >
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
              <option value="archived">Archivé</option>
            </select>
          </label>
        </section>
        {message && <div className="alert error">{message}</div>}
        <div className="form-actions">
          <Link className="button neutral" to="/projects">
            Annuler
          </Link>
          <button disabled={busy} className="button blue">
            {busy ? "Enregistrement…" : "Enregistrer le projet"}
          </button>
        </div>
      </form>
    </>
  );
}
function FileDrop({ label, accept, files, onChange, multiple = false }) {
  return (
    <label className="file-drop">
      <Upload size={19} />
      <b>{label}</b>
      <span>Glissez ou sélectionnez un fichier{multiple ? "s" : ""}</span>
      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) =>
          onChange(
            multiple
              ? [...files, ...Array.from(e.target.files || [])]
              : Array.from(e.target.files || []),
          )
        }
      />
      {files.map((f, i) => (
        <small key={i}>{f.name || `Image ${i + 1}`}</small>
      ))}
    </label>
  );
}
function Categories() {
  const { data, reload, error } = useLoad("/admin/categories");
  const [name, setName] = useState(""),
    [description, setDescription] = useState("");
  async function add(e) {
    e.preventDefault();
    try {
      await request(api.post("/admin/categories", { name, description }));
      setName("");
      setDescription("");
      reload();
    } catch (e) {
      alert(e.response?.data?.message || "Ajout impossible");
    }
  }
  async function remove(id) {
    if (!confirm("Désactiver cette catégorie ?")) return;
    await request(api.delete(`/admin/categories/${id}`));
    reload();
  }
  async function edit(category) {
    const name = prompt("Nom de la catégorie", category.name)?.trim();
    if (!name) return;
    try {
      await request(api.put(`/admin/categories/${category.id}`, { name, description: category.description }));
      reload();
    } catch (e) {
      alert(e.response?.data?.message || "Modification impossible");
    }
  }
  return (
    <>
      <PageHeading
        eyebrow="TAXONOMIE"
        title="Catégories"
        description="Organisez vos projets par style architectural."
      />
      <div className="two-panels">
        <section className="panel">
          <div className="panel-heading">
            <h2>Catégories disponibles</h2>
          </div>
          {error && <div className="alert error">{error}</div>}
          {data?.map((c) => (
            <div className="category-row" key={c.id}>
              <span>
                <b>{c.name}</b>
                <small>
                  {c.slug} · {c.isActive ? "Active" : "Inactive"}
                </small>
              </span>
              <div className="category-actions"><button onClick={() => edit(c)} aria-label="Modifier"><Pencil size={14} /></button><button onClick={() => remove(c.id)} aria-label="Désactiver"><Trash2 size={15} /></button></div>
            </div>
          ))}
        </section>
        <form className="panel form-panel" onSubmit={add}>
          <h2>Ajouter une catégorie</h2>
          <label>
            Nom
            <input
              required
              minLength="2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label>
            Description
            <textarea
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </label>
          <button className="button blue">
            <Plus size={15} /> Ajouter
          </button>
        </form>
      </div>
    </>
  );
}
function Messages() {
  const { data, reload, error } = useLoad("/admin/messages");
  const [active, setActive] = useState(null);
  async function update(id, action) {
    await request(api.patch(`/admin/messages/${id}/${action}`));
    reload();
  }
  return (
    <>
      <PageHeading
        eyebrow="CONTACT"
        title="Messages"
        description="Consultez les demandes envoyées depuis le site public."
      />
      {error && <div className="alert error">{error}</div>}
      <section className="panel">
        <div className="panel-heading">
          <h2>
            Boîte de réception{" "}
            <span className="count">
              {data?.filter((x) => x.status === "unread").length || 0} non lus
            </span>
          </h2>
        </div>
        <div className="message-list">
          {data?.map((m) => (
            <article
              className={`message-row ${m.status === "unread" ? "unread" : ""}`}
              key={m.id}
            >
              <button
                className="message-main"
                onClick={() => setActive(active === m.id ? null : m.id)}
              >
                <span className="avatar">{m.name[0]}</span>
                <span>
                  <b>{m.name}</b>
                  <small>
                    {m.subject || "Sans sujet"} ·{" "}
                    {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                  </small>
                  {active === m.id && (
                    <p>
                      {m.message}
                      <br />
                      <a href={`mailto:${m.email}`}>{m.email}</a> {m.phone}
                    </p>
                  )}
                </span>
              </button>
              <div>
                <button
                  onClick={() =>
                    update(m.id, m.status === "unread" ? "read" : "unread")
                  }
                >
                  {m.status === "unread"
                    ? "Marquer comme lu"
                    : "Marquer non lu"}
                </button>
                <button onClick={() => update(m.id, "archive")}>
                  Archiver
                </button>
              </div>
            </article>
          ))}
        </div>
        {!data?.length && <p className="empty">Aucun message reçu.</p>}
      </section>
    </>
  );
}
function AssetPage({ title, type }) {
  const { data, error } = useLoad("/admin/projects?limit=100");
  const rows = (data?.projects || []).filter((p) =>
    type === "models" ? p.model3dUrl : true,
  );
  return (
    <>
      <PageHeading
        eyebrow="MÉDIAS"
        title={title}
        description={`Fichiers associés aux projets (${title.toLowerCase()}).`}
      />
      {error && <div className="alert error">{error}</div>}
      <section className="panel">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Projet</th>
                <th>Fichier</th>
                <th>État</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((p) => (
                <tr key={p.id}>
                  <td>{p.title}</td>
                  <td>{type === "models" ? p.model3dUrl || "—" : p.title}</td>
                  <td>
                    {type === "models"
                      ? p.model3dUrl
                        ? "Modèle ajouté"
                        : "Aucun modèle"
                      : "Voir dans le projet"}
                  </td>
                  <td>
                    <Link to={`/projects/${p.id}/edit`}>
                      Gérer les fichiers
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function SettingsPage() {
  const [form, setForm] = useState({}),
    [msg, setMsg] = useState(""), [busy,setBusy]=useState(false);
  useEffect(() => {
    request(api.get("/admin/settings"))
      .then(setForm)
      .catch(() => {});
  }, []);
  async function save(e) {
    e.preventDefault();
    setBusy(true);setMsg("");
    try {
      await request(api.put("/admin/settings", form));
      setMsg("Paramètres enregistrés.");
    } catch (e) {
      setMsg(e.response?.data?.message || "Erreur.");
    } finally { setBusy(false); }
  }
  return (
    <div className="settings-page">
      <PageHeading
        eyebrow="CONFIGURATION"
        title="Paramètres du site"
        description="Coordonnées et liens affichés sur le site public."
      />
      <form className="panel settings-form" onSubmit={save}>
        <div className="settings-form-heading"><div><span className="eyebrow">INFORMATIONS PUBLIQUES</span><h2>Coordonnées de l’entreprise</h2><p>Ces informations sont utilisées sur les pages publiques et les messages.</p></div><span className="settings-form-mark"><Settings size={19}/></span></div>
        <div className="settings-fields">
        <label className="settings-field">
          <span>Nom du site</span>
          <input
            placeholder="Archirani"
            required
            value={form.site_name || ""}
            onChange={(e) => setForm({ ...form, site_name: e.target.value })}
          />
        </label>
        <label className="settings-field">
          <span>Email de contact</span>
          <input
            type="email"
            placeholder="contact@archirani.local"
            value={form.company_email || ""}
            onChange={(e) =>
              setForm({ ...form, company_email: e.target.value })
            }
          />
        </label>
        <label className="settings-field">
          <span>Téléphone</span>
          <input
            type="tel"
            placeholder="+33 1 23 45 67 89"
            value={form.company_phone || ""}
            onChange={(e) =>
              setForm({ ...form, company_phone: e.target.value })
            }
          />
        </label>
        <label className="settings-field settings-field-wide">
          <span>Adresse</span>
          <input
            placeholder="Adresse, ville, code postal"
            value={form.company_address || ""}
            onChange={(e) =>
              setForm({ ...form, company_address: e.target.value })
            }
          />
        </label>
        <label className="settings-field">
          <span>LinkedIn</span>
          <input type="url" placeholder="https://www.linkedin.com/company/..." value={form.linkedin_url || ""} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
        </label>
        <label className="settings-field">
          <span>Instagram</span>
          <input type="url" placeholder="https://www.instagram.com/..." value={form.instagram_url || ""} onChange={(e) => setForm({ ...form, instagram_url: e.target.value })} />
        </label>
        <label className="settings-field settings-field-wide">
          <span>Facebook</span>
          <input type="url" placeholder="https://www.facebook.com/..." value={form.facebook_url || ""} onChange={(e) => setForm({ ...form, facebook_url: e.target.value })} />
        </label>
        </div>
        <div className="settings-form-footer">
          {msg && <p className={`settings-feedback ${msg.includes("enregistr") ? "success" : "error"}`}>{msg}</p>}
          <button disabled={busy} className="button blue"><CheckCircle2 size={15}/>{busy ? "Enregistrement…" : "Enregistrer les paramètres"}</button>
        </div>
      </form>
    </div>
  );
}
export default App;
