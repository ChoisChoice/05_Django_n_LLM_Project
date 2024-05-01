import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true, // api 요청할 때, cookie를 보냄
});

export const getBoards = () =>
  instance.get("boards/").then((response) => response.data);

export const getBoardsDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance.get(`boards/${boardPk}/`).then((response) => response.data);
};

export const getMyProfile = () =>
  instance.get(`users/my-profile/`).then((response) => response.data);

export const signOut = () =>
  instance
    .post(`users/sign-out/`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

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

export const socialSignOut = () =>
  instance
    .post(`users/social-sign-out/`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);

// mutation object
export interface IUsernameSignInVariables {
  username: string;
  password: string;
}

// 로그인 mutation 함수: 하나의 argument를 가지지 않고 object(username, password)를 가진다.
export const usernameSignIn = ({
  username,
  password,
}: IUsernameSignInVariables) =>
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
