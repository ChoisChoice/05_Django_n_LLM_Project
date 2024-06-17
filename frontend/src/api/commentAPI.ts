import { QueryFunctionContext } from "@tanstack/react-query";
import instance from "./axios";
import Cookie from "js-cookie";
import { IComments } from "../types";

// 댓글 가져오기
export const getComments = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance
    .get(`/boards/${boardPk}/comments/`)
    .then((response) => response.data);
};

// 댓글 생성하기
export const postComment = async (
  { queryKey }: QueryFunctionContext,
  commentData: IComments
) => {
  const [_, boardPk] = queryKey;
  const { posting, ...data } = commentData;
  return instance
    .post(`/boards/${boardPk}/comments/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};
