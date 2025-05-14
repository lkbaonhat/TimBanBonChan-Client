import { Button } from "@/components/ui/button";

interface DotPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function DotPagination({
  currentPage,
  totalPages,
  onPageChange,
  className = "",
}: DotPaginationProps) {
  return (
    <div className={`flex justify-center space-x-2 ${className}`}>
      {Array.from({ length: totalPages }).map((_, index) => (
        <Button
          key={index}
          variant="ghost"
          animation="none"
          onClick={() => onPageChange(index)}
          className={`p-0 h-3 min-w-0 ${
            currentPage === index
              ? "bg-[#c5e2f0] w-6 hover:bg-[#b3dff5]"
              : "bg-gray-300 w-3"
          } rounded-full transition-all duration-300`}
          aria-label={`Go to slide ${index + 1}`}
        />
      ))}
    </div>
  );
}
