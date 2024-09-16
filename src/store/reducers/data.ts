import { makeDocID } from "@/lib/helpers";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const innitialState = {
    archivedGallaries: [],
    folders: [],
    foldersLoading: false,
    inViewGallaries: [],
    inViewGallariesLoading: false,
}

const data = createSlice({
    name: "data",
    initialState: innitialState,
    reducers: {
        updateArchivedGallaries: (state, action) => {
            state.archivedGallaries = action.payload
        },
        addArchivedGallary: (state, action) => {
            const { row } = action.payload
            state.archivedGallaries = [...state.archivedGallaries, row]
        },
        addArchivedGallaries: (state, action) => {
            const { gallaries } = action.payload
            state.archivedGallaries = [...state.archivedGallaries, ...gallaries]
        },
        removeArchivedGallary: (state, action) => {
            const { folderName, gallaryKey } = action.payload
            if (folderName && gallaryKey) {
                state.archivedGallaries = state.archivedGallaries.filter((gal: any) => !(gal?.folder === folderName && gal?.key === gallaryKey))
            }
        },
        addFolder: (state, action) => {
            const { folderName } = action.payload
            if (folderName) {
                if (!state?.folders?.includes(folderName)) {
                    state.folders = [...(state?.folders ? state?.folders : []), folderName ]
                }
            }
        },
        updateFolders: (state, action) => {
            const { folders } = action.payload
            state.folders = folders
        },
        updateFoldersLoadingStatus: (state, action) => {
            state.foldersLoading = action.payload
        },
        updateInViewGallaries: (state, action) => {
            const { gallaries } = action.payload
            state.inViewGallaries = gallaries
        },
        removeInViewGallariesByID: (state, action) => {
            const { id } = action.payload
            state.inViewGallaries = state.inViewGallaries.filter((gal: any) => id !== makeDocID(gal?.key, gal?.password))
        },
        updateInViewGallariesLoadingStatus: (state, action) => {
            state.inViewGallariesLoading = action.payload
        },
        updateInViewGallaryItemByKey: (state, action) => {
            const { gallaryKey, key, value , updateAll } = action.payload

            if (gallaryKey) {
                state.inViewGallaries = state?.inViewGallaries?.map((gal: any) => {
                    if (gal?.key === gallaryKey) {
                        if (updateAll) {
                            return updateAll
                        }
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
    },
})

export const updatePinGallaryRefferrence: any = createAsyncThunk(
    'users/pin/gallary',
    async () => {

    }
);

export const {
    updateArchivedGallaries,
    addArchivedGallary,
    removeArchivedGallary,
    addFolder,
    updateFolders,
    updateFoldersLoadingStatus,
    updateInViewGallaries,
    updateInViewGallariesLoadingStatus,
    removeInViewGallariesByID,
    updateInViewGallaryItemByKey,
    addArchivedGallaries
} = data.actions
export { data };
