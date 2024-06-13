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
  console.log(currentBoards);

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
    <Box textAlign="center" marginTop={20}>
      <Text fontSize={42} fontWeight="bold" marginBottom={10}>
        Total Board
      </Text>
      <Box
        marginTop={10}
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
      <Table width="70%" margin="auto" marginTop={10} marginBottom={10}>
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
              <Td>{board.pk}</Td>
              <Td>
                {board.disclosure_status ? (
                  <FaLock color="red" />
                ) : (
                  <FaLockOpen color="green" />
                )}
              </Td>
              <Td>{board.posting_category}</Td>
              <Td>
                <Link to={`/boards/${board.pk}`}>
                  {board.title} [{board.comment_count}]
                </Link>
              </Td>
              <Td>{board.writer}</Td>
              <Td>{board.hits}</Td>
              <Td>{new Date(board.created_at).toLocaleDateString()}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
      <Box marginBottom={20}>
        <Button
          onClick={handlePreviousClick}
          disabled={currentPage === 0} // 현재 페이지가 0이면, 왼쪽 화살표 버튼 비활성화
          style={{ marginRight: "10px" }}
        >
          <FaArrowLeft />
        </Button>
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
        <Button
          onClick={handleNextClick}
          disabled={currentPage === pageCount - 1}
          style={{ marginLeft: "10px" }}
        >
          <FaArrowRight />
        </Button>
      </Box>
    </Box>
  );
}

// interface BoardsProps {
//   boards: IBoards[];
// }

// export default function Boards({ boards }: BoardsProps) {
//   return (
//     <Box textAlign="center" marginTop={20}>
//       <Text fontSize="3xl" fontWeight="bold">
//         Total Board
//       </Text>
//       <Table width="70%" margin="auto" marginTop={20} marginBottom={20}>
//         <Thead backgroundColor="gray.100">
//           <Tr>
//             <Th fontSize="md">No</Th>
//             <Th fontSize="md">Status</Th>
//             <Th fontSize="md">Title [Comment]</Th>
//             <Th fontSize="md">Category</Th>
//             <Th fontSize="md">Writer</Th>
//             <Th fontSize="md">Hit</Th>
//             <Th fontSize="md">Creation Date</Th>
//           </Tr>
//         </Thead>
//         <Tbody>
//           {boards.map((board) => (
//             <Tr>
//               <Td>{board.pk}</Td>
//               <Td>
//                 {board.disclosure_status ? (
//                   <FaLock color="red" />
//                 ) : (
//                   <FaLockOpen color="green" />
//                 )}
//               </Td>
//               <Td>
//                 <Link to={`/boards/${board.pk}`}>
//                   {board.title} [{board.comment_count}]
//                 </Link>
//               </Td>
//               <Td>{board.posting_category}</Td>
//               <Td>{board.writer}</Td>
//               <Td>{board.hits}</Td>
//               <Td>{new Date(board.created_at).toLocaleDateString()}</Td>
//             </Tr>
//           ))}
//         </Tbody>
//       </Table>
//     </Box>
//   );
// }
