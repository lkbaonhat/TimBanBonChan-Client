const LOGO = {
  NO_TEXT:
    "https://res.cloudinary.com/drcj6f81i/image/upload/v1744127084/lctvpmmznvhplxx9ogkp.png",
  FB_LOGO:
    "https://res.cloudinary.com/drcj6f81i/image/upload/v1744169172/ewi58dubi0wwtystrwtw.png",
  GG_LOGO:
    "https://res.cloudinary.com/drcj6f81i/image/upload/v1744169172/mlrdfuv0vnsv07ufsgez.png",
  APP_LOGO:
    "https://res.cloudinary.com/drcj6f81i/image/upload/v1744169172/b2tho6xiuapfpjsj16bi.png",
};

const STRING_EMPTY = "";

const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_SERVER_ERROR: 500,
};

const ROLE = {
  ADMIN: "admin",
};

const WEB_SOCKET_STATE = {
  CONNECTING: 0,
  OPEN: 1,
  CLOSING: 2,
  CLOSED: 3,
  NOTCONNECTED: 4,
};

export { STRING_EMPTY, HTTP_STATUS, ROLE, WEB_SOCKET_STATE, LOGO };
