import {
  Clock,
  DollarSign,
  Minus,
  Package,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { ItemQuotation, payloadQuotation } from "../utils/utils";
import { useEffect, useRef, useState } from "react";
import { formatCurrency, formatDate } from "../../../utils/utils";
import { useForm } from "react-hook-form";
import { Quotation, QuotationStatus } from "../types/quotation.type";
import { Patient } from "../../patients/types/patient.type";
import { User } from "../../settings/types/user.type";
import { PatientService } from "../../patients/services/patient.service";
import { UserService } from "../../settings/services/user.service";
import { message } from "../../../components/shared/message/message";
import { Service } from "../../services/types/service.type";
import { Product } from "../../inventory/types/product.type";
import { ServicesService } from "../../services/services/services.service";
import { ProductService } from "../../inventory/services/product.service";
import { AlertErrorInput } from "../../../components/ui/alert";
import { categoriasConfig } from "../../services/utils/utils";
import { API_BASE_URL } from "../../../shared/api/axios";
import {
  estadosConfig,
  getStatus,
  categoriasConfig as categoriaConfigProduct,
} from "../../inventory/utils/utils";
import dayjs from "dayjs";

interface QuotationFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (cotizacion: Partial<Quotation>) => void;
  cotizacionNumber: number;
  currentData?: Quotation | null;
}

// Cambia el tipo de ItemQuotation para incluir promoAplicada (si no existe ya)
type ItemQuotationWithPromo = ItemQuotation & { promoAplicada?: boolean };

