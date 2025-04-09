import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { initialState } from "./state";

const editorSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
});

export const {} = editorSlice.actions;

export default editorSlice.reducer;
