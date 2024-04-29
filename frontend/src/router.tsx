import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import NotFoundPage from "./routes/NotFoundPage";
import HomePage from "./routes/HomePage";
import BoardsPage from "./routes/BoardsPage";
import BoardsDetailPage from "./routes/BoardsDetailPage";
import GithubConfirm from "./routes/GithubConfirm";
import KakaoConfirm from "./routes/KakaoConfirm";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <NotFoundPage />,
    children: [
      {
        path: "",
        element: <HomePage />,
      },
      {
        path: "boards/",
        element: <BoardsPage />,
      },
      {
        path: "boards/:boardPk/",
        element: <BoardsDetailPage />,
      },
      {
        path: "social",
        children: [
          {
            path: "github/",
            element: <GithubConfirm />,
          },
          {
            path: "kakao/",
            element: <KakaoConfirm />,
          },
        ],
      },
    ],
  },
]);

export default router;
