export type PaymentMethod = {
  id: string;
  cash_payment: boolean;
  debit_card: boolean;
  credit_card: boolean;
  bank_transfer: boolean;
  card_commission: number | 0;
  createdAt: string;
  updatedAt: string;
};
