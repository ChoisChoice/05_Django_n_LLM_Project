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
} from "@chakra-ui/react";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IURL } from "../types";
import { summarizedNewsLLM, translateddNewsLLM } from "../api";
import { useForm, SubmitHandler } from "react-hook-form";

export default function LLMRoute() {
  const { register, handleSubmit, reset } = useForm<IURL>();
  const [summarized, setSummarized] = useState("");
  const [translated, setTranslated] = useState("");

  const summarizedMutation = useMutation({
    mutationFn: summarizedNewsLLM,
    onSuccess: (data) => {
      setSummarized(data);
      translatedMutation.mutate({ summarized_news: data });
      reset();
    },
    onError: (error) => {
      console.error("Error summarizing the news:", error);
    },
  });

  const translatedMutation = useMutation({
    mutationFn: translateddNewsLLM,
    onSuccess: (data) => {
      setTranslated(data);
      reset();
    },
    onError: (error) => {
      console.error("Error translating the news:", error);
    },
  });

  const onSubmit: SubmitHandler<IURL> = ({ url }) => {
    setSummarized("");
    setTranslated("");
    summarizedMutation.mutate({ url });
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
          isLoading={summarizedMutation.isPending}
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
                Summarized News Article
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
                overflowY="auto"
              >
                {summarized ? (
                  <Text>{summarized}</Text>
                ) : (
                  <Text>Summarized News Article</Text>
                )}
              </Box>
            </Container>
          </Box>
          <Box flex="1" width="100%">
            <Container>
              <Heading fontSize={18} textAlign="center" marginTop={2}>
                Translated News Article
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
                overflowY="auto"
              >
                {translated ? (
                  <Text>{translated}</Text>
                ) : (
                  <Text>Translated News Article</Text>
                )}
              </Box>
            </Container>
          </Box>
        </VStack>
      </Box>
    </Stack>
  );
}
