import { useState, Suspense, lazy, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { Bounds, OrbitControls, Html } from "@react-three/drei";
import { Maximize, Rotate3D } from "lucide-react";
const Model = lazy(() => import("./Model.jsx"));
export default function HouseViewer({ url, sceneBackground = "#172331" }) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  return (
    <section className="viewer-box">
      <div className="viewer-title">
        <div>
          <span className="eyebrow">VISUALISATION</span>
          <h2>Explorez le projet en 3D</h2>
        </div>
        <button
          className="icon-button"
          onClick={() => setOpen(true)}
          aria-label="Plein écran"
        >
          <Maximize size={17} />
        </button>
      </div>
      <div className={`canvas-wrap ${open ? "is-full" : ""}`}>
        <Canvas shadows camera={{ position: [5, 4, 7], fov: 38 }}>
          <color attach="background" args={[sceneBackground]} />
          <ambientLight intensity={0.8} />
          <directionalLight position={[5, 8, 4]} intensity={2} />
          <Suspense
            fallback={
              <Html center>
                <span className="canvas-loading">Chargement du modèle…</span>
              </Html>
            }
          >
            <Bounds fit clip observe margin={1.08}>
              <ModelBoundary key={url || "empty"} onError={() => setError(true)}>
                {url && !error ? <Model url={url} /> : <HousePlaceholder />}
              </ModelBoundary>
            </Bounds>
            <OrbitControls makeDefault minDistance={0.1} maxDistance={1000} enableDamping dampingFactor={0.08} />
          </Suspense>
        </Canvas>
        {(!url || error) && (
          <div className="model-notice">
            {error
              ? "Impossible de charger le fichier 3D."
              : "Ajoutez un fichier GLB/GLTF dans votre espace admin."}
          </div>
        )}
        {open && (
          <button className="fullscreen-close" onClick={() => setOpen(false)}>
            Fermer
          </button>
        )}
      </div>
      <div className="viewer-hint">
        <Rotate3D size={14} /> Faites glisser pour tourner <span>·</span>{" "}
        Molette pour zoomer{" "}
        <button onClick={() => setOpen(true)}>
          Agrandir <Maximize size={13} />
        </button>
      </div>
    </section>
  );
}
class ModelBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError?.(); }
  render() { return this.state.failed ? <HousePlaceholder /> : this.props.children; }
}
function HousePlaceholder() {
  return (
    <mesh castShadow receiveShadow rotation={[0, -0.35, 0]}>
      <boxGeometry args={[3, 1.7, 2.4]} />
      <meshStandardMaterial color="#d6dce0" />
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[3.2, 0.25, 2.6]} />
        <meshStandardMaterial color="#263746" />
      </mesh>
      <mesh position={[0, -0.35, 1.21]}>
        <boxGeometry args={[1, 0.8, 0.04]} />
        <meshStandardMaterial
          color="#84a9b9"
          metalness={0.25}
          roughness={0.2}
        />
      </mesh>
    </mesh>
  );
}
