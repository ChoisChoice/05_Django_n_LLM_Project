import {
  Box,
  Button,
  Center,
  Container,
  HStack,
  Heading,
  Input,
  Stack,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { ISummaryLLM } from "../types";
import { summaryLLM } from "../api";
import { useForm } from "react-hook-form";

export default function LLMRoute() {
  const { register, handleSubmit, reset } = useForm<ISummaryLLM>();
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");

  const summary_mutation = useMutation({
    mutationFn: summaryLLM,
    onSuccess: (data) => {
      setSummary(data);
      reset();
    },
    onError: (error) => {
      console.error("Error summarizing the news:", error);
    },
  });

  const onSubmit = ({ url }: ISummaryLLM) => {
    summary_mutation.mutate({ url });
  };

  return (
    <Stack align="center">
      <Heading mb={3} marginTop={10}>
        ABC News Summarization & Translation
      </Heading>
      <Text fontSize="lg">based on GPT with LangChain</Text>
      <HStack marginTop={5} as="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          required
          {...register("url")}
          placeholder="Please put URL(ABC News ONLY) here!"
          size="md"
          width={500}
        />
        <Button
          type="submit"
          isLoading={summary_mutation.isPending}
          colorScheme="teal"
          variant="outline"
          style={{ backgroundColor: "#7ed957", color: "black" }}
          leftIcon={<FaArrowAltCircleRight />}
        ></Button>
      </HStack>
      <Box
        display="flex"
        marginTop={2}
        marginBottom={2}
        border="2px solid gray"
        width={800}
        height={600}
      >
        {/* 왼쪽 */}
        <Box flex="1" borderRight="2px solid gray">
          <Container>
            <Heading fontSize={18} textAlign="center" marginTop={2}>
              Original News Article
            </Heading>
            <Box
              border="1px solid gray"
              marginTop={4}
              marginBottom={4}
              height={530}
            >
              {/* Original News Article */}
            </Box>
          </Container>
        </Box>
        {/* 오른쪽 */}
        <VStack flex="1" minHeight="400px" justifyContent="space-between">
          <Box flex="1" borderBottom="2px solid gray" width="100%">
            <Container>
              <Heading fontSize={18} textAlign="center" marginTop={2}>
                Summarize News Article
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
                overflowY="auto"
              >
                {summary ? (
                  <Text>{summary}</Text>
                ) : (
                  <Text>Summarize News Article</Text>
                )}
              </Box>
            </Container>
          </Box>
          <Box flex="1" width="100%">
            <Container>
              <Heading fontSize={18} textAlign="center" marginTop={2}>
                Translate News Article
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
              >
                {/* Translate News */}
              </Box>
            </Container>
          </Box>
        </VStack>
      </Box>
    </Stack>
  );
}
