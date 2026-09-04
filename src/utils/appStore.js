import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import connectionReducer from './connectionSlice.js';

const appStore = configureStore({
    reducer: {
        user: userReducer,
        connection: connectionReducer,
    },
});

export default appStore;
