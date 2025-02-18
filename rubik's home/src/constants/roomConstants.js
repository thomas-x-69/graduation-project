// src/constants/roomConstants.js
import { initialState as initialRoomConfigs } from "../store/roomConfigsSlice";

// Constants for calculations
export const WIDTH_MULTIPLIER = 2.8;
export const DEPTH_MULTIPLIER = 2.5;
export const AREA_DIVISOR = 27;

// Calculate room dimensions based on imported initialRoomConfigs
export const ROOM_DIMENSIONS = {
  BEDROOM: {
    width: initialRoomConfigs.BEDROOM.size[0] * WIDTH_MULTIPLIER,
    depth: initialRoomConfigs.BEDROOM.size[1] * DEPTH_MULTIPLIER,
    area:
      (initialRoomConfigs.BEDROOM.size[0] *
        WIDTH_MULTIPLIER *
        initialRoomConfigs.BEDROOM.size[1] *
        DEPTH_MULTIPLIER) /
      AREA_DIVISOR,
    position: [3.3, 0.4, -5.2],
  },
  "LIVING ROOM": {
    width: initialRoomConfigs["LIVING ROOM"].size[0] * WIDTH_MULTIPLIER,
    depth: initialRoomConfigs["LIVING ROOM"].size[1] * DEPTH_MULTIPLIER,
    area:
      (initialRoomConfigs["LIVING ROOM"].size[0] *
        WIDTH_MULTIPLIER *
        initialRoomConfigs["LIVING ROOM"].size[1] *
        DEPTH_MULTIPLIER) /
      AREA_DIVISOR,
    position: [-6.3, 0.4, -5.2],
  },
  KITCHEN: {
    width: initialRoomConfigs.KITCHEN.size[0] * WIDTH_MULTIPLIER,
    depth: initialRoomConfigs.KITCHEN.size[1] * DEPTH_MULTIPLIER,
    area:
      (initialRoomConfigs.KITCHEN.size[0] *
        WIDTH_MULTIPLIER *
        initialRoomConfigs.KITCHEN.size[1] *
        DEPTH_MULTIPLIER) /
      AREA_DIVISOR,
    position: [-6.5, 0.4, 6.7],
  },
  BATHROOM: {
    width: initialRoomConfigs.BATHROOM.size[0] * WIDTH_MULTIPLIER,
    depth: initialRoomConfigs.BATHROOM.size[1] * DEPTH_MULTIPLIER,
    area:
      (initialRoomConfigs.BATHROOM.size[0] *
        WIDTH_MULTIPLIER *
        initialRoomConfigs.BATHROOM.size[1] *
        DEPTH_MULTIPLIER) /
      AREA_DIVISOR,
    position: [3.3, 0.4, 6.7],
  },
  LOBBY: {
    width: 5.5,
    depth: 4.0,
    area: 22.0,
    position: [-1.3, 0.4, 0.7],
  },
};
