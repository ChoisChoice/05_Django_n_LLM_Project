import { QueryFunctionContext } from "@tanstack/react-query";
import axios from "axios";
import Cookie from "js-cookie";

const instance = axios.create({
  baseURL: "http://127.0.0.1:8000/api/v1/",
  withCredentials: true, // api 요청할 때, cookie를 보냄
});

// 게시판
export const getBoards = () =>
  instance.get("boards/").then((response) => response.data);

// 게시판 상세
export const getBoardsDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance.get(`boards/${boardPk}/`).then((response) => response.data);
};

// 내 정보
export const getMyProfile = () =>
  instance.get(`users/my-profile/`).then((response) => response.data);

// export const getMyProfile = () => {
//   const accessToken = Cookie.get("access_token");
//   console.log(accessToken);
//   instance
//     .get(`users/my-profile/`, {
//       headers: {
//         Authorization: `Bearer ${accessToken}`,
//       },
//     })
//     .then((response) => response.data);
// };

// 로그인 mutation object
export interface ISignInVariables {
  username: string;
  password: string;
}

// 로그인 성공에 대한 response
export interface ISignInSuccess {
  successed: string;
}

// 로그인 실패에 대한 response
export interface ISignInFail {
  failed: string;
}

// 로그인 mutation 함수: 하나의 argument를 가지지 않고 object(username, password)를 가진다.
export const SignIn = ({ username, password }: ISignInVariables) =>
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
// => console log에 response.data를 출력하면 {token:{access:..., refresh:...}}가 출력됨

// export const SignIn = ({ username, password }: ISignInVariables) => {
//   const accessToken = Cookie.get("access_token");
//   instance
//     .post(
//       `/users/sign-in/`,
//       { username, password },
//       {
//         headers: {
//           "X-CSRFToken": Cookie.get("csrftoken") || "",
//           Authorization: `Bearer ${accessToken}`,
//         },
//       }
//     )
//     .then((response) => response.data);
// };

// 회원가입 mutation object
export interface ISignUpVariables {
  name: string;
  email: string;
  username: string;
  password: string;
}

// 회원가입 mutation 함수
export const SignUp = ({ ...username }: ISignUpVariables) =>
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
    .post(`users/sign-out/`, null, {
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
