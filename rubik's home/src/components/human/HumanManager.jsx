// src/components/human/HumanManager.jsx
import { useEffect, useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Html } from "@react-three/drei";
import { Move, Trash2, AlertCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addHuman,
  removeHuman,
  selectRoomOccupancy,
} from "../../store/humanSlice";
import { selectRoomConfigs } from "../../store/roomConfigsSlice";
import LoadingIndicator from "../../scenes/LoadingIndicator";

// Component for displaying hover menu above humans
const HumanHoverMenu = ({ visible, position, onStartMoving, onDelete }) => {
  if (!visible) return null;

  return (
    <Html position={[position.x, position.y + 1.8, position.z]} center>
      <div className="flex gap-2 bg-white/90 p-1.5 rounded-lg shadow-lg backdrop-blur-sm transform -translate-y-2 transition-all duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStartMoving();
          }}
          className="p-1.5 rounded-md hover:bg-gray-100 transition-colors"
          title="Move"
        >
          <Move className="w-4 h-4 text-gray-700" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-md hover:bg-red-100 transition-colors"
          title="Delete"
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </Html>
  );
};

// Component for displaying capacity warning
const CapacityWarning = ({ position, message }) => (
  <Html position={[position.x, position.y + 2, position.z]} center>
    <div className="flex items-center gap-2 w-[240px] bg-red-500/90 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg">
      <AlertCircle className="w-4 h-4" />
      <span>{message}</span>
    </div>
  </Html>
);

