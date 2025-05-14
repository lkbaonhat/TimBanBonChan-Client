"use client";

import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Heart, Share2, Bookmark } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import articlesData from "@/constants/data/articlesData.json";

export default function ArticleDetail() {
  const { id } = useParams<{ id: string }>();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [article, setArticle] = useState(null);
  const [relatedArticles, setRelatedArticles] = useState([]);

  // Load article data based on ID
  useEffect(() => {
    // Find the article with the matching ID
    const articleId = parseInt(id);
    const foundArticle = articlesData.find(
      (article) => article.id === articleId
    );

    if (foundArticle) {
      setArticle(foundArticle);
      setSaved(foundArticle.saved);

      // Get related articles
      if (
        foundArticle.relatedArticles &&
        Array.isArray(foundArticle.relatedArticles)
      ) {
        const relatedArticleData = foundArticle.relatedArticles
          .map((relId) => articlesData.find((a) => a.id === relId))
          .filter(Boolean);

        setRelatedArticles(relatedArticleData);
      }
    } else if (articlesData.length > 0) {
      // Fallback to first article if ID not found
      setArticle(articlesData[0]);
    }
  }, [id]);

  // Make sure we have an article before rendering the full content
  if (!article) {
    return <div className="p-8 text-center">Loading article...</div>;
  }

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng", path: "/pet-care" },
    { label: article.title },
  ];

  const handleLike = () => {
    setLiked(!liked);
  };

  const handleSave = () => {
    setSaved(!saved);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: "Xem bài viết thú vị này từ Tìm Bạn Bốn Chân",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link đã được sao chép!");
    }
  };

  const likeCount = liked ? article.likes + 1 : article.likes;

  return (
    <div className=" min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Article Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          {/* Back button and actions */}
          <div className="flex justify-between items-center mb-6">
            {/* <Button asChild variant="outline" shape="pill" animation="none">
              <Link to="/pet-care">
                <ChevronLeft size={16} className="mr-1" />
                Quay lại danh sách
              </Link>
            </Button> */}
            {/* Article title */}
            <ContentHeader title={article.title} level="h2" />

            <div className="flex gap-2">
              <Button
                variant="ghost"
                shape="pill"
                size="sm"
                animation="none"
                onClick={handleSave}
                className="flex items-center gap-1 text-gray-500 hover:text-blue-500"
              >
                <Bookmark
                  className={saved ? "fill-current text-[#0053A3]" : ""}
                  size={18}
                />
                <span className="hidden md:inline">Lưu bài viết</span>
              </Button>

              <Button
                variant="ghost"
                shape="pill"
                size="sm"
                animation="none"
                onClick={handleShare}
                className="flex items-center gap-1 text-gray-500 hover:text-green-500"
              >
                <Share2 size={18} />
                <span className="hidden md:inline">Chia sẻ</span>
              </Button>
            </div>
          </div>

          {/* Author info */}
          <div className="flex items-center mb-6">
            <Avatar className="h-12 w-12 mr-4">
              <AvatarImage
                src={article.author.avatar}
                alt={article.author.name}
              />
              <AvatarFallback>{article.author.initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.date}</p>
            </div>
          </div>

          {/* Featured Image */}
          <div className="mb-8 rounded-xl overflow-hidden">
            <img
              src={article.thumbnail || "/petcarebg.png"}
              alt={article.title}
              className="w-full max-h-150 object-cover"
            />
          </div>

          {/* Article content */}
          <div
            className="prose max-w-none mb-8"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-pink-100 text-pink-800 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Like button */}
          <div className="flex items-center justify-end">
            <Button
              variant="ghost"
              shape="pill"
              size="sm"
              animation="none"
              onClick={handleLike}
              className="flex items-center gap-1 text-gray-500 hover:text-red-500"
            >
              <Heart
                className={liked ? "fill-red-500 text-red-500" : ""}
                size={18}
              />
              <span>{likeCount}</span>
            </Button>
          </div>
        </div>

        {/* Related Articles Section */}
        {/* {relatedArticles.length > 0 && (
          <div className="mt-8">
            <ContentHeader
              title="Bài viết liên quan"
              level="h2"
              className="mb-4"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relArticle) => (
                <Link key={relArticle.id} to={`/pet-care/${relArticle.id}`}>
                  <div className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="font-bold text-lg mb-2 hover:text-[#0053A3]">
                      {relArticle.title}
                    </h3>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={relArticle.author.avatar}
                          alt={relArticle.author.name}
                        />
                        <AvatarFallback>
                          {relArticle.author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <span>{relArticle.author.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
}
