import {
  Box,
  Button,
  FormControl,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import Typewriter from "react-ts-typewriter";

////////////////////////////// 채팅 인터페이스 //////////////////////////////
interface MessageType {
  text: string;
  isUser: boolean;
  isTyping?: boolean;
  id?: number;
}

// ChatScreen: messages 배열과 currentTypingId 상태값을 유지
const ChatScreen: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([]);
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
    <Box className="app">
      <VStack className="chat-box" spacing={4}>
        <MessageList
          messages={messages}
          currentTypingId={currentTypingId}
          onEndTyping={handleEndTyping}
        />
        <MessageForm onSendMessage={handleSendMessage} />
      </VStack>
    </Box>
  );
};

////////////////////////////// 채팅 리스트 //////////////////////////////
interface MessageListProps {
  messages: MessageType[];
  currentTypingId: number | null;
  onEndTyping: (id: number) => void;
}

// 채팅 리스트를 랜더링
const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentTypingId,
  onEndTyping,
}) => (
  <VStack className="messages-list" spacing={3}>
    {messages.map((message, index) => (
      <Message
        key={index}
        {...message}
        onEndTyping={onEndTyping}
        currentTypingId={currentTypingId}
      />
    ))}
  </VStack>
);

////////////////////////////// 단일 메시지 //////////////////////////////
interface MessageProps extends MessageType {
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
      onEndTyping(id!);
    }
  }, [isUser, isTyping, id, onEndTyping, currentTypingId]);

  return (
    <Box className={isUser ? "user-message" : "ai-message"}>
      {isTyping && currentTypingId === id ? (
        <Typewriter text={text} onFinished={() => onEndTyping(id!)} />
      ) : (
        <Text>
          <b>{isUser ? "User" : "AI"}</b>: {text}
        </Text>
      )}
    </Box>
  );
};

////////////////////////////// 사용자 입력 메시지 //////////////////////////////
interface MessageFormProps {
  onSendMessage: (message: string) => void;
}

const MessageForm: React.FC<MessageFormProps> = ({ onSendMessage }) => {
  return (
    <Formik
      initialValues={{ message: "" }}
      onSubmit={(values, { resetForm }) => {
        onSendMessage(values.message);
        resetForm();
      }}
    >
      <Form className="message-form">
        <Field type="text" name="message" className="message-input" />
        <button type="submit" className="send-button">
          Send
        </button>
      </Form>
    </Formik>
  );
};

export default ChatScreen;
