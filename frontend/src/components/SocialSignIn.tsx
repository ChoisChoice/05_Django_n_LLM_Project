import GithubLogo from "../assets/GithubLogo.png";
import KakaoLogo from "../assets/KakaoLogo.png";
import GoogleLogo from "../assets/GoogleLogo.png";
import NaverLogo from "../assets/NaverLogo.png";
import { Box, Button, Divider, HStack, Link, Text } from "@chakra-ui/react";

export default function SocialSignIn() {
  // github 관련 파라미터
  const githubParams = {
    client_id: "164eb89a9f21d451ebaa",
    scope: "read:user,user:email",
  };
  const githubUrl = `https://github.com/login/oauth/authorize?${new URLSearchParams(
    githubParams
  ).toString()}`;
  // kakao 관련 파라미터
  const kakaoParams = {
    response_type: "code",
    client_id: "63d64636075adcc88581d17290cb5928",
    redirect_uri: "http://127.0.0.1:3000/social/kakao",
  };
  const kakaoUrl = `https://kauth.kakao.com/oauth/authorize?${new URLSearchParams(
    kakaoParams
  ).toString()}`;
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
        <Button variant="unstyled" as="a" href={githubUrl}>
          <img
            src={GithubLogo}
            style={{ width: "50px", height: "50px" }}
            alt="Github Logo"
          />
        </Button>
        <Button variant="unstyled" as="a" href={kakaoUrl}>
          <img
            src={KakaoLogo}
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
