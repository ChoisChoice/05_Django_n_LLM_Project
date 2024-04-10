import GithubLogo from "../assets/GithubLogo.png";
import KaKaoLogo from "../assets/KaKaoLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import {
  AbsoluteCenter,
  Box,
  Button,
  Divider,
  HStack,
  Link,
  Text,
} from "@chakra-ui/react";

export default function SocialLogin() {
  return (
    <Box mb={2}>
      <HStack my={4} spacing={2} alignItems="center">
        <Divider flex={1} />
        <Text textTransform={"uppercase"} color="gray.500" fontSize="xs" as="b">
          or continue with
        </Text>
        <Divider flex={1} />
      </HStack>
      <HStack spacing={4} justify="center">
        <Button variant="unstyled">
          <img
            src={GithubLogo}
            style={{ width: "50px", height: "50px" }}
            alt="Github Logo"
          />
        </Button>
        <Button variant="unstyled">
          <img
            src={KaKaoLogo}
            style={{ width: "50px", height: "50px" }}
            alt="KaKao Logo"
          />
        </Button>
        <Button variant="unstyled">
          <img
            src={GoogleLogo}
            style={{ width: "50px", height: "50px" }}
            alt="Google Logo"
          />
        </Button>
        <Button variant="unstyled">
          <img
            src={NaverLogo}
            style={{ width: "50px", height: "50px" }}
            alt="Naver Logo"
          />
        </Button>
      </HStack>
      <Box mt={4} mb={4}>
        <Text textAlign="right" fontSize="xs" color="gray.500">
          Some icons designed by {""}
          <Link href="https://www.freepik.com/" isExternal color="blue.500">
            Freepik
          </Link>
        </Text>
      </Box>
    </Box>
  );
}
