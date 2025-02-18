import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";

const CameraAnimation = ({ isLoading, onAnimationComplete }) => {
  const { camera, controls } = useThree();
  const timeRef = useRef(0);
  const isCompleteRef = useRef(false);

  useEffect(() => {
    if (!isLoading) {
      // Start from front view (notice the negative values for X and Z)
      camera.position.set(-2, 1, -2);
      camera.lookAt(-1.3, 1, 0); // Look at house center based on your House component position

      // Initially disable controls
      if (controls) {
        controls.enabled = false;
      }
    }

    return () => {
      isCompleteRef.current = false;
      timeRef.current = 0;
    };
  }, [isLoading, camera, controls]);

  useFrame((state, delta) => {
    if (!isLoading && !isCompleteRef.current) {
      timeRef.current = Math.min(1, timeRef.current + delta * 0.7);
      const ease = 1 - Math.pow(1 - timeRef.current, 3);

      // Zoom out while maintaining front view
      camera.position.set(
        -22 * ease, // Move back on X
        10 * ease, // Move up on Y
        5 * ease // Move back on Z
      );

      camera.lookAt(-1.3, 1, 0); // Keep looking at house center

      if (timeRef.current === 1) {
        isCompleteRef.current = true;
        onAnimationComplete?.();
      }
    }
  });

  return null;
};

export default CameraAnimation;
