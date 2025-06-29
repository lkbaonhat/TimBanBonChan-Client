import axios, { AxiosError } from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Increase default timeout for requests with large images
  timeout: 30000, // 30 seconds
  maxContentLength: 10 * 1024 * 1024, // 10MB max content length
  maxBodyLength: 10 * 1024 * 1024, // 10MB max body length
});

const axiosPrivate = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const axiosUpload = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "multipart/form-data",
  },

  withCredentials: true,
});
// Interceptors cho axiosPrivate
axiosPrivate.interceptors.request.use(
  (config) => {
    // ********** Example **********
    //! lấy token & userRole từ redux store
    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (userRole) {
      config.headers["X-User-Role"] = userRole;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosPrivate.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý khi bị unauthorized
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

// Interceptors cho axiosPrivate
axiosUpload.interceptors.request.use(
  (config) => {
    // ********** Example **********
    //! lấy token & userRole từ redux store
    const token = localStorage.getItem("accessToken");
    const userRole = localStorage.getItem("userRole");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    if (userRole) {
      config.headers["X-User-Role"] = userRole;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosUpload.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý khi bị unauthorized
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);

// Xử lý lỗi toàn cục
const handleError = (error: AxiosError) => {
  if (error.response) {
    console.error("Server Error:", error.response.data);
  } else if (error.request) {
    console.error("No Response:", error.request);
  } else {
    console.error("Error:", error.message);
  }
  return Promise.reject(error);
};

// Debug request interceptor for pet-related requests
axiosClient.interceptors.request.use(
  (config) => {
    if (config.url?.includes('/pets') && (config.method === 'put' || config.method === 'post')) {
      const hasImageData = typeof config.data === 'object' && 
        (config.data.primaryImageUrl?.startsWith('data:') || config.data.petImageUrls?.startsWith('data:'));
      
      if (hasImageData) {
        config.timeout = 60000; // 60 seconds
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use((response) => response, handleError);
axiosPrivate.interceptors.response.use((response) => response, handleError);
axiosUpload.interceptors.response.use((response) => response, handleError);

export { axiosClient, axiosPrivate, axiosUpload };
