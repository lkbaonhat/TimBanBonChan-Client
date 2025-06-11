import { authService } from "@/services/authService";
import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import { authSlice } from "./slice";
import { jwtDecode } from "jwt-decode"
import { userService } from "@/services/userService";

function* signInSaga(
  action: PayloadAction<{ email: string; password: string }> & { callback: (success: boolean) => void },
): Generator {
  try {
    const response = yield call(authService.signIn, action.payload);
    if (response.status === 200) {
      localStorage.setItem("accessToken", response.data.token);
      yield put(authSlice.actions.setIsAuthenticated(true));
      yield call(fetchUserLogin, { type: "FETCH_USER_LOGIN", payload: response.data.token })
      action.callback(true);
    }
  } catch (error: any) {
    if (error.response.status === 400) {
      action.callback(false);
    } else {
      console.error("Error in signInSaga:", error);
    }
  }
}

function* logoutSaga(action: { callback: (isSuccess: boolean) => void }): Generator {
  localStorage.removeItem("accessToken");
  yield put(authSlice.actions.setIsAuthenticated(false));
  action.callback(true);
}

function* fetchUserLogin(action: PayloadAction<string>): Generator {
  try {
    const token = jwtDecode(action.payload);
    const id = token.id
    if (id) {
      const response = yield call(userService.getSelfInfo, id)
      if (response.data.success)
        yield put(authSlice.actions.setUserInfo(response.data.data));
    }
  } catch (error) {
    console.error("Unexpected error: ", error)
  }
}

export function* authSaga() {
  yield takeLatest("SIGN_IN", signInSaga);
  yield takeLatest("LOGOUT", logoutSaga);
  yield takeLatest("FETCH_USER_LOGIN", fetchUserLogin)
}
