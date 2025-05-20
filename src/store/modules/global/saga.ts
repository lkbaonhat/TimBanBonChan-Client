import { petService } from "@/services/petService";
import { call, put, takeLatest } from "redux-saga/effects";
import { globalSlice } from "./slice";


function* getAllPetsSaga(): Generator {
  try {
    const response = yield call(petService.getAllPets);
    if (response.status === 200) {
      yield put(globalSlice.actions.setListPet(response.data.data));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

export function* globalSaga() {
  yield takeLatest("GET_ALL_PETS", getAllPetsSaga);
}
