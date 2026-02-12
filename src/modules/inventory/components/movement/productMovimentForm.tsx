import { ArrowDown, ArrowUp, Edit, X } from "lucide-react";
import { InventoryStockMovement } from "../../types/stock-moviment.type";
import { useForm } from "react-hook-form";
import { AlertErrorInput } from "../../../../components/ui/alert";
import { Product } from "../../types/product.type";
import { useEffect, useState } from "react";

interface ProductMovimentFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<InventoryStockMovement>) => void;
  productsList: Product[];
}

export const ProductMovimentFormModal = ({
  open,
  onClose,
  onSubmit,
  productsList,
}: ProductMovimentFormModalProps) => {
  if (!open) return null;
  const [productos, setProductos] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    setProductos(productsList);
  }, [productsList]);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<Partial<InventoryStockMovement>>();

  const tipoMovimiento = watch("type", "ENTRADA");
  const cantidad = watch("quantity");

  // Función para calcular el nuevo stock
  const calcularNuevoStock = () => {
    if (!selectedProduct) return 0;

    const stockActual = selectedProduct.stockInfo.quantity;
    const cantidadMovimiento = Number(cantidad) || 0;

    switch (tipoMovimiento) {
      case "ENTRADA":
        return Number(stockActual) + Number(cantidadMovimiento);
      case "SALIDA":
        return Number(stockActual) - Number(cantidadMovimiento);
      case "AJUSTE":
        return cantidadMovimiento; // Para ajuste, la cantidad es el nuevo stock total
      default:
        return stockActual;
    }
  };

  const handleClose = () => {
    onClose();
    reset();
    setSelectedProduct(null);
  };

  const onFinish = (data: Partial<InventoryStockMovement>) => {
    onSubmit?.({ ...data, type: tipoMovimiento });
    handleClose();
  };

  const handleProductChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const productId = e.target.value;
    const product = productos.find((p) => p.id === productId) || null;
    setSelectedProduct(product);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Cormorant_Garamond']">Registrar Movimiento</h2>
          <button
            type="button"
            onClick={handleClose}
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Tipo de Movimiento */}
          <div>
            <label className="block mb-3" style={{ fontWeight: 600 }}>
              Tipo de Movimiento *
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setValue("type", "ENTRADA")}
                type="button"
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  tipoMovimiento === "ENTRADA"
                    ? "border-green-500 bg-green-50"
                    : "border-[var(--color-border)] hover:border-green-300"
                }`}
              >
                <ArrowUp
                  className={`mx-auto mb-2 ${tipoMovimiento === "ENTRADA" ? "text-green-600" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div
                  style={{ fontWeight: 600 }}
                  className={
                    tipoMovimiento === "ENTRADA" ? "text-green-600" : ""
                  }
                >
                  Entrada
                </div>
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "SALIDA")}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  tipoMovimiento === "SALIDA"
                    ? "border-red-500 bg-red-50"
                    : "border-[var(--color-border)] hover:border-red-300"
                }`}
              >
                <ArrowDown
                  className={`mx-auto mb-2 ${tipoMovimiento === "SALIDA" ? "text-red-600" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div
                  style={{ fontWeight: 600 }}
                  className={tipoMovimiento === "SALIDA" ? "text-red-600" : ""}
                >
                  Salida
                </div>
              </button>
              <button
                type="button"
                onClick={() => setValue("type", "AJUSTE")}
                className={`flex-1 p-4 border-2 rounded-lg transition-all ${
                  tipoMovimiento === "AJUSTE"
                    ? "border-gray-500 bg-gray-50"
                    : "border-[var(--color-border)] hover:border-gray-300"
                }`}
              >
                <Edit
                  className={`mx-auto mb-2 ${tipoMovimiento === "AJUSTE" ? "text-gray-600" : "text-[var(--color-text-secondary)]"}`}
                  size={24}
                />
                <div
                  style={{ fontWeight: 600 }}
                  className={tipoMovimiento === "AJUSTE" ? "text-gray-600" : ""}
                >
                  Ajuste
                </div>
              </button>
            </div>
          </div>

          {/* Producto */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Producto *
            </label>
            <select
              {...register("product", {
                required: "Este campo es requerido",
                onChange: handleProductChange,
              })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="">Seleccionar producto...</option>
              {productos.map((producto) => (
                <option key={producto.id} value={producto.id}>
                  {producto.sku} - {producto.name}
                </option>
              ))}
            </select>
            {errors.product && (
              <AlertErrorInput
                message={errors.product.message || "Error en el campo"}
              />
            )}
          </div>

          {/* Cantidad */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Cantidad *
            </label>
            <div className="flex gap-3">
              <input
                {...register("quantity", {
                  valueAsNumber: true,
                  required: "Este campo es requerido",
                  min: {
                    value: 1,
                    message: "La cantidad debe ser mayor a 0",
                  },
                  max: {
                    value:
                      tipoMovimiento === "SALIDA" && selectedProduct
                        ? Number(selectedProduct.stockInfo.quantity)
                        : 1,
                    message: "La cantidad no puede ser mayor al stock actual",
                  },
                })}
                type="number"
                min="0"
                step="1"
                className="flex-1 px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="0"
              />
              <div className="px-4 py-2.5 bg-[#F5F2EF] rounded-lg flex items-center text-[var(--color-text-secondary)]">
                {selectedProduct ? selectedProduct.unit : "U"}
              </div>
            </div>
            {errors.quantity && (
              <AlertErrorInput
                message={errors.quantity.message || "Error en el campo"}
              />
            )}
            <div className="mt-2 p-3 bg-[#F5F2EF] rounded-lg">
              <div
                className="flex items-center justify-between text-[var(--color-text-secondary)]"
                style={{ fontSize: "14px" }}
              >
                <span>
                  Stock actual:{" "}
                  {selectedProduct ? selectedProduct.stockInfo.quantity : 0}
                </span>
                <span>→</span>
                <span
                  style={{ fontWeight: 600 }}
                  className="text-[var(--color-text)]"
                >
                  Nuevo stock: {calcularNuevoStock()}
                </span>
              </div>
            </div>
          </div>

          {/* Fecha */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Fecha del movimiento
            </label>
            <input
              {...register("movementDate", {
                required: "Este campo es requerido",
              })}
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            />
            {errors.movementDate && (
              <AlertErrorInput
                message={errors.movementDate.message || "Error en el campo"}
              />
            )}
          </div>

          {/* Motivo */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Motivo *
            </label>
            <select
              {...register("reason", {
                required: "Este campo es requerido",
              })}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
            >
              {tipoMovimiento === "ENTRADA" ? (
                <>
                  <option value="">Seleccionar motivo...</option>
                  <option value="compra">Compra a proveedor</option>
                  <option value="devolucion">Devolución de servicio</option>
                  <option value="ajuste">Ajuste de inventario</option>
                  <option value="otro">Otro</option>
                </>
              ) : (
                <>
                  <option value="">Seleccionar motivo...</option>
                  <option value="servicio">Uso en servicio</option>
                  <option value="danado">Producto dañado/caducado</option>
                  <option value="venta">Venta directa</option>
                  <option value="ajuste">Ajuste de inventario</option>
                  <option value="otro">Otro</option>
                </>
              )}
            </select>
            {errors.reason && (
              <AlertErrorInput
                message={errors.reason.message || "Error en el campo"}
              />
            )}
          </div>

          {/* Notas */}
          <div>
            <label className="block mb-2" style={{ fontWeight: 600 }}>
              Notas
            </label>
            <textarea
              {...register("notes")}
              rows={3}
              className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
              placeholder="Detalles adicionales, número de factura..."
            />
          </div>

          {tipoMovimiento === "ENTRADA" && (
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Costo (para actualizar promedio) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                  $
                </span>
                <input
                  {...register("cost", {
                    valueAsNumber: true,
                    required:
                      "Este campo es requerido para movimientos de entrada",
                  })}
                  type="number"
                  step="0.01"
                  min="0"
                  className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="0.00"
                />
              </div>
              {errors.cost && (
                <AlertErrorInput
                  message={errors.cost.message || "Error en el campo"}
                />
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Registrar Movimiento
          </button>
        </div>
      </form>
    </div>
  );
};
