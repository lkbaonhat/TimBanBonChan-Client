export const API_ENDPOINT = {
  AUTH: {
    SIGN_IN: "/auth/login",
    SIGN_UP: "/auth/send-confirmation",
    CONFIRM_EMAIL: "/auth/confirm-email",
  },
  PET: {
    LIST: "/pets/filter",
    DETAIL: "/pets/:slug", // Updated to use slug for pet details
    ADOPTION_FORM: "/pets/:id/adoption-form",
  },
  VOLUNTEER: {
    LIST: "/volunteer",
  },
  COMMUNITY: {
    LIST: "/community",
  },
};
