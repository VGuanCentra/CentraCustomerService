import { createSlice } from "@reduxjs/toolkit";
import { AppModes } from "app/utils/constants";
import { faL } from "@fortawesome/free-solid-svg-icons";

export const appSlice = createSlice({
  name: "app",
  initialState: {
    appMode: AppModes.calendar,
    appVersion: "",
    drawerOpen: false,
    users: [],
    isMobile: true,
    networkInfo: { ip: "", isTest: false },
    isReadOnly: false,
    userToken: "",
    userData: null
  },
  reducers: {
    updateAppMode: (state, action) => {
      state.appMode = action.payload;
    },
    updateDrawerOpen: (state, action) => {
      state.drawerOpen = action.payload;
    },
    updateUsers: (state, action) => {
      state.users = action.payload;
    },
    updateIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
    updateNetworkInfo: (state, action) => {
      state.networkInfo = action.payload;
    },
    updateIsReadOnly: (state, action) => {
      state.isReadOnly = action.payload;
    },
    updateUserToken: (state, action) => {
      state.userToken = action.payload;
    },
    updateUserData: (state, action) => {
      state.userData = action.payload;
    },
    updateAppVersion: (state, action) => {
      state.appVersion = action.payload;
    },
  },
});

export const {
  updateAppMode,
  updateDrawerOpen,
  updateIsMobile,
  updateNetworkInfo,
  updateIsReadOnly,
  updateUserToken,
  updateUserData,
  updateAppVersion
} = appSlice.actions;

export default appSlice.reducer;
