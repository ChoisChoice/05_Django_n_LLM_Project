import React, { useState, useEffect } from "react";
import Typewriter from "react-ts-typewriter";

////////////////////////////// 채팅 인터페이스 //////////////////////////////
interface Message {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  id?: number;
}

// ChatScreen: messages 배열과 currentTypingId 상태값을 유지
const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTypingId, setCurrentTypingId] = useState<number | null>(null);

  // handleSendMessage를 통해 메시지가 전달되면 사용자 메시지와 ai응답을 massages에 추가
  const handleSendMessage = (message: string) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: message, isUser: true },
      {
        text: `Your message is: "${message}"`,
        isUser: false,
        isTyping: true,
        id: Date.now(),
      },
    ]);
  };

  // 메시지가 완료되었을 때 호출
  const handleEndTyping = (id: number) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === id ? { ...msg, isTyping: false } : msg
      )
    );
    setCurrentTypingId(null);
  };

  // 다음으로 타이핑을 시작해야할 메시지를 찾아 있다면 해당 메시지 id를 currentTypingId로 설정
  useEffect(() => {
    if (currentTypingId === null) {
      const nextTypingMessage = messages.find(
        (msg) => !msg.isUser && msg.isTyping
      );
      if (nextTypingMessage) {
        setCurrentTypingId(nextTypingMessage.id || null);
      }
    }
  }, [messages, currentTypingId]);

  return (
    <div className="app">
      <div className="chat-box">
        <MessageList
          messages={messages}
          currentTypingId={currentTypingId}
          onEndTyping={handleEndTyping}
        />
        <MessageForm onSendMessage={handleSendMessage} />
      </div>
    </div>
  );
};

////////////////////////////// 채팅 리스트 //////////////////////////////
interface MessageListProps {
  messages: Message[];
  currentTypingId: number | null;
  onEndTyping: (id: number) => void;
}

// 채팅 리스트를 랜더링
const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentTypingId,
  onEndTyping,
}) => (
  <div className="messages-list">
    {messages.map((message, index) => (
      <Message
        key={index}
        {...message}
        onEndTyping={onEndTyping}
        currentTypingId={currentTypingId}
      />
    ))}
  </div>
);

////////////////////////////// 단일 메시지 //////////////////////////////
interface MessageProps extends Message {
  onEndTyping: (id: number) => void;
  currentTypingId: number | null;
}

const Message: React.FC<MessageProps> = ({
  text,
  isUser,
  isTyping,
  id,
  onEndTyping,
  currentTypingId,
}) => {
  useEffect(() => {
    if (!isUser && !isTyping && id === currentTypingId) {
      onEndTyping(id);
    }
  }, [isUser, isTyping, id, onEndTyping, currentTypingId]);

  return (
    <div className={isUser ? "user-message" : "ai-message"}>
      {isTyping && currentTypingId === id ? (
        <Typewriter text={text} onFinished={() => onEndTyping(id)} />
      ) : (
        <p>
          <b>{isUser ? "User" : "AI"}</b>: {text}
        </p>
      )}
    </div>
  );
};

////////////////////////////// 사용자 입력 메시지 //////////////////////////////
interface MessageFormProps {
  onSendMessage: (message: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSendMessage(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="message-form">
      <input
        type="text"
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        className="message-input"
      />
      <button type="submit" className="send-button">
        Send
      </button>
    </form>
  );
};

export default ChatScreen;
