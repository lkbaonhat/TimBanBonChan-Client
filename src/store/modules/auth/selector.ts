import { RootState } from '../../store'

const isAuthenticated = (state: RootState) => state.auth.isAuthenticated

export const selectorAuth = {isAuthenticated} 