import { useState, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash, Plus } from "lucide-react";
import { toast } from "sonner";
import Card from "@/components/Card/Card";
import ROUTES from "@/constants/routes";
import { petService } from "@/services/petService";
import { Pet } from "@/types/Pet";
import { SectionLoading } from "@/components/Loading";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface MyPetsProps {
  userId: number;
}

export default function MyPets({ userId }: MyPetsProps) {
  const [userPets, setUserPets] = useState<Pet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [currentPet, setCurrentPet] = useState<Partial<Pet> | null>(null);
  const navigate = useNavigate();
  // Fetch user's own pets (purpose = "Show")
  const fetchUserPets = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      // Using the service function that calls /pets/filter with CreatedByUserId and Purpose
      const response = await petService.getUserPets(userId, "Show");

      // The pets are inside data.items array, not directly in data
      const petsData = response.data?.data.items || [];

      // Set the items array to state
      setUserPets(petsData);
    } catch (error) {
      console.error("Error fetching user pets:", error);
      toast.error("Không thể tải danh sách thú cưng");
    } finally {
      setIsLoading(false);
    }
  }, [userId]);
  useEffect(() => {
    if (userId) {
      fetchUserPets();
    }
  }, [userId, fetchUserPets]);

  // Navigate to Add Pet page
  const handleAddPet = () => {
    navigate(ROUTES.PUBLIC.ADD_PET);
  };

  // Navigate to Edit Pet page
  const handleEditPet = (petId: number) => {
    navigate(ROUTES.PUBLIC.UPDATE_PET.replace(":id", petId.toString()));
  };

  // Handle delete pet click - show confirmation dialog
  const handleDeleteClick = (pet: Partial<Pet>) => {
    setCurrentPet(pet);
    setShowDeleteDialog(true);
  };

  // Delete pet
  const handleDeletePet = async () => {
    if (!currentPet || !currentPet.petId) return;

    try {
      await petService.deletePet(currentPet.petId);
      toast.success("Xóa thú cưng thành công");
      fetchUserPets(); // Refresh the list
    } catch (error) {
      console.error("Error deleting pet:", error);
      toast.error("Không thể xóa thú cưng");
    } finally {
      setShowDeleteDialog(false);
      setCurrentPet(null);
    }
  };

  return (
    <div>
      {" "}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 min-h-screen">
        {isLoading ? (
          <div className="col-span-3">
            <SectionLoading text="Đang tải danh sách thú cưng..." />
          </div>
        ) : userPets.length > 0 ? (
          <>
            {" "}
            {userPets.map((pet) => {
              // Extract image URL properly
              const imageUrl =
                pet.primaryImageUrl ||
                (typeof pet.petImageUrls === "string"
                  ? pet.petImageUrls
                  : null) ||
                "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-8tzGZPvIid5Qe3xRaobyJwv8n7kYoh.png";

              return (
                <div className="relative h-full">
                  <Card
                    key={pet.petId}
                    type="pet"
                    image={imageUrl}
                    title={pet.petName}
                    badge={pet.categoryName}
                    gender={pet.gender}
                    location={`${pet.age} tuổi`}
                    className="h-full"
                  />
                  {/* Action buttons positioned at bottom right */}
                  <div className="absolute bottom-3 right-3 flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      animation={"none"}
                      className="h-8 w-8 rounded-full hover:bg-slate-100 "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditPet(pet.petId);
                      }}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      animation={"none"}
                      className="h-8 w-8 rounded-full hover:bg-red-100 "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteClick(pet);
                      }}
                    >
                      <Trash size={16} />
                    </Button>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <div className="col-span-3 text-center py-8 text-gray-500">
            Bạn chưa có thú cưng nào. Hãy thêm thú cưng của bạn!
          </div>
        )}

        {/* Add New Pet Card */}
        <div
          className="border-2 border-gray-300 border-dashed rounded-xl overflow-hidden cursor-pointer h-full flex flex-col hover:border-gray-400 transition-colors"
          onClick={handleAddPet}
        >
          <div className="flex-grow flex flex-col items-center justify-center p-8 gap-3">
            <div className="border-2 border-gray-400 w-16 h-16 rounded-full flex items-center justify-center shadow-sm">
              <Plus size={24} className="text-gray-500" />
            </div>
            <p className="text-gray-500 font-medium">Thêm thú cưng mới</p>
          </div>
        </div>
      </div>
      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa thú cưng "{currentPet?.petName}"? Hành
              động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePet}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
