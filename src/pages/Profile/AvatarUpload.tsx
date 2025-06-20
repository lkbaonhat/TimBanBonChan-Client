import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import { toast } from "sonner";

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentAvatar?: string;
  userName?: string;
  userId?: number; // Không còn là prop bắt buộc
  onAvatarUpdate: (avatarUrl: string) => void;
}

const AvatarUploadDialog: React.FC<AvatarUploadDialogProps> = ({
  open,
  onOpenChange,
  currentAvatar,
  userName,
  userId,
  onAvatarUpdate,
}) => {
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>("");
  const [uploading, setUploading] = useState(false);

  const handleSubmit = () => {
    if (!newAvatarUrl) {
      toast.error("Vui lòng tải lên ảnh đại diện");
      return;
    }

    onAvatarUpdate(newAvatarUrl);
    onOpenChange(false);
  };

  const handleImageUploaded = (url: string) => {
    setNewAvatarUrl(url);
    setUploading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
          <DialogDescription>
            Tải lên ảnh đại diện mới cho tài khoản của bạn.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center justify-center py-4 gap-4">
          <div className="h-32 w-32 rounded-full overflow-hidden">
            <img
              src={
                newAvatarUrl ||
                currentAvatar ||
                "https://via.placeholder.com/128"
              }
              alt={userName || "User"}
              className="h-full w-full object-cover"
            />
          </div>

          <CloudinaryUpload
            onImageUploaded={handleImageUploaded}
            defaultImage={currentAvatar}
          />
        </div>

        <DialogFooter>
          <Button
            variant="blue"
            onClick={() => onOpenChange(false)}
            animation="none"
          >
            Hủy
          </Button>
          <Button
            variant="pink"
            onClick={handleSubmit}
            animation="none"
            disabled={!newAvatarUrl || uploading}
          >
            {uploading ? "Đang tải lên..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarUploadDialog;
