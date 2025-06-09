// import Logout from '@/components/Auth/Logout';
// import config from '@/config';
import ROUTES from "@/constants/routes";
import { lazy } from "react";

//* Lazy load pages
const SignIn = lazy(() => import("@/pages/Auth/SignIn"));
const SignUp = lazy(() => import("@/pages/Auth/SignUp"));
const ConfirmEmail = lazy(() => import("@pages/Auth/ConfirmEmail"));
const RegistrationSuccess = lazy(
  () => import("@pages/Auth/RegistrationSuccess")
);

const AuthRoutes = [
  { path: ROUTES.PUBLIC.SIGNIN, element: <SignIn /> },
  { path: ROUTES.PUBLIC.SIGNUP, element: <SignUp /> },
  { path: ROUTES.PUBLIC.CONFIRM_EMAIL, element: <ConfirmEmail /> },
  {
    path: ROUTES.PUBLIC.REGISTRATION_SUCCESS,
    element: <RegistrationSuccess />,
  },
];

export default AuthRoutes;
