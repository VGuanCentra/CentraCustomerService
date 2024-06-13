import { configureStore } from "@reduxjs/toolkit";
import appReducer from "./app";
import calendarReducer from "./calendar";
import ordersReducer from "./orders";
import { menuSliceReducer, searchSliceReducer } from "./calendarAux";

const store = configureStore({
  reducer: {
    app: appReducer,
    calendar: calendarReducer,
    orders: ordersReducer,
    menu: menuSliceReducer,
    search: searchSliceReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
