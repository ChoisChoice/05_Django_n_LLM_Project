import ChatScreen from "../components/Chat";

export default function ChatLLMRoute() {
  return <ChatScreen />;
}

// export default function ChatLLMPage() {
//   const { isLoading, data } = useQuery<ISummary[]>({
//     queryKey: ["models/summary-news"],
//     // queryFn: chatLLM,
//   });
//   return <>{isLoading ? <TotalSpinner /> : <ChatScreen />} </>;
// }
