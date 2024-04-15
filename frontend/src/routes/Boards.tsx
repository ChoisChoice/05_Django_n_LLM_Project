import { useQuery } from "@tanstack/react-query";
import { getBoards } from "../api";
import { Grid } from "@chakra-ui/react";
import BoardsSkeleton from "../components/BoardsSkeleton";
import Boards from "../components/Boards";

interface BoardField {
  pk: number;
  posting_category: string;
  writer: string;
  title: string;
  disclosure_status: boolean;
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
    <Grid
      mt={10}
      px={{
        base: 10,
        lg: 40,
      }}
      columnGap={4}
      rowGap={8}
      templateColumns={{
        sm: "1fr",
        md: "1fr 1fr",
        lg: "repeat(3, 1fr)",
        xl: "repeat(4, 1fr)",
        "2xl": "repeat(5, 1fr)",
      }}
    >
      {isLoading ? (
        <>
          <BoardsSkeleton />
        </>
      ) : null}
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
    </Grid>
  );
}
