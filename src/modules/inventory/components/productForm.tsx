import { Plus, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { Product } from "../types/product.type";
import { AlertErrorInput } from "../../../components/ui/alert";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { API_BASE_URL } from "../../../shared/api/axios";

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  currendProduct?: Product | null;
}

export const ProductFormModal = ({
  open,
  onClose,
  onSubmit,
  currendProduct,
}: ProductFormModalProps) => {
  if (!open) return null;
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<Partial<Product>>();
  const [imgPreview, setImgPreview] = useState<string | null>(null);

  useEffect(() => {
    if (currendProduct) {
      reset({
        name: currendProduct.name,
        brand: currendProduct.brand,
        sku: currendProduct.sku,
        category: currendProduct.category,
        description: currendProduct.description,
        unit: currendProduct.unit,
        stockInfo: {
          quantity: currendProduct.stockInfo.quantity,
          paymentStatus: currendProduct.stockInfo.paymentStatus,
        },
        stockMin: currendProduct.stockMin,
        costUnit: currendProduct.costUnit,
        salePrice: currendProduct.salePrice,
        location: currendProduct.location,
        hasExpiration: currendProduct.hasExpiration,
        expirationDate: currendProduct.expirationDate
          ? dayjs(currendProduct.expirationDate).format("YYYY-MM-DD")
          : undefined,
      });

      if (currendProduct.imagePath) {
        setImgPreview(`${API_BASE_URL}/${currendProduct.imagePath}`);
      }
    } else {
      reset();
    }
  }, [currendProduct]);

  // Observar el valor del checkbox en tiempo real
  const hasExpiration = watch("hasExpiration", false);

  const onFinish = (data: Partial<Product>) => {
    data.imagePath =
      data.imagePath instanceof FileList ? data.imagePath[0] : undefined;
    onSubmit?.(data);
    reset(); // Limpiar el formulario después de enviar
    setImgPreview(null); // Limpiar la vista previa de la imagen después de enviar
  };

  const handleClose = () => {
    onClose();
    reset(); // Limpiar el formulario al cerrar
    setImgPreview(null); // Limpiar la vista previa de la imagen al cerrar
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Cormorant_Garamond']">Nuevo Producto</h2>
          <button
            onClick={handleClose}
            type="button"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Sección 1: Información Básica */}
          <div>
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Información Básica
            </h3>
            <div className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 rounded-lg bg-[#F5F2EF] flex items-center justify-center border-2 border-dashed border-[var(--color-border)] cursor-pointer hover:border-[var(--color-primary)] transition-colors">
                  {imgPreview ? (
                    <img
                      src={imgPreview}
                      alt="Logo"
                      className="w-full h-full object-contain rounded-xl"
                    />
                  ) : (
                    <Plus
                      className="text-[var(--color-text-secondary)]"
                      size={32}
                    />
                  )}

                  <input
                    {...register("imagePath")}
                    type="file"
                    accept="image/jpeg, image/png, image/gpg"
                    style={{
                      position: "absolute",
                      width: "96px",
                      height: "96px",
                      opacity: 0,
                      cursor: "pointer",
                    }}
                    onChange={(value) => {
                      const file = value.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImgPreview(reader.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute w-24 h-24 opacity-0 cursor-pointer rounded-lg border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Nombre del producto *
                </label>
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Ej: Ácido Hialurónico 1ml"
                />
                {errors.name && (
                  <AlertErrorInput
                    message={errors.name.message || "Error en el campo"}
                  />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Marca *
                  </label>
                  <input
                    {...register("brand", {
                      required: "La marca es obligatoria",
                    })}
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Ej: Juvederm"
                  />
                  {errors.brand && (
                    <AlertErrorInput
                      message={errors.brand.message || "Error en el campo"}
                    />
                  )}
                </div>
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    SKU / Código *
                  </label>
                  <input
                    {...register("sku", {
                      required: "El SKU es obligatorio",
                    })}
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="INS-001"
                  />
                  {errors.sku && (
                    <AlertErrorInput
                      message={errors.sku.message || "Error en el campo"}
                    />
                  )}
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Categoría *
                </label>
                <select
                  {...register("category", {
                    required: "La categoría es obligatoria",
                  })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="insumo-medico">Insumo médico</option>
                  <option value="facial">Producto facial</option>
                  <option value="corporal">Producto corporal</option>
                  <option value="inyectable">Inyectable</option>
                  <option value="consumible">Consumible</option>
                  <option value="equipamiento">Equipamiento</option>
                </select>
              </div>
              {errors.category && (
                <AlertErrorInput
                  message={errors.category.message || "Error en el campo"}
                />
              )}

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Descripción del producto, especificaciones..."
                />
              </div>
            </div>
          </div>

          {/* Sección 2: Stock y Costos */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Stock y Costos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Stock inicial *
                </label>
                <input
                  {...register("stockInfo.quantity", {
                    required: "El stock inicial es obligatorio",
                    min: {
                      value: 1,
                      message: "El stock no puede ser negativo",
                    },
                  })}
                  type="number"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="0"
                />
                {errors.stockInfo?.quantity && (
                  <AlertErrorInput
                    message={
                      errors.stockInfo.quantity.message || "Error en el campo"
                    }
                  />
                )}
              </div>
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Unidad de medida *
                </label>
                <select
                  {...register("unit", {
                    required: "La unidad del stock es obligatoria",
                  })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                >
                  <option value="">Seleccionar...</option>
                  <option value="pzas">Piezas</option>
                  <option value="ml">Mililitros (ml)</option>
                  <option value="g">Gramos (g)</option>
                  <option value="cajas">Cajas</option>
                  <option value="sobres">Sobres</option>
                  <option value="ampolletas">Ampolletas</option>
                  <option value="frascos">Frascos</option>
                  <option value="kits">Kits</option>
                </select>
                {errors.unit && (
                  <AlertErrorInput
                    message={errors.unit.message || "Error en el campo"}
                  />
                )}
              </div>
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Stock mínimo (alerta) *
                </label>
                <input
                  {...register("stockMin", {
                    required: "El stock mínimo es obligatorio",
                  })}
                  type="number"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="5"
                />
                {errors.stockMin && (
                  <AlertErrorInput
                    message={errors.stockMin.message || "Error en el campo"}
                  />
                )}
                <p
                  className="text-[var(--color-text-secondary)] mt-1"
                  style={{ fontSize: "13px" }}
                >
                  Te alertaremos cuando llegue a este número
                </p>
              </div>
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Costo unitario *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                    $
                  </span>
                  <input
                    {...register("costUnit", {
                      required: "El costo unitario es obligatorio",
                    })}
                    type="number"
                    step="0.01"
                    className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                  />
                </div>
                {errors.costUnit && (
                  <AlertErrorInput
                    message={errors.costUnit.message || "Error en el campo"}
                  />
                )}
              </div>
              <div className="col-span-1">
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Precio de venta (si aplica)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary]">
                    $
                  </span>
                  <input
                    {...register("salePrice")}
                    type="number"
                    defaultValue={0}
                    step="0.01"
                    min={0}
                    className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="col-span-1">
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Pago a proveedo *
                </label>
                <select
                  {...register("stockInfo.paymentStatus", {})}
                  className="w-full pl-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  defaultValue="PENDIENTE"
                >
                  <option value="PENDIENTE">Pendiente</option>
                  <option value="PAGADO">Pagado</option>
                </select>
                {errors.stockInfo?.paymentStatus && (
                  <AlertErrorInput
                    message={
                      errors.stockInfo.paymentStatus.message ||
                      "Error en el campo"
                    }
                  />
                )}
              </div>
            </div>
          </div>

          {/* Sección 3: Caducidad */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Caducidad
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div style={{ fontWeight: 600 }}>
                    ¿Tiene fecha de caducidad?
                  </div>
                  <div
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "14px" }}
                  >
                    Para productos con vencimiento
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    {...register("hasExpiration")}
                    type="checkbox"
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                </label>
              </div>

              {hasExpiration && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Fecha de caducidad *
                    </label>
                    <input
                      {...register("expirationDate", {
                        required: hasExpiration
                          ? "La fecha de caducidad es obligatoria"
                          : false,
                      })}
                      type="date"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                    {errors.expirationDate && (
                      <AlertErrorInput
                        message={
                          errors.expirationDate.message || "Error en el campo"
                        }
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Alertar X días antes
                    </label>
                    <input
                      type="number"
                      defaultValue={30}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sección 4: Ubicación */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Ubicación (Opcional)
            </h3>
            <div>
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Ubicación en almacén
              </label>
              <input
                {...register("location")}
                type="text"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                placeholder="Ej: Estante A, Nivel 2"
              />
            </div>
          </div>
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
            Guardar Producto
          </button>
        </div>
      </form>
    </div>
  );
};
