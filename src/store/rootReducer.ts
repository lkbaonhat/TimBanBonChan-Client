import { combineReducers } from "redux";

// Import reducers
import globalReducer from "./modules/global/slice";
import authReducer from "./modules/auth/slice";

// Combine reducers
const rootReducers = combineReducers({
  global: globalReducer,
  auth: authReducer,
});

export default rootReducers;
