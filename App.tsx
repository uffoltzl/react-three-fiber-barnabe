import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import { MutableRefObject, Suspense, useLayoutEffect, useRef } from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";

const Background = () => {
  return (
    <mesh scale={100}>
      <sphereGeometry />
      <meshBasicMaterial color="#2645e0" side={THREE.BackSide} />
    </mesh>
  );
};

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

  const mesh: MutableRefObject<Mesh<
    BufferGeometry,
    Material | Material[]
  > | null> = useRef(null);

  useFrame((state, delta) => {
    if (mesh && mesh.current) {
      mesh.current.rotation.y += delta;
    }
  });

  return (
    <mesh ref={mesh} castShadow>
      <primitive object={obj} scale={0.5} />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas shadows>
      <fog attach="fog" args={["#4479e1", 0, 200]} />
      <ambientLight intensity={0.1} />
      <directionalLight position={[0, 1, 0]} intensity={0.7} />
      <Suspense fallback={null}>
        <Barnabe />
      </Suspense>
      <Background />
    </Canvas>
  );
};

export { App };
