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
    PET_DETAIL: "/pets/:postId",
    ADOPTION_FORM: "/pets/:postId/adoption-form",
    REGISTRATION_SUCCESS: "/registration-success",
    CONFIRM_EMAIL: "/auth/confirm-email",
    FIND_NEW_HOME: "/find-new-home",
    FIND_NEW_HOME_DETAIL: "/find-new-home/:id",
    PROFILE: "/profile",
    ADD_PET: "/profile/add-pet", // New route for adding a pet
    UPDATE_PET: "/profile/pets/:id", // New route for updating pet info
    VERIFY_ADOPTER: "/verify-adopter", // New route for adopter verification
  },
  GUEST: {
    MY_APPLICATION: '/my-applications'
  },
  STAFF: {
    HOME: '/staff',
    MANAGE_PETS: '/staff/manage-pets',
    ADD_PET: '/staff/manage-pets/new',
    EDIT_PET: '/staff/manage-pets/:slug/edit',
    PET_DETAIL: '/staff/manage-pets/:slug',
    VERIFY_PETS: '/staff/verify-pets',
    VERIFY_PET_DETAIL: '/staff/verify-pets/:slug',
    VERIFY_USER: '/staff/verify-users',
    VERIFY_USER_DETAIL: '/staff/verify-users/:id',
    MANAGE_VOLUNTEERS: '/staff/volunteers',
    VOLUNTEER_APPLICATIONS: '/staff/volunteers/applications',
    VOLUNTEER_APPLICATION_DETAIL: '/staff/volunteers/applications/:id',
    ADOPTIONS: '/staff/adoptions',
    ADOPTION_DETAIL: '/staff/adoptions/:id',
  },
  ADMIN: {},
};

export default ROUTES;
