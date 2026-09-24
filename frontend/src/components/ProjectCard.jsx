import { Link } from "react-router-dom";
import { ArrowUpRight, Maximize, Layers3 } from "lucide-react";
export function ProjectCard({ project }) {
  const image = project.coverImage || project.images?.[0]?.imageUrl;
  return (
    <Link className="project-card" to={`/projects/${project.slug}`}>
      <div
        className="project-cover"
        style={image ? { backgroundImage: `url(${image})` } : {}}
      >
        {project.category && <span className="pill">{project.category}</span>}
        {!image && (
          <div className="cover-empty">
            <Layers3 />
          </div>
        )}
        <span className="card-arrow">
          <ArrowUpRight size={17} />
        </span>
      </div>
      <div className="project-card-body">
        <h3>{project.title}</h3>
        <p>
          {project.shortDescription || project.style || "Projet d’architecture"}
        </p>
        <div className="project-meta">
          <span>
            <Maximize size={13} />
            {project.surface || "—"} m²
          </span>
          <span>
            <Layers3 size={13} />
            {project.floors || 1} étages
          </span>
        </div>
      </div>
    </Link>
  );
}
