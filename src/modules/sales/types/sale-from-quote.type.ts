import { paymentMethods } from "./sale.type";

export type SaleFromQuote = {
  quoteId: number;
  paymentMethod: paymentMethods;
  applyAppointment: boolean;

  items: SaleFromQuoteItem[];
};

export type SaleFromQuoteItem = {
  serviceId: string;
  date: string;
  time: string;
  duration: number;
};
