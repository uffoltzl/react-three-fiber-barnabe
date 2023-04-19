import * as THREE from "three";
import { BufferGeometry, Material, Mesh } from "three";
import backgroundVertexShader from "../shaders/backgroundVertexShader";
import backgroundFragmentShader from "../shaders/backgroundFragmentShader";
import { MutableRefObject, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";

export const Background = () => {
  const mesh: MutableRefObject<Mesh<
    BufferGeometry,
    Material | Material[]
  > | null> = useRef(null);

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
    <mesh ref={mesh} scale={50}>
      <icosahedronGeometry args={[2, 20]} />
      <shaderMaterial
        fragmentShader={backgroundFragmentShader}
        vertexShader={backgroundVertexShader}
        uniforms={uniforms}
        wireframe={false}
        side={THREE.BackSide}
      />
    </mesh>
  );
};
