import { X, Trash2 } from "lucide-react";
import { Service } from "../types/service.type";
import { set, useForm } from "react-hook-form";
import { AlertErrorInput } from "../../../components/ui/alert";
import { ProductService } from "../../inventory/services/product.service";
import { ServicesService } from "../services/services.service";
import { message } from "../../../components/shared/message/message";
import { useEffect, useState } from "react";
import { Product } from "../../inventory/types/product.type";
import dayjs from "dayjs";

interface ServiceFormModalProps {
  open: boolean;
  onClose: () => void;
  currentService?: Service | null;
  servicesList?: Service[]; // Lista completa de servicios para validaciones
  onSubmit: (serviceData: Partial<Service>) => void;
  isCopy?: boolean; // Nuevo prop para indicar si es una copia
}

// Tipo para manejar supplies temporalmente en el formulario
interface SupplyFormItem {
  product: string; // UUID del producto
  quantity: number;
  productName?: string; // Solo para mostrar en UI
  productSku?: string; // Solo para mostrar en UI
  unit?: string; // Solo para mostrar en UI
}

// Tipo para manejar servicios en paquetes
interface PackageServiceItem {
  service: string; // UUID del servicio
  serviceName?: string; // Solo para mostrar en UI
  servicePrice?: number; // Solo para mostrar en UI
}

