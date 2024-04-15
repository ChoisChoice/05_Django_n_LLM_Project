import axios from "axios";

const instance = axios.create({
  baseURL: "https://127.0.0.1:8000/api/v1/",
});

export const getBoards = () =>
  instance.get("boards/").then((response) => response.data);

export const getBoardsDetail = () =>
  instance.get("boards/${roomPk}").then((response) => response.data);
