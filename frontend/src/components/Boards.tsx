import { useState } from "react";
import {
  Table,
  Tr,
  Td,
  Text,
  Thead,
  Th,
  Tbody,
  Box,
  Button,
} from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight, FaLock, FaLockOpen } from "react-icons/fa";
import { Link } from "react-router-dom";
import { IBoards } from "../types";

interface BoardsProps {
  boards: IBoards[];
}

const ITEMS_PER_PAGE = 7;

export default function Boards({ boards }: BoardsProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // 현재 페이지의 게시글 범위 계산
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentBoards = boards.slice(startIndex, endIndex);

  // 전체 페이지 수 계산
  const pageCount = Math.ceil(boards.length / ITEMS_PER_PAGE);

  // 번호 클릭
  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  // 이전 버튼 클릭
  const handlePreviousClick = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // 다음 버튼 클릭
  const handleNextClick = () => {
    if (currentPage < pageCount - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Box textAlign="center" mt={20} mb={20}>
      <Text fontSize={42} fontWeight="bold" mb={20}>
        Total Board
      </Text>
      <Table width="70%" margin="auto" mt={10} mb={10}>
        <Thead backgroundColor="gray.100">
          <Tr>
            <Th fontSize="md">No</Th>
            <Th fontSize="md">Status</Th>
            <Th fontSize="md">Category</Th>
            <Th fontSize="md">Title [Comment]</Th>
            <Th fontSize="md">Writer</Th>
            <Th fontSize="md">Hit</Th>
            <Th fontSize="md">Creation Date</Th>
          </Tr>
        </Thead>
        <Tbody>
          {currentBoards.map((board) => (
            <Tr>
              {/* pk */}
              <Td>
                <Link to={`/boards/${board.pk}`}>{board.pk}</Link>
              </Td>

              {/* disclosure_status */}
              <Td>
                <Link to={`/boards/${board.pk}`}>
                  {board.disclosure_status ? (
                    <FaLock color="red" />
                  ) : (
                    <FaLockOpen color="green" />
                  )}
                </Link>
              </Td>

              {/* posting_category */}
              <Td>
                <Link to={`/boards/${board.pk}`}>{board.posting_category}</Link>
              </Td>

              {/* comment_count */}
              <Td>
                <Link to={`/boards/${board.pk}`}>
                  {board.title} [{board.comment_count}]
                </Link>
              </Td>

              {/* writer */}
              <Td>
                <Link to={`/boards/${board.pk}`}>{board.writer.username}</Link>
              </Td>

              {/* hits */}
              <Td>
                <Link to={`/boards/${board.pk}`}>{board.hits}</Link>
              </Td>

              {/* created_at */}
              <Td>
                <Link to={`/boards/${board.pk}`}>
                  {new Date(board.created_at).toLocaleDateString()}
                </Link>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      {/* 페이지네이션 */}
      <Box mb={10}>
        {/* 왼쪽 버튼 */}
        <Button
          onClick={handlePreviousClick}
          disabled={currentPage === 0} // 현재 페이지가 0이면, 왼쪽 화살표 버튼 비활성화
          style={{ marginRight: "10px" }}
        >
          <FaArrowLeft />
        </Button>
        {/* 페이지(숫자) 버튼 */}
        {[...Array(pageCount)].map((_, index) => (
          <Button
            key={index}
            onClick={() => handlePageClick(index)}
            style={{
              margin: "0 5px",
              fontWeight: currentPage === index ? "bold" : "normal",
            }}
          >
            {index + 1}
          </Button>
        ))}
        {/* 오른쪽 버튼 */}
        <Button
          onClick={handleNextClick}
          disabled={currentPage === pageCount - 1}
          style={{ marginLeft: "10px" }}
        >
          <FaArrowRight />
        </Button>
      </Box>
      <Box
        mb={10}
        display="flex"
        justifyContent="flex-end"
        width="70%"
        margin="auto"
      >
        <Link to={`/boards/create`}>
          <Button
            style={{
              backgroundColor: "#7ed957",
              color: "black",
            }}
          >
            Create
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
