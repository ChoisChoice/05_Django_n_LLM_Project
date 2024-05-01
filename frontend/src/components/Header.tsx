import ChoisChoiceLightLogo from "../assets/ChoisChoiceLightLogo.png";
import ChoisChoiceDarkLogo from "../assets/ChoisChoiceDarkLogo.png";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Box,
  Button,
  HStack,
  IconButton,
  LightMode as OverrideLightMode,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SignInModal from "./SignInModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { signOut, socialSignOut } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { ToastId } from "@chakra-ui/toast";

export const LightMode: React.FC<{ children: React.ReactNode }> =
  OverrideLightMode;

export default function Header() {
  // 로그인 관련 변수
  const { userLoading, isSignedIn, user } = useUser();
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
  const mutation = useMutation({
    mutationFn: socialSignOut,
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
          title: "Sign-out, Done!",
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
                <Box>{`Welcome, ${user?.name}!`}</Box>
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
