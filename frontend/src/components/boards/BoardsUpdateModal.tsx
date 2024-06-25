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
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaPencilAlt } from "react-icons/fa";
import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { IBoardsDetail, IBoardsUpdateModal } from "../../types";
import { putBoardsDetail } from "../../api/boardAPI";

export default function BoardsUpdateModal({
  isOpen,
  onClose,
  boardData,
}: IBoardsUpdateModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IBoardsDetail>({
    defaultValues: boardData,
  });
  const toast = useToast();
  const navigate = useNavigate();
  const { _, boardPk } = useParams();

  // 초기 데이터 설정
  useEffect(() => {
    if (boardData) {
      reset(boardData);
    }
  }, [boardData, reset]);

  // 게시판 업데이트 뮤테이션
  const mutation = useMutation({
    mutationFn: (variables: { boardPk: string; boardData: IBoardsDetail }) =>
      putBoardsDetail(variables),
    onMutate: () => {
      console.log("Mutation Starting");
    },
    onSuccess: (data) => {
      console.log("Board has been updated successfully.");
      toast({
        title: "Board has been updated!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      navigate(`/boards/${boardPk}/`);
      reset();
    },
    onError: (error) => {
      console.log("Update Failed");
      toast({
        title: "Board update FAIL!",
        status: "error",
        position: "bottom-right",
      });
      reset();
    },
  });

  const onSubmit = (data: IBoardsDetail) => {
    if (boardPk) {
      mutation.mutate({ boardPk, boardData: data });
    } else {
      console.error("boardPk is undefined");
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
            Board Detail Update
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
              <Switch
                {...register("disclosure_status")}
                colorScheme="blue"
                defaultChecked={boardData?.disclosure_status} // 기존값
              />
            </FormControl>

            {/* posting_category */}
            <FormControl id="posting_category" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Posting Category
                </FormLabel>
              </Flex>
              <Select
                {...register("posting_category", { required: true })}
                placeholder="Select category"
                defaultValue={boardData?.posting_category} // 기존값
              >
                <option value="sign_in">Related Issue: Sign In</option>
                <option value="opinion_of_use">
                  Related Issue: Opinion of Use
                </option>
                <option value="error">Related Issue: Some Error</option>
                <option value="improvements">
                  Related Issue: Improvements
                </option>
              </Select>
            </FormControl>

            {/* writer */}
            <FormControl id="writer" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Writer
                </FormLabel>
              </Flex>
              <Text>{boardData?.writer?.username}</Text>
            </FormControl>

            {/* title */}
            <FormControl id="title" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Title
                </FormLabel>
              </Flex>
              <Input
                {...register("title", { required: true })}
                type="text"
                placeholder="Enter the title"
                defaultValue={boardData?.title} // 기존값
              />
            </FormControl>

            {/* content */}
            <FormControl id="content" isRequired>
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Content
                </FormLabel>
              </Flex>
              <Textarea
                {...register("content", { required: true })}
                placeholder="Write your content here(max length=500)"
                maxLength={500}
                defaultValue={boardData?.content} // 기존값
              />
            </FormControl>

            {/* attachment */}
            <FormControl id="attachment">
              <Flex align="center">
                <Icon as={FaPencilAlt} color="green.500" />
                <FormLabel fontSize={22} ml={2}>
                  Attachment
                </FormLabel>
              </Flex>
              <Input {...register("attachment")} type="file" />
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
