import instance from "./axios";
import Cookie from "js-cookie";

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
