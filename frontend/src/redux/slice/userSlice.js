import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    data: null,
    userToken: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, { payload }) {
            // console.log(payload);
            state.data = payload.user;
            // console.log(payload);               
            state.userToken = payload.userToken;
            localStorage.setItem("user", JSON.stringify(state));
            localStorage.setItem("adminTimeStamp", new Date().getTime());

            // console.log(state.token);
        },
        lsUser(state) {
            const user = JSON.parse(localStorage.getItem("user"))
            if
                (user) {
                state.data = (user.data);
                // console.log(payload.ad);
                state.userToken = user.userToken;
            }
        },
        userLogout(state) {
            state.data = null;
            state.userToken = null;
            localStorage.removeItem("user")

            // localStorage.removeItem("adminTimeStamp")
        },



    },

})

// Action creators are generated for each case reducer function

export const { setUser, lsUser, userLogout } = userSlice.actions


export default userSlice.reducer








