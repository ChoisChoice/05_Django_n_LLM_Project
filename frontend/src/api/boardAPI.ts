import { QueryFunctionContext } from "@tanstack/react-query";
import instance from "./axios";
import Cookie from "js-cookie";
import { ICreateBoards } from "../types";

// 게시판 가져오기
export const getBoards = () =>
  instance.get(`/boards/`).then((response) => response.data);

// 게시판 생성하기
export const postBoards = async (boardData: ICreateBoards) => {
  const { attachment, ...data } = boardData;
  return instance
    .post(`/boards/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 상세 게시판
export const getBoardsDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance.get(`/boards/${boardPk}/`).then((response) => response.data);
};

// 상세 게시판 - 수정
export const putBoardsDetail = async (
  { queryKey }: QueryFunctionContext,
  boardData: ICreateBoards
) => {
  const [_, boardPk] = queryKey;
  const { attachment, ...data } = boardData;
  return instance
    .put(`/boards/${boardPk}/`, data, {
      headers: {
        "X-CSRFToken": Cookie.get("csrftoken") || "",
      },
    })
    .then((response) => response.data);
};

// 상세 게시판 - 삭제
export const deleteBoardsDetail = async ({
  queryKey,
}: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance
    .delete(`/boards/${boardPk}/`)
    .then((response) => response.data);
};
