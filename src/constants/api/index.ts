export const API_ENDPOINT = {
  AUTH: {
    SIGN_IN: "/auth/login",
    SIGN_UP: "/auth/send-confirmation",
    CONFIRM_EMAIL: "/auth/confirm-email",
  },
  USER: {
    SELF_INFO: "/users"
  },
  PET: {
    LIST: "/pets/filter",
    DETAIL: "/pets/:slug",
    ADOPTION_FORM: "/pets/:id/adoption-form",
    ADOPTION_APPLICATIONS: "/adoptionApplication",
    ADOPTION_POST: "/adoptionPost"
  },
  VOLUNTEER: {
    LIST: "/volunteer",
    APPLICATIONS: "/volunteerApplication",
    UPDATE_APPLICATIONS: `/volunteerApplication/update`,
  },
  ADOPTER: {
    APPLICATIONS: "/AdopterApplications",
  },
  COMMUNITY: {
    LIST: "/community",
  },
};
