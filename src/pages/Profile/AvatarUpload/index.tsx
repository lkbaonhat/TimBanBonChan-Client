import { useState, useRef } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Upload, X, Loader2 } from "lucide-react";
import { userService } from "@/services/userService";

interface AvatarUploadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    currentAvatar?: string;
    userName?: string;
    userId: number;
    onAvatarUpdate: (newAvatarUrl: string) => void;
}

export default function AvatarUploadDialog({
    open,
    onOpenChange,
    currentAvatar,
    userName,
    userId,
    onAvatarUpdate,
}: AvatarUploadDialogProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string>("");
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Cloudinary configuration - replace with your actual values
    const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your-cloud-name";
    const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your-upload-preset";

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file hình ảnh');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước file không được vượt quá 5MB');
                return;
            }

            setSelectedFile(file);

            // Create preview URL
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreviewUrl(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
            formData.append('folder', 'avatars'); // Optional: organize uploads in folders

            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!cloudinaryResponse.ok) {
                throw new Error('Upload failed');
            }

            const cloudinaryData = await cloudinaryResponse.json();
            const newAvatarUrl = cloudinaryData.secure_url;

            // Step 2: Update user profile via API
            const payload = {
                profilePicture: newAvatarUrl,
                userId: userId
            };

            await userService.updateAvatarProfile(userId, payload);

            // Call the callback with the new avatar URL
            onAvatarUpdate(cloudinaryData.secure_url);

            // Close dialog and reset state
            handleClose();

        } catch (error) {
            console.error('Upload error:', error);
            alert('Có lỗi xảy ra khi tải ảnh lên. Vui lòng thử lại.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreviewUrl("");
        onOpenChange(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            const file = files[0];
            if (file.type.startsWith('image/')) {
                setSelectedFile(file);
                const reader = new FileReader();
                reader.onload = (e) => {
                    setPreviewUrl(e.target?.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>Cập nhật ảnh đại diện</DialogTitle>
                    <DialogDescription>
                        Chọn một hình ảnh mới để làm ảnh đại diện của bạn.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    {/* Current Avatar Preview */}
                    <div className="flex justify-center">
                        <Avatar className="w-32 h-32">
                            <AvatarImage
                                src={previewUrl || currentAvatar}
                                alt={userName}
                            />
                            <AvatarFallback className="bg-[#C5E2F0] text-[#0053A3] font-medium text-2xl">
                                {userName?.split(" ").pop()?.charAt(0).toUpperCase() ||
                                    userName?.charAt(0).toUpperCase() || "U"}
                            </AvatarFallback>
                        </Avatar>
                    </div>

                    {/* File Upload Area */}
                    <div
                        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-gray-400 transition-colors"
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                        <p className="text-sm text-gray-600 mb-2">
                            Kéo thả hình ảnh vào đây hoặc <span className="text-blue-600 font-medium">nhấp để chọn</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            PNG, JPG, GIF tối đa 5MB
                        </p>
                    </div>

                    {/* Selected File Info */}
                    {selectedFile && (
                        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                    <Upload className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl("");
                                    if (fileInputRef.current) {
                                        fileInputRef.current.value = "";
                                    }
                                }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isUploading}
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="blue"
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Đang tải lên...
                            </>
                        ) : (
                            "Cập nhật ảnh"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}