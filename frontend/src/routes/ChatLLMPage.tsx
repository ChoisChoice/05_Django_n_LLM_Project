import { useQuery } from "@tanstack/react-query";
import { ISummary } from "../types";
import { chatLLM } from "../api";
import TotalSpinner from "../components/TotalSpinner";
import ChatScreen from "../components/Chat";

export default function ChatLLMPage() {
  const { isLoading, data } = useQuery<ISummary[]>({
    queryKey: ["models/summary-news"],
    queryFn: chatLLM,
  });
  return <>{isLoading ? <TotalSpinner /> : <ChatScreen />} </>;
}
