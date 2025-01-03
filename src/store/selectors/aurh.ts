'use client'

import { createSelector } from "@reduxjs/toolkit";

const rootState = (data: any) => data.auth

export const selectUser = createSelector(rootState,(data)=>data?.user);
export const selectToken = createSelector(rootState,(data)=>data?.token);
export const selectGalleries = createSelector(rootState,(data)=>data?.gallaries);
export const selectAdmin = createSelector(rootState,(data)=>data?.admin);
export const selectSearchData = createSelector(rootState,(data)=>data?.searchData);