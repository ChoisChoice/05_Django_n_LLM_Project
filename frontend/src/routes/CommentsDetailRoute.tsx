import {
  VStack,
  Box,
  Text,
  Heading,
  Flex,
  Icon,
  HStack,
  FormControl,
  FormLabel,
  Button,
  useDisclosure,
} from "@chakra-ui/react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { getCommentsDetail } from "../api/commentAPI";
import { IComments } from "../types";
import CommentsUpdateModal from "../components/comments/CommentsUpdateModal";
import CommentsDeleteModal from "../components/comments/CommentsDeleteModal";

export default function CommentsDetailRoute() {
  const { boardPk, commentId } = useParams<{
    boardPk: string | undefined;
    commentId: string | undefined;
  }>();
  const { data: commentData } = useQuery<IComments>({
    queryFn: () => getCommentsDetail({ boardPk, commentId }),
    queryKey: [`commentsDetail`, boardPk, commentId],
  });

  // 상세 댓글 수정
  const {
    isOpen: isUpdateOpen,
    onClose: onUpdateClose,
    onOpen: onUpdateOpen,
  } = useDisclosure();

  // 상세 댓글 삭제
  const {
    isOpen: isDeleteOpen,
    onClose: onDeleteClose,
    onOpen: onDeleteOpen,
  } = useDisclosure();

  console.log(commentData?.thumb_up);
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
        Comment Detail
      </Text>
      <VStack spacing={4} align="stretch">
        {/* writer */}
        <FormControl id="writer">
          <Flex align="center">
            <Icon as={FaComment} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Writer
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {commentData?.writer?.username}
          </Text>
        </FormControl>

        {/* comment */}
        <FormControl id="comment" isRequired>
          <Flex align="center">
            <Icon as={FaComment} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Comment
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {commentData?.comment}
          </Text>
        </FormControl>

        {/* thumb_up */}
        <FormControl id="thumb_up" isRequired>
          <Flex align="center">
            <Icon as={FaComment} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Thumb-Up
            </FormLabel>
          </Flex>
          <Flex align="center" ml={2}>
            <Icon as={FaThumbsUp} boxSize={4} mr={1} color="blue.600" />
            <Text p={2}>{commentData?.thumb_up?.length}</Text>
          </Flex>
        </FormControl>

        {/* created_at */}
        <FormControl id="created_at" isRequired>
          <Flex align="center">
            <Icon as={FaComment} color="green.500" />
            <FormLabel fontSize={22} ml={2}>
              Created-At
            </FormLabel>
          </Flex>
          <Text border="1px solid gray" p={2}>
            {commentData?.created_at && (
              <Text textAlign="left" textColor="gray.500">
                {new Date(commentData.created_at).toLocaleString()}
              </Text>
            )}
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
        <Link to={`/boards/${boardPk}/`}>
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
          <CommentsUpdateModal
            isOpen={isUpdateOpen}
            onClose={onUpdateClose}
            boardPk={boardPk}
            commentId={commentId}
            commentData={commentData} // 특정 댓글 데이터 해당 모달에 전달
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
          <CommentsDeleteModal
            isOpen={isDeleteOpen}
            onClose={onDeleteClose}
            boardPk={boardPk}
            commentId={commentId}
          />
        </Button>
      </Box>
    </Box>
  );
}
