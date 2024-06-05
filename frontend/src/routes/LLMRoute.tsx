import { useQuery } from "@tanstack/react-query";
import { ISummaryLLM } from "../types";
import { summaryLLM } from "../api";
import TotalSpinner from "../components/TotalSpinner";
import LLM from "../components/LLM";

export default function LLMRoute() {
  const { isLoading, data } = useQuery<ISummaryLLM>({
    queryKey: ["summaryLLM"],
    queryFn: summaryLLM,
  });
  const url = data ? data.url : "";
  return <>{isLoading ? <TotalSpinner /> : <LLM url={url} />}</>;
}
