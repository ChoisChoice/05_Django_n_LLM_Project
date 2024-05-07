import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import ReactDOM from "react-dom/client";
// import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import theme from "./theme";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// React 17
const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

// React 18
// const root = createRoot(document.getElementById("root") as HTMLElement);

const client = new QueryClient();

root.render(
  <QueryClientProvider client={client}>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <RouterProvider router={router} />
    </ChakraProvider>
  </QueryClientProvider>
);
