import { Canvas, useFrame, useLoader } from "@react-three/fiber/native";
import {
  MutableRefObject,
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { TextureLoader } from "expo-three";
import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";
import { Background } from "./components/Background";
import OrbitControlsView from "expo-three-orbitcontrols";
import backgroundVertexShader from "./shaders/backgroundVertexShader";
import backgroundFragmentShader from "./shaders/backgroundFragmentShader";
import { View } from "react-native";

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

  // useFrame((state, delta) => {
  //   if (mesh && mesh.current) {
  //     mesh.current.rotation.y += delta;
  //   }
  // });

  const uniforms = useMemo(
    () => ({
      u_intensity: {
        value: 0.3,
      },
      u_time: {
        value: 0.0,
      },
    }),
    []
  );

  useFrame((state) => {
    const { clock } = state;
    if (mesh && mesh.current && mesh.current.material) {
      // @ts-ignore
      mesh.current.material.uniforms.u_time.value =
        0.4 * clock.getElapsedTime();
    }
  });

  return (
    <mesh ref={mesh} castShadow rotation={[0.6, 0, 0]}>
      <primitive object={obj} scale={0.5} />
      <shaderMaterial
        fragmentShader={backgroundFragmentShader}
        vertexShader={backgroundVertexShader}
        uniforms={uniforms}
      />
    </mesh>
  );
};

const App = () => {
  const [camera, setCamera] = useState<THREE.Camera | null>(null);
  return (
    <View style={{ flex: 1 }}>
      <OrbitControlsView style={{ flex: 1 }} camera={camera}>
        <Canvas shadows onCreated={({ camera }) => setCamera(camera)}>
          <ambientLight intensity={0.1} />
          <directionalLight position={[0, 1, 0]} intensity={0.7} />
          <Suspense fallback={null}>
            <Barnabe />
          </Suspense>
          <Background />
        </Canvas>
      </OrbitControlsView>
    </View>
  );
};

export { App };
