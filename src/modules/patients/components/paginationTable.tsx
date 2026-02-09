import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface PaginationTableProps {
  onChangePage: (page: number) => void;
  onItemPerPageChange: (value: number) => void;
  totalItems: number;
  currentPage: number;
  itemsPerPage: number;
}

export const PaginationTable = ({
  onChangePage,
  onItemPerPageChange,
  totalItems,
  currentPage,
  itemsPerPage,
}: PaginationTableProps) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChangeItemsPerPage = (value: number) => {
    onItemPerPageChange(value);
  };

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onChangePage(page);
    }
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 5);
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const PaginationButton = ({ number }: { number: number }) => {
    const isActive = number === currentPage;
    return (
      <button
        onClick={() => handleChangePage(number)}
        className={`px-3 py-1 rounded-lg transition-colors ${
          isActive
            ? "bg-[var(--color-primary)] text-white"
            : "border border-[var(--color-border)] hover:bg-[#F5F2EF]"
        }`}
      >
        {number}
      </button>
    );
  };

  const PaginationButtonAction = ({ type }: { type: "left" | "right" }) => {
    const isDisabled =
      type === "left" ? currentPage === 1 : currentPage === totalPages;

    const handleClick = () => {
      if (type === "left" && currentPage > 1) {
        handleChangePage(currentPage - 1);
      } else if (type === "right" && currentPage < totalPages) {
        handleChangePage(currentPage + 1);
      }
    };

    return (
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`p-2 border border-[var(--color-border)] rounded-lg transition-colors ${
          isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#F5F2EF]"
        }`}
      >
        {type === "left" ? (
          <ChevronLeft size={18} />
        ) : (
          <ChevronRight size={18} />
        )}
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)]">
      <div className="text-[var(--color-text-secondary)]">
        Mostrando {startItem}-{endItem} de {totalItems} pacientes
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-text-secondary)]">Mostrar:</span>
          <select
            value={itemsPerPage}
            onChange={(e) => handleChangeItemsPerPage(Number(e.target.value))}
            className="px-3 py-1 border border-[var(--color-border)] rounded-lg focus:outline-none focus:border-[var(--color-primary)]"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <PaginationButtonAction type="left" />

          {getPageNumbers().map((page) => (
            <PaginationButton key={page} number={page} />
          ))}

          <PaginationButtonAction type="right" />
        </div>
      </div>
    </div>
  );
};
