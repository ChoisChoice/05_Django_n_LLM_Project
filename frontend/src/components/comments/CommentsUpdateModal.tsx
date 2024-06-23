import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { IComments, ICommentsUpdateModal } from "../../types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { putComments } from "../../api/commentAPI";
import { FaCommentAlt, FaThumbsUp } from "react-icons/fa";

export default function CommentsUpdateModal({
  isOpen,
  onClose,
  boardPk,
  commentId,
  commentData,
}: ICommentsUpdateModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IComments>({
    defaultValues: commentData,
  });
  const toast = useToast();
  const navigate = useNavigate();

  // 초기 데이터 설정
  useEffect(() => {
    if (commentData) {
      reset(commentData);
    }
  }, [commentData, reset]);

  // 댓글 업데이트 뮤테이션
  const mutation = useMutation({
    mutationFn: (variables: {
      boardPk: string;
      commentId: string;
      commentData: IComments;
    }) => putComments(variables),
    onMutate: () => {
      console.log("Mutation Starting");
    },
    onSuccess: (data) => {
      console.log("Comment has been updated successfully.");
      toast({
        title: "Comment has been updated!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      navigate(`/boards/${boardPk}/comments/${commentId}/`);
      reset();
    },
    onError: (error) => {
      console.log("Update Failed");
      toast({
        title: "Comment update FAIL!",
        status: "error",
        position: "bottom-right",
      });
      reset();
    },
  });

  const onSubmit = (data: IComments) => {
    if (boardPk && commentId) {
      mutation.mutate({
        boardPk: boardPk,
        commentId: commentId,
        commentData: data,
      });
    }
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent maxW="4xl">
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <Text
            textAlign="center"
            fontSize={42}
            fontWeight="bold"
            mt={20}
            mb={20}
          >
            Comment Update
          </Text>
          <VStack spacing={4} align="stretch">
            {/* writer */}
            <FormControl id="writer" isRequired>
              <Flex align="center">
                <Icon as={FaCommentAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Writer
                </FormLabel>
              </Flex>
              <Text>{commentData?.writer?.username}</Text>
            </FormControl>

            {/* comment */}
            <FormControl id="comment" isRequired>
              <Flex align="center">
                <Icon as={FaCommentAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Comment
                </FormLabel>
              </Flex>
              <Input
                {...register("comment", { required: true })}
                type="text"
                placeholder="Enter the comment"
                defaultValue={commentData?.comment} // 기존값
              />
            </FormControl>

            {/* thumb_up */}
            <FormControl id="thumb_up" isRequired>
              <Flex align="center">
                <Icon as={FaCommentAlt} color="green.500" />
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
                <Icon as={FaCommentAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Created-At
                </FormLabel>
              </Flex>
              <Text>{commentData?.created_at}</Text>
            </FormControl>
          </VStack>
          <Box
            padding={2}
            mt={10}
            display="flex"
            justifyContent="flex-end"
            width="100%"
            margin="auto"
          >
            {/* 취소하기 버튼 */}
            <Button mt={10} ml={2} onClick={onClose}>
              Cancle
            </Button>

            {/* 수정하기 버튼 */}
            <Button
              isLoading={mutation.isPending}
              mt={10}
              ml={2}
              style={{
                backgroundColor: "#7ed957",
                color: "black",
              }}
              type="submit"
            >
              Update
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
