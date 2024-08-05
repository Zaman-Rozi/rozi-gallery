import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
    users: [],
    admin: false,
    gallaries: [],
    admins:[]
}

const admin = createSlice({
    name: "admin",
    initialState: innitialState,
    reducers: {
        updateAdmins: (state, action) => {
            state.admins = action.payload
        },
        updateAdminUsers: (state, action) => {
            state.users = action.payload
        },
        updateAdminGallaries: (state, action) => {
            state.gallaries = action.payload
        },
        updateAdmin: (state, action) => {
            state.admin = action.payload
        },
    },
})

export const { updateAdminUsers, updateAdmin, updateAdminGallaries , updateAdmins} = admin.actions
export { admin }