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

export const getProfile = () =>
  instance.get(`users/profile/`).then((response) => response.data);

export const signOut = () =>
  instance
    .post(`users/sign-out`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
