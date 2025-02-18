// src/store/store.js
import { configureStore } from "@reduxjs/toolkit";
import { enableMapSet } from "immer";
import roomReducer from "./roomSlice";
import humanReducer from "./humanSlice";
import roomConfigsReducer from "./roomConfigsSlice";

// Enable Map and Set support in Immer
enableMapSet();

const store = configureStore({
  reducer: {
    rooms: roomReducer,
    humans: humanReducer,
    roomConfigs: roomConfigsReducer,
  },
});

export default store;
