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
export const postComments = async ({
  boardPk,
  commentData,
}: {
  boardPk: string;
  commentData: IComments;
}) => {
  const { posting, ...data } = commentData;
  return instance
    .post(`/boards/${boardPk}/comments/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 댓글 수정하기
export const putComments = async ({
  boardPk,
  commentPk,
  commentData,
}: {
  boardPk: string;
  commentPk: string;
  commentData: IComments;
}) => {
  const { posting, ...data } = commentData;
  return instance
    .put(`/boards/${boardPk}/comments/${commentPk}`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 댓글 삭제
export const deleteComments = async ({
  boardPk,
  commentPk,
}: {
  boardPk: string;
  commentPk: string;
}) => {
  return instance
    .delete(`/boards/${boardPk}/comments/${commentPk}`, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};
