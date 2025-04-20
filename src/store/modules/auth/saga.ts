import { authService } from "@/services/authService";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { authSlice } from "./slice";

function* signInSaga(
  action: PayloadAction<{ email: string; password: string }>
): Generator {
  try {
    const response = yield call(authService.signIn, action.payload);
    if (response.status === 200) {
      localStorage.setItem("token", response.data.token);
      yield put(authSlice.actions.setIsAuthenticated(true));
    }

    console.log(response.data);
  } catch (error) {
    console.error("Error in signInSaga:", error);
  }
}

export function* authSaga() {
  yield takeLatest("SIGN_IN", signInSaga);
}
