import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

import pipelinrReducer from '../features/pipelinr/pipelinrSlice';

import { encryptTransform } from 'redux-persist-transform-encrypt';

import {
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER
} from "redux-persist";

const persistConfig = {
    key: 'root',
    storage,
    transforms: [
        encryptTransform({
            secretKey: 'my-super-secret-key',
            onError: function (error) {
                // Handle the error.
            },
        }),
    ],
}

const persistedReducer = persistReducer(persistConfig, pipelinrReducer)

export const store = configureStore({
  reducer: {
    pipelinr: persistedReducer,
  },
  middleware: getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
    }
  })
});

export const persistor = persistStore(store)
