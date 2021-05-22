import { configureStore } from '@reduxjs/toolkit';
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import pipelinrReducer from '../features/pipelinr/pipelinrSlice';

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, pipelinrReducer)

export const store = configureStore({
  reducer: {
    pipelinr: persistedReducer,
  },
});

export const persistor = persistStore(store)
