import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";
import {
  // IChatEnv,
  ISignInVariables,
  ISignUpVariables,
  ISummarizedNewsLLM,
  ITranslatedNewsLLM,
  IURL,
} from "./types";

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

// 게시판
export const getBoards = () =>
  instance.get("/boards/").then((response) => response.data);

// 상세 게시판
export const getBoardsDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance.get(`/boards/${boardPk}/`).then((response) => response.data);
};

// 내 정보
export const getMyProfile = () =>
  instance.get(`/users/my-profile/`).then((response) => response.data);

// 로그인
export const signIn = ({ username, password }: ISignInVariables) =>
  instance
    .post(
      `/users/sign-in/`,
      { username, password },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// 회원가입
export const signUp = ({ ...username }: ISignUpVariables) =>
  instance
    .post(
      `/users/sign-up/`,
      { ...username },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// 로그아웃
export const signOut = () =>
  instance
    .post(`/users/sign-out/`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

// [소셜] 깃허브 로그인
export const githubSignIn = (code: string) =>
  instance
    .post(
      `/users/github/`,
      { code },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.status);

// [소셜] 카카오 로그인
export const kakaoSignIn = (code: string) =>
  instance
    .post(
      `/users/kakao/`,
      { code },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.status);

// // chatEnv(채팅환경)
// export const chatEnv = ({ test }: IChatEnv) =>
//   instance.post(``, { test }).then((response) => response.data);

// Original News
export const originalNews = ({ url }: IURL) =>
  instance
    .post(
      `/models/original-news/`,
      { url },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// Summarized News LLM
export const summarizedNewsLLM = ({ url }: ISummarizedNewsLLM) =>
  instance
    .post(
      `/models/summarized-news/`,
      { url },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// Translated News LLM
export const translateddNewsLLM = ({ summarized_news }: ITranslatedNewsLLM) =>
  instance
    .post(
      `/models/translated-news/`,
      { summarized_news },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);
