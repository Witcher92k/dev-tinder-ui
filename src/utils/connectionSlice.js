

import { createSlice } from "@reduxjs/toolkit"

const connectionSlice = createSlice({


    name: "connection",
    initialState: [],
    reducers: {

        addConnection: (state, action) => action.payload,
        addSingleConnection: (state, action) => {
            const user = action.payload
            const alreadyExists = state.some((connection) => connection?._id === user?._id)

            if (user && !alreadyExists) {
                state.unshift(user)
            }
        },
        removeConnection: () => []




    }




})

export const { addConnection, addSingleConnection, removeConnection } = connectionSlice.actions;

export default connectionSlice.reducer;
