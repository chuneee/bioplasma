import { useEffect, useState } from "react";
import { Plus, FileText } from "lucide-react";
import { ProductTable } from "../components/productTable";
import { ProductFormModal } from "../components/productForm";
import { ProductMovimentFormModal } from "../components/movement/productMovimentForm";
import { ProductFilters } from "../components/filters";
import { ProductService } from "../services/product.service";
import { message } from "../../../components/shared/message/message";
import { InventoryStockMovement } from "../types/stock-moviment.type";
import { StockMovementService } from "../services/stock-movement.service";
import { CardsInfo } from "../components/cardsinfo";
import { getAllStatuses } from "../utils/utils";
import { Product } from "../types/product.type";

export function Inventario({
  onNavigateTo,
}: {
  onNavigateTo: (id: string) => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategoria, setSelectedCategoria] = useState<string>("todas");
  const [selectedEstado, setSelectedEstado] = useState<string>("todos");
  const [sortBy, setSortBy] = useState("nombre-az");
  const [showNewProductModal, setShowNewProductModal] = useState(false);
  const [showMovimientoModal, setShowMovimientoModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("todos");

  const [productos, setProductos] = useState<Product[]>([]);
  const [currendProduct, setCurrendProduct] = useState<Product | null>(null);

  const initData = async () => {
    try {
      const response = await ProductService.getProducts();
      setProductos(response);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      message.error("No se pudieron cargar los productos. Intente nuevamente.");
    }
  };
  useEffect(() => {
    initData();
  }, []);

  const handelProductSubmit = async (values: Partial<Product>) => {
    try {
      if (currendProduct) {
        const response = await ProductService.updateProduct(
          currendProduct.id,
          values,
        );
        setProductos((prev) =>
          prev.map((p) => (p.id === currendProduct.id ? response : p)),
        );
        message.success("Producto actualizado exitosamente");
      } else {
        const response = await ProductService.createProduct(values);
        setProductos((prev) => [...prev, response]);
        message.success("Producto creado exitosamente");
      }
    } catch (error) {
      console.error("Error al crear producto:", error);
      message.error("No se pudo crear el producto. Intente nuevamente.");
    } finally {
      setShowNewProductModal(false);
      setCurrendProduct(null);
    }
  };

  const handleProductDlete = async (id: string) => {
    try {
      await ProductService.deleteProduct(id);
      setProductos((prev) => prev.filter((p) => p.id !== id));
      message.success("Producto eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      message.error("No se pudo eliminar el producto. Intente nuevamente.");
    }
  };

  const handleProductEdit = (id: string) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      setCurrendProduct(producto);
      setShowNewProductModal(true);
    } else {
      message.error("Producto no encontrado");
    }
  };

  const handleStockMovementSubmit = async (
    data: Partial<InventoryStockMovement>,
  ) => {
    try {
      await StockMovementService.createStockMovement(data);
      message.success("Movimiento de stock registrado exitosamente");
      initData();
    } catch (error) {
      console.error("Error al registrar movimiento de stock:", error);
      message.error("No se pudo registrar el movimiento. Intente nuevamente.");
    } finally {
      setShowMovimientoModal(false);
    }
  };

  // Calcular estadísticas
  const stockBajo = productos.filter((p) =>
    getAllStatuses(p).includes("bajo"),
  ).length;

  const sinStock = productos.filter((p) =>
    getAllStatuses(p).includes("agotado"),
  ).length;

  const porCaducar = productos.filter((p) =>
    getAllStatuses(p).includes("por-caducar"),
  ).length;

  const valorTotal = productos.reduce(
    (total, p) => total + Number(p.stockInfo.quantity) * Number(p.costUnit),
    0,
  );

  // Filtrar productos
  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (producto.brand &&
        producto.brand.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesCategoria =
      selectedCategoria === "todas" || producto.category === selectedCategoria;

    // Obtener todos los estados del producto
    const productStatuses = getAllStatuses(producto);

    const matchesEstado =
      selectedEstado === "todos" || productStatuses.includes(selectedEstado);

    const matchesTab =
      selectedTab === "todos" || productStatuses.includes(selectedTab);

    return matchesSearch && matchesCategoria && matchesEstado && matchesTab;
  });

  // Ordenar productos filtrados
  const sortedProductos = [...filteredProductos].sort((a, b) => {
    switch (sortBy) {
      case "nombre-az":
        return a.name.localeCompare(b.name);
      case "nombre-za":
        return b.name.localeCompare(a.name);
      case "stock-menor":
        return Number(a.stockInfo.quantity) - Number(b.stockInfo.quantity);
      case "stock-mayor":
        return Number(b.stockInfo.quantity) - Number(a.stockInfo.quantity);
      case "caducar":
        if (!a.expirationDate) return 1;
        if (!b.expirationDate) return -1;
        return (
          new Date(a.expirationDate).getTime() -
          new Date(b.expirationDate).getTime()
        );
      case "precio-mayor":
        return Number(b.costUnit) - Number(a.costUnit);
      case "precio-menor":
        return Number(a.costUnit) - Number(b.costUnit);
      default:
        return 0;
    }
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-['Cormorant_Garamond'] text-[var(--color-text)] mb-2">
              Inventario
            </h1>
            <p className="text-[var(--color-text-secondary)]">
              {productos.length} productos registrados
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowMovimientoModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 border border-[var(--color-border)] rounded-lg hover:bg-[#F5F2EF] transition-colors"
            >
              <FileText size={20} />
              <span>Registrar Movimiento</span>
            </button>
            <button
              onClick={() => setShowNewProductModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[#7A6349] transition-colors"
            >
              <Plus size={20} />
              <span>Nuevo Producto</span>
            </button>
          </div>
        </div>

        {/* Cards de resumen */}
        <CardsInfo
          totalRegistros={productos.length}
          stockBajo={stockBajo}
          porCaducar={porCaducar}
          valorTotal={valorTotal}
          setSelectedTab={setSelectedTab}
        />
      </div>

      {/* Tabs de estado */}
      <div className="mb-6 border-b border-[var(--color-border)] overflow-x-auto">
        <div className="flex gap-6 min-w-max">
          <button
            onClick={() => setSelectedTab("todos")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "todos"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "todos" ? 600 : 400 }}
          >
            Todos ({productos.length})
          </button>
          <button
            onClick={() => setSelectedTab("normal")}
            className={`pb-3 transition-colors whitespace-nowrap ${
              selectedTab === "normal"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "normal" ? 600 : 400 }}
          >
            Stock Normal (
            {
              productos.filter((p) => getAllStatuses(p).includes("normal"))
                .length
            }
            )
          </button>
          <button
            onClick={() => setSelectedTab("bajo")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "bajo"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "bajo" ? 600 : 400 }}
          >
            Stock Bajo
            <span
              className="px-2 py-0.5 bg-amber-100 text-amber-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                productos.filter((p) => getAllStatuses(p).includes("bajo"))
                  .length
              }
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("agotado")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "agotado"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "agotado" ? 600 : 400 }}
          >
            Sin Stock
            <span
              className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                productos.filter((p) => getAllStatuses(p).includes("agotado"))
                  .length
              }
            </span>
          </button>
          <button
            onClick={() => setSelectedTab("por-caducar")}
            className={`pb-3 transition-colors whitespace-nowrap flex items-center gap-2 ${
              selectedTab === "por-caducar"
                ? "text-[var(--color-primary)] border-b-2 border-[var(--color-primary)]"
                : "text-[var(--color-text-secondary)] hover:text-[var(--color-text)]"
            }`}
            style={{ fontWeight: selectedTab === "por-caducar" ? 600 : 400 }}
          >
            Por Caducar
            <span
              className="px-2 py-0.5 bg-red-100 text-red-600 rounded-full"
              style={{ fontSize: "12px", fontWeight: 600 }}
            >
              {
                productos.filter((p) =>
                  getAllStatuses(p).includes("por-caducar"),
                ).length
              }
            </span>
          </button>
        </div>
      </div>

      {/* Barra de controles */}
      <ProductFilters
        onSearch={(value) => setSearchTerm(value)}
        onSelectedCategoria={(value) => setSelectedCategoria(value)}
        onSelectedEstado={(value) => setSelectedEstado(value)}
        onSortBy={(value) => setSortBy(value)}
      />

      {/* Tabla de productos */}
      <ProductTable
        productosList={sortedProductos}
        onEditProduct={handleProductEdit}
        onDeleteProduct={handleProductDlete}
        onNavigateTo={onNavigateTo}
      />
      {/* Modal: Nuevo Producto */}
      <ProductFormModal
        open={showNewProductModal}
        onClose={() => {
          setShowNewProductModal(false);
          setCurrendProduct(null);
        }}
        onSubmit={handelProductSubmit}
        currendProduct={currendProduct}
      />

      {/* Modal: Registrar Movimiento */}
      <ProductMovimentFormModal
        open={showMovimientoModal}
        onClose={() => setShowMovimientoModal(false)}
        onSubmit={handleStockMovementSubmit}
        productsList={productos}
      />
    </div>
  );
}
