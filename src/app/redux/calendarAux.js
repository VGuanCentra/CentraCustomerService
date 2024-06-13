import { createSlice } from "@reduxjs/toolkit";
import { SearchCategories } from "app/utils/constants";

export const searchSlice = createSlice({
  name: "search",
  initialState: {
    isLoading: false,
    searchEntry: "",
    searchResults: null,
    departmentToSearch: null,
    searchedEvents: [],
    includeHistorical: false
  },
  reducers: {
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateSearchEntry: (state, action) => {
      state.searchEntry = action.payload;
    },
    updateSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    updateDepartmentToSearch: (state, action) => {
      state.departmentToSearch = action.payload;
    },
    updateSearchedEvents: (state, action) => {
      state.searchedEvents = action.payload;
    },
    updateIncludeHistorical: (state, action) => {
      state.includeHistorical = action.payload;
    },
  },
});

export const menuSlice = createSlice({
  name: "menu",
  initialState: {
    isLoading: false,
    action: null
  },
  reducers: {
    updateIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    updateAction: (state, action) => {
      state.action = action.payload;
    },
  },
});

export const { actions: searchSliceActions, reducer: searchSliceReducer } = searchSlice;
export const { actions: menuSliceActions, reducer: menuSliceReducer } = menuSlice;
