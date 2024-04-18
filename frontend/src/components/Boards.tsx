import { Table, Tr, Td, Text, Thead, Th, Tbody, Box } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { FcNext, FcPrevious } from "react-icons/fc";
import { Link } from "react-router-dom";
import { IBoards } from "../types";
import {
  Container,
  Next,
  PageGroup,
  Paginator,
  Previous,
  usePaginator,
} from "chakra-paginator";
import { useState } from "react";

interface BoardsProps {
  boards: IBoards[];
}

export default function Boards({ boards }: BoardsProps) {
  const itemsPerPage = 10; // 페이지당 표시할 항목 수
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const boardsToShow = boards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box textAlign="center" marginTop="3rem">
      <Text fontSize="3xl" fontWeight="bold">
        Total Board
      </Text>
      <Table width="70%" margin="auto" marginTop="2rem">
        <Thead>
          <Tr>
            <Th>No</Th>
            <Th>Status</Th>
            <Th>Title [Comment]</Th>
            <Th>Category</Th>
            <Th>Writer</Th>
            <Th>Hit</Th>
            <Th>Creation Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {/* boards -> boardsToShow */}
          {boardsToShow.map((board) => (
            <Tr key={board.pk}>
              <Td>{board.pk}</Td>
              <Td>
                {board.disclosure_status ? (
                  <FaLock color="red" />
                ) : (
                  <FaLockOpen color="green" />
                )}
              </Td>
              <Td>
                <Link to={`/boards/${board.pk}`}>
                  {board.title} [{board.comment_count}]
                </Link>
              </Td>
              <Td>{board.posting_category}</Td>
              <Td>{board.writer}</Td>
              <Td>{board.hits}</Td>
              <Td>{new Date(board.created_at).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* <Paginator
        activePage={currentPage}
        totalPages={Math.ceil(boards.length / itemsPerPage)}
        onPageChange={handlePageChange}
      >
        <Container align="center" justify="space-between" w="full" p={4}>
          <Previous as={FcPrevious} />
          <PageGroup isInline align="center" />
          <Next as={FcNext} />
        </Container>
      </Paginator> */}
    </Box>
  );
}
