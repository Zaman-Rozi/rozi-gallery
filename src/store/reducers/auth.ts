import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
    user: {},
    token: null,
    gallaries: [],
}

const auth = createSlice({
    name: "auth",
    initialState: innitialState,
    reducers: {
        addUser: (state, action) => {
            if (action.payload && action.payload?.uid) {
                state.user = action.payload
            }
        },
        updateUser: (state, action) => {
            if (action.payload) {
                state.user = { ...state.user, ...action.payload }
            }
        },
        updateToken: (state, action) => {
            state.token = action.payload
        },
        updateUserGalleries: (state, action) => {
            state.gallaries = action.payload
        }
    },
})

export const { addUser, updateToken, updateUserGalleries , updateUser } = auth.actions
export { auth }