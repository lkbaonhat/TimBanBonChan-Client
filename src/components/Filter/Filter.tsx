import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterOption {
  id: string;
  label: string;
  value: string;
}

export interface FilterConfig {
  id: string;
  placeholder: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
}

interface FilterProps {
  filters: FilterConfig[];
  className?: string;
}

export default function Filter({ filters, className = "" }: FilterProps) {
  return (
    <div className={`flex flex-wrap gap-4 ${className}`}>
      {filters.map((filter) => (
        <div key={filter.id} className="w-auto min-w-[160px]">
          <Select value={filter.value} onValueChange={filter.onChange}>
            <SelectTrigger className="w-full h-12 rounded-full border border-gray-200 flex items-center justify-center">
              <SelectValue
                placeholder={filter.placeholder}
                className="text-center"
              />
            </SelectTrigger>
            <SelectContent>
              {filter.options.map((option) => (
                <SelectItem key={option.id} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
