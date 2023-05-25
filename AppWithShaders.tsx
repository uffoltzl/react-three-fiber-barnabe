import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import {
  MutableRefObject,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";
import fishVertexShader from "./shaders/fishVertexShader";
import fishFragmentShader from "./shaders/fishFragmentShader";
import { Background } from "./components/Background";

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

  const uniforms = useMemo(
    () => ({
      u_wave: {
        value: 0.25,
      },
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  const mesh: MutableRefObject<Mesh<
    BufferGeometry,
    Material | Material[]
  > | null> = useRef(null);

  useFrame((state) => {
    const { clock } = state;
    if (mesh && mesh.current && mesh.current.material) {
      // @ts-ignore
      mesh.current.material.uniforms.u_time.value = 2 * clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} castShadow rotation={[0.6, 0, 0]}>
      <primitive object={obj} scale={0.5} />
      <shaderMaterial
        fragmentShader={fishFragmentShader}
        vertexShader={fishVertexShader}
        uniforms={uniforms}
        wireframe={false}
      />
    </mesh>
  );
};

const App = () => {
  return (
    <Canvas shadows>
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
