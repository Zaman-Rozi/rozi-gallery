'use client'

import { createSelector } from "@reduxjs/toolkit";

const rootState = (data: any) => data.admin

export const selectAdminUsers = createSelector(rootState, (data) => data?.users);
export const selectAdminGalleries = createSelector(rootState, (data) => data?.gallaries);
export const selectAdmin = createSelector(rootState, (data) => data?.admin);
export const selectAdmins = createSelector(rootState, (data) => data?.admins);