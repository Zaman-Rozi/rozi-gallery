'use client'

import { createSelector } from "@reduxjs/toolkit";

const rootState = (data: any) => data.data

export const selectArchivedGallaries = createSelector(rootState, (data) => data?.archivedGallaries);
export const selectUserFolders = createSelector(rootState, (data) => data?.folders);
export const selectFoldersLoading = createSelector(rootState, (data) => data?.foldersLoading);
export const selectInViewGallaries = createSelector(rootState, (data) => data?.inViewGallaries);
export const selectInViewGallariesLoading = createSelector(rootState, (data) => data?.inViewGallariesLoading);