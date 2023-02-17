import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  margin: false
};

export const marginSlice = createSlice({
  name: "margin",
  initialState,
  reducers: {
    change: (state) => {
      state.margin = !state.margin;
    },
  }
});

// Action creators are generated for each case reducer function
export const { change } = marginSlice.actions;

export default marginSlice.reducer;