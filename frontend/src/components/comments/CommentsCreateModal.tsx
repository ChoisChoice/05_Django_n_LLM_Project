import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaPencilAlt, FaThumbsUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IComments, ICommentsCreateModal } from "../../types";
import useUser from "../../lib/useUser";
import { useMutation } from "@tanstack/react-query";
import { postComments } from "../../api/commentAPI";

export default function CommentsCreateModal({
  isOpen,
  onClose,
}: ICommentsCreateModal) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IComments>({
    defaultValues: {
      comment: "",
      thumb_up: [],
    },
  });
  const toast = useToast();
  const navigate = useNavigate();
  const { _, boardPk } = useParams();

  // 좋아요 관련 변수
  const [thumbUpList, setThumbUpList] = useState<number[]>([]);

  // 댓글 생성 관련 뮤테이션
  const mutation = useMutation({
    mutationFn: postComments,
    onSuccess: (data) => {
      toast({
        title: "Comment has been created successfully!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      navigate(`/boards/${boardPk}`);
      reset();
    },
    onError: (error) => {
      console.log("Creation Failed");
      toast({
        title: "Comment create FAIL!",
        status: "error",
        position: "bottom-right",
      });
      reset();
    },
  });

  const onSubmit = (data: IComments) => {
    if (boardPk) {
      mutation.mutate({ boardPk, commentData: data });
    } else {
      console.error("boardPk is undefined");
    }
  };

  // 좋아요
  const handleThumbUpClick = () => {
    if (user) {
      const userPk = Number(user.pk);
      let newThumbUpList;

      if (thumbUpList.includes(userPk)) {
        // 이미 좋아요를 눌렀다면 목록에서 제거
        newThumbUpList = thumbUpList.filter((pk) => pk !== userPk);
      } else {
        // 좋아요를 누르지 않았다면 목록에 추가
        newThumbUpList = [...thumbUpList, userPk];
      }
      setThumbUpList(newThumbUpList);
    } else {
      toast({
        title: "You MUST be signed in to like a comment!",
        status: "warning",
        position: "bottom-right",
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setThumbUpList([]);
      reset();
    }
  }, [isOpen, reset]);

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
            Comment Create
          </Text>
          <VStack spacing={4} align="stretch">
            {/* writer */}
            <FormControl id="writer" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Writer
                </FormLabel>
              </Flex>
              <Text>{user?.name}</Text>
            </FormControl>

            {/* comment */}
            <FormControl id="comment" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Comment
                </FormLabel>
              </Flex>
              <Textarea
                {...register("comment", { required: true })}
                placeholder="Write your comment here(max length=200)"
                maxLength={200}
              />
            </FormControl>

            {/* thumb_up */}
            <FormControl id="thumb_up" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Thumb-Up
                </FormLabel>
              </Flex>
              <Button onClick={handleThumbUpClick} colorScheme="blue">
                <Icon as={FaThumbsUp} mr={2} />
                Like
              </Button>
              <Text>{`Thumb-Up: ${thumbUpList.length}`}</Text>
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
            {/* 생성하기 버튼 */}
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
              Create
            </Button>
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
