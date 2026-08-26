import axios from "axios";

const BASE_URL = "https://idsr-backend.onrender.com/api/";  //"http://127.0.0.1:8000/api/"; //https://idsr-backend.onrender.com/api/";
   
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,     
});   

// =====================================================
// AUTH INTERCEPTORS
// =====================================================

api.interceptors.request.use(
  (config) => {
    if (!config.skipAuth) {
      const token = localStorage.getItem("access");

      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.skipAuth
    ) {
      originalRequest._retry = true;

      try {
        const refresh = localStorage.getItem("refresh");

        if (!refresh) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${BASE_URL}auth/token/refresh/`,
          { refresh }
        );

        const newAccessToken = response.data.access;

        localStorage.setItem("access", newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        logoutUser();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =====================================================
// AUTH
// =====================================================

export const registerUser = (data) =>
  api.post("/auth/register/", data, {
    skipAuth: true,
  });

export const loginUser = (data) =>
  api.post("/auth/login/", data, {
    skipAuth: true,
  });

export const refreshToken = (refresh) =>
  axios.post(`${BASE_URL}auth/token/refresh/`, {
    refresh,
  });

export const logoutUser = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
  localStorage.removeItem("user");

  window.location.href = "/login";
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

// =====================================================
// CASES
// =====================================================     

export const getCases = (params = {}) =>
  api.get("/cases/", { params });

export const getCase = (id) =>
  api.get(`/cases/${id}/`);

export const createCase = (data) =>
  api.post("/cases/", data);

export const updateCase = (id, data) =>
  api.put(`/cases/${id}/`, data);

export const patchCase = (id, data) =>
  api.patch(`/cases/${id}/`, data);

export const deleteCase = (id) =>
  api.delete(`/cases/${id}/`);

// =====================================================
// PATIENTS / DEMOGRAPHICS
// =====================================================

export const getPatients = (params = {}) =>
  api.get("/patients/", { params });

export const getPatient = (id) =>
  api.get(`/patients/${id}/`);

export const createPatient = (data) =>
  api.post("/patients/", data);

export const updatePatient = (id, data) =>
  api.put(`/patients/${id}/`, data);

export const patchPatient = (id, data) =>
  api.patch(`/patients/${id}/`, data);

export const deletePatient = (id) =>
  api.delete(`/patients/${id}/`);

// =====================================================
// CLINICAL
// =====================================================

export const getClinical = (params = {}) =>
  api.get("/clinical/", { params });

export const getClinicalCase = (id) =>
  api.get(`/clinical/${id}/`);

export const createClinical = (data) =>
  api.post("/clinical/", data);

export const updateClinical = (id, data) =>
  api.put(`/clinical/${id}/`, data);

export const patchClinical = (id, data) =>
  api.patch(`/clinical/${id}/`, data);

export const deleteClinical = (id) =>
  api.delete(`/clinical/${id}/`);

// =====================================================
// LAB
// =====================================================

export const getLab = (params = {}) =>
  api.get("/lab/", { params });

export const getLabCase = (id) =>
  api.get(`/lab/${id}/`);

export const createLab = (data) =>
  api.post("/lab/", data);

export const updateLab = (id, data) =>
  api.put(`/lab/${id}/`, data);

export const patchLab = (id, data) =>
  api.patch(`/lab/${id}/`, data);

export const deleteLab = (id) =>
  api.delete(`/lab/${id}/`);

// =====================================================
// FACILITY
// =====================================================

export const getFacilities = (params = {}) =>
  api.get("/facility/", { params });

export const getFacility = (id) =>
  api.get(`/facility/${id}/`);

export const createFacility = (data) =>
  api.post("/facility/", data);

export const updateFacility = (id, data) =>
  api.put(`/facility/${id}/`, data);

export const patchFacility = (id, data) =>
  api.patch(`/facility/${id}/`, data);

export const deleteFacility = (id) =>
  api.delete(`/facility/${id}/`);

// =====================================================
// TREATMENT
// =====================================================

export const getTreatment = (params = {}) =>
  api.get("/treatment/", { params });

export const getTreatmentCase = (id) =>
  api.get(`/treatment/${id}/`);

export const createTreatment = (data) =>
  api.post("/treatment/", data);

export const updateTreatment = (id, data) =>
  api.put(`/treatment/${id}/`, data);

export const patchTreatment = (id, data) =>
  api.patch(`/treatment/${id}/`, data);

export const deleteTreatment = (id) =>
  api.delete(`/treatment/${id}/`);

// =====================================================
// SURVEILLANCE
// =====================================================

export const getSurveillance = (params = {}) =>
  api.get("/surveillance/", { params });

export const getSurveillanceCase = (id) =>
  api.get(`/surveillance/${id}/`);

export const createSurveillance = (data) =>
  api.post("/surveillance/", data);

export const updateSurveillance = (id, data) =>
  api.put(`/surveillance/${id}/`, data);

export const patchSurveillance = (id, data) =>
  api.patch(`/surveillance/${id}/`, data);

export const deleteSurveillance = (id) =>
  api.delete(`/surveillance/${id}/`);

// =====================================================
// EPIDEMIOLOGY
// =====================================================

export const getEpidemiology = (params = {}) =>
  api.get("/epidemiological/", { params });

export const getEpidemiologyCase = (id) =>
  api.get(`/epidemiological/${id}/`);

export const createEpidemiology = (data) =>
  api.post("/epidemiological/", data);

export const updateEpidemiology = (id, data) =>
  api.put(`/epidemiological/${id}/`, data);

export const patchEpidemiology = (id, data) =>
  api.patch(`/epidemiological/${id}/`, data);

export const deleteEpidemiology = (id) =>
  api.delete(`/epidemiological/${id}/`);

// =====================================================
// FORM OPTIONS
// =====================================================

export const getFormOptions = () =>
  api.get("/form-options/");

// =====================================================
// API HEALTH / BASE
// =====================================================

export const healthCheck = () =>
  api.get("/");

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default api;    
