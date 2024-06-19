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
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { IBoardsCreateModal, IBoardsDetail } from "../../types";
import useUser from "../../lib/useUser";
import { postBoards } from "../../api/boardAPI";

export default function BoardsCreateModal({
  isOpen,
  onClose,
}: IBoardsCreateModal) {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IBoardsDetail>();
  const toast = useToast();
  const navigate = useNavigate();

  // 게시판 생성 관련 뮤테이션
  const mutation = useMutation({
    mutationFn: postBoards,
    onSuccess: (data) => {
      toast({
        title: "Board has been created successfully!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      navigate(`/boards`);
      reset();
    },
    onError: (error) => {
      console.log("Creation Failed");
      toast({
        title: "Board create FAIL!",
        status: "error",
        position: "bottom-right",
      });
      reset();
    },
  });

  const onSubmit = (data: IBoardsDetail) => {
    mutation.mutate(data);
    console.log(data);
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
            Board Create
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
                defaultChecked
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
              <Text>{user?.name}</Text>
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