export const ServiceFormModal = ({
  open,
  onClose,
  currentService,
  onSubmit,
  isCopy = false,
  servicesList = [],
}: ServiceFormModalProps) => {
  if (!open) return null;

  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>(servicesList);
  const [supplies, setSupplies] = useState<SupplyFormItem[]>([]);
  const [packageServices, setPackageServices] = useState<PackageServiceItem[]>(
    [],
  );
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("");

  const [isPaquete, setIsPaquete] = useState<boolean>(
    currentService?.type === "PAQUETE" || false,
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<Partial<Service>>();

  const initData = async () => {
    try {
      const [productsResponse, servicesResponse] = await Promise.all([
        ProductService.getProducts(),
        ServicesService.getServicios(),
      ]);
      setProducts(productsResponse);
      setServices(servicesResponse);
    } catch (error) {
      console.error("Error al obtener datos:", error);
      message.error("No se pudieron cargar los datos. Intenta nuevamente.");
      onClose?.();
    }
  };

  const promoWatch = watch("promoPrice", 0);

  useEffect(() => {
    initData();
  }, []);

  useEffect(() => {
    // Si hay un servicio actual, cargar sus datos en el formulario
    if (currentService) {
      reset({
        name: currentService.name,
        description: currentService.description,
        shortDescription: currentService.shortDescription,
        category: currentService.category,
        price: currentService.price,
        promoPrice: currentService.promoPrice,
        durationMinutes: currentService.durationMinutes,
        notes: currentService.notes,
        promoEndAt: currentService.promoEndAt
          ? dayjs(currentService.promoEndAt).format("YYYY-MM-DD")
          : undefined,
      });
      setIsPaquete(currentService.type === "PAQUETE");
    } else {
      reset();
      setIsPaquete(false);
    }
  }, [currentService, reset]);

  // Cargar supplies existentes si se está editando un servicio único
  useEffect(() => {
    if (currentService && currentService.type !== "PAQUETE") {
      if (currentService.supplies && currentService.supplies.length > 0) {
        const existingSupplies = currentService.supplies
          .filter((supply) => supply?.product)
          .map((supply) => {
            const productId =
              typeof supply.product === "string"
                ? supply.product
                : supply.product?.id;
            const productName =
              typeof supply.product === "object" && supply.product?.name
                ? supply.product.name
                : undefined;
            const productSku =
              typeof supply.product === "object" && supply.product?.sku
                ? supply.product.sku
                : undefined;

            const unit =
              typeof supply.product === "object" && supply.product?.unit
                ? supply.product.unit
                : undefined;

            return {
              product: productId,
              quantity: parseFloat(supply.quantity),
              productName,
              productSku,
              unit,
            };
          })
          .filter((supply) => supply.product);

        setSupplies(existingSupplies);
      } else {
        setSupplies([]);
      }
      setPackageServices([]);
    }
    // Cargar servicios incluidos si se está editando un paquete
    else if (currentService && currentService.type === "PAQUETE") {
      if (
        currentService.packageItems &&
        currentService.packageItems.length > 0
      ) {
        const existingPackageServices = currentService.packageItems
          .filter((item) => item?.service)
          .map((item) => {
            const serviceId =
              typeof item.service === "string"
                ? item.service
                : item.service?.id;
            const serviceName =
              typeof item.service === "object" && item.service?.name
                ? item.service.name
                : undefined;
            const servicePrice =
              typeof item.service === "object" && item.service?.price
                ? item.service.price
                : undefined;

            return {
              service: serviceId,
              serviceName,
              servicePrice,
            };
          })
          .filter((item) => item.service);

        setPackageServices(existingPackageServices);
      } else {
        setPackageServices([]);
      }
      setSupplies([]);
    } else {
      setSupplies([]);
      setPackageServices([]);
    }
  }, [currentService]);

  const handleAddSupply = () => {
    if (!selectedProductId || !quantity || parseFloat(quantity) <= 0) {
      message.error("Selecciona un producto y una cantidad válida");
      return;
    }

    const product = products.find((p) => p.id === selectedProductId);
    if (!product) {
      message.error("Producto no encontrado");
      return;
    }

    if (supplies.some((s) => s.product === selectedProductId)) {
      message.error("Este producto ya está agregado");
      return;
    }

    const newSupply: SupplyFormItem = {
      product: selectedProductId,
      quantity: parseFloat(quantity),
      productName: product.name,
      productSku: product.sku,
    };

    setSupplies([...supplies, newSupply]);
    setSelectedProductId("");
    setQuantity("");
  };

  const handleAddPackageService = () => {
    if (!selectedServiceId) {
      message.error("Selecciona un servicio");
      return;
    }

    const service = services.find((s) => s.id === selectedServiceId);
    if (!service) {
      message.error("Servicio no encontrado");
      return;
    }

    // No permitir agregar el mismo servicio que se está editando
    if (currentService && service.id === currentService.id) {
      message.warning("No puedes agregar el paquete a sí mismo");
      return;
    }

    // No permitir agregar otros paquetes
    if (service.type === "PAQUETE") {
      message.warning("No puedes agregar un paquete dentro de otro paquete");
      return;
    }

    if (packageServices.some((s) => s.service === selectedServiceId)) {
      message.warning("Este servicio ya está agregado");
      return;
    }

    const newPackageService: PackageServiceItem = {
      service: selectedServiceId,
      serviceName: service.name,
      servicePrice: service.price,
    };

    setPackageServices([...packageServices, newPackageService]);
    setSelectedServiceId("");
  };

  const handleRemoveSupply = (productId: string) => {
    setSupplies(supplies.filter((s) => s.product !== productId));
  };

  const handleRemovePackageService = (serviceId: string) => {
    setPackageServices(packageServices.filter((s) => s.service !== serviceId));
  };

  const onFinish = (serviceData: Partial<Service>) => {
    let finalData: Partial<Service>;

    if (isPaquete) {
      // Para paquetes, enviamos packageItems
      const packageItemsData = packageServices.map((item) => item.service);

      finalData = {
        ...serviceData,
        packageItems: packageItemsData as any,
        supplies: [], // Los paquetes no tienen supplies
      };
    } else {
      // Para servicios únicos, enviamos supplies
      const suppliesData = supplies.map((supply) => ({
        product: supply.product,
        quantity: supply.quantity,
      }));

      finalData = {
        ...serviceData,
        supplies: suppliesData as any,
      };
    }

    onSubmit(finalData);
    onClose();
  };

  const handleCancel = () => {
    onClose?.();
    reset();
    setSupplies([]);
    setPackageServices([]);
    setSelectedProductId("");
    setSelectedServiceId("");
    setQuantity("");
    setIsPaquete(false);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value;
    setValue("category", newCategory);
    const isPackage = newCategory === "paquete";
    setIsPaquete(isPackage);

    // Limpiar los items al cambiar de tipo
    if (isPackage) {
      setSupplies([]);
    } else {
      setPackageServices([]);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
          <h2 className="font-['Cormorant_Garamond']">
            {currentService
              ? "Editar Servicio"
              : isCopy
                ? "Duplicar Servicio"
                : "Nuevo Servicio"}
          </h2>
          <button
            type="button"
            onClick={handleCancel}
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
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Nombre del servicio *
                </label>
                <input
                  {...register("name", {
                    required: "El nombre es obligatorio",
                  })}
                  type="text"
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Ej: Limpieza Facial Profunda"
                  defaultValue={currentService?.name}
                />
                {errors.name && (
                  <AlertErrorInput message={errors.name.message || ""} />
                )}
              </div>

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Categoría *
                </label>
                <select
                  {...register("category", {
                    required: "La categoría es obligatoria",
                    onChange: handleCategoryChange,
                  })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  defaultValue={currentService?.category}
                >
                  <option value="">Seleccionar categoría...</option>
                  <option value="facial">Facial</option>
                  <option value="corporal">Corporal</option>
                  <option value="inyectable">Inyectable</option>
                  <option value="laser">Láser</option>
                  <option value="paquete">Paquete</option>
                  <option value="otro">Otro</option>
                </select>
                {errors.category && (
                  <AlertErrorInput message={errors.category.message || ""} />
                )}
              </div>

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Descripción
                </label>
                <textarea
                  {...register("description")}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                  placeholder="Describe el servicio, beneficios y qué incluye..."
                  defaultValue={currentService?.description}
                />
                <div
                  className="text-right text-[var(--color-text-secondary)] mt-1"
                  style={{ fontSize: "12px" }}
                >
                  0 / 500 caracteres
                </div>
              </div>

              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Descripción corta (para listados)
                </label>
                <input
                  {...register("shortDescription")}
                  type="text"
                  maxLength={100}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  placeholder="Descripción breve"
                  defaultValue={currentService?.shortDescription}
                />
                <div
                  className="text-right text-[var(--color-text-secondary)] mt-1"
                  style={{ fontSize: "12px" }}
                >
                  0 / 100 caracteres
                </div>
              </div>
            </div>
          </div>

          {/* Sección 2: Tiempo y Precio */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              Tiempo y Precio
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Duración estimada *
                </label>
                <select
                  {...register("durationMinutes", {
                    required: "La duración es obligatoria",
                  })}
                  className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  defaultValue={currentService?.durationMinutes}
                >
                  <option value="15">15 minutos</option>
                  <option value="30">30 minutos</option>
                  <option value="45">45 minutos</option>
                  <option value="60">1 hora</option>
                  <option value="90">1.5 horas</option>
                  <option value="120">2 horas</option>
                </select>

                {errors.durationMinutes && (
                  <AlertErrorInput
                    message={errors.durationMinutes.message || ""}
                  />
                )}
              </div>
              <div>
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Precio regular *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                    $
                  </span>
                  <input
                    {...register("price", {
                      min: {
                        value: 0,
                        message: "El precio no puede ser negativo",
                      },
                      required: "El precio es obligatorio",
                    })}
                    min={0}
                    type="number"
                    className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                    defaultValue={currentService?.price}
                  />
                </div>
                {errors.price && (
                  <AlertErrorInput message={errors.price.message || ""} />
                )}
              </div>
              <div className="col-span-2">
                <label className="block mb-2" style={{ fontWeight: 600 }}>
                  Precio promocional (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
                    $
                  </span>
                  <input
                    {...register("promoPrice")}
                    type="number"
                    className="w-full pl-8 pr-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="0.00"
                    defaultValue={currentService?.promoPrice}
                  />
                </div>
              </div>
              {Number(promoWatch) > 0 && (
                <div className="col-span-2">
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Fecha de fin de promoción
                  </label>
                  <input
                    {...register("promoEndAt", {
                      required:
                        Number(promoWatch) > 0
                          ? "Este campo es requerido"
                          : false,
                    })}
                    type="date"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                  />
                  {errors.promoEndAt && (
                    <AlertErrorInput
                      message={errors.promoEndAt.message || "Error en el campo"}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Sección 3: Insumos o Servicios según el tipo */}
          <div className="border-t border-[var(--color-border)] pt-6">
            <h3 className="mb-4" style={{ fontWeight: 600 }}>
              {isPaquete ? "Servicios Incluidos" : "Insumos Asociados"}
            </h3>

            {isPaquete ? (
              // Sección para agregar servicios al paquete
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                    >
                      <option value="">Seleccionar servicio...</option>
                      {services
                        .filter(
                          (s) =>
                            s.type !== "PAQUETE" && s.id !== currentService?.id,
                        )
                        .map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.name} - ${service.price}
                          </option>
                        ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddPackageService}
                    className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                {/* Lista de servicios agregados */}
                {packageServices.length > 0 ? (
                  <div className="bg-[#F5F2EF] rounded-lg p-4 space-y-2">
                    {packageServices.map((item) => (
                      <div
                        key={item.service}
                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <div style={{ fontWeight: 600 }}>
                            {item.serviceName}
                          </div>
                          <div
                            className="text-[var(--color-text-secondary)]"
                            style={{ fontSize: "14px" }}
                          >
                            Precio: ${item.servicePrice}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            handleRemovePackageService(item.service)
                          }
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                    <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
                      <div className="flex justify-between items-center">
                        <span style={{ fontWeight: 600 }}>
                          Total de servicios:
                        </span>
                        <span style={{ fontWeight: 600 }}>
                          $
                          {Number(
                            packageServices.reduce(
                              (sum, item) =>
                                sum + (Number(item.servicePrice) || 0),
                              0,
                            ),
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#F5F2EF] rounded-lg p-4">
                    <p
                      className="text-[var(--color-text-secondary)] text-center"
                      style={{ fontSize: "14px" }}
                    >
                      No hay servicios agregados al paquete
                    </p>
                  </div>
                )}
              </div>
            ) : (
              // Sección para agregar insumos (productos) al servicio único
              <div className="space-y-3">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <select
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                    >
                      <option value="">Seleccionar producto...</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.sku} - {product.name} - {product.unit}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-32">
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                      placeholder="Cantidad"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleAddSupply}
                    className="px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
                  >
                    Agregar
                  </button>
                </div>

                {/* Lista de supplies agregados */}
                {supplies.length > 0 ? (
                  <div className="bg-[#F5F2EF] rounded-lg p-4 space-y-2">
                    {supplies.map((supply) => (
                      <div
                        key={supply.product}
                        className="flex items-center justify-between bg-white p-3 rounded-lg"
                      >
                        <div className="flex-1">
                          <div style={{ fontWeight: 600 }}>
                            {supply.productSku} - {supply.productName}
                          </div>
                          <div
                            className="text-[var(--color-text-secondary)]"
                            style={{ fontSize: "14px" }}
                          >
                            Cantidad: {supply.quantity}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSupply(supply.product)}
                          className="text-red-500 hover:text-red-700 transition-colors p-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-[#F5F2EF] rounded-lg p-4">
                    <p
                      className="text-[var(--color-text-secondary)] text-center"
                      style={{ fontSize: "14px" }}
                    >
                      No hay insumos agregados
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="border-t border-[var(--color-border)] pt-6 mt-6">
              <label className="block mb-2" style={{ fontWeight: 600 }}>
                Notas internas
              </label>
              <textarea
                {...register("notes")}
                rows={3}
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                placeholder="Notas para el personal, preparación necesaria..."
                defaultValue={currentService?.notes}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Guardar {isPaquete ? "Paquete" : "Servicio"}
          </button>
        </div>
      </form>
    </div>
  );
};
