import { useState } from "react";
import { Table, Tr, Td, Text, Thead, Th, Tbody, Box } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IBoards } from "../types";

interface BoardsProps {
  boards: IBoards[];
}

export default function Boards({ boards }: BoardsProps) {
  return (
    <Box textAlign="center" marginTop={20}>
      <Text fontSize="3xl" fontWeight="bold">
        Total Board
      </Text>
      <Table width="70%" margin="auto" marginTop={20} marginBottom={20}>
        <Thead backgroundColor="gray.100">
          <Tr>
            <Th fontSize="md">No</Th>
            <Th fontSize="md">Status</Th>
            <Th fontSize="md">Title [Comment]</Th>
            <Th fontSize="md">Category</Th>
            <Th fontSize="md">Writer</Th>
            <Th fontSize="md">Hit</Th>
            <Th fontSize="md">Creation Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {boards.map((board) => (
            <Tr>
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
