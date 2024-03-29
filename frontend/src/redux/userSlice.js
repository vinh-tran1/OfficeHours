// userSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user_id: '',
  name: '',
  email: '',
  role: ''
};

const userSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      const { user_id, name, email, role } = action.payload;
      state.user_id = user_id;
      state.name = name;
      state.email = email;
      state.role = role;
    },
    clearUser: () => initialState,
  }
});

// Export actions
export const { setUserInfo, clearUser } = userSlice.actions;

// Export reducer
export default userSlice.reducer;

// Selectors
export const selectIsLoggedIn = (state) => state.userInfo.email?.length > 0 || false;
export const selectUserInfo = (state) => state.userInfo;
