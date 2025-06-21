import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    schedule: [],
    loading: false,
};

const itinerarySlice = createSlice({
    name: "itinerary",
    initialState,
    reducers: {
        setSchedule: (state, action) => {
            state.schedule = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        clearSchedule: (state) => {
            state.schedule = [];
        },
    },
});

export const { setSchedule, setLoading, clearSchedule } = itinerarySlice.actions;
export default itinerarySlice.reducer;
