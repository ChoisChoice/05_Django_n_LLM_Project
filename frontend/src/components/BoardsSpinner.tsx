import { Box, Spinner, Text } from "@chakra-ui/react";

const spinnerMessage = "Just wait for a second!";

const boardsSpinner = () => {
  return (
    <Box textAlign={"center"}>
      <Spinner
        thickness="4px"
        speed="0.65s"
        emptyColor="gray.200"
        color="blue.500"
        size="xl"
      />
      <Text ml={2}>{spinnerMessage}</Text>
    </Box>
  );
};

export default boardsSpinner;
