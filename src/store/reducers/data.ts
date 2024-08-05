import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
    filesURL: [],
}

const data = createSlice({
    name: "data",
    initialState: innitialState,
    reducers: {
        updateFilesURL: (state, action) => {
            state.filesURL = action.payload
        },
    },
})

export const { updateFilesURL } = data.actions
export { data };
