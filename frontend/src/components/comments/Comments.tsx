import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Icon,
  Text,
  VStack,
} from "@chakra-ui/react";
import { FaComment, FaThumbsUp } from "react-icons/fa";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { deleteThumbUp, getComments, postThumbUp } from "../../api/commentAPI";
import { IComments } from "../../types";
import useUser from "../../lib/useUser";

interface BoardPkProps {
  boardPk: string | undefined;
}

export default function Comments({ boardPk }: BoardPkProps) {
  const { user } = useUser();

  // 댓글
  const { data: commentsData } = useQuery<IComments[]>({
    queryFn: getComments,
    queryKey: [`comments`, boardPk],
  });

  // 좋아요
  const queryClient = useQueryClient();

  const handleThumbUp = async (
    boardPk: string,
    commentId: string,
    thumb_up: string[]
  ) => {
    try {
      const userId = user?.id;
      if (userId && thumb_up.includes(userId)) {
        // 좋아요 취소
        await deleteThumbUp({ boardPk, commentId });
      } else {
        // 좋아요 추가
        await postThumbUp({ boardPk, commentId });
      }
      queryClient.invalidateQueries({
        queryKey: [`comments`, boardPk],
      });
    } catch (error) {
      console.error("Failed to update thumb up status:", error);
    }
  };

  return (
    <Box
      p={6}
      boxShadow="lg"
      bg="white"
      maxW="4xl"
      mx="auto"
      mt={10}
      mb={10}
      as="form"
    >
      <VStack mt={10} align="stretch" w="100%">
        <Heading mb={5}>
          <Flex align="center" mt={4}>
            <Icon as={FaComment} boxSize={6} mr={2} color="silver" />
            <Text fontSize={24}>Comments</Text>
          </Flex>
        </Heading>
        {commentsData?.map((comment) => (
          <Box mb={2}>
            <Link to={`/boards/${boardPk}/comments/${comment.id}`}>
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
            </Link>
            <HStack justify="space-between" margin={3}>
              <Text textAlign="left" textColor="gray.500">
                {new Date(comment?.created_at).toLocaleString()}
              </Text>
              <Flex>
                <Button
                  onClick={() =>
                    boardPk &&
                    handleThumbUp(
                      boardPk,
                      comment.id.toString(),
                      comment.thumb_up
                    )
                  }
                  size="sm"
                  variant="ghost"
                  colorScheme="blue"
                  leftIcon={<FaThumbsUp />}
                >
                  {comment?.thumb_up?.length}
                </Button>
              </Flex>
            </HStack>
          </Box>
        ))}
      </VStack>
    </Box>
  );
}
