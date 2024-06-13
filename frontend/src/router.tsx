import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import NotFoundRoute from "./routes/NotFoundRoute";
import HomeRoute from "./routes/HomeRoute";
import BoardsRoute from "./routes/BoardsRoute";
import BoardsDetailRoute from "./routes/BoardsDetailRoute";
import GithubConfirmRoute from "./routes/GithubConfirmRoute";
import KakaoConfirmRoute from "./routes/KakaoConfirmRoute";
import LLMRoute from "./routes/LLMRoute";
import CreateBoardRoute from "./routes/CreateBoardRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundRoute />,
    children: [
      {
        path: "",
        element: <HomeRoute />,
      },
      {
        path: "boards/",
        children: [
          {
            path: "",
            element: <BoardsRoute />,
          },
          {
            path: "create/",
            element: <CreateBoardRoute />,
          },
        ],
      },
      {
        path: "boards/:boardPk/",
        element: <BoardsDetailRoute />,
      },
      {
        path: "social/",
        children: [
          {
            path: "github/",
            element: <GithubConfirmRoute />,
          },
          {
            path: "kakao/",
            element: <KakaoConfirmRoute />,
          },
        ],
      },
      {
        path: "llm/",
        element: <LLMRoute />,
      },
    ],
  },
]);

export default router;
