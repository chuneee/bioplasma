// shared/message/message.ts
let messageHandler: any;

export const registerMessage = (handler: any) => {
  messageHandler = handler;
};

export const message = {
  success: (text: string) => messageHandler("success", text),
  error: (text: string) => messageHandler("error", text),
  warning: (text: string) => messageHandler("warning", text),
  info: (text: string) => messageHandler("info", text),
};
