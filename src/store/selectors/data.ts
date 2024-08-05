'use client'

import { createSelector } from "@reduxjs/toolkit";

const rootState = (data: any) => data.data

export const selectFilesURL = createSelector(rootState, (data) => data?.filesURL);