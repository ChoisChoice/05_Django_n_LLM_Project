import instance from "./axios";
import Cookie from "js-cookie";
import { ISignInVariables, ISignUpVariables } from "../types";

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
