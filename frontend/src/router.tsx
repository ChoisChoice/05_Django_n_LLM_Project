import { createBrowserRouter } from "react-router-dom";
import Root from "./components/Root";
import NotFoundPage from "./routes/NotFoundPage";
import HomePage from "./routes/HomePage";
import BoardsPage from "./routes/BoardsPage";
import BoardsDetailPage from "./routes/BoardsDetailPage";
import GithubConfirmPage from "./routes/GithubConfirmPage";
import KakaoConfirmPage from "./routes/KakaoConfirmPage";

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
            element: <GithubConfirmPage />,
          },
          {
            path: "kakao/",
            element: <KakaoConfirmPage />,
          },
        ],
      },
    ],
  },
]);

export default router;
