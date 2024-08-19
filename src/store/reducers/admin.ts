import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
    users: [],
    admin: false,
    gallaries: [],
    admins: []
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
        removeAdminUser: (state, action) => {
            const { id } = action.payload
            if (id) {
                state.users = state.users.map((user: any) => {
                    if (user['id'] !== id) {
                        return user
                    }
                })
            }
        },
        updateAdminUser: (state, action) => {
            const { id, data } = action.payload
            if (id && data) {
                state.users = state.users.map((user: any) => {
                    if (user['id'] === id) {
                        return {
                            ...user,
                            ...data
                        }
                    } else {
                        return user
                    }
                })
            }
        },
        updateAdminGallaries: (state, action) => {
            state.gallaries = action.payload
        },
        updateAdmin: (state, action) => {
            state.admin = action.payload
        },
    },
})

export const { updateAdminUsers, updateAdmin, updateAdminGallaries, updateAdmins, updateAdminUser , removeAdminUser} = admin.actions
export { admin }