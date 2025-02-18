// src/store/roomSlice.js
import { createSlice } from "@reduxjs/toolkit";
import { ROOM_DIMENSIONS } from "../constants/roomConstants";

const initialState = {
  roomSizes: ROOM_DIMENSIONS,
  totalArea: Object.values(ROOM_DIMENSIONS).reduce(
    (sum, room) => sum + room.area,
    0
  ),
};

const roomSlice = createSlice({
  name: "rooms",
  initialState,
  reducers: {
    updateRoomSize: (state, action) => {
      const { roomName, newSize } = action.payload;
      const area = newSize.width * newSize.depth;

      state.roomSizes[roomName] = {
        ...state.roomSizes[roomName],
        ...newSize,
        area,
      };

      // Recalculate total area
      state.totalArea = Object.values(state.roomSizes).reduce(
        (sum, room) => sum + room.area,
        0
      );
    },
  },
});

export const { updateRoomSize } = roomSlice.actions;

// Selectors
export const selectRoomSizes = (state) => state.rooms.roomSizes;
export const selectTotalArea = (state) => state.rooms.totalArea;

export default roomSlice.reducer;
