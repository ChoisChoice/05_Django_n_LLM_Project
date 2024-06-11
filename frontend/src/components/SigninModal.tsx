import {
  Box,
  Button,
  Input,
  InputGroup,
  InputLeftElement,
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
import { FaUserNinja, FaLock } from "react-icons/fa";
import SocialSignIn from "./SocialSignIn";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { signIn } from "../api/users";

interface SignInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface IForm {
  username: string;
  password: string;
}

export default function SignInModal({ isOpen, onClose }: SignInModalProps) {
  const {
    register, // form에 input을 등록하는 함수
    handleSubmit, // 데이터를 validate하는 함수(event.preventDefault, handleSubmit 기능들을 제공)
    formState: { errors },
    reset,
  } = useForm<IForm>();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: signIn,
    onMutate: () => {
      console.log("Mutation Starting");
    },
    onSuccess: () => {
      console.log("Successfully Sign-In");
      toast({
        title: "Welcome back!",
        status: "success",
        position: "bottom-right",
      });
      onClose();
      queryClient.refetchQueries({ queryKey: ["my-profile"] });
    },
    onError: (error) => {
      console.log("Mutation Failed");
      reset();
    },
  });
  const onSubmit = ({ username, password }: IForm) => {
    mutation.mutate({ username, password });
    console.log(username, password);
  };
  return (
    <Modal onClose={onClose} isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sign in</ModalHeader>
        <ModalCloseButton />
        {/* 아래에서 데이터 validation과 preventDefault 함. 그리고 두가지가 끝나면 onSubmit함수를 호출함 */}
        <ModalBody as="form" onSubmit={handleSubmit(onSubmit)}>
          <VStack>
            <InputGroup size={"md"}>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaUserNinja />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.username?.message)}
                {...register("username", {
                  required: "Please write a username",
                })}
                variant={"filled"}
                placeholder="Username"
              />
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                children={
                  <Box color="gray.500">
                    <FaLock />
                  </Box>
                }
              />
              <Input
                isInvalid={Boolean(errors.password?.message)}
                {...register("password", {
                  required: "Please write a password",
                })}
                type="password"
                variant={"filled"}
                placeholder="Password"
              />
            </InputGroup>
          </VStack>
          {mutation.isError ? (
            <Text color="red.500" textAlign={"center"} fontSize="sm">
              Username or Password are wrong!
            </Text>
          ) : null}
          <Button
            isLoading={mutation.isPending} // isLoading -> isPending
            type="submit"
            mt={4}
            style={{ backgroundColor: "#7ed957", color: "black" }}
            w="100%"
          >
            Sign in
          </Button>
          <SocialSignIn />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
