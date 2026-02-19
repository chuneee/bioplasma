import { CheckCircle, FileText, Percent, TrendingUp } from "lucide-react";
import { formatCurrency } from "../../../utils/utils";
import { QuotationSummary } from "../types/quotation-sumary.type";
import { useEffect, useState } from "react";

interface SummaryCardsProps {
  dataSummary: QuotationSummary;
}

export const SummaryCards = ({ dataSummary }: SummaryCardsProps) => {
  const [summary, setSummary] = useState<QuotationSummary>(dataSummary);

  useEffect(() => {
    setSummary(dataSummary);
  }, [dataSummary]);

  const { pending, closed, conversionClosedRate, porcentChange } = summary;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
            <FileText className="text-[var(--color-primary)]" size={24} />
          </div>
        </div>
        <div
          className="text-[var(--color-text)]"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {pending?.count || 0}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Pendientes de cierre
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
            <TrendingUp className="text-blue-600" size={24} />
          </div>
        </div>
        <div
          className="text-blue-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {formatCurrency(pending?.totalValue || 0)}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Valor total pendiente
        </div>
      </div>

      <div className="bg-white rounded-xl border border-green-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <CheckCircle className="text-green-600" size={24} />
          </div>
        </div>
        <div
          className="text-green-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {closed?.count || 0}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Convertidas a venta
        </div>
        <div
          className="text-green-600 mt-1"
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          {formatCurrency(closed?.totalValue || 0)} facturados
        </div>
      </div>

      <div className="bg-white rounded-xl border border-green-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Percent className="text-green-600" size={24} />
          </div>
        </div>
        <div
          className="text-green-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {conversionClosedRate || 0}%
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Cotización → Venta
        </div>
        <div
          className="text-green-600 mt-1"
          style={{ fontSize: "13px", fontWeight: 600 }}
        >
          {porcentChange || 0}% vs mes anterior
        </div>
      </div>
    </div>
  );
};
