// src/store/humanSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { ROOM_DIMENSIONS } from "../constants/roomConstants";

// Calculate room capacities based on room areas
const calculateRoomOccupancy = (roomConfig) => {
  // Each person needs 3.0 square meters
  const maxCapacity = Math.floor(roomConfig.area / 2.5);

  return {
    currentOccupancy: 0,
    maxCapacity,
    humanIds: [], // Track humans in this room
    area: roomConfig.area, // Store area for reference
  };
};

const calculateInitialState = () => {
  const roomOccupancy = {};

  // Initialize each room with its own independent state
  Object.entries(ROOM_DIMENSIONS).forEach(([roomName, config]) => {
    roomOccupancy[roomName] = calculateRoomOccupancy(config);
    console.log(
      `Room ${roomName} area: ${config.area}, max capacity: ${roomOccupancy[roomName].maxCapacity}`
    );
  });

  return {
    roomOccupancy,
    placedHumans: {},
  };
};

const humanSlice = createSlice({
  name: "humans",
  initialState: calculateInitialState(),
  reducers: {
    updateRoomCapacity: (state, action) => {
      const { roomName, newConfig } = action.payload;
      console.log("Received room capacity update:", { roomName, newConfig });
      const currentRoom = state.roomOccupancy[roomName];

      if (!currentRoom) return;

      const newOccupancy = calculateRoomOccupancy(newConfig);

      // Preserve current occupants while updating capacity
      newOccupancy.currentOccupancy = currentRoom.currentOccupancy;
      newOccupancy.humanIds = currentRoom.humanIds;

      state.roomOccupancy[roomName] = newOccupancy;

      console.log(`Updated ${roomName} capacity:`, {
        area: newConfig.area,
        maxCapacity: newOccupancy.maxCapacity,
        currentOccupancy: newOccupancy.currentOccupancy,
      });
    },

    addHuman: (state, action) => {
      const { id, position, room } = action.payload;
      const roomState = state.roomOccupancy[room];

      if (!roomState) {
        console.error(`Room ${room} not found`);
        return;
      }

      if (roomState.currentOccupancy >= roomState.maxCapacity) {
        console.error(`Room ${room} is at capacity`);
        return;
      }

      // Add human to global tracking
      state.placedHumans[id] = {
        position,
        room,
      };

      // Update room occupancy
      roomState.currentOccupancy += 1;
      roomState.humanIds.push(id);

      console.log(`Human added successfully. New room state:`, {
        room,
        current: roomState.currentOccupancy,
        max: roomState.maxCapacity,
        humans: roomState.humanIds,
      });
    },

    removeHuman: (state, action) => {
      const { id, room } = action.payload;
      const roomState = state.roomOccupancy[room];

      if (!roomState || !roomState.humanIds.includes(id)) {
        console.error(`Cannot remove human ${id} from ${room}`);
        return;
      }

      // Remove from global tracking
      delete state.placedHumans[id];

      // Update room occupancy
      roomState.currentOccupancy -= 1;
      roomState.humanIds = roomState.humanIds.filter(
        (humanId) => humanId !== id
      );

      console.log(`Human removed successfully. New room state:`, {
        room,
        current: roomState.currentOccupancy,
        max: roomState.maxCapacity,
        humans: roomState.humanIds,
      });
    },

    moveHuman: (state, action) => {
      const { id, oldRoom, newRoom, newPosition } = action.payload;
      const oldRoomState = state.roomOccupancy[oldRoom];
      const newRoomState = state.roomOccupancy[newRoom];

      if (!oldRoomState || !newRoomState) {
        console.error("Invalid room in move operation");
        return;
      }

      if (newRoomState.currentOccupancy >= newRoomState.maxCapacity) {
        console.error(`Destination room ${newRoom} is at capacity`);
        return;
      }

      // Remove from old room
      oldRoomState.currentOccupancy -= 1;
      oldRoomState.humanIds = oldRoomState.humanIds.filter(
        (humanId) => humanId !== id
      );

      // Add to new room
      newRoomState.currentOccupancy += 1;
      newRoomState.humanIds.push(id);

      // Update human's data
      state.placedHumans[id] = {
        position: newPosition,
        room: newRoom,
      };

      console.log(`Human moved successfully. New states:`, {
        oldRoom: {
          room: oldRoom,
          current: oldRoomState.currentOccupancy,
          max: oldRoomState.maxCapacity,
          humans: oldRoomState.humanIds,
        },
        newRoom: {
          room: newRoom,
          current: newRoomState.currentOccupancy,
          max: newRoomState.maxCapacity,
          humans: newRoomState.humanIds,
        },
      });
    },
  },
});

export const { addHuman, removeHuman, moveHuman, updateRoomCapacity } =
  humanSlice.actions;

// Selectors
export const selectRoomOccupancy = (state) => state.humans.roomOccupancy;
export const selectPlacedHumans = (state) => state.humans.placedHumans;
export const selectRoomCapacity = (roomName) => (state) => {
  const room = state.humans.roomOccupancy[roomName];
  if (!room) return null;

  return {
    current: room.currentOccupancy,
    max: room.maxCapacity,
    isFull: room.currentOccupancy >= room.maxCapacity,
    humans: room.humanIds,
  };
};

export default humanSlice.reducer;
