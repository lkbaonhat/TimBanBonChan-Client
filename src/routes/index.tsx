import { lazy, Suspense } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* Routes
import AuthRoutes from "./AuthRoutes";
import ROUTES from "@constants/routes";
import StaffRoutes from "./StaffRoutes";
import PrivateRoute from "@/components/Auth/PrivateRoutes";
import PublicRoute from "@/components/Auth/PublicRoutes";
//* Layouts
const DefaultLayout = lazy(() => import("@layouts/DefaultLayout"))
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
const BlogCreate = lazy(() => import("@/pages/PetCare/BlogCreate/BlogCreate"));
const ListPets = lazy(() => import("@pages/ListPets"));
const PetDetail = lazy(() => import("@/pages/ListPets/PetDetail"));
const AdoptionForm = lazy(() => import("@/pages/ListPets/AdoptionForm"));
const ListClinics = lazy(() => import("@/pages/PetCare/ListClinics"));
import FindNewHome from "@/pages/FindNewHome";
import ProfileDetail from "@/pages/FindNewHome/ProfileDetail";
import VetClinicProfile from "@/pages/PetCare/ClinicDetail";
const ProfilePage = lazy(() => import("@/pages/Profile"));
import AddPet from "@/pages/Profile/AddPet";
import UpdatePetInfo from "@/pages/Profile/UpdatePetInfo";
import LoadingPage from "@/pages/Loading";
import PersistToken from "@/components/Auth/PersistLogin";
import { ROLE } from "@/constants/global";

const RouterComponent = () => {
  const router = createBrowserRouter([
    //* PUBLIC routes
    {
      element: <DefaultLayout />,
      children: [
        {
          index: true, path: ROUTES.PUBLIC.HOME, element: <Home />
        },
        { path: ROUTES.PUBLIC.COMMUNITY, element: <CommunityPage /> },
        { path: ROUTES.PUBLIC.VOLUNTEER, element: <VolunteerPage /> },
        { path: ROUTES.PUBLIC.PETCARE, element: <PetCare /> },
        { path: ROUTES.PUBLIC.PETCARE_DETAIL, element: <ArticleDetail /> },
        { path: ROUTES.PUBLIC.CLINICS, element: <ListClinics /> },
        { path: ROUTES.PUBLIC.CLINIC_DETAIL, element: <VetClinicProfile /> },
        { path: ROUTES.PUBLIC.PETCARE_CREATE, element: <BlogCreate /> },
        { path: ROUTES.PUBLIC.LIST_PETS, element: <ListPets /> },
        { path: ROUTES.PUBLIC.PET_DETAIL, element: <PetDetail /> },
        { path: ROUTES.PUBLIC.ADOPTION_FORM, element: <AdoptionForm /> },
        { path: ROUTES.PUBLIC.VOLUNTEER_FORM, element: <VolunteerForm /> },
        { path: ROUTES.PUBLIC.FIND_NEW_HOME, element: <FindNewHome /> },
        {
          path: ROUTES.PUBLIC.FIND_NEW_HOME_DETAIL,
          element: <ProfileDetail />,
        },
        { path: ROUTES.PUBLIC.PROFILE, element: <ProfilePage /> },
        { path: ROUTES.PUBLIC.ADD_PET, element: <AddPet /> },
        { path: ROUTES.PUBLIC.UPDATE_PET, element: <UpdatePetInfo /> },
      ],
    },
    //* AUTH routes *\
    {
      element: <PublicRoute><></></PublicRoute>,
      children: [...AuthRoutes]
    },
    //**** PRIVATE routes ****
    {
      element: <PersistToken />,
      children: [
        //* Admin routes *
        // {
        //   element: <PrivateRoute allowedRoles={[ROLE.ADMIN]} />,
        //   children: [...AdminRoutes],
        // },
        //* Member routes *
        {
          element: <PrivateRoute allowedRoles={[ROLE.STAFF]} />,
          children: [...StaffRoutes],
        },
      ],
    },
  ]);

  return (
    <Suspense fallback={<LoadingPage />}>
      <RouterProvider router={router} />
    </Suspense>
  )
};

export default RouterComponent;
