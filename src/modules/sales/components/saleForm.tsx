import { useEffect, useRef, useState } from "react";
import {
  getMetodoPagoLabel,
  ItemSale,
  ItemVenta,
  payloadSales,
} from "../utils";
import {
  Banknote,
  Clock,
  CreditCard,
  DollarSign,
  Minus,
  Package,
  Plus,
  Smartphone,
  Sparkles,
  WalletCards,
  X,
} from "lucide-react";
import { formatCurrency } from "../../../utils/utils";
import { Patient } from "../../patients/types/patient.type";
import { Service } from "../../services/types/service.type";
import { Product } from "../../inventory/types/product.type";
import { message } from "../../../components/shared/message/message";
import { PatientService } from "../../patients/services/patient.service";
import { ServicesService } from "../../services/services/services.service";
import { ProductService } from "../../inventory/services/product.service";
import { set, useForm } from "react-hook-form";
import { paymentMethods, Sale, SaleStatus } from "../types/sale.type";
import dayjs from "dayjs";
import { categoriasConfig } from "../../services/utils/utils";
import {
  estadosConfig,
  getStatus,
  categoriasConfig as categoriaConfigProduct,
} from "../../inventory/utils/utils";
import { API_BASE_URL } from "../../../shared/api/axios";
import { AlertErrorInput } from "../../../components/ui/alert";
import { PaymentMethod } from "../../settings/types/payment-methods.type";
import { PaymentMethodService } from "../../settings/services/payment-method.service";

interface SaleFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (data: Partial<Sale>) => void;
}

type ItemQuotationWithPromo = ItemSale & { promoAplicada?: boolean };

