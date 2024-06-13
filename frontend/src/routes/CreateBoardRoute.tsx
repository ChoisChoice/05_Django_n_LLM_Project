import React from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Switch,
  Text,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import useUser from "../lib/useUser";

export default function CreateBoardRoute() {
  const { userLoading, user, isSignedIn } = useUser();
  return (
    <Box p={6} boxShadow="lg" bg="white" maxW="md" mx="auto" mt={20} mb={10}>
      <Text textAlign="center" fontSize={42} fontWeight="bold" mb={10}>
        Create Board
      </Text>
      <VStack spacing={4} align="stretch">
        <FormControl id="disclosure_status">
          <FormLabel>Disclosure Status</FormLabel>
          <Switch colorScheme="green" defaultChecked />
        </FormControl>

        <FormControl id="posting_category" isRequired>
          <FormLabel>Posting Category</FormLabel>
          <Select placeholder="Select category">
            <option value="sign_in">Related Issue: Sign In</option>
            <option value="opinion_of_use">
              Related Issue: Opinion of Use
            </option>
            <option value="error">Related Issue: Some Error</option>
            <option value="improvements">Related Issue: Improvements</option>
          </Select>
        </FormControl>

        <FormControl id="writer" isRequired>
          <FormLabel>Writer</FormLabel>
          {user?.name}
        </FormControl>

        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input type="text" placeholder="Enter the title" />
        </FormControl>

        <FormControl id="content" isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea placeholder="Write your content here" maxLength={500} />
        </FormControl>

        <FormControl id="attachment">
          <FormLabel>Attachment</FormLabel>
          <Input type="file" />
        </FormControl>

        <Button
          style={{
            backgroundColor: "#7ed957",
            color: "black",
          }}
          type="submit"
        >
          Create
        </Button>
      </VStack>
    </Box>
  );
}
