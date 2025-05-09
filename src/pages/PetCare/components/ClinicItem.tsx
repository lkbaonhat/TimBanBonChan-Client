import { Phone } from "lucide-react"

interface ClinicItemProps {
  id: number
  name: string
  location: string
  rating: number
  phone: string
  price: string
  image: string
}

export default function ClinicItem({ id, name, location, rating, phone, price, image }: ClinicItemProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md">
      <div className="grid grid-cols-3">
        <div className="col-span-1">
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = "https://via.placeholder.com/200x200?text=Clinic"
            }}
          />
        </div>
        <div className="col-span-2 p-4">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-gray-900">{name}</h4>
              <p className="text-sm text-gray-600">{location}</p>
            </div>
            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">{rating} ⭐</div>
          </div>

          <div className="mt-2 text-sm">
            <p className="flex items-center text-gray-600">
              <Phone size={14} className="mr-1" />
              {phone}
            </p>
            <p className="text-gray-600 mt-1">{price}</p>
          </div>

          <button className="mt-3 w-full py-2 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-colors text-sm font-medium">
            Gọi ngay
          </button>
        </div>
      </div>
    </div>
  )
}
