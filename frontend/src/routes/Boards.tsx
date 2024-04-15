import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api";
import { Flex, Text } from "@chakra-ui/react";
import Boards from "../components/Boards";
import BoardsSpinner from "../components/BoardsSpinner";

interface BoardField {
  pk: number;
  disclosure_status: boolean;
  posting_category: string;
  writer: string;
  title: string;
  comment_count: string;
  hit: number;
  created_at: string;
}

export default function BoardsRoute() {
  const { isLoading, data } = useQuery<BoardField[]>({
    queryKey: ["boards"],
    queryFn: getBoards,
  });
  return (
    <Flex justify={"center"} align={"center"} minHeight="100vh">
      {isLoading ? <BoardsSpinner /> : null}
      {data?.map((board) => (
        <Boards
          pk={board.pk}
          posting_category={board.posting_category}
          writer={board.writer}
          title={board.title}
          disclosure_status={board.disclosure_status}
          comment_count={board.comment_count}
          hit={board.hit}
          created_at={board.created_at}
        />
      ))}
    </Flex>
  );
}
