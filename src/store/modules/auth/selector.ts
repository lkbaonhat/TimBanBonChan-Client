import { RootState } from '../../store'

const isAuthenticated = (state: RootState) => state.auth.isAuthenticated
const userInfo = (state: RootState) => state.auth.userInfo

export const selectorAuth = { isAuthenticated, userInfo } 