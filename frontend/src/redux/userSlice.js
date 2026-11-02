import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getCurrentUser } from '../apis/user.api'
import api from '../utils/axios'

const getErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCurrentUser()
      return response?.user ?? null
    } catch (error) {
      if (error?.response?.status === 401) return null
      return rejectWithValue(getErrorMessage(error, 'Unable to verify your session.'))
    }
  },
  {
    condition: (_, { getState }) => {
      const status = getState().user.status
      return status === 'idle' || status === 'error'
    },
  }
)

export const loginUser = createAsyncThunk(
  'user/login',
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/login', { token })
      if (!response.data?.user) {
        return rejectWithValue(response.data?.message || 'Login did not return a user.')
      }
      return response.data.user
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to log in. Please try again.'))
    }
  }
)

export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/auth/logout')
      if (!response.data?.success) {
        return rejectWithValue(response.data?.message || 'Unable to log out. Please try again.')
      }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to log out. Please try again.'))
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    status: 'idle',
    error: null,
    loginLoading: false,
    logoutLoading: false,
  },
  reducers: {
    updateUser: (state, action) => {
      if (state.user) state.user = { ...state.user, ...action.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'checking'
        state.error = null
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = action.payload ? 'authenticated' : 'unauthenticated'
        state.user = action.payload
        state.error = null
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        if (action.meta.condition) return
        state.status = 'error'
        state.error = action.payload || action.error.message || 'Unable to verify your session.'
      })
      .addCase(loginUser.pending, (state) => {
        state.loginLoading = true
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loginLoading = false
        state.status = 'authenticated'
        state.user = action.payload
        state.error = null
      })
      .addCase(loginUser.rejected, (state) => {
        state.loginLoading = false
      })
      .addCase(logoutUser.pending, (state) => {
        state.logoutLoading = true
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.logoutLoading = false
        state.status = 'unauthenticated'
        state.user = null
      })
      .addCase(logoutUser.rejected, (state) => {
        state.logoutLoading = false
      })
  },
})

export const { updateUser } = userSlice.actions
export default userSlice.reducer
