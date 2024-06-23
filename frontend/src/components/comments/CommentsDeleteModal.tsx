import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { ICommentsDeleteModal } from "../../types";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { deleteComments } from "../../api/commentAPI";

export default function CommentsDeleteModal({
  isOpen,
  onClose,
  boardPk,
  commentId,
}: ICommentsDeleteModal) {
  const { handleSubmit } = useForm();
  const toast = useToast();
  const navigate = useNavigate();

  // 댓글 삭제 관련 뮤테이션
  const mutation = useMutation({
    mutationFn: deleteComments,
    onSuccess: (data) => {
      toast({
        title: "Comment has been deleted successfully!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      navigate(`/boards/${boardPk}/`);
    },
    onError: (error) => {
      console.log("Deletion Failed");
      toast({
        title: "Comment delete FAIL!",
        status: "error",
        position: "bottom-right",
      });
    },
  });

  const onSubmit = () => {
    if (boardPk && commentId) {
      mutation.mutate({
        boardPk: boardPk,
        commentId: commentId,
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
            mt={10}
            mb={10}
          >
            Comment Delete
          </Text>
          <VStack spacing={4} align="stretch">
            <Text textAlign="center" fontSize={18}>
              Are you sure you want to delete this comment?
            </Text>
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

            {/* 삭제하기 버튼 */}
            <Button
              isLoading={mutation.isPending}
              mt={10}
              ml={2}
              colorScheme="red"
              type="submit"
            >
              Delete
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
