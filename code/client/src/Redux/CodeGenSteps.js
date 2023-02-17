import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  step: 0
};

export const codeGenSlice = createSlice({
  name: "codegen_steps_slice",
  initialState,
  reducers: {
    increase: (state) => {
      state.step += 1 
    },
    decrease: (state) => {
        state.step -= 1 
    }
  }
});

// Action creators are generated for each case reducer function
export const { increase, decrease } = codeGenSlice.actions;

export default codeGenSlice.reducer;