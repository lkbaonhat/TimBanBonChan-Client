import { petService } from "@/services/petService";
import { call, put, takeLatest, select } from "redux-saga/effects";
import { globalSlice } from "./slice";
import { selectorGlobal } from "./selector";

function* getAllPetsSaga(): Generator {
  try {
    const response = yield call(petService.getAllPets);
    if (response.status === 200) {
      yield put(globalSlice.actions.setListPet(response.data.data.items));
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

function* getPetsNeedingVerificationSaga(): Generator {
  try {
    // Trong trường hợp thực tế, có thể sẽ có API riêng để lấy danh sách thú cưng cần xác minh
    // Ở đây tạm thời sử dụng listPet và lọc những thú cưng cần xác minh
    const listPet = yield select(selectorGlobal.listPet);
    const petsNeedingVerification = (listPet as any[]).filter(
      pet => !pet.isVerified || pet.verificationStatus === 'pending_verification'
    );
    yield put(globalSlice.actions.setPetsNeedingVerification(petsNeedingVerification));
  } catch (error) {
    console.error("Error:", error);
  }
}

function* getPetDetailSaga(action: { type: string; payload: { slug: string } }): Generator {
  try {
    const { slug } = action.payload;
    // Trong trường hợp thực tế, có thể sẽ gọi API để lấy chi tiết thú cưng
    // Ở đây tạm thời không làm gì vì chi tiết thú cưng đã có trong state
  } catch (error) {
    console.error("Error:", error);
  }
}

function* verifyPetSaga(action: {
  type: string;
  payload: { id: number; isApproved: boolean }
}): Generator {
  try {
    const { id, isApproved } = action.payload;
    // Trong trường hợp thực tế, sẽ gọi API để xác minh thú cưng
    // Ở đây tạm thời chỉ cập nhật state
    yield put(globalSlice.actions.verifyPet({ id, isApproved }));
  } catch (error) {
    console.error("Error:", error);
  }
}

export function* globalSaga() {
  yield takeLatest("GET_ALL_PETS", getAllPetsSaga);
  yield takeLatest("GET_PETS_NEEDING_VERIFICATION", getPetsNeedingVerificationSaga);
  yield takeLatest("GET_PET_DETAIL", getPetDetailSaga);
  yield takeLatest("VERIFY_PET", verifyPetSaga);
}
