import ROUTES from "@/constants/routes";
import SidebarLayout from "@/layouts/SidebarLayout";
import { lazy } from "react";

//Page component
const StaffDashboard = lazy(() => import("@pages/Home"))
const PetInfoList = lazy(() => import("@pages/Staff/ManagePet/PetInfoList"))
const AddPetPage = lazy(() => import("@pages/Staff/ManagePet/AddPet"))
const EditPetPage = lazy(() => import("@pages/Staff/ManagePet/EditPet"))
const PetDetailsPage = lazy(() => import("@pages/Staff/ManagePet/PetDetail"))
const VerifyPetsPage = lazy(() => import("@pages/Staff/VerifyPet"))
const VerifyPetDetail = lazy(() => import("@pages/Staff/VerifyPet/components/PetDetail"))
const ActiveVolunteers = lazy(() => import("@pages/Staff/ManageVolunteer/ActiveVolunteer"))
const VolunteerApplications = lazy(() => import("@pages/Staff/ManageVolunteer/VolunteerApplications"))
const VolunteerApplicationDetail = lazy(() => import("@pages/Staff/ManageVolunteer/VolunteerApplicationDetail"))
const ManageAdoptions = lazy(() => import("@pages/Staff/ManageAdoptions"))
const AdoptionApplicationDetail = lazy(() => import("@pages/Staff/ManageAdoptions/AdoptionApplicationDetail"))
const VerifyUser = lazy(() => import("@pages/Staff/VerifyUser"))

const StaffRoutes = [
    {
        path: ROUTES.STAFF.HOME,
        element: <SidebarLayout roleUser="staff" />,
        children: [
            { path: ROUTES.STAFF.HOME, element: <StaffDashboard /> },
            { path: ROUTES.STAFF.MANAGE_PETS, element: <PetInfoList /> },
            { path: ROUTES.STAFF.ADD_PET, element: <AddPetPage /> },
            { path: ROUTES.STAFF.EDIT_PET, element: <EditPetPage /> },
            { path: ROUTES.STAFF.PET_DETAIL, element: <PetDetailsPage /> },
            { path: ROUTES.STAFF.VERIFY_PETS, element: <VerifyPetsPage /> },
            { path: ROUTES.STAFF.VERIFY_PET_DETAIL, element: <VerifyPetDetail /> },
            { path: ROUTES.STAFF.MANAGE_VOLUNTEERS, element: <ActiveVolunteers /> },
            { path: ROUTES.STAFF.VOLUNTEER_APPLICATIONS, element: <VolunteerApplications /> },
            { path: ROUTES.STAFF.VOLUNTEER_APPLICATION_DETAIL, element: <VolunteerApplicationDetail /> },
            { path: ROUTES.STAFF.ADOPTIONS, element: <ManageAdoptions /> },
            { path: ROUTES.STAFF.ADOPTION_DETAIL, element: <AdoptionApplicationDetail /> },
            { path: ROUTES.STAFF.VERIFY_USER, element: <VerifyUser /> }
        ],
    }
]

export default StaffRoutes