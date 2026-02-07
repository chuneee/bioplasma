import { CircleCheck, Info, OctagonX, TriangleAlert } from "lucide-react";

// shared/message/MessageContainer.tsx
interface Props {
  messages: {
    id: number;
    type: string;
    text: string;
  }[];
}

const MessageRoot = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="fixed bottom-20 right-4 space-y-2 z-50">{children}</div>
  );
};
const MessageItem = ({ type, text }: { type: string; text: string }) => {
  const Icon = (props: { size: number }) => {
    switch (type) {
      case "success":
        return <CircleCheck color="var(--color-success)" {...props} />;
      case "error":
        return <OctagonX color="var(--color-error)" {...props} />;
      case "warning":
        return <TriangleAlert color="var(--color-warning)" {...props} />;
      case "info":
        return <Info color="var(--color-info)" {...props} />;
      default:
        return null;
    }
  };

  const textColor = {
    success: "var(--color-success)",
    error: "var(--color-error)",
    warning: "var(--color-warning)",
    info: "var(--color-info)",
  }[type];

  const bgColor = {
    success: "var(--color-green-100)",
    error: "var(--color-red-100)",
    warning: "var(--color-amber-100)",
    info: "var(--color-blue-100)",
  }[type];

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        fontSize: 14,
        backgroundColor: bgColor,
        maxWidth: 300,
        minWidth: 200,
      }}
      className="p-3 bg-[var(--color-bg)] rounded shadow-md border border-[var(--color-border)] items-center"
    >
      <Icon size={20} />
      <span style={{ display: "block", color: textColor }}>{text}</span>
    </div>
  );
};

export const MessageContainer = ({ messages }: Props) => {
  return (
    <MessageRoot>
      <div>
        {messages.map((msg) => (
          <MessageItem key={msg.id} type={msg.type} text={msg.text} />
        ))}
      </div>
    </MessageRoot>
  );
};
