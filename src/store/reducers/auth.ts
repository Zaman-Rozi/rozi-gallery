import { createSlice } from "@reduxjs/toolkit";

const innitialState = {
    user: {},
    token: null,
    gallaries: [],
    admin: false,
    searchData: {},
    state: {}
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
        },
        removeUserGallerYByID: (state, action) => {
            const { id } = action.payload
            if (id) {
                state.gallaries = state?.gallaries?.filter((gal: any) => gal?.id !== id)
            }
        },
        updateUserGallaryItemByKey: (state, action) => {
            const { id, key, value } = action.payload

            if (id) {
                state.gallaries = state?.gallaries?.map((gal: any) => {
                    if (gal?.id === id) {
                        return {
                            ...gal,
                            [key]: value
                        }
                    } else {
                        return gal
                    }
                })
            }
        },
        updateAdmin: (state, action) => {
            state.admin = action.payload
        },
        updateSearchData: (state, action) => {
            state.searchData = action.payload
        },
        updateState: (state, action) => {
            state.state = action.payload
        }
    },
})

export const { addUser, updateToken, updateUserGalleries, updateUser, updateAdmin, removeUserGallerYByID, updateUserGallaryItemByKey, updateSearchData, updateState } = auth.actions
export { auth }