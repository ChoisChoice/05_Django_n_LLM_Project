import { Heading, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { kakaoSignIn } from "../api";
import { useQueryClient } from "@tanstack/react-query";

export default function KakaoConfirm() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const confirmSignin = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    if (code) {
      const status = await kakaoSignIn(code);
      if (status === 200) {
        toast({
          status: "success",
          title: "Welcome back!",
          description: "You look much better!",
          position: "bottom-right",
        });
        queryClient.refetchQueries({ queryKey: ["profile"] });
        navigate("/");
      }
    }
  };
  useEffect(() => {
    confirmSignin();
  }, []);
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Sign-in using Kakao...</Heading>
      <Text>Just wait a few seconds.</Text>
      <Spinner size="lg" />
    </VStack>
  );
}
