import { configureStore } from '@reduxjs/toolkit';
import userAliasesReducer from '../userAliasesSlice';
// import counterReducer from '../features/counter/counterSlice';

export default configureStore({
  reducer: {
    userAliases: userAliasesReducer
    // counter: counterReducer,
  },
});
