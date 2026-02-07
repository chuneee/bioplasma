// shared/message/MessageContext.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { registerMessage } from "./message";
import { MessageContainer } from "./MessageContainer";

export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [messages, setMessages] = useState<any[]>([]);

  const showMessage = (type: any, text: string) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, type, text }]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, 4000);
  };

  // 👇 AQUÍ MISMO
  useEffect(() => {
    registerMessage(showMessage);
  }, []);

  return (
    <>
      {children}
      <MessageContainer messages={messages} />
    </>
  );
};
