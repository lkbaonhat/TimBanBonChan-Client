import { cn } from "@/lib/utils";

interface ContentHeaderProps {
  title: string;
  level?: "h1" | "h2" | "h3";
  className?: string;
}

const ContentHeader = ({
  title,
  level = "h1",
  className,
}: ContentHeaderProps) => {
  // Base styles that apply to both h1 and h2
  const baseStyles = "font-bold";

  // Level-specific styles
  const levelStyles = {
    h1: "text-3xl md:text-4xl mb-8 mt-8",
    h2: "text-2xl md:text-2xl mb-6 mt-6",
    h3: "text-xl md:text-xl mb-2 mt-2",
  };

  if (level === "h1") {
    return (
      <div className={cn("", className)}>
        <h1 className={cn(baseStyles, levelStyles.h1)}>{title}</h1>
      </div>
    );
  } else if (level === "h3") {
    return (
      <div className={cn("", className)}>
        <h3 className={cn(baseStyles, levelStyles.h3)}>{title}</h3>
      </div>
    );
  } else {
    return (
      <div className={cn("", className)}>
        <h2 className={cn(baseStyles, levelStyles.h2)}>{title}</h2>
      </div>
    );
  }
};

export default ContentHeader;
