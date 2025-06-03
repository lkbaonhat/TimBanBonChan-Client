import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: PaginationProps) {
  return (
    <div className={`flex justify-center items-center gap-2 mb-2 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        shape="pill"
        animation="none"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="w-14"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <Button
          key={page}
          variant="outline"
          shape="pill"
          animation="none"
          onClick={() => onPageChange(page)}
          className={`w-14 h-10 p-0 ${
            currentPage === page
              ? "bg-[#c5e2f0] text-white border-[#c5e2f0] hover:bg-[#b1d8ec] hover:text-white"
              : "bg-transparent text-gray-700"
          }`}
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        shape="pill"
        animation="none"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="w-14"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
