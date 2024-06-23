import ChoisChoiceLightLogo from "../assets/ChoisChoiceLightLogo.png";
import ChoisChoiceDarkLogo from "../assets/ChoisChoiceDarkLogo.png";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Box,
  Button,
  HStack,
  IconButton,
  LightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  Text,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { ToastId } from "@chakra-ui/toast";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { signOut } from "../api/userAPI";
import Navigation from "./NavBar";

export default function Header() {
  // 로그인 관련 변수
  const { userLoading, user, isSignedIn } = useUser();
  const {
    isOpen: isSigninOpen,
    onClose: onSigninClose,
    onOpen: onSigninOpen,
  } = useDisclosure();

  // 회원가입 관련 변수
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();

  // 홈페이지 로고 관련 변수
  const isDarkMode = useColorModeValue(false, true);

  // 다크모드 아이콘 관련 변수
  const { toggleColorMode } = useColorMode();
  const Icon = useColorModeValue(FaMoon, FaSun);

  // 로그아웃 관련 변수
  const toast = useToast();
  const queryClient = useQueryClient();
  const toastId = useRef<ToastId>();

  // 로그아웃 뮤테이션
  const mutation = useMutation({
    mutationFn: signOut,
    onMutate: () => {
      toastId.current = toast({
        status: "success",
        title: "Sign-out, Loading...",
        description: "I'm glad to be with you!",
        position: "bottom-right",
      });
    },
    onSuccess: () => {
      if (toastId.current) {
        queryClient.refetchQueries({ queryKey: ["my-profile"] });
        toast.update(toastId.current, {
          status: "success",
          title: "Sign-Out, Done!",
          description: "See you later!",
        });
      }
    },
  });
  const onSignOut = async () => {
    mutation.mutate();
  };

  return (
    <Stack
      justifyContent={"space-between"}
      alignItems="center"
      py={3.5}
      px={30}
      direction={{
        sm: "column",
        md: "row",
      }}
      spacing={{
        sm: 4,
        md: 0,
      }}
      borderBottomWidth={2}
    >
      <Box>
        <Link to={"/"}>
          <img
            src={isDarkMode ? ChoisChoiceDarkLogo : ChoisChoiceLightLogo}
            alt="Homepage Logo"
            style={{ width: "90px", height: "90px" }}
          />
        </Link>
      </Box>
      <Navigation />
      <HStack spacing={2}>
        <IconButton
          onClick={toggleColorMode}
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={<Icon />} // onclick에 따라 다크모드 아이콘이 결정됨
        />
        {!userLoading ? (
          !isSignedIn ? (
            <>
              <Button onClick={onSigninOpen}>Sign in</Button>
              <LightMode>
                <Button
                  onClick={onSignUpOpen}
                  style={{ backgroundColor: "#7ed957", color: "black" }}
                  colorScheme={"red"}
                >
                  Sign up
                </Button>
              </LightMode>
            </>
          ) : (
            <Menu>
              <MenuButton>
                <Box
                  backgroundColor="gray.100"
                  color="black"
                  borderRadius="8px"
                  padding="6px"
                >
                  Welcome,{" "}
                  <Text as="span" fontWeight="bold">
                    {user?.username}
                  </Text>
                  !
                </Box>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onSignOut}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <SignInModal isOpen={isSigninOpen} onClose={onSigninClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
