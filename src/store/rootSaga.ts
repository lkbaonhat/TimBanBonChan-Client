import { all, fork } from "redux-saga/effects";
import { globalSaga } from "./modules/global/saga";
import { authSaga } from "./modules/auth/saga";

// Import sagas

// Combine sagas
export function* rootSaga() {
  yield all([fork(globalSaga), fork(authSaga)]);
}
