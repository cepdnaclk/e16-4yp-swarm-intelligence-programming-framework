import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  firmwareFile: null,
  dynamicCodeObject: null,
  formResult: null,
  algorithmName: null,
  generatedCppCode: null,
  generatedXmlCode: null
};

export const firmwareFileSlice = createSlice({
  name: "firmware_file",
  initialState,
  reducers: {
    change: (state, action) => {
      state.firmwareFile = action.payload
    },
    setDynamicCode: (state, action) => {
      state.dynamicCodeObject = action.payload
    },
    setFormResult: (state, action) => {
      state.formResult = action.payload
    },
    setAlgorithmName: (state, action) => {
      state.algorithmName = action.payload
    },
    setGeneratedCppCode: (state, action) => {
      state.generatedCppCode = action.payload
    },
    setGeneratedXmlCode: (state, action) => {
      state.generatedXmlCode = action.payload
    }
  }
});

// Action creators are generated for each case reducer function
export const { change, setDynamicCode, setFormResult, setAlgorithmName, setGeneratedCppCode, setGeneratedXmlCode } = firmwareFileSlice.actions;

export default firmwareFileSlice.reducer;