const HumanManager = ({ isPlacingHuman, onPlacementComplete, homeRef }) => {
  const { scene, gl, camera } = useThree();
  const dispatch = useDispatch();
  const roomOccupancy = useSelector(selectRoomOccupancy);
  const roomConfigs = useSelector(selectRoomConfigs);
  const mousePosition = useRef(new THREE.Vector2());
  const raycaster = useRef(new THREE.Raycaster());
  const placementPlanes = useRef({});
  const previewMesh = useRef();
  const gltfLoader = useRef(new GLTFLoader());
  const [isPlacing, setIsPlacing] = useState(false);
  const placedHumans = useRef([]);
  const [hoveredHuman, setHoveredHuman] = useState(null);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const loadingPosition = useRef(new THREE.Vector3());
  const [showCapacityWarning, setShowCapacityWarning] = useState(false);

  // Create placement planes for each room
  useEffect(() => {
    Object.entries(roomConfigs).forEach(([roomName, config]) => {
      const planeGeometry = new THREE.PlaneGeometry(
        config.size[0],
        config.size[1]
      );
      const planeMaterial = new THREE.MeshBasicMaterial({
        visible: false,
      });

      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = -Math.PI / 2;
      plane.position.set(...config.position);
      plane.userData.roomName = roomName;

      placementPlanes.current[roomName] = plane;
      scene.add(plane);
    });

    return () => {
      Object.values(placementPlanes.current).forEach((plane) => {
        scene.remove(plane);
      });
    };
  }, [scene, roomConfigs]);

  // Check collision with other objects
  const checkCollision = (position) => {
    if (!previewMesh.current) return false;

    // Create bounding box for preview human
    const humanBox = new THREE.Box3().setFromObject(previewMesh.current);

    // Check collisions with placed humans
    for (const human of placedHumans.current) {
      const otherBox = new THREE.Box3().setFromObject(human);
      if (humanBox.intersectsBox(otherBox)) {
        return true;
      }
    }

    // Check collisions with furniture and house geometry
    if (homeRef.current) {
      const homeMeshes = [];
      homeRef.current.traverse((child) => {
        if (child.isMesh && !child.userData?.type?.includes("roomLabel")) {
          homeMeshes.push(child);
        }
      });

      for (const mesh of homeMeshes) {
        const meshBox = new THREE.Box3().setFromObject(mesh);
        if (humanBox.intersectsBox(meshBox)) {
          return true;
        }
      }
    }

    return false;
  };

  // Load human model
  useEffect(() => {
    if (isPlacingHuman && !previewMesh.current) {
      const modelPath = "/src/assets/models/human/Human.glb";
      loadingPosition.current.set(-1.3, 0, 0);
      setIsLoading(true);

      gltfLoader.current.load(
        modelPath,
        (gltf) => {
          setTimeout(() => {
            const model = gltf.scene;
            model.scale.set(20, 20, 20);
            model.traverse((node) => {
              if (node.isMesh) {
                node.material = node.material.clone();
                node.material.transparent = true;
                node.material.opacity = 0.7;
                node.material.emissive = new THREE.Color(0x666666);
                node.material.emissiveIntensity = 0.5;
                node.castShadow = true;
                node.receiveShadow = true;
              }
            });

            previewMesh.current = model;
            scene.add(previewMesh.current);
            setIsPlacing(true);
            setIsLoading(false);
          }, 600);
        },
        undefined,
        (error) => {
          console.error("Error loading human model:", error);
          setIsLoading(false);
        }
      );
    }
  }, [isPlacingHuman, scene]);

  // Handle human hover interactions
  const handleHumanHover = (event) => {
    if (isPlacing) return;

    raycaster.current.setFromCamera(mousePosition.current, camera);
    const intersects = raycaster.current.intersectObjects(
      placedHumans.current.map((h) => h.children).flat()
    );

    if (intersects.length > 0) {
      gl.domElement.style.cursor = "pointer";
      const hoveredMesh = intersects[0].object;
      const humanParent = hoveredMesh.parent;
      setHoveredHuman(humanParent);
    } else {
      gl.domElement.style.cursor = "default";
      setHoveredHuman(null);
    }
  };

  // Handle human deletion
  const handleDelete = () => {
    if (hoveredHuman) {
      dispatch(
        removeHuman({
          id: hoveredHuman.userData.id,
          room: hoveredHuman.userData.room,
        })
      );
      scene.remove(hoveredHuman);
      placedHumans.current = placedHumans.current.filter(
        (h) => h !== hoveredHuman
      );
      setHoveredHuman(null);
      gl.domElement.style.cursor = "default";
    }
  };

  // Handle starting human movement
  const handleStartMoving = () => {
    if (hoveredHuman && !isPlacing) {
      loadingPosition.current.copy(hoveredHuman.position);
      setIsLoading(true);

      setTimeout(() => {
        const newPreview = hoveredHuman.clone();
        newPreview.traverse((node) => {
          if (node.isMesh) {
            node.material = node.material.clone();
            node.material.transparent = true;
            node.material.opacity = 0.7;
            node.material.emissive = new THREE.Color(0x666666);
            node.material.emissiveIntensity = 0.5;
          }
        });

        dispatch(
          removeHuman({
            id: hoveredHuman.userData.id,
            room: hoveredHuman.userData.room,
          })
        );

        scene.remove(hoveredHuman);
        placedHumans.current = placedHumans.current.filter(
          (h) => h !== hoveredHuman
        );

        previewMesh.current = newPreview;
        scene.add(previewMesh.current);

        setIsPlacing(true);
        setHoveredHuman(null);
        setIsLoading(false);
        gl.domElement.style.cursor = "grab";
      }, 600);
    }
  };

  // Handle mouse events
  useEffect(() => {
    const handleMouseMove = (event) => {
      const newX = (event.clientX / gl.domElement.clientWidth) * 2 - 1;
      const newY = -(event.clientY / gl.domElement.clientHeight) * 2 + 1;
      mousePosition.current.set(newX, newY);

      if (!isPlacing) {
        handleHumanHover(event);
      }
    };

    const handleClick = () => {
      if (isPlacing && previewMesh.current && currentRoom) {
        const hasCollision = checkCollision(previewMesh.current.position);
        const isRoomFull =
          roomOccupancy[currentRoom]?.currentOccupancy >=
          roomOccupancy[currentRoom]?.maxCapacity;

        if (!hasCollision && !isRoomFull) {
          const humanId = `human_${Date.now()}`;
          const placedHuman = previewMesh.current.clone();
          placedHuman.traverse((node) => {
            if (node.isMesh) {
              node.material = node.material.clone();
              node.material.transparent = false;
              node.material.opacity = 1;
              node.material.emissive = new THREE.Color(0x000000);
              node.material.emissiveIntensity = 0;
            }
          });

          // Add isHuman flag for collision detection with walls
          placedHuman.userData = {
            id: humanId,
            room: currentRoom,
            isHuman: true,
          };

          scene.add(placedHuman);
          placedHumans.current.push(placedHuman);

          dispatch(
            addHuman({
              id: humanId,
              position: placedHuman.position.toArray(),
              room: currentRoom,
            })
          );

          scene.remove(previewMesh.current);
          previewMesh.current = null;
          setIsPlacing(false);
          setCurrentRoom(null);
          setShowCapacityWarning(false);
          gl.domElement.style.cursor = "default";
          onPlacementComplete?.();
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("click", handleClick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("click", handleClick);
    };
  }, [isPlacing, currentRoom, dispatch, onPlacementComplete]);

  // Cancel placement when isPlacingHuman becomes false
  useEffect(() => {
    if (!isPlacingHuman && previewMesh.current) {
      scene.remove(previewMesh.current);
      previewMesh.current = null;
      setIsPlacing(false);
      setCurrentRoom(null);
      setShowCapacityWarning(false);
      gl.domElement.style.cursor = "default";
    }
  }, [isPlacingHuman, scene, gl.domElement]);

  // Update preview position and handle room capacity checks
  useFrame(() => {
    if (isPlacing && previewMesh.current) {
      raycaster.current.setFromCamera(mousePosition.current, camera);
      const intersects = raycaster.current.intersectObjects(
        Object.values(placementPlanes.current)
      );

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const roomName = intersection.object.userData.roomName;

        if (roomName !== currentRoom) {
          setCurrentRoom(roomName);
          // Reset capacity warning when changing rooms
          setShowCapacityWarning(false);
        }

        previewMesh.current.position.copy(point);

        // Check both collision and room capacity
        const hasCollision = checkCollision(point);
        const isRoomFull =
          roomOccupancy[roomName]?.currentOccupancy >=
          roomOccupancy[roomName]?.maxCapacity;

        // Update preview appearance
        previewMesh.current.traverse((node) => {
          if (node.isMesh) {
            const canPlace = !hasCollision && !isRoomFull;
            node.material.emissive.setHex(canPlace ? 0x00ff00 : 0xff0000);
            node.material.emissiveIntensity = canPlace ? 0.5 : 1;
          }
        });

        // Show capacity warning if room is full
        setShowCapacityWarning(isRoomFull);
      }
    }
  });

  return (
    <>
      {isLoading && (
        <LoadingIndicator
          position={loadingPosition.current}
          isInitialLoad={false}
        />
      )}
      {hoveredHuman && !isLoading && (
        <HumanHoverMenu
          visible={!isPlacing}
          position={hoveredHuman.position}
          onStartMoving={handleStartMoving}
          onDelete={handleDelete}
        />
      )}
      {showCapacityWarning && previewMesh.current && (
        <CapacityWarning
          position={previewMesh.current.position}
          message="Room at maximum capacity"
        />
      )}
    </>
  );
};

export default HumanManager;
