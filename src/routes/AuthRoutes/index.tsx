// import Logout from '@/components/Auth/Logout';
// import config from '@/config';
import ROUTES from "@/constants/routes";
import { lazy } from "react";

//* Lazy load pages
const SignIn = lazy(() => import("@/pages/Auth/SignIn"));
const SignUp = lazy(() => import("@/pages/Auth/SignUp"));

const AuthRoutes = [
  { path: ROUTES.PUBLIC.SIGNIN, element: <SignIn /> },
  { path: ROUTES.PUBLIC.SIGNUP, element: <SignUp /> },
  //   { path: config.routes.auth.logout, element: <Logout /> },
  //   { path: config.routes.auth.validateEmail, element: <ValidateEmail /> },
  //   { path: config.routes.auth.forgotPassword, element: <ForgetPassword /> },
  //   { path: config.routes.auth.unauthorized, element: <UnauthorizedPage /> },
];

export default AuthRoutes;
