import { LOGO } from "@/constants/global";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export default function Loading({
  size = "md",
  text = "Đang tải...",
  className = "",
}: LoadingProps) {
  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-12 w-12";
      case "lg":
        return "h-24 w-24";
      default:
        return "h-16 w-16";
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className="relative">
        <img
          src={LOGO.NO_TEXT}
          alt="Loading..."
          className={`${getSizeClasses()} animate-spin`}
          style={{ animationDuration: "2s" }}
        />
      </div>
      {text && (
        <p className="text-gray-600 text-sm font-medium animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
}

// Component for full page loading
export function PageLoading({
  text = "Đang tải dữ liệu...",
}: {
  text?: string;
}) {
  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <Loading size="lg" text={text} />
    </div>
  );
}

// Component for card/section loading
export function SectionLoading({ text = "Đang tải..." }: { text?: string }) {
  return (
    <div className="py-8 flex items-center justify-center">
      <Loading size="md" text={text} />
    </div>
  );
}
