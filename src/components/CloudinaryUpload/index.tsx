import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'

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

    const uploadToCloudinary = async (file: File) => {
        setUploading(true)
        setProgress(10)
        setError(null)

        try {
            // Create a FormData object to send the file
            const formData = new FormData()
            formData.append('file', file)
            formData.append('upload_preset', 'pet_adoption') // Replace with your Cloudinary upload preset

            // Simulate progress (in a real app, you might use an upload progress event)
            const progressInterval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval)
                        return 90
                    }
                    return prev + 10
                })
            }, 300)

            // Upload to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/your-cloud-name/image/upload`, // Replace with your Cloudinary cloud name
                {
                    method: 'POST',
                    body: formData,
                }
            )

            clearInterval(progressInterval)

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            setProgress(100)            // In a real app, this would be the actual URL from Cloudinary
            // For this example, we'll use the preview URL
            onImageUploaded(data.secure_url)

            // For demo purposes, we'll just use the local preview
            // Remove this in a real implementation
            setTimeout(() => {
                setUploading(false)
            }, 500)
        } catch (err) {
            setError('Upload failed. Please try again.')
            setProgress(0)
            setUploading(false)
        }
    }

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return

        const file = acceptedFiles[0]

        // Create a preview URL
        const objectUrl = URL.createObjectURL(file)
        setPreviewUrl(objectUrl)

        // Upload to Cloudinary
        uploadToCloudinary(file)

        // Clean up the preview URL when component unmounts
        return () => URL.revokeObjectURL(objectUrl)
    }, [onImageUploaded])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.gif']
        },
        maxFiles: 1,
        disabled: uploading
    })

    const removeImage = () => {
        setPreviewUrl(null)
        onImageUploaded('')
    }

    // For demo purposes, simulate Cloudinary upload with the local preview
    const handleDemoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0]
            const objectUrl = URL.createObjectURL(file)
            setPreviewUrl(objectUrl)

            // Simulate upload process
            setUploading(true)
            setProgress(0)

            let currentProgress = 0
            const progressInterval = setInterval(() => {
                currentProgress += 10
                setProgress(currentProgress)

                if (currentProgress >= 100) {
                    clearInterval(progressInterval)
                    setTimeout(() => {
                        setUploading(false)
                        onImageUploaded(objectUrl) // In a real app, this would be the Cloudinary URL
                    }, 500)
                }
            }, 200)
        }
    }

    return (
        <div className="w-full">
            {previewUrl ? (
                <div className="relative rounded-md overflow-hidden border">
                    <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                    />

                    {uploading ? (
                        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white p-4">
                            <p className="mb-2">Đang tải lên... {progress}%</p>
                            <Progress value={progress} className="w-full" />
                        </div>
                    ) : (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 rounded-full"
                            onClick={removeImage}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    )}
                </div>
            ) : (
                <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'
                        }`}
                >
                    <input {...getInputProps()} onChange={handleDemoUpload} />
                    <div className="flex flex-col items-center justify-center gap-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                            <Upload className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium">
                            {isDragActive ? 'Thả ảnh vào đây' : 'Kéo và thả ảnh vào đây, hoặc click để chọn'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            Hỗ trợ: JPG, PNG, GIF (Tối đa 5MB)
                        </p>
                    </div>
                </div>
            )}

            {error && (
                <p className="text-sm text-destructive mt-2">{error}</p>
            )}
        </div>
    )
}