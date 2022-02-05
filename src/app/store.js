import { configureStore } from '@reduxjs/toolkit';
import userAliasesReducer from '../userAliasesSlice';
import receiverReducer from '../receivers-slice'

export default configureStore({
  reducer: {
    userAliases: userAliasesReducer, 
    receiver: receiverReducer
  },
});
