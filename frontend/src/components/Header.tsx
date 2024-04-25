import ChoisChoiceLightLogo from "../assets/ChoisChoiceLightLogo.png";
import ChoisChoiceDarkLogo from "../assets/ChoisChoiceDarkLogo.png";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Avatar,
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
  useColorMode,
  useColorModeValue,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SigninModal from "./SigninModal";
import SignUpModal from "./SignUpModal";
import useUser from "../lib/useUser";
import { signOut } from "../api";

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
  const onSignOut = async () => {
    const toastId = toast({
      title: "Login out...",
      description: "Sad to see you go...",
      status: "loading",
      position: "bottom-right",
    });
    /* const data = await logOut();
    console.log(data); */
    setTimeout(() => {
      toast.update(toastId, {
        status: "success",
        title: "Done!",
        description: "See you later!",
      });
    }, 5000);
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
                <Box>{`${user?.name}님, 환영합니다.`}</Box>
              </MenuButton>
              <MenuList>
                <MenuItem onClick={onSignOut}>Sign out</MenuItem>
              </MenuList>
            </Menu>
          )
        ) : null}
      </HStack>
      <SigninModal isOpen={isSigninOpen} onClose={onSigninClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
