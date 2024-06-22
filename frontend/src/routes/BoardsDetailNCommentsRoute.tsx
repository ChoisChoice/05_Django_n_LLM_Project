import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getBoardsDetail } from "../api/boardAPI";
import BoardsUpdateModal from "../components/boards/BoardsUpdateModal";
import BoardsDeleteModal from "../components/boards/BoardsDeleteModal";
import Comments from "../components/comments/Comments";
import CommentsCreateModal from "../components/comments/CommentsCreateModal";

export default function BoardsDetailNCommentsRoute() {
  // 상세 게시글
  const { _, boardPk } = useParams();
  const { data: boardData } = useQuery({
    queryFn: getBoardsDetail,
    queryKey: [`board`, boardPk],
  });

  // 상세 게시글 수정
  const {
    isOpen: isUpdateOpen,
    onClose: onUpdateClose,
    onOpen: onUpdateOpen,
  } = useDisclosure();

  // 상세 게시글 삭제
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();

  // 댓글 생성
  const {
    isOpen: isCommentCreateOpen,
    onClose: onCommentCreateClose,
    onOpen: onCommentCreateOpen,
  } = useDisclosure();

  return (
    <Box
      p={6}
      boxShadow="lg"
      bg="white"
      maxW="4xl"
      mx="auto"
      mt={20}
      mb={20}
      as="form"
    >
      <Text textAlign="center" fontSize={42} fontWeight="bold" mb={20}>
        Board Detail
      </Text>
      <VStack spacing={4} align="stretch">
        {/* disclosure_status */}
        <FormControl id="disclosure_status">
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Disclosure Status
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.disclosure_status ? "True" : "False"}
          </Text>
        </FormControl>

        {/* posting_category */}
        <FormControl id="posting_category" isRequired>
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Posting Category
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.posting_category}
          </Text>
        </FormControl>

        {/* writer */}
        <FormControl id="writer" isRequired>
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Writer
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.writer?.username}
          </Text>
        </FormControl>

        {/* title */}
        <FormControl id="title" isRequired>
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Title
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.title}
          </Text>
        </FormControl>

        {/* content */}
        <FormControl id="content" isRequired>
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Content
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.content}
          </Text>
        </FormControl>

        {/* attachment */}
        <FormControl id="attachment">
          <Flex align="center">
            <Icon as={FaPencilAlt} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Attachment
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {boardData?.attachment
              ? boardData.attachment instanceof File
                ? boardData.attachment.name
                : "No file attached"
              : "No file attached"}
          </Text>
        </FormControl>
      </VStack>
      <Box
        mt={10}
        display="flex"
        justifyContent="flex-end"
        width="100%"
        margin="auto"
      >
        {/* 돌아가기 버튼 */}
        <Link to={`/boards`}>
          <Button
            mt={10}
            style={{
              backgroundColor: "gray.100",
              color: "black",
            }}
          >
            Back
          </Button>
        </Link>

        {/* 수정하기 버튼 */}
        <Button
          mt={10}
          ml={2}
          style={{
            backgroundColor: "yellow",
            color: "black",
          }}
          onClick={onUpdateOpen}
        >
          Update
          <BoardsUpdateModal
            isOpen={isUpdateOpen}
            onClose={onUpdateClose}
            boardData={boardData} // 특정 게시물 데이터 해당 모달에 전달
          />
        </Button>

        {/* 삭제하기 버튼 */}
        <Button
          mt={10}
          ml={2}
          style={{
            backgroundColor: "orangered",
            color: "black",
          }}
          onClick={onDeleteOpen}
        >
          Delete
          <BoardsDeleteModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            boardPk={boardPk}
          />
        </Button>
      </Box>

      {/* 특정 게시글의 댓글 */}
      <Comments boardPk={boardPk} />

      {/* 댓글 생성 버튼*/}
      <Box
        mt={10}
        display="flex"
        justifyContent="flex-end"
        width="100%"
        margin="auto"
      >
        <Button
          mt={10}
          ml={2}
          style={{
            backgroundColor: "#7ed957",
            color: "black",
          }}
          onClick={onCommentCreateOpen}
        >
          Create
          <CommentsCreateModal
            isOpen={isCommentCreateOpen}
            onClose={onCommentCreateClose}
          />
        </Button>
      </Box>
    </Box>
  );
}
