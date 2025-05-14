import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  currentPath?: string;
}

export default function Breadcrumb({
  items,
  className = "",
  currentPath,
}: BreadcrumbProps) {
  // Use the current location if currentPath is not provided
  const location = useLocation();
  const path = currentPath || location.pathname;

  // The last item in the breadcrumb should be the current page
  const lastIndex = items.length - 1;

  return (
    <div className={`container mx-auto  ${className}`}>
      <nav className="flex py-4" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          {/* Home link */}
          <li className="inline-flex items-center">
            <Link
              to="/"
              className={`text-gray-700 hover:text-gray-900 ${
                path === "/" ? "font-bold" : "font-normal"
              }`}
            >
              {items[0]?.label || "Trang chủ"}
            </Link>
          </li>

          {/* Other breadcrumb items */}
          {items.slice(1).map((item, index) => {
            // Only the last item should be bold (current page)
            const isCurrentPage = index === lastIndex - 1;

            return (
              <li key={index}>
                <div className="flex items-center">
                  <ChevronRight className="w-4 h-4 text-gray-700" />
                  {item.path ? (
                    <Link
                      className={`text-gray-700 hover:text-gray-900 p-0 h-auto no-underline ${
                        isCurrentPage ? "font-bold" : "font-normal"
                      }`}
                      to={item.path}
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span
                      className={`text-gray-900 ${
                        isCurrentPage ? "font-bold" : "font-normal"
                      }`}
                    >
                      {item.label}
                    </span>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
