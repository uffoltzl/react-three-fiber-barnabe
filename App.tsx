import { Canvas, useLoader } from "@react-three/fiber/native";
import { Suspense, useLayoutEffect } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import * as THREE from "three";

const Barnabe = () => {
  const [base, normal, rough] = useLoader(TextureLoader, [
    require("./assets/WhaleShark/WhaleShark_Base_Color.png"),
    require("./assets/WhaleShark/WhaleShark_Normal.png"),
  ]);

  const material = useLoader(
    MTLLoader,
    require("./assets/WhaleShark/WhaleShark.mtl")
  );

  const obj = useLoader(
    OBJLoader,
    require("./assets/WhaleShark/WhaleShark.obj"),
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    }
  );

  useLayoutEffect(() => {
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material.map = base;
        child.material.normalMap = normal;
        child.material.roughnessMap = rough;
      }
    });
  }, [obj]);

  return (
    <mesh>
      <primitive object={obj} scale={0.5} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas>
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <Barnabe />
      </Suspense>
    </Canvas>
  );
};

export { App };