export const QuotationFormModal = ({
  open,
  onClose,
  onSubmit,
  cotizacionNumber,
  currentData,
}: QuotationFormModalProps) => {
  if (!open) return null;

  const folio =
    currentData?.folio ||
    `COT-${dayjs().format("YYYY")}-${(cotizacionNumber + 1).toString().padStart(4, "0")}`;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<Partial<Quotation>>();

  // Cambia el tipo de selectedItems
  const [selectedItems, setSelectedItems] = useState<ItemQuotationWithPromo[]>(
    [],
  );
  const [pacientes, setPacientes] = useState<Patient[]>([]);
  const [usuarios, setUsuarios] = useState<User[]>([]);
  const [servicios, setServicios] = useState<Service[]>([]);
  const [productos, setProductos] = useState<Product[]>([]);

  const [searchPaciente, setSearchPaciente] = useState("");
  const [showDropdownPaciente, setShowDropdownPaciente] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState<Patient | null>(
    null,
  );

  const [searchServicioProducto, setSearchServicioProducto] = useState("");
  const [typeItem, setTypeItem] = useState<"SERVICIO" | "PRODUCTO">("SERVICIO");

  const [initialStatus, setInitialStatus] = useState<QuotationStatus>(
    QuotationStatus.BORRADOR,
  );

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Estados para los descuentos
  const [aplicarDescuentoRecurrente, setAplicarDescuentoRecurrente] =
    useState(false);

  const fetchData = async () => {
    const [
      fetchedPacientes,
      fetchedUsuarios,
      fetchedServicios,
      fetchedProductos,
    ] = await Promise.all([
      PatientService.getPatients(),
      UserService.getUsers(),
      ServicesService.getServicios(),
      ProductService.getProducts(),
    ]);
    setPacientes(fetchedPacientes.filter((p) => p.isActive));
    setUsuarios(fetchedUsuarios.filter((u) => u.isActive));
    setServicios(fetchedServicios.filter((s) => s.isActive));
    setProductos(fetchedProductos.filter((p) => Number(p.salePrice) > 0));
    try {
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Error al cargar pacientes y usuarios. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (currentData) {
      reset({
        patientNotes: currentData.patientNotes,
        internalNotes: currentData.internalNotes,
        validityDays: currentData.validityDays,
      });

      const seller = currentData.seller;
      setValue("seller", seller.id as any);

      setSelectedPaciente(currentData.patient);
      setSearchPaciente(currentData.patient.fullName);
      setValue("patient", currentData.patient.uuid as any);

      const items = currentData.items.map((item) => {
        const type = item.itemType;
        let data = item.service || item.product;

        const name = data?.name || "Nombre no disponible";
        const description = data?.description || "";

        return {
          id: item.itemId,
          name: name,
          type: type,
          description: description,
          quantity: item.quantity,
          promoAplicada: Number(item.discount) > 0,
          price: Number(item.unitPrice),
          promoEndAt:
            "type" in data && "promoEndAt" in data
              ? data.promoEndAt
              : undefined,
          promoPrice:
            item.discount > 0
              ? Number(item.unitPrice) - Number(item.discount / item.quantity)
              : 0,
          subtotal: Number(item.total),
        };
      });

      setSelectedItems(items);
      setAplicarDescuentoRecurrente(currentData.patient.isRecurrent);
    } else {
      reset();
    }
  }, [currentData, usuarios]);

  useEffect(() => {
    // Recalcula subtotales de cada ítem cuando cambian cantidad o promoAplicada
    setSelectedItems((prev) =>
      prev.map((item) => {
        const priceToUse =
          item.promoAplicada && item.promoPrice && item.promoPrice > 0
            ? item.promoPrice
            : item.price;
        return {
          ...item,
          subtotal: priceToUse * item.quantity,
        };
      }),
    );
    // eslint-disable-next-line
  }, [aplicarDescuentoRecurrente]);

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

  // Subtotal después de promos
  const subtotalSinDescuento = selectedItems.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.quantity),
    0,
  );

  // Calcula el descuento recurrente
  const descuentoRecurrente =
    aplicarDescuentoRecurrente && selectedPaciente?.porcentDiscount
      ? (subtotalSinDescuento * Number(selectedPaciente.porcentDiscount)) / 100
      : 0;

  const descuentoPromos = selectedItems.reduce((total, item) => {
    if (item.promoAplicada && item.promoPrice && item.promoPrice > 0) {
      return total + (item.price - item.promoPrice) * item.quantity;
    }
    return Number(total);
  }, 0);

  // Total final
  const totalFinal = Math.max(
    subtotalSinDescuento - descuentoRecurrente - descuentoPromos,
    0,
  );

  const handleClose = () => {
    onClose();
    reset();
    setSelectedItems([]);
    setSelectedPaciente(null);
    setSearchPaciente("");
    setInitialStatus(QuotationStatus.BORRADOR);
    setTypeItem("SERVICIO");
    setSearchServicioProducto("");
    setShowDropdownPaciente(false);
  };

  const eliminarItem = (id: string) => {
    setSelectedItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handlePacienteSelect = (patient: Patient) => {
    setSelectedPaciente(patient);
    setSearchPaciente(patient.fullName);
    setShowDropdownPaciente(false);
    setValue("patient", patient.uuid as any);
  };

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

  // COMPONENTES INTERNOS
  const FormHeader = () => {
    return (
      <div className="sticky top-0 bg-white border-b border-[var(--color-border)] px-6 py-4 flex items-center justify-between z-10">
        <div>
          <h2 className="font-['Cormorant_Garamond']">Nueva Cotización</h2>
          <p
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            Folio: {folio}
          </p>
        </div>
        <button
          onClick={handleClose}
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

  // Modifica Preview para mostrar el descuento total si existe
  const Preview = () => {
    return (
      <div className="sticky top-24 bg-white border border-[var(--color-border)] rounded-xl p-6 shadow-lg">
        <div className="text-center mb-6">
          <div
            className="text-[var(--color-primary)] mb-2"
            style={{ fontSize: "24px", fontWeight: 700 }}
          >
            Bio Plasma
          </div>
          <div
            className="text-[var(--color-text-secondary)] mb-1"
            style={{ fontSize: "20px", fontWeight: 600 }}
          >
            COTIZACIÓN
          </div>
          <div
            className="font-mono text-[var(--color-text-secondary)]"
            style={{ fontSize: "13px" }}
          >
            {folio}
          </div>
          <div
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "13px" }}
          >
            {formatDate(currentData?.updatedAt || dayjs().toISOString())}
          </div>
        </div>

        <div className="mb-6 pb-6 border-b border-[var(--color-border)]">
          <div
            className="text-[var(--color-text-secondary)] mb-1"
            style={{ fontSize: "12px", fontWeight: 600 }}
          >
            PARA:
          </div>
          <div style={{ fontWeight: 600 }}>
            {selectedPaciente?.fullName || "-"}
          </div>
          <div
            className="text-[var(--color-text-secondary)]"
            style={{ fontSize: "14px" }}
          >
            -
          </div>
        </div>

        <>
          <table className="w-full mb-6">
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
                  <td className="py-2" style={{ fontSize: "14px" }}>
                    {item.name}
                  </td>
                  <td className="py-2 text-center" style={{ fontSize: "14px" }}>
                    {item.quantity}
                  </td>
                  <td className="py-2 text-right" style={{ fontSize: "14px" }}>
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
                {formatCurrency(
                  selectedItems.reduce(
                    (acc, item) => acc + item.price * item.quantity,
                    0,
                  ),
                )}
              </span>
            </div>
            {descuentoRecurrente > 0 && (
              <div className="flex justify-between text-[var(--color-error)]">
                <span>Descuento cliente recurrente:</span>
                <span>-{formatCurrency(descuentoRecurrente)}</span>
              </div>
            )}
            {descuentoPromos > 0 && (
              <div className="flex justify-between text-[var(--color-error)]">
                <span>Descuento por promociones:</span>
                <span>-{formatCurrency(descuentoPromos)}</span>
              </div>
            )}
            {/* Descuento recurrente */}

            <div className="flex justify-between pt-2 border-t border-[var(--color-border)]">
              <span style={{ fontSize: "18px", fontWeight: 700 }}>TOTAL:</span>
              <span
                className="text-[var(--color-secondary)]"
                style={{ fontSize: "20px", fontWeight: 700 }}
              >
                {formatCurrency(totalFinal)}
              </span>
            </div>
          </div>
        </>

        <div
          className="text-center text-[var(--color-text-secondary)] pt-6 border-t border-[var(--color-border)]"
          style={{ fontSize: "12px" }}
        >
          Bio Plasma • Hermosillo, Sonora
          <br />
          (662) 000-0000 • contacto@bioplasma.com
        </div>
      </div>
    );
  };

  // FUNCIONES PRINCIPALES
  const onFinish = (value: Partial<Quotation>) => {
    if (selectedItems.length === 0) {
      message.error("Agrega al menos un servicio o producto a la cotización.");
      return;
    }

    const cotizacion = payloadQuotation(
      value,
      selectedItems,
      initialStatus,
      descuentoRecurrente,
    );

    onSubmit(cotizacion as any);
    handleClose();
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
            {/* Información General */}
            <div>
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Información General
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Paciente *
                  </label>
                  <input
                    type="text"
                    autoComplete={"off"}
                    value={searchPaciente}
                    onChange={(e) => {
                      setSearchPaciente(e.target.value);
                      setShowDropdownPaciente(true);
                      if (!e.target.value) {
                        setSelectedPaciente(null);
                        setValue("patient", undefined); // Limpiar el UUID también
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

                  {/* Dropdown de resultados */}
                  <DropDownPatientResult
                    open={showDropdownPaciente}
                    pacientes={filteredPatients}
                  />
                  {/* <button
                    className="mt-2 text-[var(--color-primary)] hover:underline"
                    style={{ fontSize: "14px" }}
                  >
                    + Nuevo paciente
                  </button> */}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Vendedora asignada *
                    </label>
                    <select
                      {...register("seller", {
                        required: "La vendedora es requerida.",
                      })}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="">Selecciona una vendedora</option>
                      {usuarios.map((usuario) => (
                        <option key={usuario.id} value={usuario.id}>
                          {usuario.username}
                        </option>
                      ))}
                    </select>
                    {errors.seller && (
                      <AlertErrorInput
                        message={
                          errors.seller.message ||
                          "Error en el campo vendedora asignada"
                        }
                      />
                    )}
                  </div>
                  <div>
                    <label className="block mb-2" style={{ fontWeight: 600 }}>
                      Vigencia
                    </label>
                    <select
                      {...register("validityDays")}
                      className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    >
                      <option value="7">7 días</option>
                      <option value="15">15 días</option>
                      <option value="30">30 días</option>
                      <option>Sin vigencia</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Agregar Items */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Agregar Items
              </h3>
              <div className="space-y-4">
                <div className="flex gap-2 border-b border-[var(--color-border)]">
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

                <div>
                  <input
                    type="text"
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
                    placeholder="Buscar servicio o producto..."
                    value={searchServicioProducto}
                    onChange={(e) => setSearchServicioProducto(e.target.value)}
                  />
                </div>

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
                                .includes(
                                  searchServicioProducto.toLowerCase(),
                                )),
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
                                .includes(
                                  searchServicioProducto.toLowerCase(),
                                )),
                        )
                        .map((producto) => (
                          <ProductsOptionCard
                            key={producto.id}
                            producto={producto}
                          />
                        ))}
                </div>

                <div className="py-8 text-[var(--color-text-secondary)] bg-[#F5F2EF] rounded-lg">
                  {selectedItems.length > 0 ? (
                    <div className="space-y-2 px-3">
                      {selectedItems.map((item, idx) => (
                        <SelectedItemCard
                          key={item.id}
                          item={item}
                          index={idx}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-center block">
                      No hay items agregados
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Descuentos y Notas */}
            <div className="border-t border-[var(--color-border)] pt-6">
              <h3 className="mb-4" style={{ fontWeight: 600 }}>
                Descuentos y Notas
              </h3>
              <div className="space-y-4">
                <div
                  className="flex flex-col gap-4 "
                  hidden={!selectedPaciente?.isRecurrent}
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
                        - {selectedPaciente?.porcentDiscount || 0} %
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={aplicarDescuentoRecurrente}
                          onChange={() =>
                            setAplicarDescuentoRecurrente((v) => !v)
                          }
                          disabled={!selectedPaciente?.porcentDiscount}
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--color-success)]"></div>
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Notas para el paciente
                  </label>
                  <textarea
                    {...register("patientNotes")}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Condiciones, recomendaciones, instrucciones..."
                  />
                </div>

                <div>
                  <label className="block mb-2" style={{ fontWeight: 600 }}>
                    Notas internas
                  </label>
                  <textarea
                    {...register("internalNotes")}
                    rows={2}
                    className="w-full px-4 py-2.5 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)] resize-none"
                    placeholder="Notas solo visibles para el personal..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha - Preview */}
          <div className="lg:col-span-2">
            <Preview />
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
            onClick={() => setInitialStatus(QuotationStatus.BORRADOR)}
            className="px-6 py-2.5 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-lg hover:bg-[#8B7355]/10 transition-colors"
          >
            Guardar Borrador
          </button>
          <button
            type="submit"
            onClick={() => setInitialStatus(QuotationStatus.ENVIADA)}
            className="px-6 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
          >
            Guardar y Enviar
          </button>
        </div>
      </form>
    </div>
  );
};
