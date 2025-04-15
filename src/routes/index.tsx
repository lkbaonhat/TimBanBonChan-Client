import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* Routes
import AuthRoutes from "./AuthRoutes";
import ROUTES from "@/constants/routes";
//* Layouts
import DefaultLayout from "@/layouts/DefaultLayout";
import ListPets from "@/pages/ListPets";
import PetDetail from "@/pages/PetDetail";
import AdoptionForm from "@/pages/AdoptionForm";
//* Lazy load pages
const Home = lazy(() => import("@/pages/Home"));

const RouterComponent = () => {
  const router = createBrowserRouter([
    //* PUBLIC routes
    {
      element: <DefaultLayout />,
      children: [
        { index: true, path: ROUTES.PUBLIC.HOME, element: <Home /> },
        { path: ROUTES.PUBLIC.LIST_PETS, element: <ListPets /> },
        { path: ROUTES.PUBLIC.PET_DETAIL, element: <PetDetail /> },
        { path: ROUTES.PUBLIC.ADOPTION_FORM, element: <AdoptionForm /> },
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
