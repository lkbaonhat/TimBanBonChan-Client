import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { rootSaga } from "./rootSaga";
import rootReducer from "./rootReducer";
import { isTokenValid } from "@/lib/utils";
import { initialState as authInitialState } from "./modules/auth/state";

// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

const accessToken = localStorage.getItem("access_token");

let preloadedState;

if (accessToken && isTokenValid(accessToken)) {
  preloadedState = {
    auth: {
      ...authInitialState,
      isAuthenticated: true,
    },
  };
} else {
  preloadedState = undefined;
}

// Config store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: false,
      immutableCheck: false,
    }).concat(sagaMiddleware),
  preloadedState
});

// Run saga
sagaMiddleware.run(rootSaga);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
