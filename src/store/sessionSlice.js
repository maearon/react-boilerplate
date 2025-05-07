import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import * as authService from "../services/authService"

export const loginUser = createAsyncThunk("session/login", async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials)
    return response
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Login failed" })
  }
})

export const logoutUser = createAsyncThunk("session/logout", async (_, { rejectWithValue }) => {
  try {
    await authService.logout()
    return true
  } catch (error) {
    return rejectWithValue(error.response?.data || { message: "Logout failed" })
  }
})

export const checkAuth = createAsyncThunk("session/checkAuth", async () => {
  return await authService.checkAuthStatus()
})

const sessionSlice = createSlice({
  name: "session",
  initialState: {
    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    initialized: false,
  },
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.loggedIn = true
        state.user = action.payload.user
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loggedIn = false
        state.user = null
      })
      .addCase(checkAuth.pending, (state) => {
        state.loading = true
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false
        state.loggedIn = action.payload.loggedIn
        state.user = action.payload.user
        state.initialized = true
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false
        state.loggedIn = false
        state.user = null
        state.initialized = true
      })
  },
})

export const { clearError } = sessionSlice.actions

export default sessionSlice.reducer
