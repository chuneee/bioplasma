import { useEffect, useState } from "react";
import { Quotation, QuotationStatus } from "../types/quotation.type";
import { formatCurrency, formatDate } from "../../../utils/utils";
import bioPlasmaLogo from "figma:asset/175af98dc3b4599e36e3eb47be9bf1f4fb2a405b.png";
import {
  Calendar,
  Clock,
  File,
  Mail,
  MapPin,
  MessageCircle,
  SquareUser,
  User,
  X,
} from "lucide-react";
import dayjs from "dayjs";

interface QuotationDetailProps {
  open: boolean;
  dataSource: Quotation;
  onClose: () => void;
  onChangeStatus?: (id: number, status: QuotationStatus) => void;
}

export const QuotationDetail = ({
  dataSource,
  open,
  onClose,
  onChangeStatus,
}: QuotationDetailProps) => {
  if (!open) return null;

  const [currentData, setCurrentData] = useState<Quotation>(dataSource);

  useEffect(() => {
    setCurrentData(dataSource);
  }, [dataSource]);

  const handleClose = () => {
    onClose();
  };

  const handleStatusChange = (id: number, status: QuotationStatus) => {
    if (onChangeStatus) {
      onChangeStatus(id, status);
    }
  };

  const Header = () => {
    return (
      <div className="bg-white border-[var(--color-border)] flex items-center justify-between z-10">
        <div className="space-y-5 flex items-center">
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-lg bg-[#8B735515] flex items-center justify-center">
              <img
                src={bioPlasmaLogo}
                alt="Bio Plasma - Revitaliza tu piel"
                className="w-64 h-auto mx-auto drop-shadow-md"
              />
            </div>
            <div>
              <h3 className=" tracking-tighter uppercase mb-1">Bio Plasma</h3>
              <p className="text-[var(--color-text-secondary)] flex items-center gap-1">
                <span className="w-4 h-px bg-[var(--color-secondary)]" />
                REVITALIZA TU PIEL
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col text-center">
          <h2 style={{ fontWeight: "bold" }}>Cotizacion</h2>
          <span
            style={{ fontWeight: "bold" }}
            className="rounded-lg bg-[#E0A75E]/15 text-[var(--color-primary)] px-2 py-1 text-sm3"
          >
            {dataSource?.folio}
          </span>
        </div>
      </div>
    );
  };

  const SubHeader = () => {
    return (
      <div
        style={{ justifyContent: "space-around" }}
        className="flex flex items-center gap-4 mt-6 mb-6"
      >
        <div className="flex flex-col gap-2">
          <small
            style={{ fontSize: "12px", fontWeight: "bold" }}
            className="text-[var(--color-text)]"
          >
            FECHA DE EMISION
          </small>
          <strong style={{ fontSize: "14px" }}>
            <Calendar
              size={18}
              className="text-[var(--color-secondary)] mr-2 inline-block"
            />
            {formatDate(currentData?.createdAt) || "Sin fecha"}
          </strong>
        </div>
        <div className="flex flex-col gap-2">
          <small
            style={{ fontSize: "12px", fontWeight: "bold" }}
            className="text-[var(--color-text )]"
          >
            VENCE EN
          </small>
          <strong
            style={{ fontSize: "14px" }}
            className={
              dayjs(currentData?.expirationDate).isAfter(dayjs())
                ? ""
                : "text-[var(--color-error)]"
            }
          >
            <Clock
              size={18}
              className="text-[var(--color-secondary)] mr-2 inline-block"
            />
            <span
              hidden={dayjs(currentData?.expirationDate).isAfter(dayjs())}
              style={{
                fontSize: 12,
                fontWeight: "bold",
                backgroundColor: "rgba(255, 0, 0, 0.2)",
              }}
              className="text-[var(--color-error)] mr-1 px-2 py-1 rounded-lg"
            >
              EXPIRADO
            </span>
            {formatDate(currentData?.expirationDate) || "Sin fecha"}
          </strong>
        </div>
      </div>
    );
  };

  const InfoPaciente = () => {
    const { patient } = currentData;

    return (
      <div
        style={{
          minWidth: 400,
        }}
        className="bg-[var(--color-bg)] border-[var(--color-border)] rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <SquareUser size={30} className="text-[var(--color-secondary)]" />
          <span className="ml-2 text-[var(--color-text-secondary)] text-sm">
            Información del paciente
          </span>
        </div>
        <strong>{patient?.fullName || "Paciente sin nombre"}</strong>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <MessageCircle
              size={18}
              className="text-green-600 hover:bg-green-50"
            />
            <a
              className="cursor-pointer hover:text-[var(--color-primary)] transition-colors"
              style={{ textDecorationLine: "underline" }}
              href={`https://wa.me/${patient?.principalPhoneNumber.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {patient?.principalPhoneNumber || "Sin teléfono"}
            </a>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[var(--color-text-secondary)]" />
            <span>{patient?.email || "Sin email"}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin size={18} className="text-[var(--color-text-secondary)]" />
            <span>
              {patient?.address || "Sin dirección"}, {patient?.city || ""},
              {" #"}
              {patient?.zipCode || ""}
            </span>
          </div>
        </div>
      </div>
    );
  };

  const InfoVendedor = () => {
    const { seller } = currentData;

    return (
      <div
        style={{
          minWidth: 400,
        }}
        className="bg-[var(--color-bg)] border-[var(--color-border)] rounded-xl p-6 mb-6"
      >
        <div className="flex items-center gap-2 mb-3">
          <Clock size={30} className="text-[var(--color-secondary)]" />
          <span className="ml-2 text-[var(--color-text-secondary)] text-sm">
            Atendido por
          </span>
        </div>
        <strong>{seller?.username || "Vendedor sin nombre"}</strong>
        <div className="flex flex-col gap-4 mt-2">
          <div className="flex items-center gap-2">
            <User size={18} className="text-[var(--color-text-secondary)]" />
            <span>{seller?.role?.name || "Sin rol"}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail size={18} className="text-[var(--color-text-secondary)]" />
            <span>{seller?.email || "Sin email"}</span>
          </div>
        </div>
      </div>
    );
  };

  const ItemsTable = () => {
    const { items } = currentData;

    return (
      <table className="w-full rounded-lg overflow-hidden">
        <thead>
          <tr className="bg-[#F5F2EF] border-b border-[var(--color-border)]">
            <th
              className="text-left px-6 py-2 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px" }}
            >
              Concepto
            </th>
            <th
              className="text-center px-6 py-2 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px" }}
            >
              Cant.
            </th>
            <th
              className="text-center px-6 py-2 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px" }}
            >
              Precio Unit.
            </th>
            <th
              className="text-center px-6 py-2 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px" }}
            >
              Descuento
            </th>
            <th
              className="text-center px-6 py-2 text-[var(--color-text-secondary)] uppercase tracking-wide"
              style={{ fontSize: "12px" }}
            >
              Total
            </th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => {
            const name =
              item.service?.name || item.product?.name || "Item sin nombre";

            const description =
              item.service?.shortDescription ||
              item.product?.description ||
              "Sin descripción";
            return (
              <tr
                key={item.id}
                className="border-b border-[var(--color-border)]"
              >
                <td
                  className="py-2 px-6"
                  style={{ fontSize: "14px", maxWidth: 400 }}
                >
                  <strong>{name}</strong>
                  <p style={{ fontSize: 12 }} className="block">
                    {description}
                  </p>
                </td>
                <td className="py-2 px-6 text-center">{item.quantity}</td>
                <td className="py-2 px-6 text-center">
                  {formatCurrency(item.unitPrice)}
                </td>
                <td className="py-2 px-6 text-center">
                  {formatCurrency(item.discount)}
                </td>
                <td className="py-2 px-6 text-right">
                  {formatCurrency(item.total)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  const InfoCotizacion = () => {
    return (
      <div className="w-full">
        {/* Observaciones */}
        <div className="border-l-4 border-[var(--color-border)] rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <File size={20} className="text-[var(--color-secondary)]" />
            <h4 className="ml-2 text-[var(--color-text-secondary)] text-sm">
              Notas:
            </h4>
          </div>
          <div className="flex flex-col gap-4">
            <div className="p-4 bg-[var(--color-bg)]">
              <h5>Nota Interna:</h5>
              <p className="text-[var(--color-text-secondary)]">
                {currentData.internalNotes || "Sin notas internas"}
              </p>
            </div>
            <div className="p-4 bg-[var(--color-bg)]">
              <h5>Nota del paciente:</h5>
              <p className="text-[var(--color-text-secondary)]">
                {currentData.patientNotes || "Sin notas del paciente"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-center gap-4 mt-4">
          <div className="p-4">
            <span
              className="text-[var(--color-primary)]"
              style={{ fontSize: 18 }}
            >
              VALIDEZ:
            </span>
            <div className="flex gap-2 items-center mt-1">
              <div
                style={{
                  backgroundColor: "rgba(255, 0, 0, 0.2)",
                  fontWeight: "bold",
                }}
                className="w-10 h-10 rounded-lg flex items-center justify-center text-[var(--color-error)]"
              >
                {currentData.validityDays || "Sin validez"}
              </div>
              <strong>DIAS NATURALES</strong>
            </div>
          </div>
          <div className="p-4">
            <span
              className="text-[var(--color-primary)]"
              style={{ fontSize: 18 }}
            >
              ESTADO:
            </span>
            <div className="flex gap-2 items-center mt-1">
              <div className="w-10 h-10 rounded-lg bg-[var(--color-info)] flex items-center justify-center">
                <Mail size={18} />
              </div>
              <strong> {currentData.status || "Sin estado"}</strong>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const TotalSummary = () => {
    const { total, subTotal, discount } = currentData;

    return (
      <div className="bg-[var(--color-bg)] rounded-lg w-full max-w-sm p-4">
        <div className="flex justify-between p-4 border-b border-[var(--color-border)]">
          <h3 className="text-[var(--color-text-secondary)]">Subtotal:</h3>
          <h3 style={{ fontWeight: "bold" }}>{formatCurrency(subTotal)}</h3>
        </div>
        <div className="flex justify-between p-4 text-[var(--color-error)] border-b border-[var(--color-border)]">
          <h3>Descuento:</h3>
          <h3>-{formatCurrency(discount)}</h3>
        </div>

        <div className="flex mt-5 justify-between p-4 pt-2 border-t border-[var(--color-border)] text-[var(--color-secondary)]">
          <h3 style={{ fontWeight: 700 }}>TOTAL:</h3>
          <h3 className="text-[var(--color-secondary)]">
            {formatCurrency(total)}
          </h3>
        </div>

        {[
          QuotationStatus.ENVIADA,
          QuotationStatus.NEGOCIACION,
          QuotationStatus.BORRADOR,
        ].includes(currentData.status) && (
          <div
            className="flex flex-col gap-4 mt-6 uppercase"
            style={{ justifyContent: "center" }}
          >
            <button
              style={{ cursor: "pointer" }}
              type="button"
              className="w-full px-4 py-2 uppercase rounded-lg bg-[var(--color-primary)] text-white"
            >
              Cerrar Venta
            </button>
            <div className="flex gap-2">
              <button
                style={{ cursor: "pointer" }}
                type="button"
                className="w-full px-4 py-2 uppercase rounded-lg bg-white text-black border border-[var(--color-border)]"
                onClick={() =>
                  handleStatusChange(currentData.id, QuotationStatus.ENVIADA)
                }
              >
                Enviar
              </button>
              <button
                hidden={currentData.status === QuotationStatus.NEGOCIACION}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  handleStatusChange(
                    currentData.id,
                    QuotationStatus.NEGOCIACION,
                  )
                }
                type="button"
                className="w-full px-4 py-2 uppercase rounded-lg bg-[var(--color-secondary)] text-white"
              >
                Negociacion
              </button>
            </div>
            <button
              onClick={() =>
                handleStatusChange(currentData.id, QuotationStatus.RECHAZADA)
              }
              style={{ cursor: "pointer" }}
              type="button"
              className="w-full px-4 py-2 uppercase rounded-lg bg-white text-[var(--color-error)] border border-[var(--color-error)]"
            >
              COTIZACION RECHAZADA
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div
        style={{ padding: "50px 40px" }}
        className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
      >
        <Header />
        <SubHeader />

        <div
          className="flex gap-2 mt-6 mb-6"
          style={{ justifyContent: "space-around" }}
        >
          <InfoPaciente />
          <InfoVendedor />
        </div>
        {/* <ViewDetail /> */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            width: "100%",
          }}
        >
          <div
            style={{
              width: 800,
              backgroundColor: "var(--color-bg)",
              border: "1px solid var(--color-border)",
              borderRadius: 12,
            }}
          >
            <ItemsTable />
          </div>
        </div>

        <div className="flex gap-4 mt-6" style={{ justifyContent: "center" }}>
          <InfoCotizacion />
          <TotalSummary />
        </div>
        <button
          onClick={handleClose}
          className="px-4 py-2 mt-4 w-full text-center rounded-lg text-[var(--color-text-secondary)] border border-[var(--color-secondary)] hover:text-[var(--color-error)] cursor-pointer transition-colors "
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};
