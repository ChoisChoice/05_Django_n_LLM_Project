import ChoisChoiceLightLogo from "../assets/ChoisChoiceLightLogo.png";
import ChoisChoiceDarkLogo from "../assets/ChoisChoiceDarkLogo.png";
import { FaMoon, FaSun } from "react-icons/fa";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Stack,
  useColorMode,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SigninModal from "./SigninModal";
import SignUpModal from "./SignUpModal";

export default function Header() {
  // 로그인 관련 변수
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
        <Button onClick={onSigninOpen}>Sign in</Button>
        <Button
          onClick={onSignUpOpen}
          style={{ backgroundColor: "#7ed957", color: "black" }}
        >
          Sign up
        </Button>
      </HStack>
      <SigninModal isOpen={isSigninOpen} onClose={onSigninClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </Stack>
  );
}
