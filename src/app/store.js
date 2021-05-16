import { configureStore } from '@reduxjs/toolkit';
import pipelinrReducer from '../features/pipelinr/pipelinrSlice';

export const store = configureStore({
  reducer: {
    pipelinr: pipelinrReducer,
  },
});