export const SaleForm = ({ open, onClose, onSubmit }: SaleFormProps) => {
  if (!open) return null;
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Partial<Sale>>();

  //   Estados Para los datos iniciales
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);
  const [paymentMethodsConfig, setPaymentMethodsConfig] =
    useState<PaymentMethod>({} as PaymentMethod);

  const [showDropdownPaciente, setShowDropdownPaciente] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [initialStatus, setInitialStatus] = useState<SaleStatus>(
    SaleStatus.GUARDADA,
  );

  const initializeData = async () => {
    try {
      const [pacientesData, serviciosData, productosData, paymentMethodsData] =
        await Promise.all([
          PatientService.getPatients(),
          ServicesService.getServicios(),
          ProductService.getProducts(),
          PaymentMethodService.getPaymentMethods(),
        ]);
      setPacientes(pacientesData.filter((p) => p.isActive));
      setServicios(serviciosData.filter((s) => s.isActive));
      setProductos(productosData.filter((p) => Number(p.salePrice) > 0));
      setPaymentMethodsConfig(paymentMethodsData);
    } catch (error) {
      console.error("Error initializing sale form data:", error);
      message.error("Error al cargar datos para la venta. Intenta nuevamente.");
    }
  };

  useEffect(() => {
    initializeData();
  }, []);

  //   Estados para le manejo de los pacientes
  const [searchPaciente, setSearchPaciente] = useState("");
  const [pacienteSeleccionado, setPacienteSeleccionado] =
    useState<Patient | null>(null);

  const [selectPublicoGeneral, setSelectPublicoGeneral] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdownPaciente(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ESTADOS PARA MANEJAR LOS ITEMS DE LA VENTA
  const [typeItem, setTypeItem] = useState<"SERVICIO" | "PRODUCTO">("SERVICIO");
  const [searchServicioProducto, setSearchServicioProducto] = useState("");
  const [selectedItems, setSelectedItems] = useState<ItemQuotationWithPromo[]>(
    [],
  );
  const [aplicarDescuentoRecurrente, setAplicarDescuentoRecurrente] =
    useState(false);

  //   Estados para nueva venta
  const [descuentoActivo, setDescuentoActivo] = useState(false);
  const [descuentoTipo, setDescuentoTipo] = useState<"porcentaje" | "monto">(
    "porcentaje",
  );
  const [descuentoValor, setDescuentoValor] = useState(0);
  const [metodoPago, setMetodoPago] = useState<paymentMethods>("efectivo");
  const [montoRecibido, setMontoRecibido] = useState(0);

  const hanldeClose = () => {
    setSelectedItems([]);
    searchPaciente && setSearchPaciente("");
    setPacienteSeleccionado(null);
    setDescuentoActivo(false);
    setMetodoPago("efectivo");
    setMontoRecibido(0);
    onClose();
  };

  const eliminarItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const calcularSubtotalVenta = () => {
    return selectedItems.reduce((sum, item) => sum + item.subtotal, 0);
  };

  const calcularComisionTarjetaVenta = () => {
    if (
      (!paymentMethodsConfig?.credit_card &&
        !paymentMethodsConfig?.debit_card) ||
      !["tarjeta-credito", "tarjeta-debito"].includes(metodoPago)
    )
      return 0;
    const totalVenta = calcularTotalVenta();
    const comision = paymentMethodsConfig?.card_commission;

    return (
      (calcularTotalVenta() * (paymentMethodsConfig?.card_commission || 0)) /
      100
    );
  };

  const calcularDescuentoVenta = () => {
    if (!descuentoActivo) return 0;
    const subtotal = calcularSubtotalVenta();
    if (descuentoTipo === "porcentaje") {
      return (subtotal * descuentoValor) / 100;
    }
    return descuentoValor;
  };

  const calcularTotalVenta = () => {
    return calcularSubtotalVenta() - calcularDescuentoVenta();
  };

  const calcularCambio = () => {
    if (metodoPago === "efectivo" && montoRecibido > 0) {
      return montoRecibido - calcularTotalVenta();
    }
    return 0;
  };

  const subtotalSinDescuento = selectedItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );

  const descuentoRecurrente =
    aplicarDescuentoRecurrente && pacienteSeleccionado?.porcentDiscount
      ? (subtotalSinDescuento * Number(pacienteSeleccionado.porcentDiscount)) /
        100
      : 0;

  //   FUNCIONES DE PACIENTES:

  const handlePacienteSelect = (patient: Patient) => {
    setPacienteSeleccionado(patient);
    setSearchPaciente(patient.fullName);
    setShowDropdownPaciente(false);
    setValue("patient", patient.uuid as any);
    setValue("customerName", patient.fullName); // Guardar el nombre del cliente también
  };

  const filteredPatients = searchPaciente
    ? pacientes.filter(
        (patient) =>
          patient.fullName
            .toLowerCase()
            .includes(searchPaciente.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchPaciente.toLowerCase()) ||
          patient.principalPhoneNumber.includes(searchPaciente),
      )
    : pacientes.slice(0, 5);

  // FUNCIONES DE SERVICIOS Y PRODUCTOS:
  const onItemClick = (
    item: Service | Product,
    type: "SERVICIO" | "PRODUCTO",
    promo: number = 0,
    price: number,
  ) => {
    if (selectedItems.some((i) => i.id === item.id)) return;

    let Item: Service | Product;

    if (type === "SERVICIO") {
      Item = servicios.find((s) => s.id === item.id)!;
    } else {
      Item = productos.find((p) => p.id === item.id)!;
    }

    const promoEndAt =
      "type" in Item && "promoEndAt" in Item ? Item.promoEndAt : undefined;

    // Determina si la promo está vigente
    const promoVigente = Boolean(
      promo > 0 && promoEndAt && dayjs(promoEndAt).isAfter(dayjs()),
    );

    const nuevoItem: ItemQuotationWithPromo = {
      id: Item.id,
      name: Item.name,
      type: type,
      promoEndAt: promoEndAt,
      description: Item.description,
      quantity: 1,
      price: price,
      promoPrice: promo,
      subtotal: (promoVigente ? promo : price) * 1,
      promoAplicada: promoVigente,
    };

    setSelectedItems((prev) => [...prev, nuevoItem]);
  };

  const onSelectMetodoPago = (metodo: paymentMethods) => {
    setMetodoPago(metodo);
    setValue("paymentMethod", metodo);
  };

  const FormHeader = () => {
    return (
      <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="font-['Cormorant_Garamond']">Nueva Venta</h2>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Folio: VTA-2025-0157 • {new Date().toLocaleString("es-MX")}
          </p>
        </div>
        <button
          onClick={hanldeClose}
          className="text-[var(--color-text-secondary)] hover:text-[var(--color-text)] transition-colors"
        >
          <X size={24} />
        </button>
      </div>
    );
  };

  const PatientCard = ({ paciente }: { paciente: Patient }) => {
    return (
      <div
        key={paciente.uuid}
        onClick={() => handlePacienteSelect(paciente)}
        className="px-4 py-3 hover:bg-[#F5F2EF] cursor-pointer border-b border-[var(--color-border)] last:border-b-0"
      >
        <div className="font-medium text-[var(--color-text)]">
          {paciente.fullName}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)] mt-1">
          {paciente.email} • {paciente.principalPhoneNumber}
        </div>
      </div>
    );
  };

  const DropDownPatientResult = ({
    open,
    pacientes,
  }: {
    open: boolean;
    pacientes: Patient[];
  }) => {
    if (!open) return null;

    return (
      <div
        ref={dropdownRef}
        style={{ maxHeight: "300px" }}
        className="relative mt-1 bg-white border border-[var(--color-border)] rounded-lg shadow-lg  overflow-y-auto"
      >
        {pacientes.map((patient) => (
          <PatientCard key={patient.uuid} paciente={patient} />
        ))}
      </div>
    );
  };

  const ServicesOptionCard = ({ servicio }: { servicio: Service }) => {
    return (
      <div
        key={servicio.id}
        className="bg-white rounded-xl border transition-all hover:shadow-lg"
        onClick={() =>
          onItemClick(
            servicio,
            typeItem,
            Number(servicio.promoPrice),
            Number(servicio.price),
          )
        }
      >
        <div className="p-5 border-b border-[var(--color-border)]">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              {servicio.type === "PAQUETE" && (
                <Package size={18} className="text-[#9D6FD8]" />
              )}
              <span
                className="px-2 py-1 rounded-full"
                style={{
                  fontSize: "12px",
                  fontWeight: 500,
                  backgroundColor:
                    categoriasConfig[
                      servicio.category as keyof typeof categoriasConfig
                    ]?.bgColor || "#E0E0E0",
                  color:
                    categoriasConfig[
                      servicio.category as keyof typeof categoriasConfig
                    ]?.color || "#333",
                }}
              >
                {categoriasConfig[
                  servicio.category as keyof typeof categoriasConfig
                ]?.label || servicio.category}
              </span>
            </div>
            <div
              className={`w-2 h-2 rounded-full ${
                selectedItems.some((item) => item.id === servicio.id)
                  ? "bg-[var(--color-success)]"
                  : "bg-[var(--color-text-secondary)]"
              }`}
            />
          </div>
          <h5 className="mb-2" style={{ fontWeight: 600 }}>
            {servicio.name}
          </h5>
          {servicio.description && (
            <p
              className="text-[var(--color-text-secondary)] line-clamp-2"
              style={{ fontSize: "12px" }}
            >
              {servicio.shortDescription}
            </p>
          )}
        </div>
        <div className="p-5 space-y-3">
          <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
            <Clock size={16} />
            <span style={{ fontSize: "14px" }}>
              {servicio.durationMinutes} minutos
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <DollarSign
              size={16}
              className="text-[var(--color-text-secondary)]"
            />
            {Number(servicio.promoPrice) > 0 ? (
              <>
                <span
                  className="text-[var(--color-text-secondary)] line-through"
                  style={{ fontSize: "14px" }}
                >
                  {formatCurrency(Number(servicio.price))}
                </span>
                <span
                  className="text-[var(--color-secondary)]"
                  style={{
                    fontSize: "20px",
                    fontWeight: 700,
                  }}
                >
                  {formatCurrency(Number(servicio.promoPrice))}
                </span>
              </>
            ) : (
              <span
                className="text-[var(--color-secondary)]"
                style={{
                  fontSize: "20px",
                  fontWeight: 700,
                }}
              >
                {formatCurrency(Number(servicio.price))}
              </span>
            )}
          </div>
        </div>
      </div>
    );
  };

  const ProductsOptionCard = ({ producto }: { producto: Product }) => {
    const status = getStatus(producto);
    const estado = estadosConfig[status];
    const categoria = categoriaConfigProduct[producto.category];

    return (
      <div
        key={producto.id}
        className="bg-white rounded-xl border transition-all hover:shadow-lg"
        onClick={() =>
          onItemClick(producto, typeItem, 0, Number(producto.salePrice))
        }
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex w-full lg:w-80  flex-col gap-4">
            <div className="relative w-full h-24 bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] flex items-center justify-center overflow-hidden">
              {producto.imagePath ? (
                <img
                  src={`${API_BASE_URL}/${producto.imagePath}`}
                  alt={producto.name}
                  className="w-full h-full object-contain p-2"
                />
              ) : (
                <Package
                  size={64}
                  className="text-[var(--color-text-secondary)]"
                />
              )}
              <div
                className={`absolute top-6 right-3  w-2 h-2 rounded-full ${
                  selectedItems.some((item) => item.id === producto.id)
                    ? "bg-[var(--color-success)]"
                    : "bg-[var(--color-text-secondary)]"
                }`}
              />
            </div>
          </div>
        </div>
        <div className="p-2 ">
          <h5 className="font-['Cormorant_Garamond'] text-[var(--color-text)]">
            {producto.name}
          </h5>
          <small className="text-[var(--color-text-secondary)] text-lg italic">
            {producto.brand}
          </small>
        </div>
        <div className="px-2 py-1 flex items-center gap-2">
          <DollarSign
            size={16}
            className="text-[var(--color-text-secondary)]"
          />
          <span
            className="text-[var(--color-secondary)]"
            style={{
              fontSize: "16px",
              fontWeight: 700,
            }}
          >
            {formatCurrency(Number(producto.salePrice))}
          </span>
        </div>

        <div className="flex items-center gap-3 mb-3 px-2 ">
          <div className="rounded-full">
            <span
              className="px-2 py-1 uppercase rounded-full"
              style={{
                fontSize: "10px",
                fontWeight: 500,
                backgroundColor: categoria.bgColor,
                color: categoria.color,
              }}
            >
              {producto.category}
            </span>
          </div>
          <span className="text-[var(--color-border)]">|</span>
          <span
            style={{ fontSize: "10px" }}
            className="text-[var(--color-text-secondary)] font-mono"
          >
            SKU: {producto.sku}
          </span>
          <span className="text-[var(--color-border)]">|</span>
          <span
            className="inline-flex px-2 py-1 rounded-full"
            style={{
              fontSize: "10px",
              fontWeight: 500,
              backgroundColor: estado?.bgColor || "transparent",
              color: estado?.color || "inherit",
            }}
          >
            {estado?.label}
          </span>
        </div>
      </div>
    );
  };

  const SelectedItemCard = ({
    item,
    index,
  }: {
    item: ItemQuotationWithPromo;
    index: number;
  }) => {
    const promoVigente =
      item.promoPrice &&
      Number(item.promoPrice) > 0 &&
      item.promoEndAt &&
      dayjs(item.promoEndAt).isAfter(dayjs());

    // Sin estado local, usa el del array global
    const promoAplicada = !!item.promoAplicada;

    const priceToUse =
      promoAplicada && item.promoPrice && item.promoPrice > 0
        ? item.promoPrice
        : item.price;

    const onChangeQuantity = (newQuantity: number) => {
      setSelectedItems((prev) =>
        prev.map((it, i) =>
          i === index
            ? {
                ...it,
                quantity: newQuantity,
                subtotal: Number(priceToUse) * newQuantity,
              }
            : it,
        ),
      );
    };

    const onChangePromo = () => {
      setSelectedItems((prev) =>
        prev.map((it, i) =>
          i === index
            ? {
                ...it,
                promoAplicada: !it.promoAplicada,
                subtotal:
                  (!it.promoAplicada && it.promoPrice && it.promoPrice > 0
                    ? it.promoPrice
                    : it.price) * it.quantity,
              }
            : it,
        ),
      );
    };

    return (
      <div
        key={item.id}
        className="flex items-center gap-3 p-3 bg-white rounded-lg"
      >
        <div className="flex flex-1 gap-3 items-center">
          <div className="relative bg-[#FDFBF9] rounded-lg border border-[var(--color-border)] w-16 h-12 flex items-center justify-center">
            {item.type === "PRODUCTO" ? (
              <Package
                size={32}
                className="text-[var(--color-text-secondary)]"
              />
            ) : (
              <Sparkles
                size={32}
                className="text-[var(--color-text-secondary)]"
              />
            )}
          </div>
          <div className="w-full">
            <div style={{ fontWeight: 600 }}>{item.name}</div>
            {item.description && (
              <div
                className="text-[var(--color-text-secondary)]"
                style={{ fontSize: "13px" }}
              >
                {item.description.length > 90
                  ? item.description.substring(0, 90) + "..."
                  : item.description}
              </div>
            )}
            <div
              hidden={!(item.promoPrice && Number(item.promoPrice) > 0)}
              className="flex items-center gap-2 mt-2"
            >
              <span
                className="rounded-xl "
                style={{
                  fontSize: "12px",
                  padding: "2px 6px",
                  background: "#9D6FD815",
                  color: "#9D6FD8",
                }}
              >
                Promo:
              </span>
              <small
                className={`${
                  dayjs(item.promoEndAt).isBefore(dayjs())
                    ? "line-through text-[var(--color-error)]"
                    : "text-[var(--color-secondary)]"
                } font-medium`}
                style={{ fontSize: "12px" }}
              >
                {dayjs(item.promoEndAt).format("DD MMM YYYY")}
              </small>
              <input
                type="checkbox"
                checked={promoAplicada}
                onChange={onChangePromo}
                title={
                  promoVigente
                    ? "La promoción está vigente"
                    : "La promoción no está vigente, pero puedes aplicarla manualmente"
                }
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1 hover:bg-white rounded"
            onClick={(e) => {
              e.preventDefault();
              onChangeQuantity(item.quantity > 1 ? item.quantity - 1 : 1);
            }}
            disabled={item.quantity <= 1}
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center" style={{ fontWeight: 600 }}>
            {item.quantity}
          </span>
          <button
            className="p-1 hover:bg-white rounded"
            onClick={(e) => {
              e.preventDefault();
              onChangeQuantity(item.quantity + 1);
            }}
          >
            <Plus size={16} />
          </button>
        </div>
        <div className="w-24 text-right" style={{ fontWeight: 600 }}>
          {formatCurrency(
            promoAplicada && item.promoPrice && item.promoPrice > 0
              ? item.promoPrice * item.quantity
              : item.price * item.quantity,
          )}

          <small
            hidden={!promoAplicada}
            className="block line-through "
            style={{ fontSize: 12 }}
          >
            {formatCurrency(item.price * item.quantity)}
          </small>
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            eliminarItem(item.id);
          }}
          className="p-1 text-red-600 hover:bg-red-50 rounded"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  const PaymentMethodButton = ({
    metodo,
    label,
    icon,
    selected = false,
  }: {
    metodo: paymentMethods;
    label: string;
    icon: React.ElementType;
    selected?: boolean;
  }) => {
    // if (!selected) return null;
    const IconComponent = icon;
    const isSelected = metodoPago === metodo;

    return (
      <button
        disabled={!selected}
        type="button"
        onClick={() => onSelectMetodoPago(metodo)}
        style={{
          cursor: selected ? "pointer" : "not-allowed",
        }}
        className={`p-4 border-2 rounded-lg transition-all ${!selected ? "opacity-50" : ""} ${
          isSelected
            ? "border-[var(--color-primary)] bg-[#8B735515]"
            : "border-[var(--color-border)]"
        }`}
      >
        <IconComponent
          className={`mx-auto mb-2 ${isSelected ? "text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
          size={24}
        />
        <div style={{ fontWeight: 600, fontSize: "14px" }}>{label}</div>
      </button>
    );
  };

  const Preview = () => {
    return (
      <div className="sticky top-24 bg-white border-2 border-[var(--color-border)] rounded-xl p-6">
        <div className="text-center mb-6 pb-4 border-b border-[var(--color-border)]">
          <div
            className="text-[var(--color-primary)] mb-2"
            style={{ fontSize: "24px", fontWeight: 700 }}
          >
            Bio Plasma
          </div>
          <div
            className="text-[var(--color-text-secondary)] mb-1"
            style={{ fontSize: "16px", fontWeight: 600 }}
          >
            TICKET DE VENTA
          </div>
          <div
            className="font-mono text-[var(--color-text-secondary)]"
            style={{ fontSize: "12px" }}
          >
            VTA-2025-0157
          </div>
          <div
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "12px" }}
          >
            {new Date().toLocaleString("es-MX")}
          </div>
        </div>

        {selectedItems.length > 0 ? (
          <>
            <table className="w-full mb-4">
              <thead>
                <tr className="border-b border-[var(--color-border)]">
                  <th
                    className="text-left pb-2 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "12px" }}
                  >
                    Concepto
                  </th>
                  <th
                    className="text-center pb-2 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "12px" }}
                  >
                    Cant.
                  </th>
                  <th
                    className="text-right pb-2 text-[var(--color-text-secondary)]"
                    style={{ fontSize: "12px" }}
                  >
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {selectedItems.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-[var(--color-border)]"
                  >
                    <td className="py-2" style={{ fontSize: "13px" }}>
                      {item.name}
                    </td>
                    <td
                      className="py-2 text-center"
                      style={{ fontSize: "13px" }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className="py-2 text-right"
                      style={{ fontSize: "14px" }}
                    >
                      {formatCurrency(item.subtotal)}
                      <small
                        hidden={!(item.promoAplicada && item.promoPrice)}
                        className="block line-through "
                        style={{ fontSize: 12 }}
                      >
                        {formatCurrency(item.price * item.quantity)}
                      </small>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span className="text-[var(--color-text-secondary)]">
                  Subtotal:
                </span>
                <span style={{ fontWeight: 600 }}>
                  {formatCurrency(calcularSubtotalVenta())}
                </span>
              </div>
              {descuentoActivo && calcularDescuentoVenta() > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>Descuento:</span>
                  <span>-{formatCurrency(calcularDescuentoVenta())}</span>
                </div>
              )}

              {["tarjeta-credito", "tarjeta-debito"].includes(metodoPago) &&
                paymentMethodsConfig.card_commission > 0 && (
                  <div className="flex justify-between text-[var(--color-success)]">
                    <span>Comision por tarjeta:</span>
                    <span>
                      +{formatCurrency(calcularComisionTarjetaVenta())}
                    </span>
                  </div>
                )}
              <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
                <span style={{ fontSize: "18px", fontWeight: 700 }}>
                  TOTAL:
                </span>
                <span
                  className="text-[var(--color-secondary)]"
                  style={{ fontSize: "20px", fontWeight: 700 }}
                >
                  {formatCurrency(
                    calcularTotalVenta() + calcularComisionTarjetaVenta(),
                  )}
                </span>
              </div>
            </div>

            {metodoPago && (
              <div className="mb-6 p-3 bg-[#F5F2EF] rounded-lg">
                <div className="flex justify-between mb-1">
                  <span
                    className="text-[var(--color-text-secondary)]"
                    style={{ fontSize: "13px" }}
                  >
                    Pago:
                  </span>
                  <span style={{ fontWeight: 600 }}>
                    {getMetodoPagoLabel(metodoPago)}
                  </span>
                </div>
                {metodoPago === "efectivo" && montoRecibido > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span
                        className="text-[var(--color-text-secondary)]"
                        style={{ fontSize: "13px" }}
                      >
                        Recibido:
                      </span>
                      <span>{formatCurrency(montoRecibido)}</span>
                    </div>
                    {calcularCambio() > 0 && (
                      <div className="flex justify-between">
                        <span
                          className="text-green-600"
                          style={{
                            fontSize: "13px",
                            fontWeight: 600,
                          }}
                        >
                          Cambio:
                        </span>
                        <span
                          className="text-green-600"
                          style={{ fontWeight: 600 }}
                        >
                          {formatCurrency(calcularCambio())}
                        </span>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        ) : (
          <div
            className="text-center py-8 text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Agrega items para ver el ticket
          </div>
        )}

        <div
          className="text-center text-[var(--color-text-secondary)] pt-4 border-t border-[var(--color-border)]"
          style={{ fontSize: "11px" }}
        >
          ¡Gracias por tu visita!
          <br />
          Bio Plasma • Hermosillo, Sonora
          <br />
          (662) 000-0000 • contacto@bioplasma.com
        </div>
      </div>
    );
  };

  const onFinish = (data: Partial<Sale>) => {
    if (selectedItems.length === 0) {
      message.error("Agrega al menos un servicio o producto a la venta.");
      return;
    }

    const credencialData = payloadSales(
      data,
      selectedItems,
      SaleStatus.GUARDADA,
      metodoPago,
      descuentoRecurrente,
    );

    console.log("Datos para crear venta:", credencialData);

    onSubmit &&
      onSubmit({
        ...credencialData,
        status: initialStatus,
      } as Partial<Sale>);

    return;
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <form
        onSubmit={handleSubmit(onFinish)}
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <FormHeader />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 p-6">
          {/* Columna Izquierda - Formulario */}
          <div className="lg:col-span-3 space-y-6">
            {/* Paciente */}
            <div>
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Paciente
              </h3>
              {selectPublicoGeneral ? (
                <>
                  <input
                    {...register("customerName", {
                      required:
                        "El nombre del cliente es requerido para público general.",
                    })}
                    type="text"
                    autoComplete={"off"}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Nombre del cliente (público general)"
                  />
                </>
              ) : (
                <>
                  <input
                    type="text"
                    autoComplete={"off"}
                    value={searchPaciente}
                    onChange={(e) => {
                      setSearchPaciente(e.target.value);
                      setShowDropdownPaciente(true);
                      if (!e.target.value) {
                        setPacienteSeleccionado(null);
                        setValue("patient", undefined); // Limpiar el UUID también
                        setValue("customerName", undefined); // Limpiar el nombre del cliente también
                      }
                    }}
                    onFocus={() => setShowDropdownPaciente(true)}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Buscar paciente..."
                  />
                  <input
                    type="hidden"
                    {...register("patient", {
                      required: "El paciente es requerido.",
                    })}
                  />

                  <DropDownPatientResult
                    open={showDropdownPaciente}
                    pacientes={filteredPatients}
                  />
                  {errors.patient && (
                    <p
                      className="text-red-600 mt-1"
                      style={{ fontSize: "12px" }}
                    >
                      <AlertErrorInput
                        message={
                          errors.patient.message || "Error en el campo paciente"
                        }
                      />
                    </p>
                  )}
                </>
              )}

              {/* <button
                className="mt-2 text-[var(--color-primary)] hover:underline"
                style={{ fontSize: "14px" }}
              >
                + Nuevo paciente
              </button> */}
              <label className="flex items-center gap-2 mt-3">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectPublicoGeneral}
                  onChange={(e) => {
                    setSelectPublicoGeneral(e.target.checked);
                    if (e.target.checked) {
                      setPacienteSeleccionado(null);
                      setSearchPaciente("");
                      setValue("patient", undefined);
                      setValue("customerName", undefined);
                    }
                  }}
                />
                <span style={{ fontSize: "14px" }}>
                  Venta sin paciente (público general)
                </span>
              </label>
            </div>

            {/* Agregar Items */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Agregar Items
              </h3>

              <div className="flex gap-2 border-b border-[var(--color-border)] mb-4">
                <button
                  type="button"
                  className={`px-4 py-2 border-b-2 ${typeItem === "SERVICIO" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                  style={{ fontWeight: 600 }}
                  onClick={() => setTypeItem("SERVICIO")}
                >
                  Servicios
                </button>
                <button
                  type="button"
                  className={`px-4 py-2 border-b-2 ${typeItem === "PRODUCTO" ? "border-[var(--color-primary)] text-[var(--color-primary)]" : "text-[var(--color-text-secondary)]"}`}
                  onClick={() => setTypeItem("PRODUCTO")}
                  style={{ fontWeight: 600 }}
                >
                  Productos
                </button>
              </div>

              <input
                type="text"
                className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] mb-4"
                placeholder="Buscar servicio o producto..."
                value={searchServicioProducto}
                onChange={(e) => setSearchServicioProducto(e.target.value)}
              />

              <div
                style={{ maxHeight: "300px", scrollbarWidth: "thin" }}
                className="grid grid-cols-2 gap-4 overflow-y-auto"
              >
                {typeItem === "SERVICIO"
                  ? servicios
                      .filter(
                        (servicio) =>
                          servicio.name
                            .toLowerCase()
                            .includes(searchServicioProducto.toLowerCase()) ||
                          (servicio.description &&
                            servicio.description
                              .toLowerCase()
                              .includes(searchServicioProducto.toLowerCase())),
                      )
                      .map((servicio) => (
                        <ServicesOptionCard
                          key={servicio.id}
                          servicio={servicio}
                        />
                      ))
                  : productos
                      .filter(
                        (producto) =>
                          producto.name
                            .toLowerCase()
                            .includes(searchServicioProducto.toLowerCase()) ||
                          (producto.description &&
                            producto.description
                              .toLowerCase()
                              .includes(searchServicioProducto.toLowerCase())),
                      )
                      .map((producto) => (
                        <ProductsOptionCard
                          key={producto.id}
                          producto={producto}
                        />
                      ))}
              </div>

              {/* Lista de items */}
              <div className="py-8 text-[var(--color-text-secondary)] bg-[#F5F2EF] rounded-lg">
                {selectedItems.length > 0 ? (
                  <div className="space-y-2 px-3">
                    {selectedItems.map((item, idx) => (
                      <SelectedItemCard key={item.id} item={item} index={idx} />
                    ))}
                  </div>
                ) : (
                  <span className="text-center block">
                    No hay items agregados
                  </span>
                )}
              </div>
            </div>

            {/* Descuento */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <div className="flex items-center justify-between mb-4">
                <h3 style={{ fontWeight: 600 }}>Descuento</h3>
              </div>

              <div className="space-y-4">
                <div
                  className="flex flex-col gap-4 "
                  hidden={!pacienteSeleccionado?.isRecurrent}
                >
                  <div className="flex items-center gap-4 justify-between border border-[var(--color-border)] rounded-lg px-4 py-2">
                    <div style={{ fontWeight: 600 }}>
                      Descuento por cliente recurrente
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-[var(--color-error)]"
                        style={{ fontWeight: 600 }}
                      >
                        - {pacienteSeleccionado?.porcentDiscount || 0} %
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={aplicarDescuentoRecurrente}
                          onChange={() =>
                            setAplicarDescuentoRecurrente((v) => !v)
                          }
                          disabled={!pacienteSeleccionado?.porcentDiscount}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pago */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Método de Pago
              </h3>

              <div className="grid grid-cols-2 gap-3 mb-4">
                <PaymentMethodButton
                  metodo="efectivo"
                  label="Efectivo"
                  icon={Banknote}
                  selected={paymentMethodsConfig.cash_payment}
                />
                <PaymentMethodButton
                  metodo="tarjeta-credito"
                  label="Tarjeta de crédito"
                  icon={CreditCard}
                  selected={paymentMethodsConfig.credit_card}
                />
                <PaymentMethodButton
                  metodo="tarjeta-debito"
                  label="Tarjeta de débito"
                  icon={WalletCards}
                  selected={paymentMethodsConfig.debit_card}
                />
                <PaymentMethodButton
                  metodo="transferencia"
                  label="Transfer."
                  icon={Smartphone}
                  selected={paymentMethodsConfig.bank_transfer}
                />
              </div>

              <input
                type="hidden"
                {...register("paymentMethod", {
                  required: "El método de pago es requerido.",
                })}
              />
              {errors.paymentMethod && (
                <p className="text-red-600 mt-1" style={{ fontSize: "12px" }}>
                  <AlertErrorInput
                    message={
                      errors.paymentMethod.message ||
                      "Error en el campo método de pago"
                    }
                  />
                </p>
              )}

              <div
                hidden={
                  !["tarjeta-credito", "tarjeta-debito"].includes(
                    metodoPago || "",
                  )
                }
                className="p-4 bg-blue-50 border border-blue-200 rounded-lg flex-1"
              >
                <p className="text-blue-900" style={{ fontSize: "13px" }}>
                  <strong>Comision por pago con tarjeta</strong> Con una
                  comisión del {paymentMethodsConfig?.card_commission || 0}%,
                  una venta de {calcularTotalVenta()} generará una comisión de $
                  {(
                    (calcularTotalVenta() *
                      (paymentMethodsConfig?.card_commission || 0)) /
                    100
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Preview de Ticket */}
          <div className="lg:col-span-2">
            <Preview />
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-[var(--color-border)] px-6 py-4 flex gap-3 justify-end">
          <button
            onClick={hanldeClose}
            className="px-6 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={() => setInitialStatus(SaleStatus.GUARDADA)}
            type="submit"
            className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[#8B7355]/10 transition-colors"
          >
            Guardar e Imprimir
          </button>
          <button
            onClick={() => setInitialStatus(SaleStatus.CONCRETADA)}
            type="submit"
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Completar Venta
          </button>
        </div>
      </form>
    </div>
  );
};
