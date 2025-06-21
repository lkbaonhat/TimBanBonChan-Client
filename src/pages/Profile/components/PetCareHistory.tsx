import { useState, useCallback, useEffect } from "react";
import Card from "@/components/Card/Card";
import { petService } from "@/services/petService";
import { Pet } from "@/types/Pet";
import { toast } from "sonner";
import { Heart } from "lucide-react";

interface PetCareHistoryProps {
  userId: number;
}

export default function PetCareHistory({ userId }: PetCareHistoryProps) {
  const [adoptedPets, setAdoptedPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch pets that the user has adopted
  const fetchAdoptedPets = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      console.log(
        "Fetching adopted pets for userId:",
        userId,
        "with AdoptionStatus: Adopted"
      );

      // Using getAllPets with filter for adoption status
      const response = await petService.getAllPets({
        userId: userId,
        adoptionStatus: "Adopted",
      });

      console.log("Adopted pets API response:", response.data);

      // The pets are inside data.items array
      const petsData = response.data?.data?.items || [];
      console.log("API response contains", petsData.length, "adopted pets");

      // Show sample of first pet if available
      if (petsData.length > 0) {
        console.log("Sample adopted pet data:", {
          petId: petsData[0].petId,
          name: petsData[0].petName,
          imageUrls: petsData[0].petImageUrls,
          primaryImage: petsData[0].primaryImageUrl,
          adoptionStatus: petsData[0].adoptionStatus,
        });
      }

      setAdoptedPets(petsData);
    } catch (error) {
      console.error("Error fetching adopted pets:", error);
      toast.error("Không thể tải danh sách thú cưng đã nhận nuôi");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      fetchAdoptedPets();
    }
  }, [userId, fetchAdoptedPets]);

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-3 text-center py-8">
              Đang tải dữ liệu...
            </div>
          ) : adoptedPets.length > 0 ? (
            adoptedPets.map((pet) => {
              // Log the pet data to understand the structure
              console.log(`Adopted pet ${pet.petId} image:`, {
                petImageUrls: pet.petImageUrls,
                primaryImageUrl: pet.primaryImageUrl,
              });

              // Extract image URL properly
              const imageUrl =
                pet.primaryImageUrl ||
                (typeof pet.petImageUrls === "string"
                  ? pet.petImageUrls
                  : null) ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tzGZPvIid5Qe3xRaobyJwv8n7kYoh.png";

              return (
                <div className="relative h-full" key={pet.petId}>
                  <Card
                    type="pet"
                    image={imageUrl}
                    title={pet.petName}
                    badge={pet.categoryName}
                    gender={pet.gender}
                    location={`${pet.age} tuổi`}
                    className="h-full"
                  />
                  {/* Heart icon to indicate adopted pets */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-red-100 p-1.5 rounded-full">
                      <Heart
                        size={16}
                        className="text-red-500"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-3 text-center py-8 text-gray-500">
              Bạn chưa nhận nuôi thú cưng nào.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
