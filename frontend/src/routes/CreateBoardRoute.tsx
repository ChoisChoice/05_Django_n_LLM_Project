import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import useUser from "../lib/useUser";
import { postBoards } from "../api/boardAPI";
import { ICreateBoards } from "../types";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { FaPencilAlt } from "react-icons/fa";

export default function CreateBoardRoute() {
  const { userLoading, user, isSignedIn } = useUser();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ICreateBoards>();
  const toast = useToast();
  const navigate = useNavigate();

  // 게시판 생성 관련 뮤테이션
  const mutation = useMutation({
    mutationFn: postBoards,
    onSuccess: (data) => {
      toast({
        title: "Board created successfully!",
        status: "success",
        position: "bottom-right",
      });
      reset();
      navigate("/boards");
    },
    onError: (error) => {
      console.log("Mutation Failed");
      toast({
        title: "Board created failed!",
        status: "error",
        position: "bottom-right",
      });
      reset();
    },
  });

  const onSubmit = (data: ICreateBoards) => {
    mutation.mutate(data);
  };

  return (
    <Box
      p={6}
      boxShadow="lg"
      bg="white"
      maxW="4xl"
      mx="auto"
      mt={20}
      mb={10}
      as="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Text textAlign="center" fontSize={42} fontWeight="bold" mb={20}>
        Create Board
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
            <option value="improvements">Related Issue: Improvements</option>
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
        {/* 생성하기 버튼 */}
        <Button
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
    </Box>
  );
}
