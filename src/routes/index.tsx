import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* Routes
import AuthRoutes from "./AuthRoutes";
import ROUTES from "@constants/routes";
//* Layouts
import DefaultLayout from "@layouts/DefaultLayout";
import SidebarLayout from "@/layouts/SidebarLayout";
import StaffDashboard from "@/pages/Staff/Dashboard";
import PetInfoList from "@/pages/Staff/PetInfoList";
import { AddPetPage } from "@/pages/Staff/AddPet";
import { PetDetailsPage } from "@/pages/Staff/PetDetail";
//* Lazy load pages
const Home = lazy(() => import("@pages/Home"));
const VolunteerPage = lazy(() => import("@pages/Volunteer"));
const VolunteerForm = lazy(
  () => import("@pages/Volunteer/VolunteerForm/index")
);
const CommunityPage = lazy(() => import("@pages/Community"));
const PetCare = lazy(() => import("@/pages/PetCare"));
const ArticleDetail = lazy(
  () => import("@/pages/PetCare/ArticleDetail/ArticleDetail")
);
const ClinicDetail = lazy(
  () => import("@/pages/PetCare/ClinicDetail/ClinicDetail")
);
const BlogCreate = lazy(() => import("@/pages/PetCare/BlogCreate/BlogCreate"));
const ListPets = lazy(() => import("@pages/ListPets"));
const PetDetail = lazy(() => import("@/pages/ListPets/PetDetail"));
const AdoptionForm = lazy(() => import("@/pages/ListPets/AdoptionForm"));
const ConfirmEmail = lazy(() => import("@pages/Auth/ConfirmEmail"));
const RegistrationSuccess = lazy(
  () => import("@pages/Auth/RegistrationSuccess")
);
const ListClinics = lazy(() => import("@/pages/PetCare/ListClinics"));

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
        { path: ROUTES.PUBLIC.CLINICS, element: <ListClinics /> },
        { path: ROUTES.PUBLIC.CLINIC_DETAIL, element: <ClinicDetail /> },
        { path: ROUTES.PUBLIC.PETCARE_CREATE, element: <BlogCreate /> },
        { path: ROUTES.PUBLIC.LIST_PETS, element: <ListPets /> },
        { path: ROUTES.PUBLIC.PET_DETAIL, element: <PetDetail /> },
        { path: ROUTES.PUBLIC.ADOPTION_FORM, element: <AdoptionForm /> },
        {
          path: ROUTES.PUBLIC.REGISTRATION_SUCCESS,
          element: <RegistrationSuccess />,
        },
        { path: ROUTES.PUBLIC.CONFIRM_EMAIL, element: <ConfirmEmail /> },
        { path: ROUTES.PUBLIC.VOLUNTEER_FORM, element: <VolunteerForm /> },
      ],
    },
    {
      element: <SidebarLayout roleUser="staff" />,
      children: [
        { path: ROUTES.STAFF.HOME, element: <StaffDashboard /> },
        { path: ROUTES.STAFF.MANAGE_PETS, element: <PetInfoList /> },
        { path: ROUTES.STAFF.ADD_PET, element: <AddPetPage /> },
        { path: ROUTES.STAFF.PET_DETAIL, element: <PetDetailsPage /> },
      ]

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
