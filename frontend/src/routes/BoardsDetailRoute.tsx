import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { IBoardsDetail } from "../types";
import { getBoardsDetail } from "../api/board";

export default function BoardsDetailRoute() {
  const { boardPk } = useParams();
  const { isLoading, data } = useQuery<IBoardsDetail>({
    queryKey: [`board`, boardPk],
    queryFn: getBoardsDetail,
  });
  console.log(data);
  return <h1>Boards Detail Page</h1>;
}
