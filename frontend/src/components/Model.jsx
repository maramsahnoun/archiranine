import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
export default function Model({ url }) {
  const gltf = useGLTF(url);
  useEffect(() => {
    gltf.scene.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
  }, [gltf]);
  return <primitive object={gltf.scene} dispose={null} scale={1} />;
}
