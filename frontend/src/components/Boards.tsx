import { Table, Tr, Td, Text, Thead, Th, Tbody, Box } from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IBoards } from "../types";

interface BoardsProps {
  boards: IBoards[];
}

export default function Boards({ boards }: BoardsProps) {
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
          {boards.map((board) => (
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
    </Box>
  );
}
