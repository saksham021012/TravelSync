import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  trips: [],
  loading: false,
};

const tripSlice = createSlice({
  name: "trip",
  initialState,
  reducers: {
    setTrips: (state, action) => {
      state.trips = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearTrips: (state) => {
      state.trips = [];
    },
  },
});

export const { setTrips, setLoading, clearTrips } = tripSlice.actions;
export default tripSlice.reducer;
