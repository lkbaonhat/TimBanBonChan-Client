import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  return (
    <div className="flex items-center gap-2 text-sm mb-6">
      <a href="/" className="text-pink-500 hover:underline">
        Trang chủ
      </a>
      <ChevronRight className="h-4 w-4 text-gray-400" />
      <span className="text-gray-600">Làm quen với các bé</span>
    </div>
  );
}
