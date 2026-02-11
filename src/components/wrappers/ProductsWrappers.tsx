import { useParams, Navigate } from "react-router-dom";
import { useNavigation } from "../../hooks/useNavigation";
import { Inventario } from "../../modules/inventory/pages/Inventario";
import { DetalleProducto } from "../../modules/inventory/pages/DetalleProducto";

// Wrapper para la página de inventario de productos
export function InventoryPageWrapper() {
  const { navigateToProducto } = useNavigation();

  return <Inventario onNavigateTo={navigateToProducto} />;
}

// Wrapper para el expediente de paciente individual
export function DetalleProductoPageWrapper() {
  const { id } = useParams<{ id: string }>();
  const { goBack } = useNavigation();

  // Si no hay ID, redirigir a la lista de productos
  if (!id) {
    return <Navigate to="/inventario" replace />;
  }
  return <DetalleProducto productoId={id} onBack={goBack} />;
}
