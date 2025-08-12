// import axios from "axios";
// import Cookies from "js-cookie";

// // Create an Axios instance
// const api = axios.create({
//   baseURL: "http://localhost:5000", // Your backend URL
// });

// // Add a request interceptor to attach the Bearer token
// api.interceptors.request.use(
//   (config) => {
//     // Extract token from cookie (based on your console log: cookie: 'token=<JWT>')
//     const token = Cookies.get("token");
//     console.log("api.ts -->", token);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//       console.log("Added Authorization header:", `Bearer ${token}`);
//     } else {
//       console.warn("No token found in cookies");
//     }
//     return config;
//   },
//   (error) => {
//     console.error("Interceptor error:", error);
//     return Promise.reject(error);
//   }
// );

// export default api;
