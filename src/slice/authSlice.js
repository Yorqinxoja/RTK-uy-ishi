import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  token: localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    signIn: (state, action) => {
      const token = action.payload?.access_token;
      if (token) {
        state.token = token;
        localStorage.setItem("token", token); 
      }
    },
   
    signOut: (state) => {
      state.token = null;
      localStorage.removeItem("token"); 
    },
  },
});

export const { signOut, signIn } = authSlice.actions;

export default authSlice.reducer;
