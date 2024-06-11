import { useQuery } from "@tanstack/react-query";
import Boards from "../components/Boards";
import TotalSpinner from "../components/TotalSpinner";
import { IBoards } from "../types";
import { getBoards } from "../api/posting";

export default function BoardsRoute() {
  const { isLoading, data } = useQuery<IBoards[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  return <>{isLoading ? <TotalSpinner /> : <Boards boards={data || []} />}</>;
}
