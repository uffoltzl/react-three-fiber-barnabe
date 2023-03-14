import { Canvas } from "@react-three/fiber/native";
import { Suspense } from "react";

const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <Suspense fallback={null}>
        <mesh>
          <sphereGeometry />
          <meshStandardMaterial color="orange" />
        </mesh>
      </Suspense>
    </Canvas>
  );
};

export { App };
