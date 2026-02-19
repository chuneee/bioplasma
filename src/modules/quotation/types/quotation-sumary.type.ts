export type QuotationSummary = {
  pending: {
    count: number;
    totalValue: number;
  };
  closed: {
    count: number;
    totalValue: number;
  };
  conversionClosedRate: number;
  porcentChange: number;
};
