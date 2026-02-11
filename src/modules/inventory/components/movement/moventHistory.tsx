import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "../../../../utils/utils";
import { Box, Clock, FileText } from "lucide-react";
import { StockMovementService } from "../../services/stock-movement.service";
import { message } from "../../../../components/shared/message/message";
import { InventoryStockMovement } from "../../types/stock-moviment.type";
import dayjs from "dayjs";

interface MovementHistoryProps {
  productId: string;
}

export const MovementHistory = ({ productId }: MovementHistoryProps) => {
  const [movementList, setMovementList] = useState<InventoryStockMovement[]>(
    [] as InventoryStockMovement[],
  );

  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response =
        await StockMovementService.getStockMovementsByProduct(productId);
      setMovementList(response);
    } catch (error) {
      console.error("Error fetching stock movements:", error);
      message.error("Error al cargar el historial de movimientos de stock.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span className="text-[var(--color-text-secondary)]">Cargando...</span>
      </div>
    );
  }

  const MovementItemOne = ({
    movement,
    key,
  }: {
    movement: InventoryStockMovement;
    key: number;
  }) => {
    return (
      <div key={movement.id} className="group relative flex gap-6 pl-4">
        {/* Timeline Line */}
        {key !== movementList.length - 1 && (
          <div className="absolute left-[19px] top-[28px] bottom-[-24px]  bg-[var(--color-primary)]" />
        )}

        {/* Date Indicator */}
        <div className="w-24 shrink-0 flex flex-col items-end pt-1">
          <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold">
            {dayjs(movement.createdAt).format("MMM YYYY")}
          </p>
          <strong
            style={{ fontFamily: "Cormorant Garamond", fontSize: "1.25rem" }}
            className="text-[var(--color-text)] leading-none mt-1"
          >
            {dayjs(movement.createdAt).format("D")}
          </strong>
        </div>

        {/* Timeline Dot */}
        <div
          className={`
           relative z-10 w-5 h-5 rounded-full mt-2 shrink-0 border-4 border-white shadow-sm
          ${movement.type === "ENTRADA" ? "bg-[var(--color-success)]" : "bg-[var(--color-error)]"}
        `}
        />

        {/* Content Card */}
        <div className="flex-1 rounded-xl p-6 border bg-[#FDFBF9] transition-all hover:shadow-md hover:-translate-y-0.5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`
                  text-xs font-semibold uppercase tracking-wide px-3 py-1 rounded-full
                  ${
                    movement.type === "ENTRADA"
                      ? "bg-green-100 text-green-600"
                      : "bg-red-50 text-red-600"
                  }
                `}
                >
                  {movement.type}
                </span>
                <span className="text-[var(--color-border)]">•</span>
                <span className="text-sm font-medium text-[var(--color-text-secondary)]">
                  {movement.createdBy.username}
                </span>
              </div>
              <h4 className="text-[var(--color-text)] font-semibold">
                {movement.type === "SALIDA"
                  ? "Uso en tratamiento"
                  : "Abastecimiento de inventario"}
              </h4>
            </div>
            {movement.cost !== undefined && movement.cost > 0 && (
              <div className="text-right">
                <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold mb-1">
                  Valor
                </p>
                <p className="text-[var(--color-secondary)] text-xl font-bold">
                  {formatCurrency(movement.cost)}
                </p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[var(--color-border)]">
            {/* Cantidad */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center">
                <Box size={18} className="text-[var(--color-primary)]" />
              </div>
              <div>
                <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold">
                  Cantidad
                </p>
                <p className="text-[var(--color-text)] font-semibold">
                  {movement.quantity > 0
                    ? `+${movement.quantity}`
                    : movement.quantity}{" "}
                  unidades
                </p>
              </div>
            </div>

            {/* Notas */}
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-white border border-[var(--color-border)] flex items-center justify-center">
                <FileText
                  size={18}
                  className="text-[var(--color-text-secondary)]"
                />
              </div>
              <div className="flex-1">
                <p className="text-[var(--color-text-secondary)] text-xs uppercase tracking-wide font-semibold">
                  Notas
                </p>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mt-1">
                  {movement.notes || "Sin notas"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-white rounded-xl border border-[var(--color-border)]">
      {/* Timeline de tratamientos */}
      <h2 className="text-[var(--color-text)] font-semibold mb-4">
        Historial de movimientos
      </h2>

      {movementList.length === 0 && (
        <div className="flex items-center justify-center h-32">
          <span className="text-[var(--color-text-secondary)]">
            No hay movimientos registrados para este producto.
          </span>
        </div>
      )}

      <div className="relative">
        {/* Línea vertical del timeline */}
        <div className="absolute left-4 top-0 bottom-0 w-1 rounded-full bg-[var(--color-primary)]"></div>

        <div className="space-y-6 ">
          {movementList.map((movimiento, index) => (
            <MovementItemOne key={index} movement={movimiento} />
          ))}
        </div>
      </div>
    </div>
  );
};
