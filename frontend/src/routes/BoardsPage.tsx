import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api";
import Boards from "../components/Boards";
import BoardsSpinner from "../components/BoardsSpinner";
import { IBoards } from "../types";

export default function BoardsPage() {
  const { isLoading, data } = useQuery<IBoards[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  return <>{isLoading ? <BoardsSpinner /> : <Boards boards={data || []} />}</>;
}
