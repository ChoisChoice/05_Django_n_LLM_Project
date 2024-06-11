import instance from "./axios";
import Cookie from "js-cookie";
import { IURL, ITranslatedNewsLLM } from "../types";

// Original News
export const originalNews = ({ url }: IURL) =>
  instance
    .post(
      `/models/original-news/`,
      { url },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// Summarized News LLM
export const summarizedNewsLLM = ({ url }: IURL) =>
  instance
    .post(
      `/models/summarized-news/`,
      { url },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);

// Translated News LLM
export const translateddNewsLLM = ({ summarized_news }: ITranslatedNewsLLM) =>
  instance
    .post(
      `/models/translated-news/`,
      { summarized_news },
      {
        headers: {
          "X-CSRFToken": Cookie.get("csrftoken") || "",
        },
      }
    )
    .then((response) => response.data);
