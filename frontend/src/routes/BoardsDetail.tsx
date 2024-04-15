import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getBoards } from "../api";

export default function BoardsDetailRoute() {
  const { boardPk } = useParams();
  const { isLoading, data } = useQuery({
    queryKey: [`board:${boardPk}`],
    queryFn: getBoards,
  });
  console.log(data);
  return <h1>hello</h1>;
}
