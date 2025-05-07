import { configureStore } from "@reduxjs/toolkit"
import sessionReducer from "./sessionSlide"

export const store = configureStore({
  reducer: {
    session: sessionReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
})

export default store
