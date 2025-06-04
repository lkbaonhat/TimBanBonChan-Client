export const API_ENDPOINT = {
  AUTH: {
    SIGN_IN: "/auth/login",
    SIGN_UP: "/auth/send-confirmation",
    CONFIRM_EMAIL: "/auth/confirm-email",
  },
  PET: {
    LIST: "/pets/filter",
    DETAIL: "/pets/:slug", 
    ADOPTION_FORM: "/pets/:id/adoption-form",
    ADOPTION_APPLICATIONS: "/adoptionApplication",
  },
  VOLUNTEER: {
    LIST: "/volunteer",
    APPLICATIONS: "/volunteerApplication",
    UPDATE_APPLICATIONS: `/volunteerApplication/update`,
  },
  COMMUNITY: {
    LIST: "/community",
  },
};
