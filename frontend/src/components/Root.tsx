import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Footer from "./Footer";

export default function Root() {
  return (
    <Box>
      <Header />
      <Outlet />
      <ReactQueryDevtools />
      <Footer />
    </Box>
  );
}
