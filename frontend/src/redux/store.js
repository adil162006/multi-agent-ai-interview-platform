import { configureStore } from '@reduxjs/toolkit'
import resumeSlice from './resumeSlice'
import userSlice from './userSlice'

export const store = configureStore({
  reducer: {
    resume: resumeSlice,
    user: userSlice,
  }
})