"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../../../components/Breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";

// Import components
import ImageUploader from "./components/ImageUploader";
import ArticleForm from "./components/ArticleForm";
import RichTextEditor from "./components/RichTextEditor";

// Import custom Froala styles - these will be applied globally
import "./froalaStyles.css";

interface UserData {
  role: string;
  // Other user properties would go here
}

const BlogCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [backgroundImage, setBackgroundImage] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [isStaff, setIsStaff] = useState(false);

  // Mock function to get current user - replace with actual auth implementation
  const getCurrentUser = () => {
    // This would typically be fetched from your auth context or API
    return {
      id: "123",
      name: "Admin User",
      role: "staff", // For testing purposes, hardcoded as staff
    };
  };

  useEffect(() => {
    // Get current user and check if they're staff
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setIsStaff(currentUser?.role === "staff");
  }, []);

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setBackgroundImage(file);
    setBackgroundPreview(previewUrl);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isStaff) {
      alert("You don't have permission to create articles");
      return;
    }

    if (!title || !content || !excerpt) {
      alert("Please fill in all required fields");
      return;
    }

    if (!backgroundImage) {
      alert("Please upload a background image for your article");
      return;
    }

    setIsSubmitting(true);

    try {
      // Mock image upload - replace with actual implementation
      const imageUrl = await uploadImage(backgroundImage);

      // Mock API call - replace with actual implementation
      const articleData = {
        title,
        content,
        excerpt,
        backgroundImage: imageUrl, // Add the image URL
        author: {
          name: user?.name || "Anonymous",
          avatar: "/avatars/default.jpg",
          date: new Date().toLocaleDateString("vi-VN"),
        },
        likes: 0,
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Success - redirect to pet care page
      alert("Article created successfully!");
      navigate("/pet-care");
    } catch (error) {
      console.error("Error creating article:", error);
      alert("Failed to create article. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Mock function to upload image - replace with actual implementation
  const uploadImage = async (file: File): Promise<string> => {
    // This would be an actual API call to upload the image

    // Simulate upload delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Return a mock URL
    return URL.createObjectURL(file);
  };

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng", path: "/pet-care" },
    { label: "Tạo bài viết mới" },
  ];

  if (!isStaff) {
    return (
      <div className="min-h-screen">
        <Breadcrumb items={breadcrumbItems} />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-10">
            <h1 className="text-2xl font-bold text-red-600 mb-4">
              Không có quyền truy cập
            </h1>
            <p className="text-gray-600 mb-4">
              Bạn không có quyền tạo bài viết mới.
            </p>
            <Button variant="pink" onClick={() => navigate("/pet-care")}>
              Quay lại trang Sổ tay
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Breadcrumb items={breadcrumbItems} />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Tạo bài viết mới
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Two-column layout for the top section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left column: Article form (title and excerpt) */}
            <div>
              <ArticleForm
                title={title}
                excerpt={excerpt}
                onTitleChange={setTitle}
                onExcerptChange={setExcerpt}
              />
            </div>

            {/* Right column: Image uploader */}
            <div className="h-full">
              <ImageUploader onImageChange={handleImageChange} />
            </div>
          </div>

          {/* Full-width rich text editor below */}
          <div>
            <label className="block mb-2 text-lg font-medium text-gray-900">
              Nội dung
            </label>
            <RichTextEditor content={content} onContentChange={setContent} />
          </div>

          {/* Form buttons */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="blue"
              animation={"none"}
              onClick={() => navigate("/pet-care")}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="pink"
              disabled={isSubmitting}
              animation={"none"}
            >
              {isSubmitting ? "Đang lưu..." : "Lưu bài viết"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreate;
