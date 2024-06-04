import { Heading, Spinner, Text, VStack, useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { githubSignIn } from "../api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GithubConfirmRoute() {
  const { search } = useLocation();
  const toast = useToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const mutation = useMutation({
    mutationFn: githubSignIn,
    onSuccess: () => {
      toast({
        status: "success",
        title: "Welcome back!",
        description: "You look much better!",
      });
      queryClient.refetchQueries({ queryKey: ["my-profile"] });
      navigate("/");
    },
  });
  const confirmSignIn = async () => {
    const params = new URLSearchParams(search);
    const code = params.get("code");
    if (code) {
      mutation.mutate(code);
    }
  };
  useEffect(() => {
    confirmSignIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <VStack justifyContent={"center"} mt={40}>
      <Heading>Sign-in using Github...</Heading>
      <Text>Just wait a few seconds.</Text>
      <Spinner size="lg" />
    </VStack>
  );
}
