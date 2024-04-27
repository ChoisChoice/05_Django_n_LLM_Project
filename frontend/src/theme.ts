import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;

// import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// const config: ThemeConfig = {
//   initialColorMode: "light",
//   useSystemColorMode: false,
// };

// const theme = extendTheme({ config });

// export default theme;
