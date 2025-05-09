const ROUTES = {
  PUBLIC: {
    HOME: '/',
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
    VOLUNTEER: '/volunteer',
    COMMUNITY: '/community',
    PETCARE: '/pet-care',
    PETCARE_DETAIL: '/pet-care/:id',
    PETCARE_CREATE: '/pet-care/create',
    LIST_PETS: "/pets",
    PET_DETAIL: "/pets/:id",
    ADOPTION_FORM: "/pets/:id/adoption-form",
    REGISTRATION_SUCCESS: "/registration-success",
    CONFIRM_EMAIL: "/confirm-email",
  },
  ADMIN: {},
};

export default ROUTES;
