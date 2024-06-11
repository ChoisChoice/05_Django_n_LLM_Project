import axios from "axios";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true, // api 요청할 때, cookie를 보냄
});

// // jwt 토큰
// instance.interceptors.request.use(
//   (config) => {
//     console.log(config);
//     const token = localStorage.getItem(ACCESS_TOKEN);
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(token);
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

export default instance;
