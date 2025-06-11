"use client";
import { Heart, Building, MapPin, Phone, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

type CardType = "pet" | "person" | "clinic";

interface CardProps {
  type: CardType;
  image: string;
  title: string;
  badge?: string;
  rating?: number;
  location?: string;
  gender?: string;
  area?: string;
  phone?: string;
  hours?: string;
  price?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export default function Card({
  type,
  image,
  title,
  badge,
  rating,
  location,
  gender,
  area,
  phone,
  hours,
  price,
  buttonText,
  onButtonClick,
  className = "",
}: CardProps) {
  // Default button text based on card type
  const defaultButtonText = {
    pet: "Nhận nuôi ngay",
    person: "Chi tiết",
    clinic: "Gọi ngay",
  };

  // Determine which info items to show based on card type
  const renderInfoItems = () => {
    switch (type) {
      case "pet":
      case "person":
        return (
          <div className="space-y-2 mb-4">
            {gender && (
              <div className="flex items-center text-sm text-gray-600">
                <Heart size={16} className="mr-2 flex-shrink-0" />
                <span>{gender}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center text-sm text-gray-600">
                <Building size={16} className="mr-2 flex-shrink-0" />
                <span>{location}</span>
              </div>
            )}
            {area && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin size={16} className="mr-2 flex-shrink-0" />
                <span>{area}</span>
              </div>
            )}
          </div>
        );
      case "clinic":
        return (
          <div className="space-y-2 mb-4">
            {phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone size={16} className="mr-2 flex-shrink-0" />
                <span>{phone}</span>
              </div>
            )}
            <div className="flex justify-between text-sm text-gray-600">
              {hours && (
                <div className="flex items-center text-sm text-gray-600">
                  <Clock size={16} className="mr-2 flex-shrink-0" />
                  <span>{hours}</span>
                </div>
              )}
              {price && (
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span className="text-right">{price}</span>
                </div>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`bg-white rounded-3xl overflow-hidden shadow-sm h-full ${className}`}
    >
      {/* Image */}
      <div className="relative">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className={`w-full ${type === "pet" ? "h-100" : "h-100"
            } object-cover`}
        />
      </div>

      {/* Content */}
      <div className="p-4 relative">
        {/* Header */}
        {type === "clinic" && location && (
          <div className="text-sm text-gray-500 mb-1">{location}</div>
        )}

        <div className="flex justify-between items-start mb-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          {/* Remove duplicate badge for pet cards */}
          {type === "clinic" && rating !== undefined && (
            <div className="text-[#ff99c0] font-medium">
              {rating} <span className="text-[#ff99c0">★</span>
            </div>
          )}
        </div>

        {/* Info Items */}
        {renderInfoItems()}

        {badge && type === "pet" && (
          <span className="absolute top-3 right-3 bg-[#5b7ccb] text-white text-xs px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
        {type === "person" && (
          <span className="absolute top-3 right-3 bg-[#5b7ccb] text-white text-xs px-3 py-1 rounded-full">
            ✓
          </span>
        )}

        {/* Button - Pink buttons with no animation and fixed spacing */}
        {buttonText && (
          <Button
            variant="pink"
            shape="pill"
            animation="none"
            className="w-full mt-2"
            onClick={onButtonClick}
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
