import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBoards } from "../api";
import { BoardsDetailField } from "../types";

export default function BoardsDetailRoute() {
  const { boardPk } = useParams();
  const { isLoading, data } = useQuery<BoardsDetailField>({
    queryKey: [`board`, boardPk],
    queryFn: getBoards,
  });
  console.log(data);
  return <h1>hello</h1>;
}
