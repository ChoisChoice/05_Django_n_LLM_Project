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

// 상세 댓글 가져오기
export const getCommentsDetail = async ({
  boardPk,
  commentId,
}: {
  boardPk: string | undefined;
  commentId: string | undefined;
}) => {
  return instance
    .get(`/boards/${boardPk}/comments/${commentId}/`)
    .then((response) => response.data);
};

// 댓글 수정하기
export const putComments = async ({
  boardPk,
  commentId,
  commentData,
}: {
  boardPk: string;
  commentId: string;
  commentData: IComments;
}) => {
  const { posting, ...data } = commentData;
  return instance
    .put(`/boards/${boardPk}/comments/${commentId}/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 댓글 삭제
export const deleteComments = async ({
  boardPk,
  commentId,
}: {
  boardPk: string;
  commentId: string;
}) => {
  return instance
    .delete(`/boards/${boardPk}/comments/${commentId}/`, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 좋아요 추가
export const postThumbUp = async ({
  boardPk,
  commentId,
}: {
  boardPk: string;
  commentId: string;
}) => {
  return instance
    .post(`/boards/${boardPk}/comments/${commentId}/thumb-up/`, null, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 좋아요 삭제
export const deleteThumbUp = async ({
  boardPk,
  commentId,
}: {
  boardPk: string;
  commentId: string;
}) => {
  return instance
    .delete(`/boards/${boardPk}/comments/${commentId}/thumb-up/`, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};
