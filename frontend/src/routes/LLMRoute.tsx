import {
  Box,
  Button,
  Container,
  HStack,
  Heading,
  Input,
  Link,
  List,
  ListIcon,
  ListItem,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaArrowAltCircleRight, FaCheck } from "react-icons/fa";
import { RiAlertLine } from "react-icons/ri";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { IURL } from "../types";

import { useForm, SubmitHandler } from "react-hook-form";
import {
  originalNews,
  summarizedNewsLLM,
  translateddNewsLLM,
} from "../api/model";

export default function LLMRoute() {
  const { register, handleSubmit, reset } = useForm<IURL>();

  // 원문 기사 관련 변수
  const [original, setOriginal] = useState("");
  const originalMutation = useMutation({
    mutationFn: originalNews,
    onSuccess: (data) => {
      setOriginal(data);
      reset();
    },
    onError: (error) => {
      console.error("Error Occurrence of loading original news:", error);
    },
  });

  // 요약된 기사 관련 변수
  const [summarized, setSummarized] = useState("");
  const summarizedMutation = useMutation({
    mutationFn: summarizedNewsLLM,
    onSuccess: (data) => {
      setSummarized(data);
      translatedMutation.mutate({ summarized_news: data }); // 요약된 기사를 번역함
      reset();
    },
    onError: (error) => {
      console.error("Error Occurrence of loading summarized news:", error);
    },
  });

  // 번역된 기사 관련 변수
  const [translated, setTranslated] = useState("");
  const translatedMutation = useMutation({
    mutationFn: translateddNewsLLM,
    onSuccess: (data) => {
      setTranslated(data);
      reset();
    },
    onError: (error) => {
      console.error("Error Occurrence of loading translated news:", error);
    },
  });

  const onSubmit: SubmitHandler<IURL> = ({ url }) => {
    originalMutation.mutate({ url });
    summarizedMutation.mutate({ url });
  };

  return (
    <Stack align="center">
      <Heading fontSize={42} marginTop={20}>
        ABC News Summarization & Translation
      </Heading>
      <Text fontSize={28} as="b" marginTop={1}>
        based on GPT with LangChain
      </Text>
      <List marginTop={4} spacing={3}>
        <ListItem fontSize={18} as="b">
          <ListIcon as={RiAlertLine} color="red.500" />
          Instructions
        </ListItem>
        <Box pl={6} fontSize={16}>
          <ListItem>
            <ListIcon as={FaCheck} color="green.500" />
            Enter the 'ABC News URL' into the search box and click the 'Run'
            button.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color="green.500" />
            The URL to be entered MUST contain a 10-digit number as shown below.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color="green.500" />
            Example: https://abcnews.go.com/...?id=110930284
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color="green.500" />
            Please refer to the following link for the url. →
            <Link href="https://abcnews.go.com/" color="blue" margin={2}>
              https://abcnews.go.com/
            </Link>
          </ListItem>
        </Box>
      </List>
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
          style={{
            backgroundColor: "#7ed957",
            color: "black",
          }}
          rightIcon={<FaArrowAltCircleRight />}
        >
          Run
        </Button>
      </HStack>
      <Box
        display="flex"
        marginTop={8}
        marginBottom={10}
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
              overflowY="auto"
            >
              {original ? (
                <Text padding={2}>{original}</Text>
              ) : (
                <Text padding={2}>.....</Text>
              )}
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
                  <Text padding={2}>{summarized}</Text>
                ) : (
                  <Text padding={2}>.....</Text>
                )}
              </Box>
            </Container>
          </Box>
          <Box flex="1" width="100%">
            <Container>
              <Heading fontSize={18} textAlign="center" marginTop={2}>
                Translated News Article(En → Kr)
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
                overflowY="auto"
              >
                {translated ? (
                  <Text padding={2}>{translated}</Text>
                ) : (
                  <Text padding={2}>.....</Text>
                )}
              </Box>
            </Container>
          </Box>
        </VStack>
      </Box>
    </Stack>
  );
}
