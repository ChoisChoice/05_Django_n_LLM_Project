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
import { ISummaryLLM } from "../types";

export default function LLM({ url }: ISummaryLLM) {
  return (
    <Stack align="center">
      <Heading mb={3} marginTop={10}>
        ABC News Summarization & Translation
      </Heading>
      <Text fontSize="lg">based on GPT with LangChain</Text>
      <HStack marginTop={5}>
        <Input
          placeholder="Please put URL(ABC News ONLY) here!"
          size="md"
          width={500}
        />
        <Button colorScheme="teal" variant="outline"></Button>
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
                Summarize News
              </Heading>
              <Box
                border="1px solid gray"
                marginTop={4}
                marginBottom={4}
                height={230}
              >
                {/* Summarize News */}
              </Box>
            </Container>
          </Box>
          <Box flex="1" width="100%">
            <Container>
              <Heading fontSize={18} textAlign="center" marginTop={2}>
                Translate News
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
