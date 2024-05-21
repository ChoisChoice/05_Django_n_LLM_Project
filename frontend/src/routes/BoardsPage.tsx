import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api";
import Boards from "../components/Boards";
import TotalSpinner from "../components/TotalSpinner";
import { IBoards } from "../types";

export default function BoardsPage() {
  const { isLoading, data } = useQuery<IBoards[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  return <>{isLoading ? <TotalSpinner /> : <Boards boards={data || []} />}</>;
}
