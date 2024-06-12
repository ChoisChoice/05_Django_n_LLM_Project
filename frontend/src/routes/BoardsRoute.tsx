import { useQuery } from "@tanstack/react-query";
import Boards from "../components/Boards";
import { IBoards } from "../types";
import { getBoards } from "../api/posting";
import CustomSpinner from "../components/CustomSpinner";

export default function BoardsRoute() {
  const { isLoading, data } = useQuery<IBoards[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });

  return <>{isLoading ? <CustomSpinner /> : <Boards boards={data || []} />}</>;
}
