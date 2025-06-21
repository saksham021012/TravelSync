import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  alerts: [],
  loading: false,
};

const alertSlice = createSlice({
  name: "alert",
  initialState,
  reducers: {
    setAlerts: (state, action) => {
      state.alerts = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearAlerts: (state) => {
      state.alerts = [];
    },
  },
});

export const { setAlerts, setLoading, clearAlerts } = alertSlice.actions;
export default alertSlice.reducer;
