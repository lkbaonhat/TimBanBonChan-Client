const ROUTES = {
  PUBLIC: {
    HOME: '/',
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    VOLUNTEER: '/volunteer',
    VOLUNTEER_FORM: '/volunteer/registration',
    COMMUNITY: '/community',
    PETCARE: '/pet-care',
    PETCARE_DETAIL: '/pet-care/:id',
    CLINICS: '/clinics',
    CLINIC_DETAIL: '/clinics/:id',
    PETCARE_CREATE: '/pet-care/create',
    LIST_PETS: "/pets",
    PET_DETAIL: "/pets/:slug", // Change from :id to :slug to match navigation
    ADOPTION_FORM: "/pets/:slug/adoption-form", // Change from :id to :slug to match the URL structure
    REGISTRATION_SUCCESS: "/registration-success",
    CONFIRM_EMAIL: "/confirm-email",
    FIND_NEW_HOME: "/find-new-home",
    FIND_NEW_HOME_DETAIL: "/find-new-home/:id",
    PROFILE: "/profile",
    ADD_PET: "/profile/add-pet", // New route for adding a pet
    UPDATE_PET: "/profile/pets/:id", // New route for updating pet info
  },
  STAFF: {
    HOME: '/staff',
    MANAGE_PETS: '/staff/manage-pets',
    ADD_PET: '/staff/manage-pets/new',
    EDIT_PET: '/staff/manage-pets/:id/edit',
    PET_DETAIL: '/staff/manage-pets/:slug',
  },
  ADMIN: {},
};

export default ROUTES;
