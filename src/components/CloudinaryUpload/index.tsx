import type React from "react"
import { useCallback, useState, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface CloudinaryUploadProps {
    onImageUploaded: (url: string) => void
    defaultImage?: string
    isPrimary?: boolean
}

export function CloudinaryUpload({ onImageUploaded, defaultImage }: CloudinaryUploadProps) {
    const [uploading, setUploading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [previewUrl, setPreviewUrl] = useState<string | null>(defaultImage || null)
    const [error, setError] = useState<string | null>(null)

    // Initialize with defaultImage if provided
    useEffect(() => {
        if (defaultImage && defaultImage.trim() !== "") {
            setPreviewUrl(defaultImage)
        }
    }, [defaultImage])

    const uploadToCloudinary = async (file: File) => {
        setUploading(true)
        setProgress(10)
        setError(null)

        try {
            // Create FormData for Cloudinary upload
            const formData = new FormData()
            formData.append("file", file)
            formData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET) // Replace with your actual upload preset

            // Create temporary preview for immediate feedback
            const localPreview = URL.createObjectURL(file)
            setPreviewUrl(localPreview)

            // Set up progress tracking
            const progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 90) return 90
                    return prev + 5
                })
            }, 200)

            // Make the actual API call to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: "POST",
                    body: formData
                }
            )

            clearInterval(progressInterval)

            if (!response.ok) {
                throw new Error("Upload to Cloudinary failed")
            }

            const data = await response.json()
            setProgress(100)

            // Clean up the local preview URL
            URL.revokeObjectURL(localPreview)

            // Set the actual Cloudinary URL and notify parent component
            setPreviewUrl(data.secure_url)
            onImageUploaded(data.secure_url)

            setTimeout(() => {
                setUploading(false)
                setProgress(0)
            }, 500)
        } catch (err) {
            console.error("Upload error:", err)
            setError("Upload failed. Please try again.")
            setProgress(0)
            setUploading(false)
        }
    }

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles.length === 0) return;

            const file = acceptedFiles[0];
            uploadToCloudinary(file);
        },
        []
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [".jpeg", ".jpg", ".png", ".gif"],
        },
        maxFiles: 1,
        disabled: uploading,
    });

    const removeImage = () => {
        // Clean up object URL to avoid memory leaks
        if (previewUrl && previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
        onImageUploaded("");
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            uploadToCloudinary(file);
        }
    };

    return (
        <div className="w-full grid grid-cols-2 gap-2">
            <div
                {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${isDragActive
                    ? "border-blue-400 bg-blue-50 scale-105"
                    : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"
                    }`}
            >
                <input {...getInputProps()} onChange={handleFileUpload} />
                <div className="flex flex-col items-center justify-center gap-3">
                    <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-full shadow-lg">
                        <Upload className="h-6 w-6 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-semibold text-gray-700 mb-1">
                            {isDragActive ? "Thả ảnh vào đây" : "Tải ảnh lên"}
                        </p>
                        <p className="text-xs text-gray-500">Kéo và thả hoặc click để chọn ảnh</p>
                    </div>
                </div>
            </div>

            {uploading && (
                <div className="mt-3 bg-white/90 border border-blue-200 rounded-lg p-3">
                    <div className="flex flex-col gap-2">
                        <p className="text-sm text-center font-medium text-blue-700">Đang tải lên... {progress}%</p>
                        <Progress value={progress} className="w-full h-2" />
                    </div>
                </div>
            )}

            {previewUrl && !uploading && (
                <div className="mt-3 relative rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                    <img
                        src={previewUrl}
                        alt="Preview"
                        className="w-full h-36 object-cover"
                        onError={(e) => {
                            // Fallback if the image URL is invalid
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                    />
                    <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 rounded-full shadow-lg hover:scale-110 transition-transform"
                        onClick={removeImage}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-600 flex items-center gap-2">
                        <X className="h-4 w-4" />
                        {error}
                    </p>
                </div>
            )}
        </div>
    );
}
