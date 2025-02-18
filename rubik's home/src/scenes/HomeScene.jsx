// src/scenes/HomeScene.jsx
import { forwardRef, Suspense, useRef } from "react";
import {
  Stage,
  Environment,
  Lightformer,
  ContactShadows,
} from "@react-three/drei";
import { useDispatch, useSelector } from "react-redux";
import {
  selectRoomConfigs,
  updateRoomSize,
  updateRoomPosition,
} from "../store/roomConfigsSlice";
import { updateRoomCapacity } from "../store/humanSlice";
import {
  WIDTH_MULTIPLIER,
  DEPTH_MULTIPLIER,
  AREA_DIVISOR,
} from "../constants/roomConstants";

// Component Imports
import House from "../components/House";
import RoomLabels from "../components/RoomLabels";
import Wall from "../components/Wall";
import RoomOccupancy from "./RoomOccupancy";

const HomeScene = forwardRef(
  ({ showCeiling, showOccupancy, isEditingRooms }, ref) => {
    const roomConfigs = useSelector(selectRoomConfigs);
    const dispatch = useDispatch();

    // Wall positions calculation with initial positions stored
    const wallPositions = [
      {
        id: "wall1",
        position: [-0.325, -0.3, -12.9],
        rotation: [0, 0, 0],
        scale: [0.75, 0.818, 0.9],
        initialX: -0.325,
      },
      {
        id: "wall2",
        position: [-0.325, -0.3, -0.8],
        rotation: [0, 0, 0],
        scale: [0.75, 0.818, 0.9],
        initialX: -0.325,
      },
    ];

    // This function will be called when wall movement ends
    const handleWallMoveComplete = (wallId, finalPosition) => {
      console.log("Wall move complete:", { wallId, finalPosition });
      const wallConfig = wallPositions.find((w) => w.id === wallId);
      if (!wallConfig) return;

      const movementDelta = (finalPosition.x - wallConfig.initialX) * 0.5;

      if (wallId === "wall1") {
        // Calculate new dimensions
        const newBedroomSize = [
          6 - movementDelta * 2,
          roomConfigs.BEDROOM.size[1],
        ];
        const newLivingRoomSize = [
          6 + movementDelta * 2,
          roomConfigs["LIVING ROOM"].size[1],
        ];

        // Update sizes
        dispatch(
          updateRoomSize({
            roomName: "BEDROOM",
            newSize: newBedroomSize,
          })
        );
        dispatch(
          updateRoomSize({
            roomName: "LIVING ROOM",
            newSize: newLivingRoomSize,
          })
        );

        // Update room capacities with new areas
        dispatch(
          updateRoomCapacity({
            roomName: "BEDROOM",
            newConfig: {
              area:
                (newBedroomSize[0] *
                  WIDTH_MULTIPLIER *
                  newBedroomSize[1] *
                  DEPTH_MULTIPLIER) /
                AREA_DIVISOR,
            },
          })
        );
        console.log("Updated Bedroom capacity:", {
          size: newBedroomSize,
          area:
            (newBedroomSize[0] *
              WIDTH_MULTIPLIER *
              newBedroomSize[1] *
              DEPTH_MULTIPLIER) /
            AREA_DIVISOR,
        });

        dispatch(
          updateRoomCapacity({
            roomName: "LIVING ROOM",
            newConfig: {
              area:
                (newLivingRoomSize[0] *
                  WIDTH_MULTIPLIER *
                  newLivingRoomSize[1] *
                  DEPTH_MULTIPLIER) /
                AREA_DIVISOR,
            },
          })
        );
        console.log("Updated Living Room capacity:", {
          size: newLivingRoomSize,
          area:
            (newLivingRoomSize[0] *
              WIDTH_MULTIPLIER *
              newLivingRoomSize[1] *
              DEPTH_MULTIPLIER) /
            AREA_DIVISOR,
        });

        // Update X position with wall movement
        dispatch(
          updateRoomPosition({
            roomName: "BEDROOM",
            newPosition: [
              2.7 + finalPosition.x / 2 - wallConfig.initialX,
              -1.54,
              -6,
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "LIVING ROOM",
            newPosition: [
              -2.7 + finalPosition.x / 2 + wallConfig.initialX,
              -1.54,
              -6,
            ],
          })
        );
      } else if (wallId === "wall2") {
        // Calculate new dimensions
        const newBathroomSize = [
          6 - movementDelta * 2,
          roomConfigs.BATHROOM.size[1],
        ];
        const newKitchenSize = [
          6 + movementDelta * 2,
          roomConfigs.KITCHEN.size[1],
        ];

        // Update sizes
        dispatch(
          updateRoomSize({
            roomName: "BATHROOM",
            newSize: newBathroomSize,
          })
        );
        dispatch(
          updateRoomSize({
            roomName: "KITCHEN",
            newSize: newKitchenSize,
          })
        );

        // Update room capacities with new areas
        dispatch(
          updateRoomCapacity({
            roomName: "BATHROOM",
            newConfig: {
              area:
                (newBathroomSize[0] *
                  WIDTH_MULTIPLIER *
                  newBathroomSize[1] *
                  DEPTH_MULTIPLIER) /
                AREA_DIVISOR,
            },
          })
        );
        console.log("Updated Bathroom capacity:", {
          size: newBathroomSize,
          area:
            (newBathroomSize[0] *
              WIDTH_MULTIPLIER *
              newBathroomSize[1] *
              DEPTH_MULTIPLIER) /
            AREA_DIVISOR,
        });

        dispatch(
          updateRoomCapacity({
            roomName: "KITCHEN",
            newConfig: {
              area:
                (newKitchenSize[0] *
                  WIDTH_MULTIPLIER *
                  newKitchenSize[1] *
                  DEPTH_MULTIPLIER) /
                AREA_DIVISOR,
            },
          })
        );
        console.log("Updated Kitchen capacity:", {
          size: newKitchenSize,
          area:
            (newKitchenSize[0] *
              WIDTH_MULTIPLIER *
              newKitchenSize[1] *
              DEPTH_MULTIPLIER) /
            AREA_DIVISOR,
        });

        // Update X position with wall movement
        dispatch(
          updateRoomPosition({
            roomName: "KITCHEN",
            newPosition: [
              -2.7 + finalPosition.x / 2 + wallConfig.initialX,
              -1.54,
              6.1,
            ],
          })
        );
        dispatch(
          updateRoomPosition({
            roomName: "BATHROOM",
            newPosition: [
              2.7 + finalPosition.x / 2 - wallConfig.initialX,
              -1.54,
              6.1,
            ],
          })
        );
      }
    };

    return (
      <group ref={ref}>
        <Suspense fallback={null}>
          <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
          <ambientLight intensity={0.2} />
          <Environment preset="apartment" background blur={0.6}>
            <Lightformer
              position={[10, 5, 0]}
              scale={[10, 1, 1]}
              intensity={2}
              color="#ffeded"
            />
            <Lightformer
              position={[-10, 5, 0]}
              scale={[10, 1, 1]}
              intensity={2}
              color="#edefff"
            />
          </Environment>

          <Stage
            environment="apartment"
            intensity={0.5}
            contactShadow={{ blur: 2, opacity: 0.5 }}
            shadowBias={-0.0015}
          >
            <House showCeiling={showCeiling} />
            <RoomLabels />
            {showOccupancy && <RoomOccupancy roomOccupants={{}} />}

            {wallPositions.map((wallProps) => (
              <Wall
                key={wallProps.id}
                id={wallProps.id}
                {...wallProps}
                isEditMode={isEditingRooms}
                onMoveComplete={(finalPosition) =>
                  handleWallMoveComplete(wallProps.id, finalPosition)
                }
              />
            ))}
          </Stage>

          <ContactShadows
            position={[0, 0, 0]}
            scale={10}
            resolution={1024}
            far={1}
            opacity={0.6}
            blur={1}
          />
        </Suspense>
      </group>
    );
  }
);

export default HomeScene;
