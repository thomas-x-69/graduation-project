// src/components/RoomLabels.jsx
import { Text } from "@react-three/drei";

const RoomLabels = () => {
  const rooms = [
    { name: "BEDROOM", position: [3.3, 0.4, -5.2], scale: 0.5 },
    { name: "LIVING ROOM", position: [-6.3, 0.4, -5.2], scale: 0.5 },
    { name: "KITCHEN", position: [-6.5, 0.4, 6.7], scale: 0.6 },
    { name: "BATHROOM", position: [3.3, 0.4, 6.7], scale: 0.6 },
    { name: "LOBBY", position: [-1.3, 0.4, 0.7], scale: 2 },
  ];

  return rooms.map((room, index) => (
    <Text
      key={index}
      position={room.position}
      rotation={[-Math.PI / 2, 0, -1.57]}
      fontSize={room.scale}
      color="#e7ded6"
      fillOpacity={0.5}
      anchorX="center"
      anchorY="middle"
      opacity={0.1}
      renderOrder={1}
      depthWrite={false}
      userData={{ type: "roomLabel" }}
    >
      {room.name}
    </Text>
  ));
};

export default RoomLabels;
