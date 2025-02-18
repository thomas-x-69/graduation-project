// src/components/Wall.jsx
import { useEffect, useRef, useState } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { AlertCircle } from "lucide-react";
import WALL_MODEL from "../assets/models/Moving_Wall/Wall.glb";

const CollisionWarning = ({ position, objectType }) => (
  <Html position={position} center>
    <div className="bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg flex items-center gap-2 min-w-[200px]">
      <AlertCircle className="w-12 h-12" />
      <span>
        Cannot move wall <b className="text-red-800">{objectType} in the way</b>
      </span>
    </div>
  </Html>
);

const Wall = ({
  position,
  rotation,
  scale,
  isEditMode,
  onMoveComplete,
  onCollisionUpdate,
}) => {
  const { scene, camera, gl } = useThree();
  const { scene: wallScene } = useGLTF(WALL_MODEL);
  const wallRef = useRef();
  const [isDragging, setIsDragging] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(
    new THREE.Vector3(...position)
  );
  const raycaster = useRef(new THREE.Raycaster());
  const dragPlane = useRef(new THREE.Plane(new THREE.Vector3(0, 0, 1), 0));
  const [isHovered, setIsHovered] = useState(false);
  const [collisionInfo, setCollisionInfo] = useState(null);
  const lastValidPosition = useRef(new THREE.Vector3(...position));
  const warningTimeout = useRef(null);
  const [warningPosition, setWarningPosition] = useState(new THREE.Vector3());

  const showWarning = (type, worldPosition) => {
    setCollisionInfo({ type });
    setWarningPosition(worldPosition.clone().add(new THREE.Vector3(0, 1, 0)));

    // Clear any existing timeout
    if (warningTimeout.current) {
      clearTimeout(warningTimeout.current);
    }

    // Set new timeout to hide warning after 1.5 seconds
    warningTimeout.current = setTimeout(() => {
      setCollisionInfo(null);
    }, 1500);
  };

  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (warningTimeout.current) {
        clearTimeout(warningTimeout.current);
      }
    };
  }, []);

  const checkObjectCollisions = (newPosition) => {
    if (!wallRef.current) return null;

    const wallBox = new THREE.Box3().setFromObject(wallRef.current);
    const moveOffset = new THREE.Vector3().subVectors(
      newPosition,
      currentPosition
    );
    wallBox.translate(moveOffset);

    wallBox.min.x -= 0.2;
    wallBox.max.x += 0.2;

    let collisionFound = null;

    scene.traverse((object) => {
      if (
        !collisionFound &&
        (object.userData?.isHuman || object.userData?.isFurniture)
      ) {
        const objectBox = new THREE.Box3().setFromObject(object);
        if (wallBox.intersectsBox(objectBox)) {
          collisionFound = {
            type: object.userData?.isHuman ? "Person" : "Furniture",
            object,
            position: object.position,
          };
        }
      }
    });

    return collisionFound;
  };

  // Handle wall dragging
  useEffect(() => {
    if (!isEditMode) return;

    const handlePointerDown = (event) => {
      event.stopPropagation();
      const bounds = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);

      const intersects = raycaster.current.intersectObject(
        wallRef.current,
        true
      );
      if (intersects.length > 0) {
        setIsDragging(true);
        gl.domElement.style.cursor = "ew-resize";

        const cameraDirection = new THREE.Vector3();
        camera.getWorldDirection(cameraDirection);
        dragPlane.current.normal.copy(cameraDirection);
        dragPlane.current.constant = -currentPosition.dot(
          dragPlane.current.normal
        );
      }
    };

    const handlePointerMove = (event) => {
      if (!isDragging) {
        const bounds = gl.domElement.getBoundingClientRect();
        const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
        const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
        raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);

        const intersects = raycaster.current.intersectObject(
          wallRef.current,
          true
        );
        setIsHovered(intersects.length > 0);
        gl.domElement.style.cursor =
          intersects.length > 0 ? "ew-resize" : "default";
        return;
      }

      const bounds = gl.domElement.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      const y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.current.setFromCamera(new THREE.Vector2(x, y), camera);

      const intersectPoint = new THREE.Vector3();
      raycaster.current.ray.intersectPlane(dragPlane.current, intersectPoint);

      const newPosition = new THREE.Vector3(
        intersectPoint.x,
        currentPosition.y,
        currentPosition.z
      );

      const maxOffset = 3;
      const minX = position[0] - maxOffset;
      const maxX = position[0] + maxOffset;

      if (newPosition.x >= minX && newPosition.x <= maxX) {
        const collision = checkObjectCollisions(newPosition);
        if (collision && !collisionInfo) {
          // Only show warning if not already showing
          showWarning(collision.type, collision.position);
          wallRef.current.position.copy(lastValidPosition.current);
        } else if (!collision) {
          lastValidPosition.current.copy(newPosition);
          setCurrentPosition(newPosition);
          wallRef.current.position.copy(newPosition);
        }
      }
    };

    const handlePointerUp = () => {
      if (isDragging) {
        setIsDragging(false);
        setCollisionInfo(null);
        gl.domElement.style.cursor = isHovered ? "ew-resize" : "default";
        onMoveComplete?.(currentPosition);
      }
    };

    wallRef.current.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone();
        child.material.emissive = new THREE.Color(
          isDragging ? 0x00ff00 : isHovered ? 0x00aa00 : 0x008800
        );
        child.material.emissiveIntensity = isDragging
          ? 0.8
          : isHovered
          ? 0.5
          : 0.3;
      }
    });

    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointerleave", handlePointerUp);

    return () => {
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointerleave", handlePointerUp);
    };
  }, [
    isEditMode,
    isDragging,
    isHovered,
    camera,
    gl,
    onMoveComplete,
    currentPosition,
    position,
  ]);

  useEffect(() => {
    if (!isEditMode && wallRef.current) {
      wallRef.current.traverse((child) => {
        if (child.isMesh) {
          child.material = child.material.clone();
          child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0;
        }
      });
    }
  }, [isEditMode]);

  return (
    <>
      <primitive
        ref={wallRef}
        object={wallScene.clone()}
        position={currentPosition}
        rotation={rotation}
        scale={scale}
      />
      {collisionInfo && (
        <CollisionWarning
          position={warningPosition}
          objectType={collisionInfo.type}
        />
      )}
    </>
  );
};

export default Wall;
