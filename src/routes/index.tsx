import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* Routes
import AuthRoutes from "./AuthRoutes";
import ROUTES from "@constants/routes";
//* Layouts
import DefaultLayout from "@layouts/DefaultLayout";
//* Lazy load pages
const Home = lazy(() => import("@pages/Home"));
const VolunteerPage = lazy(() => import("@pages/Volunteer"));
const CommunityPage = lazy(() => import("@pages/Community"));
const PetCare = lazy(() => import("@/pages/PetCare"));
const ArticleDetail = lazy(() => import("@/pages/PetCare/ArticleDetail"));
const BlogCreate = lazy(() => import("@/pages/PetCare/BlogCreate/BlogCreate"));
const ListPets = lazy(() => import("@pages/ListPets"));
const PetDetail = lazy(() => import("@pages/PetDetail"));
const AdoptionForm = lazy(() => import("@pages/AdoptionForm"));
const ConfirmEmail = lazy(() => import("@pages/Auth/ConfirmEmail"));
const RegistrationSuccess = lazy(
  () => import("@pages/Auth/RegistrationSuccess")
);

const RouterComponent = () => {
  const router = createBrowserRouter([
    //* PUBLIC routes
    {
      element: <DefaultLayout />,
      children: [
        { index: true, path: ROUTES.PUBLIC.HOME, element: <Home /> },
        { path: ROUTES.PUBLIC.COMMUNITY, element: <CommunityPage /> },
        { path: ROUTES.PUBLIC.VOLUNTEER, element: <VolunteerPage /> },
        { path: ROUTES.PUBLIC.PETCARE, element: <PetCare /> },
        { path: ROUTES.PUBLIC.PETCARE_DETAIL, element: <ArticleDetail /> },
        { path: ROUTES.PUBLIC.PETCARE_CREATE, element: <BlogCreate /> },
        { path: ROUTES.PUBLIC.LIST_PETS, element: <ListPets /> },
        { path: ROUTES.PUBLIC.PET_DETAIL, element: <PetDetail /> },
        { path: ROUTES.PUBLIC.ADOPTION_FORM, element: <AdoptionForm /> },
        {
          path: ROUTES.PUBLIC.REGISTRATION_SUCCESS,
          element: <RegistrationSuccess />,
        },
        { path: ROUTES.PUBLIC.CONFIRM_EMAIL, element: <ConfirmEmail /> },
      ],
    },
    //* AUTH routes *
    ...AuthRoutes,
    //**** PRIVATE routes ****
    // {
    //   element: <PersistToken />,
    //   children: [
    //     //* Admin routes *
    //     {
    //       element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
    //       children: [AdminRoutes],
    //     },
    //     //* Member routes *
    //     {
    //       element: <PrivateRoute allowedRoles={[ROLE.MEMBER]} />,
    //       children: [...MemberRoutes],
    //     },
    //   ],
    // },
  ]);

  return <RouterProvider router={router} />;
};

export default RouterComponent;
