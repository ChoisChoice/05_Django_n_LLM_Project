import { Box, Spinner, Text } from "@chakra-ui/react";

const spinnerMessage = "Just wait for a second!";

const CustomSpinner = () => {
  return (
    <Box textAlign={"center"} marginTop={200} marginBottom={200}>
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

export default CustomSpinner;
