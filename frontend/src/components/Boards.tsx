import {
  Table,
  Tr,
  TableContainer,
  Td,
  Text,
  Thead,
  Th,
  Tbody,
  Box,
} from "@chakra-ui/react";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { Link } from "react-router-dom";

interface BoardFieldProps {
  pk: number;
  disclosure_status: boolean;
  posting_category: string;
  writer: string;
  title: string;
  comment_count: string;
  hit: number;
  created_at: string;
}

export default function Boards({
  pk,
  disclosure_status,
  posting_category,
  writer,
  title,
  comment_count,
  hit,
  created_at,
}: BoardFieldProps) {
  const formattedCreatedAt = new Date(created_at).toLocaleString();
  return (
    <Link to={`/boards/${pk}`}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>No</Th>
              <Th>Status</Th>
              <Th>Category</Th>
              <Th>Writer</Th>
              <Th>Title</Th>
              <Th>Hit</Th>
              <Th>Creation Date</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>{pk}</Td>
              <Td>
                <Box>
                  {disclosure_status ? (
                    <Box color="red.500">
                      <FaLock />
                    </Box>
                  ) : (
                    <Box color="green.500">
                      <FaLockOpen />
                    </Box>
                  )}
                </Box>
              </Td>
              <Td>{posting_category}</Td>
              <Td>{writer}</Td>
              <Td>
                {title} [{comment_count}]
              </Td>
              <Td>{hit}</Td>
              <Td>{formattedCreatedAt}</Td>
            </Tr>
          </Tbody>
        </Table>
      </TableContainer>
    </Link>
  );
}
