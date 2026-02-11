import { AlertTriangle, Clock, Package, Wallet } from "lucide-react";
import { formatCurrency } from "../../../utils/utils";

interface CardsInfoProps {
  totalRegistros: number;
  stockBajo: number;
  porCaducar: number;
  valorTotal: number;
  setSelectedTab: (tab: string) => void;
}

export const CardsInfo = ({
  totalRegistros,
  stockBajo,
  porCaducar,
  valorTotal,
  setSelectedTab,
}: CardsInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-white rounded-xl border border-[var(--color-border)] p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-[#8B735515] flex items-center justify-center">
            <Package className="text-[var(--color-primary)]" size={24} />
          </div>
        </div>
        <div
          className="text-[var(--color-text)]"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {totalRegistros}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Productos registrados
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-amber-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedTab("bajo")}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-amber-100 flex items-center justify-center">
            <AlertTriangle className="text-amber-600" size={24} />
          </div>
        </div>
        <div
          className="text-amber-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {stockBajo}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Requieren reposición
        </div>
      </div>

      <div
        className="bg-white rounded-xl border border-red-200 p-5 cursor-pointer hover:shadow-md transition-shadow"
        onClick={() => setSelectedTab("por-caducar")}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
            <Clock className="text-red-600" size={24} />
          </div>
        </div>
        <div
          className="text-red-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {porCaducar}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Caducan en 30 días
        </div>
      </div>

      <div className="bg-white rounded-xl border border-green-200 p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
            <Wallet className="text-green-600" size={24} />
          </div>
        </div>
        <div
          className="text-green-600"
          style={{ fontSize: "28px", fontWeight: 700 }}
        >
          {formatCurrency(valorTotal)}
        </div>
        <div
          className="text-[var(--color-text-secondary)]"
          style={{ fontSize: "14px" }}
        >
          Valor total en stock
        </div>
      </div>
    </div>
  );
};
