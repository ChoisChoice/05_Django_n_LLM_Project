import ChoisChoiceLogo from "../assets/ChoisChoiceLogo.png";
import { FaMoon } from "react-icons/fa";
import {
  Box,
  Button,
  HStack,
  IconButton,
  useDisclosure,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import SigninModal from "./SigninModal";
import SignUpModal from "./SignUpModal";

export default function Header() {
  const {
    isOpen: isSigninOpen,
    onClose: onSigninClose,
    onOpen: onSigninOpen,
  } = useDisclosure();
  const {
    isOpen: isSignUpOpen,
    onClose: onSignUpClose,
    onOpen: onSignUpOpen,
  } = useDisclosure();
  return (
    <HStack
      justifyContent={"space-between"}
      py={3.5}
      px={7}
      borderBottomWidth={2}
    >
      <Box color="red.500">
        <Link to={"/"}>
          <img
            src={ChoisChoiceLogo}
            alt="Logo"
            style={{ width: "120px", height: "120px" }}
          />
        </Link>
      </Box>
      <HStack spacing={2}>
        <IconButton
          variant={"ghost"}
          aria-label="Toggle dark mode"
          icon={<FaMoon />}
        />
        <Button onClick={onSigninOpen}>Sign in</Button>
        <Button
          onClick={onSignUpOpen}
          style={{ backgroundColor: "#70DB93", color: "black" }}
        >
          Sign up
        </Button>
      </HStack>
      <SigninModal isOpen={isSigninOpen} onClose={onSigninClose} />
      <SignUpModal isOpen={isSignUpOpen} onClose={onSignUpClose} />
    </HStack>
  );
}
