import {
  Box,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getComments } from "../../api/commentAPI";
import { IComments } from "../../types";

export default function Comments() {
  // 댓글
  const { _, boardPk } = useParams();
  const { data: commentsData } = useQuery<IComments[]>({
    queryFn: getComments,
    queryKey: [`comments`, boardPk],
  });

  // 각 댓글의 추천 수
  const countThumbUp =
    commentsData?.reduce(
      (sum, comment) => sum + (comment.thumb_up?.length || 0),
      0
    ) || 0;

  return (
    <VStack mt={10} align="stretch" w="100%">
      <Heading mb={5}>
        <Flex align="center" mt={4}>
          <Icon as={FaComment} boxSize={6} mr={2} color="silver" />
          <Text fontSize={24}>Comments</Text>
        </Flex>
      </Heading>
      {commentsData?.map((comment) => (
        <Link to={`/boards/${boardPk}/comments/${comment.pk}`}>
          <Box mb={2}>
            <Text
              bg="gray.100"
              p={1}
              borderRadius="md"
              fontSize="md"
              fontWeight="bold"
            >
              {comment?.writer?.username}
            </Text>
            <Text margin={3}>{comment?.comment}</Text>
            <HStack justify="space-between" margin={3}>
              <Text textAlign="left" textColor="gray.500">
                {new Date(comment?.created_at).toLocaleString()}
              </Text>
              <Flex>
                <Icon as={FaThumbsUp} boxSize={4} mr={2} color="blue.600" />
                <Text textAlign="right">{comment?.thumb_up?.length}</Text>
              </Flex>
            </HStack>
          </Box>
        </Link>
      ))}
    </VStack>
  );
}
