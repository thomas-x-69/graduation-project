// src/store/roomConfigsSlice.js
import { createSlice } from "@reduxjs/toolkit";

export const initialState = {
  BEDROOM: {
    size: [6, 4.5],
    position: [2.9, -1.54, -6],
    color: "red",
  },
  "LIVING ROOM": {
    size: [6, 4.5],
    position: [-3.1, -1.54, -6],
    color: "blue",
  },
  KITCHEN: {
    size: [6, 4.5],
    position: [-3.1, -1.54, 6.1],
    color: "green",
  },
  BATHROOM: {
    size: [6, 4.5],
    position: [2.9, -1.54, 6.1],
    color: "yellow",
  },
  LOBBY: {
    size: [12, 7.1],
    position: [0, -1.54, 0.05],
    color: "black",
  },
};

const roomConfigsSlice = createSlice({
  name: "roomConfigs",
  initialState,
  reducers: {
    updateRoomSize: (state, action) => {
      const { roomName, newSize } = action.payload;
      if (state[roomName]) {
        state[roomName].size = newSize;
      }
    },
    updateRoomPosition: (state, action) => {
      const { roomName, newPosition } = action.payload;
      if (state[roomName]) {
        state[roomName].position = newPosition;
      }
    },
  },
});

// Make sure both actions are exported
export const { updateRoomSize, updateRoomPosition } = roomConfigsSlice.actions;
export const selectRoomConfigs = (state) => state.roomConfigs;
export default roomConfigsSlice.reducer;
