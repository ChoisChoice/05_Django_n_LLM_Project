import ChatScreen from "../components/Chat";

export default function ChatLLMPage() {
  return <ChatScreen />;
}

// export default function ChatLLMPage() {
//   const { isLoading, data } = useQuery<ISummary[]>({
//     queryKey: ["models/summary-news"],
//     // queryFn: chatLLM,
//   });
//   return <>{isLoading ? <TotalSpinner /> : <ChatScreen />} </>;
// }
