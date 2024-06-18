import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import {
  FaUserNinja,
  FaLock,
  FaEnvelope,
  FaUserSecret,
  FaCheck,
} from "react-icons/fa";
import SocialSignIn from "./SocialSignIn";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signUp } from "../api/userAPI";
import { RiAlertLine } from "react-icons/ri";
import { ISignUpModal, ISignUpVariables } from "../types";

export default function SignUpModal({ isOpen, onClose }: ISignUpModal) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISignUpVariables>();
  const toast = useToast();
  const queryClient = useQueryClient();

  // 회원가입 관련 뮤테이션
  const mutation = useMutation({
    mutationFn: signUp,
    onMutate: () => {
      console.log("Mutation Starting");
    },
    onSuccess: () => {
      console.log("Successfully Sign-Up");
      toast({
        title: "Welcome to the my Site!",
        description: "PLEASE SIGN-IN AND JOIN WEBSITE!!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      queryClient.refetchQueries({ queryKey: ["my-profile"] });
      reset();
    },
    onError: (error) => {
      console.log("Mutation Failed");
      reset();
    },
  });

  const onSubmit = ({ ...username }: ISignUpVariables) => {
    mutation.mutate({ ...username });
  };

  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign up</ModalHeader>
        <ModalCloseButton />
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            {/* name */}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserSecret />
                  </Box>
                }
              />
              <Input
                {...register("name", {
                  required: "Please write a name",
                })}
                isInvalid={Boolean(errors.name?.message)}
                variant={"filled"}
                placeholder="Name"
              />
            </InputGroup>

            {/* email */}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaEnvelope />
                  </Box>
                }
              />
              <Input
                {...register("email", {
                  required: "Please write an valid email",
                })}
                isInvalid={Boolean(errors.email?.message)}
                type="email"
                variant={"filled"}
                placeholder="Email"
              />
            </InputGroup>

            {/* username */}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserNinja />
                  </Box>
                }
              />
              <Input
                {...register("username", {
                  required: "Please write a username",
                })}
                isInvalid={Boolean(errors.username?.message)}
                variant={"filled"}
                placeholder="Username"
              />
            </InputGroup>

            {/* password */}
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaLock />
                  </Box>
                }
              />
              <Input
                {...register("password", {
                  required: "Please write a password",
                })}
                isInvalid={Boolean(errors.password?.message)}
                variant={"filled"}
                type="password"
                placeholder="Password"
              />
            </InputGroup>
            <List mt={2} mb={2} spacing={3}>
              <ListItem fontSize={18} as="b">
                <ListIcon as={RiAlertLine} color={"red.500"} />
                Password Rules
              </ListItem>
              <Box pl={6} fontSize={16}>
                <ListItem>
                  <ListIcon as={FaCheck} color={"green.500"} />
                  Password must be at least 8 characters
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color={"green.500"} />
                  Contains at least 2 upper/lowercase letters
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color={"green.500"} />
                  Contains 2 or more numbers
                </ListItem>
                <ListItem>
                  <ListIcon as={FaCheck} color={"green.500"} />
                  Contains 2 or more special characters
                </ListItem>
              </Box>
            </List>
          </VStack>

          {/* error */}
          {mutation.isError ? (
            <Text color="red.500" textAlign={"center"} fontSize="sm">
              Please input correct information!
            </Text>
          ) : null}
          <Button
            isLoading={mutation.isPending}
            type="submit"
            mt={4}
            style={{ backgroundColor: "#7ed957", color: "black" }}
            w="100%"
          >
            Sign up
          </Button>
          <SocialSignIn />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
