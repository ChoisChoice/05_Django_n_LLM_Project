import { Button, Box } from "@chakra-ui/react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { IPagination } from "../types";

export default function Pagination({
  currentPage,
  pageCount,
  handlePageClick,
  handlePreviousClick,
  handleNextClick,
}: IPagination) {
  return (
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
  );
}
