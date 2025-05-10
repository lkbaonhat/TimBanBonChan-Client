"use client";

import { useState, useEffect } from "react";
import { Search, ChevronLeft, ChevronRight, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// Sample data for pet care articles
const petCareArticles = [
  {
    id: 1,
    title: "Chăm sóc bé cưng nhà bạn vào mùa hè",
    excerpt:
      "Mùa hè nắng nóng, các bé thú cưng của nhà bạn cần những quan tâm đặc biệt để luôn khỏe mạnh và thoải mái.",
    author: {
      name: "Siriana Pham",
      avatar: "/petcarebg.png",
      date: "24/07/2023",
    },
    likes: 4,
  },
  {
    id: 2,
    title: "Thực đơn khỏe mạnh ở nhà cho mèo",
    excerpt:
      "Chế độ ăn theo từng độ tuổi của mèo, những thực phẩm tốt và những thực phẩm cần tránh.",
    author: {
      name: "Quang Pham",
      avatar: "/avatars/quang.jpg",
      date: "18/06/2023",
    },
    likes: 0,
  },
  {
    id: 3,
    title: "Kiểm tra sức khỏe thường niên",
    excerpt:
      "Tại sao kiểm tra sức khỏe thường niên cho thú cưng lại quan trọng và các bước thực hiện.",
    author: {
      name: "Minh Tran",
      avatar: "/avatars/minh.jpg",
      date: "05/06/2023",
    },
    likes: 0,
  },
  {
    id: 4,
    title: "Dưỡi cùa bé nhà bạn đúng cách",
    excerpt:
      "Tìm hiểu những kỹ thuật cắt và chăm sóc móng chân cho thú cưng an toàn tại nhà.",
    author: {
      name: "Lan Nguyen",
      avatar: "/avatars/lan.jpg",
      date: "01/05/2023",
    },
    likes: 0,
  },
];

export default function PetCareHandbook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStaff, setIsStaff] = useState(false);
  const articlesPerPage = 4;

  // Check if user is staff (mock implementation)
  useEffect(() => {
    // This would typically come from your auth context or API
    const checkUserRole = () => {
      // Mock implementation - replace with actual auth logic
      const currentUser = {
        role: "staff", // For testing purposes
      };
      setIsStaff(currentUser.role === "staff");
    };

    checkUserRole();
  }, []);

  // Filter articles based on search term
  const filteredArticles = petCareArticles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  // Get current articles
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(
    indexOfFirstArticle,
    indexOfLastArticle
  );

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div className="container mx-auto px-4 mt-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Sổ tay chăm sóc các bé
        </h1>

        {/* Search Bar */}
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full md:w-80 h-10 pl-4 pr-10 rounded-full bg-pink-100 border-none focus:outline-none focus:ring-2 focus:ring-pink-300"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pink-500">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Create New Article Button (Staff Only) */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Bài viết mới nhất</h2>
        {isStaff && (
          <Button
            asChild
            variant="pink"
            shape="pill"
            className="flex items-center"
          >
            <Link to="/pet-care/create">
              <PlusCircle className="mr-2 h-5 w-5" />
              Tạo bài viết mới
            </Link>
          </Button>
        )}
      </div>

      {/* Featured Image */}
      <div className="w-full h-100 rounded-xl overflow-hidden mb-8">
        <img
          src="/petcarebg.png"
          alt="Dogs playing together"
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://via.placeholder.com/1200x400?text=Pet+Care";
          }}
        />
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        {currentArticles.map((article) => (
          <div
            key={article.id}
            className="p-6 hover:shadow-md transition-shadow"
          >
            <Link to={`/pet-care/${article.id}`} className="flex flex-row ">
              {/* Article Image */}
              <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 mr-4 md:mr-6">
                <img
                  src="/petcarebg.png"
                  alt={article.title}
                  className="w-full h-full rounded-xl object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src =
                      "https://via.placeholder.com/128x128?text=Article+Image";
                  }}
                />
              </div>

              {/* Article Content */}
              <div className="flex-grow">
                <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">
                  {article.title}
                </h2>
                <p className="text-gray-600 mb-4">{article.excerpt}</p>

                <div className="flex items-center">
                  <div className="flex items-center">
                    <img
                      src={article.author.avatar || "/petcarebg.png"}
                      alt={article.author.name}
                      className="w-10 h-10 rounded-full mr-3 object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "https://via.placeholder.com/40?text=User";
                      }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">
                        {article.author.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {article.author.date}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center ml-auto">
                    <span className="text-sm text-gray-500 mr-1">
                      {article.likes}
                    </span>
                    <span className="text-gray-500">thích</span>
                  </div>
                </div>

                {/* Article card actions */}
                <div className="flex justify-end mt-3">
                  <Button asChild variant="blue" shape="pill">
                    <Link to={`/pet-care/${article.id}`}>Đọc tiếp</Link>
                  </Button>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8 mb-12">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => currentPage > 1 && paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-pink-100"
            }`}
          >
            <ChevronLeft size={16} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => paginate(i + 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-pink-100"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() =>
              currentPage < totalPages && paginate(currentPage + 1)
            }
            disabled={currentPage === totalPages}
            className={`w-8 h-8 flex items-center justify-center rounded-full ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-pink-100"
            }`}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
