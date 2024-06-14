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
  Spinner,
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
} from "../api/modelAPI";

export default function LLMRoute() {
  const { register, handleSubmit, reset } = useForm<IURL>();

  // 상태 변수
  const [original, setOriginal] = useState("");
  const [summarized, setSummarized] = useState("");
  const [translated, setTranslated] = useState("");

  // 원문 기사 관련 뮤테이션
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

  // 요약된 기사 관련 뮤테이션
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

  // 번역된 기사 관련 뮤테이션
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
      <Text fontSize={28} as="b" marginTop={1} color={"#7ed957"}>
        based on GPT with LangChain
      </Text>
      <List marginTop={4} spacing={3}>
        <ListItem fontSize={18} as="b">
          <ListIcon as={RiAlertLine} color={"red.500"} />
          Instructions
        </ListItem>
        <Box pl={6} fontSize={16}>
          <ListItem>
            <ListIcon as={FaCheck} color={"green.500"} />
            Enter the 'ABC News URL' into the search box and click the 'Run'
            button.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color={"green.500"} />
            The URL to be entered MUST contain a 10-digit number as shown below.
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color={"green.500"} />
            Example: https://abcnews.go.com/...?id=110930284
          </ListItem>
          <ListItem>
            <ListIcon as={FaCheck} color={"green.500"} />
            Please refer to the following link for the url. →
            <Link href={"https://abcnews.go.com/"} color={"blue"} margin={2}>
              https://abcnews.go.com/
            </Link>
          </ListItem>
        </Box>
      </List>
      <HStack marginTop={5} as={"form"} onSubmit={handleSubmit(onSubmit)}>
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
        marginBottom={20}
        border="2px solid gray"
        width={1000}
        height={800}
      >
        {/* 왼쪽 */}
        <Box flex="1" borderRight="2px solid gray">
          <Container>
            <Heading fontSize={18} textAlign="center" marginTop={3}>
              Original News Article
            </Heading>
            <Box
              border="1px solid gray"
              marginTop={4}
              marginBottom={4}
              height={730}
              overflowY="auto"
              position="relative"
            >
              {originalMutation.isPending && (
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="blue.500"
                  size="xl"
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                />
              )}
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
              <Heading fontSize={18} textAlign="center" marginTop={3}>
                Summarized News Article
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={330}
                overflowY="auto"
                position="relative"
              >
                {summarizedMutation.isPending && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  />
                )}
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
                height={330}
                overflowY="auto"
                position="relative"
              >
                {translatedMutation.isPending && (
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="blue.500"
                    size="xl"
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                  />
                )}
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
