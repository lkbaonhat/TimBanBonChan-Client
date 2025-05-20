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
    PET_DETAIL: "/pets/:id",
    ADOPTION_FORM: "/pets/:id/adoption-form",
    REGISTRATION_SUCCESS: "/registration-success",
    CONFIRM_EMAIL: "/confirm-email",
    FIND_NEW_HOME: "/find-new-home",
    FIND_NEW_HOME_DETAIL: "/find-new-home/:id",
  },
  ADMIN: {},
};

export default ROUTES;
