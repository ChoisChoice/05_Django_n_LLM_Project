import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import Home from "./routes/Home";
import NotFound from "./routes/NotFound";
import BoardsDetailRoute from "./routes/BoardsDetail";
import BoardsRoute from "./routes/Boards";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFound />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "boards/",
        element: <BoardsRoute />,
      },
      {
        path: "boards/:boardPk/",
        element: <BoardsDetailRoute />,
      },
    ],
  },
]);

export default router;
