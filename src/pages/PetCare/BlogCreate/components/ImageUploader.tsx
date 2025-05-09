import React, { useState, useRef, useCallback } from "react";
import { Image, X, Move, RotateCw, Check } from "lucide-react";
import ReactCrop, { centerCrop, makeAspectCrop, Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

interface ImageUploaderProps {
  onImageChange: (file: File | null, previewUrl: string | null) => void;
}

// Function to generate a centered crop based on aspect ratio
function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: "%",
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );
  const [isDragging, setIsDragging] = useState(false);
  const [cropMode, setCropMode] = useState(false);
  const [crop, setCrop] = useState<Crop>();
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [completedCrop, setCompletedCrop] = useState<Crop | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dropAreaRef = useRef<HTMLDivElement>(null);

  // Image handling functions
  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    if (cropMode) {
      const { width, height } = e.currentTarget;
      // Default to a 16:9 aspect ratio
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    processFile(file);
  };

  const processFile = (file: File) => {
    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    // Validate file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB.");
      return;
    }

    setBackgroundImage(file);

    // Create a preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setBackgroundPreview(result);
      onImageChange(file, result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setBackgroundImage(null);
    setBackgroundPreview(null);
    setCropMode(false);
    setRotation(0);
    setZoom(1);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      processFile(file);
      e.dataTransfer.clearData();
    }
  };

  // Crop functions
  const toggleCropMode = () => {
    setCropMode(!cropMode);
    if (!cropMode && imgRef.current) {
      const { width, height } = imgRef.current;
      setCrop(centerAspectCrop(width, height, 16 / 9));
    }
  };

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyZoom = (newZoom: number) => {
    setZoom(Math.max(0.5, Math.min(3, newZoom)));
  };

  // Fixed cropping function that properly handles the cropped area
  const saveCroppedImage = useCallback(async () => {
    if (!imgRef.current || !canvasRef.current || !completedCrop) {
      return;
    }

    const image = imgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      return;
    }

    // Set proper canvas dimensions
    const pixelRatio = window.devicePixelRatio || 1;
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = completedCrop.width * scaleX * pixelRatio;
    canvas.height = completedCrop.height * scaleY * pixelRatio;

    // Scale the context for high DPI displays
    ctx.scale(pixelRatio, pixelRatio);
    ctx.imageSmoothingQuality = "high";

    // Calculate the position of the cropped area in the original image
    const cropX = completedCrop.x * scaleX;
    const cropY = completedCrop.y * scaleY;
    const cropWidth = completedCrop.width * scaleX;
    const cropHeight = completedCrop.height * scaleY;

    // Apply rotation
    if (rotation !== 0) {
      // Move to center of canvas
      ctx.translate(
        canvas.width / (2 * pixelRatio),
        canvas.height / (2 * pixelRatio)
      );
      // Rotate around the center
      ctx.rotate((rotation * Math.PI) / 180);
      // Move back
      ctx.translate(
        -canvas.width / (2 * pixelRatio),
        -canvas.height / (2 * pixelRatio)
      );
    }

    // Apply zoom and draw the image
    ctx.drawImage(
      image,
      cropX, // source x
      cropY, // source y
      cropWidth, // source width
      cropHeight, // source height
      0, // destination x
      0, // destination y
      canvas.width / pixelRatio, // destination width
      canvas.height / pixelRatio // destination height
    );

    // Convert canvas to blob
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error("Canvas is empty");
          return;
        }

        // Create a new File from the blob
        const croppedFile = new File(
          [blob],
          backgroundImage?.name || "cropped-image.jpg",
          {
            type: "image/jpeg",
            lastModified: Date.now(),
          }
        );

        // Update states
        setBackgroundImage(croppedFile);
        const newPreviewUrl = URL.createObjectURL(blob);
        setBackgroundPreview(newPreviewUrl);

        // Notify parent component
        onImageChange(croppedFile, newPreviewUrl);

        // Exit crop mode
        setCropMode(false);
      },
      "image/jpeg",
      0.95
    );
  }, [completedCrop, rotation, zoom, backgroundImage?.name, onImageChange]);

  return (
    <div className="h-full">
      <label className="block mb-2 text-lg font-medium text-gray-900">
        Ảnh nền bài viết
      </label>
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageSelect}
        className="hidden"
      />

      {backgroundPreview && !cropMode ? (
        <div className="relative w-full mb-4">
          <img
            ref={imgRef}
            src={backgroundPreview}
            alt="Background preview"
            className="w-full object-cover rounded-lg"
            style={{ maxHeight: "400px" }}
          />
          <div className="absolute top-2 right-2 flex space-x-2">
            <button
              type="button"
              onClick={toggleCropMode}
              className="bg-white p-2 rounded-full text-blue-600 hover:bg-blue-50 shadow-md"
              title="Edit image"
            >
              <Move size={20} />
            </button>
            <button
              type="button"
              onClick={handleRemoveImage}
              className="bg-white p-2 rounded-full text-red-600 hover:bg-red-50 shadow-md"
              title="Remove image"
            >
              <X size={20} />
            </button>
          </div>
        </div>
      ) : backgroundPreview && cropMode ? (
        <div className="w-full mb-4 border rounded-lg overflow-hidden bg-gray-100 p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-lg font-medium">Chỉnh sửa ảnh</h4>
            <div className="flex space-x-2">
              <button
                type="button"
                className="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                onClick={rotateImage}
                title="Rotate"
              >
                <RotateCw size={20} />
              </button>
              <div className="flex items-center bg-gray-200 rounded-full px-2">
                <button
                  type="button"
                  className="p-1 hover:bg-gray-300 rounded-full"
                  onClick={() => applyZoom(zoom - 0.1)}
                  title="Zoom out"
                >
                  -
                </button>
                <span className="mx-2 text-sm">{Math.round(zoom * 100)}%</span>
                <button
                  type="button"
                  className="p-1 hover:bg-gray-300 rounded-full"
                  onClick={() => applyZoom(zoom + 0.1)}
                  title="Zoom in"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="relative">
            <ReactCrop
              crop={crop}
              onChange={(c) => setCrop(c)}
              onComplete={(c) => setCompletedCrop(c)}
              aspect={16 / 9}
              className="max-h-[400px] mx-auto"
            >
              <img
                ref={imgRef}
                src={backgroundPreview}
                alt="Crop preview"
                style={{
                  transform: `rotate(${rotation}deg) scale(${zoom})`,
                  maxHeight: "400px",
                  maxWidth: "100%",
                  display: "block",
                  margin: "0 auto",
                }}
                onLoad={onImageLoad}
              />
            </ReactCrop>
            <canvas ref={canvasRef} className="hidden" />
          </div>

          <div className="flex justify-end mt-4 space-x-2">
            <button
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              onClick={() => setCropMode(false)}
            >
              Hủy
            </button>
            <button
              type="button"
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center"
              onClick={saveCroppedImage}
            >
              <Check size={16} className="mr-1" /> Lưu chỉnh sửa
            </button>
          </div>
        </div>
      ) : (
        <div
          ref={dropAreaRef}
          onClick={triggerFileInput}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
            isDragging
              ? "border-pink-400 bg-pink-50"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          <Image
            size={48}
            className={isDragging ? "text-pink-400" : "text-gray-400"}
          />
          <p
            className={`font-medium mt-2 ${
              isDragging ? "text-pink-500" : "text-gray-500"
            }`}
          >
            {isDragging ? "Thả ảnh ở đây" : "Tải lên ảnh nền bài viết"}
          </p>
          <p className="text-gray-400 text-sm mt-1">
            Kéo và thả ảnh hoặc nhấp để chọn file (Kích thước tối đa: 5MB)
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
