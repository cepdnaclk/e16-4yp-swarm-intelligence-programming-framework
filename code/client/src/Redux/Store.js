import { configureStore } from "@reduxjs/toolkit";
import SidemenuMarginReducer from "./SidemenuMargin";
import firmwareFileSliceReducer from "./FirmwareFile";
import CodeGenStepsReducer from "./CodeGenSteps";

export const Store = configureStore({
  reducer: {
    margin: SidemenuMarginReducer,
    firmware: firmwareFileSliceReducer,
    step: CodeGenStepsReducer
  }
});