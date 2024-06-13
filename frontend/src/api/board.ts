import { QueryFunctionContext } from "@tanstack/react-query";
import instance from "./axios";
import { IBoardsDetail } from "../types";

// 게시판
export const getBoards = () =>
  instance.get("/boards/").then((response) => response.data);

// 게시판 생성
export const postBoards = (
  newBoard: Partial<IBoardsDetail>
): Promise<IBoardsDetail> => {
  return instance.post("/boards/", newBoard).then((response) => response.data);
};

// 상세 게시판
export const getBoardsDetail = ({ queryKey }: QueryFunctionContext) => {
  const [_, boardPk] = queryKey;
  return instance.get(`/boards/${boardPk}/`).then((response) => response.data);
};
