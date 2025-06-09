import ROUTES from "@/constants/routes"
import SidebarLayout from "@/layouts/SidebarLayout"

const AdminRoutes = [
    {
        path: ROUTES.ADMIN,
        element: <SidebarLayout roleUser="admin" />,
        children: [
            // { path: ROUTES.STAFF.HOME, element: <StaffDashboard /> },
            // { path: ROUTES.STAFF.MANAGE_PETS, element: <PetInfoList /> },
            // { path: ROUTES.STAFF.ADD_PET, element: <AddPetPage /> },
            // { path: ROUTES.STAFF.EDIT_PET, element: <EditPetPage /> },
            // { path: ROUTES.STAFF.PET_DETAIL, element: <PetDetailsPage /> },
            // { path: ROUTES.STAFF.VERIFY_PETS, element: <VerifyPetsPage /> },
            // { path: ROUTES.STAFF.VERIFY_PET_DETAIL, element: <VerifyPetDetail /> },
            // { path: ROUTES.STAFF.MANAGE_VOLUNTEERS, element: <ActiveVolunteers /> },
            // { path: ROUTES.STAFF.VOLUNTEER_APPLICATIONS, element: <VolunteerApplications /> },
            // { path: ROUTES.STAFF.VOLUNTEER_APPLICATION_DETAIL, element: <VolunteerApplicationDetail /> },
            // { path: ROUTES.STAFF.ADOPTIONS, element: <ManageAdoptions /> },
            // { path: ROUTES.STAFF.ADOPTION_DETAIL, element: <AdoptionApplicationDetail /> },
            // { path: ROUTES.STAFF.VERIFY_USER, element: <VerifyUser /> }
        ],
    }
]

export default AdminRoutes