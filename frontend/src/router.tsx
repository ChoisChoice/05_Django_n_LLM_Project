import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import NotFoundRoute from "./routes/NotFoundRoute";
import HomeRoute from "./routes/HomeRoute";
import BoardsRoute from "./routes/BoardsRoute";
import BoardsDetailNCommentsRoute from "./routes/BoardsDetailNCommentsRoute";
import CommentsDetailRoute from "./routes/CommentsDetailRoute";
import GithubConfirmRoute from "./routes/GithubConfirmRoute";
import KakaoConfirmRoute from "./routes/KakaoConfirmRoute";
import LLMRoute from "./routes/LLMRoute";

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
        element: <BoardsRoute />, // 게시판
      },
      {
        path: "boards/:boardPk/",
        element: <BoardsDetailNCommentsRoute />, // 상세 게시글 & 댓글
      },
      {
        path: "boards/:boardPk/comments/:commentPk/",
        element: <CommentsDetailRoute />, // 상세 댓글
      },
      {
        path: "social/", // 소셜 로그인
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
        path: "llm/", // translation-summarization llm
        element: <LLMRoute />,
      },
    ],
  },
]);

export default router;
