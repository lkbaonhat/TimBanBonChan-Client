"use client";

import { useState, useEffect } from "react";
import { Search, PlusCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Pagination from "@/components/Pagination/Pagination";
import ArticleItem from "./ArticleItem";
import articlesData from "@/constants/data/articlesData.json";
import { BANNER } from "@/constants/global";

export default function PetCareHandbook() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isStaff, setIsStaff] = useState(false);
  const [articles, setArticles] = useState(articlesData);
  const articlesPerPage = 4;
  const navigate = useNavigate();

  // Toggle saved status for articles
  const toggleSaved = (articleId: number) => {
    setArticles(
      articles.map((article) =>
        article.id === articleId
          ? { ...article, saved: !article.saved }
          : article
      )
    );
  };

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
  const filteredArticles = articles.filter(
    (article) =>
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.summary.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="container mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 animate-on-scroll opacity-0">
        <ContentHeader title="Sổ tay chăm sóc các bé" level="h1" />

        {/* Search Bar */}
        <div className="mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className="w-full md:w-80 h-10 pl-4 pr-10 rounded-full text-white bg-[#FF99C0] border-none focus:outline-none focus:ring-2 focus:ring-[#FF99C0]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[white]">
              <Search size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Create New Article Button (Staff Only) */}
      {/* <div className="flex justify-between items-center mb-6">
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
      </div> */}

      {/* Featured Image */}
      <div className="w-full h-120 rounded-xl overflow-hidden mb-8 animate-on-scroll opacity-0">
        <img
          src={BANNER.PET_CARE_BG}
          alt="Dogs playing together"
          className="w-full h-full "
        />
      </div>

      {/* Articles Section */}
      <div className="space-y-4 animate-on-scroll opacity-0">
        {currentArticles.map((article, index) => (
          <div
            key={article.id}
            className="animate-on-scroll opacity-0"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <ArticleItem
              id={article.id}
              title={article.title}
              summary={article.summary}
              author={article.author}
              likes={article.likes}
              thumbnail={article.thumbnail}
              tags={article.tags}
              saved={article.saved}
              onToggleSaved={toggleSaved}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 mb-12 animate-on-scroll opacity-0">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={paginate}
        />
      </div>
    </div>
  );
}
