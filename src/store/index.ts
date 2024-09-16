import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { admin } from "./reducers/admin";
import { auth } from "./reducers/auth";
import { data } from "./reducers/data";

const reducers = {
  auth: auth.reducer,
  admin: admin.reducer,
  data: data.reducer,
};

const rootPersistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth'],
};

const rootReducer = combineReducers(reducers);

const persistedReducer = persistReducer(rootPersistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

const persistor = persistStore(store);

export { persistor, store };

