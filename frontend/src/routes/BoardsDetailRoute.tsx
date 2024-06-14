import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { IBoardsDetail } from "../types";
import { getBoardsDetail } from "../api/boardAPI";
import { FaPencilAlt } from "react-icons/fa";

export default function BoardsDetailRoute() {
  const { _, boardPk } = useParams();
  const { isLoading, data } = useQuery<IBoardsDetail>({
    queryFn: getBoardsDetail,
    queryKey: [`board`, boardPk],
  });
  // console.log(data?.disclosure_status);

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
            {data?.disclosure_status ? "True" : "False"}
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
            {data?.posting_category}
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
            {data?.writer?.username}
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
            {data?.title}
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
            {data?.content}
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
            {data?.attachment
              ? data.attachment instanceof File
                ? data.attachment.name
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
            backgroundColor: "#7ed957",
            color: "black",
          }}
          type="submit"
        >
          Modify
        </Button>
        {/* 삭제하기 버튼 */}
        <Button
          mt={10}
          ml={2}
          style={{
            backgroundColor: "orangered",
            color: "black",
          }}
          type="submit"
        >
          Delete
        </Button>
      </Box>
    </Box>
  );
}
