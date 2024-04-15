import {
  Table,
  Thead,
  Tr,
  Th,
  TableContainer,
  useColorModeValue,
} from "@chakra-ui/react";
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
  posting_category,
  writer,
  title,
  comment_count,
  hit,
  created_at,
}: BoardFieldProps) {
  return (
    <Link to={`/boards/${pk}`}>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th isNumeric>primary key</Th>
              <Th>posting_category</Th>
              <Th>writer</Th>
              <Th>title</Th>
              <Th isNumeric>comment_count</Th>
              <Th isNumeric>hit</Th>
              <Th>created_at</Th>
            </Tr>
            <Tr key={pk}>
              <Th isNumeric>{pk}</Th>
              <Th>{posting_category}</Th>
              <Th>{writer}</Th>
              <Th>{title}</Th>
              <Th isNumeric>{comment_count}</Th>
              <Th isNumeric>{hit}</Th>
              <Th>{created_at}</Th>
            </Tr>
          </Thead>
        </Table>
      </TableContainer>
    </Link>
  );
}
