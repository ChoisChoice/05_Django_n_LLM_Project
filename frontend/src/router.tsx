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
import BoardsUpdateRoute from "./routes/BoardsUpdateRoute";

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
            element: <BoardsRoute />, // 게시판
          },
          {
            path: "create/",
            element: <CreateBoardRoute />, // 게시글 생성
          },
        ],
      },
      {
        path: "boards/:boardPk/",
        children: [
          {
            path: "",
            element: <BoardsDetailRoute />, // 상세 게시글
          },
          {
            path: "update/",
            element: <BoardsUpdateRoute />, // 상세 게시글 생성
          },
        ],
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
