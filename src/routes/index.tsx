import { lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//* Routes
import AuthRoutes from "./AuthRoutes";
import ROUTES from "@constants/routes";
//* Layouts
import DefaultLayout from "@layouts/DefaultLayout";
import SidebarLayout from "@/layouts/SidebarLayout";
import StaffDashboard from "@/pages/Staff/Dashboard";
import PetInfoList from "@/pages/Staff/ManagePet/PetInfoList";
import AddPetPage from "@/pages/Staff/ManagePet/AddPet";
import { PetDetailsPage } from "@/pages/Staff/ManagePet/PetDetail";
import EditPetPage from "@/pages/Staff/ManagePet/EditPet";
import VerifyPetsPage from "@/pages/Staff/VerifyPet";
import VerifyPetDetail from "@/pages/Staff/VerifyPet/PetDetail";
import ActiveVolunteers from "@/pages/Staff/ManageVolunteer/ActiveVolunteer";
import VolunteerApplications from "@/pages/Staff/ManageVolunteer/VolunteerApplications";
import VolunteerApplicationDetail from "@/pages/Staff/ManageVolunteer/VolunteerApplicationDetail";
import ManageAdoptions from "@/pages/Staff/ManageAdoptions";
import AdoptionApplicationDetail from "@/pages/Staff/ManageAdoptions/AdoptionApplicationDetail";
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
const ConfirmEmail = lazy(() => import("@pages/Auth/ConfirmEmail"));
const RegistrationSuccess = lazy(
  () => import("@pages/Auth/RegistrationSuccess")
);
const ListClinics = lazy(() => import("@/pages/PetCare/ListClinics"));
import FindNewHome from "@/pages/FindNewHome";
import ProfileDetail from "@/pages/FindNewHome/ProfileDetail";
import VetClinicProfile from "@/pages/PetCare/ClinicDetail";
const ProfilePage = lazy(() => import("@/pages/Profile"));
import AddPet from "@/pages/Profile/AddPet";
import UpdatePetInfo from "@/pages/Profile/UpdatePetInfo";

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
        { path: ROUTES.PUBLIC.CLINIC_DETAIL, element: <VetClinicProfile /> },
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
    {
      element: <SidebarLayout roleUser="staff" />,
      children: [{ path: ROUTES.STAFF.HOME, element: <StaffDashboard /> },
      { path: ROUTES.STAFF.MANAGE_PETS, element: <PetInfoList /> },
      { path: ROUTES.STAFF.ADD_PET, element: <AddPetPage /> },
      { path: ROUTES.STAFF.EDIT_PET, element: <EditPetPage /> },
      { path: ROUTES.STAFF.PET_DETAIL, element: <PetDetailsPage /> },
      { path: ROUTES.STAFF.VERIFY_PETS, element: <VerifyPetsPage /> }, { path: ROUTES.STAFF.VERIFY_PET_DETAIL, element: <VerifyPetDetail /> },
      { path: ROUTES.STAFF.MANAGE_VOLUNTEERS, element: <ActiveVolunteers /> },
      { path: ROUTES.STAFF.VOLUNTEER_APPLICATIONS, element: <VolunteerApplications /> },
      { path: ROUTES.STAFF.VOLUNTEER_APPLICATION_DETAIL, element: <VolunteerApplicationDetail /> },
      { path: ROUTES.STAFF.ADOPTIONS, element: <ManageAdoptions /> },
      { path: ROUTES.STAFF.ADOPTION_DETAIL, element: <AdoptionApplicationDetail /> },
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
