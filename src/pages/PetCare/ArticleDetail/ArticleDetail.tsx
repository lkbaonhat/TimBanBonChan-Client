import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Heart, Share2, Bookmark, ArrowLeft } from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import { PageLoading } from "@/components/Loading";
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
    return <PageLoading text="Đang tải bài viết..." />;
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
    <div className=" min-h-screen pb-12 ">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Article Content */}
      <div className="container mx-auto ">
        <div className=" rounded-xl overflow-hidden relative">
          {/* Decorative circles to match home page style */}
          <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#C5E2F0] opacity-70 rounded-full z-0 hidden md:block"></div>
          <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-[#FF99C0] opacity-60 rounded-full z-0 hidden md:block"></div>

          <div className="relative z-10">
            {/* Back button and actions */}
            <div className="flex justify-between items-center mb-6">
              {/* Article title */}
              <ContentHeader title={article.title} level="h1" />

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  shape="pill"
                  size="sm"
                  animation="none"
                  onClick={handleSave}
                  className="flex items-center gap-1 text-gray-500 hover:text-[#0053A3]"
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
                  className="flex items-center gap-1 text-gray-500 hover:text-[#FF99C0]"
                >
                  <Share2 size={18} />
                  <span className="hidden md:inline">Chia sẻ</span>
                </Button>
              </div>
            </div>

            {/* Featured Image */}
            <div className="mb-8 rounded-xl overflow-hidden shadow-md transform transition-transform">
              <img
                src={article.thumbnail || "/petcarebg.png"}
                alt={article.title}
                className="w-full max-h-[500px] object-cover"
              />
            </div>

            {/* Author info */}
            <div className="flex items-center mb-6 rounded-lg">
              <Avatar className="h-16 w-16 mr-4 ">
                <AvatarImage
                  src={article.author.avatar}
                  alt={article.author.name}
                />
                <AvatarFallback>{article.author.initials}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-xl text--900">
                  {article.author.name}
                </p>
                <p className="">{article.author.date}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2  text-[#FF99C0] rounded-full text-sm font-medium hover:bg-pink-200 transition-colors cursor-pointer"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Article content */}
            <div
              className="prose max-w-none mb-8 prose-headings:text-[#0053A3] prose-a:text-[#FF99C0]"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Like button */}
            <div className="flex items-center justify-end">
              <Button
                variant="pink"
                shape="pill"
                size="sm"
                animation="none"
                onClick={handleLike}
                className="flex items-center gap-1"
              >
                <Heart className={liked ? "fill-white" : ""} size={18} />
                <span>{likeCount} thích</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Related Articles Section */}
        {relatedArticles.length > 0 && (
          <div className="mt-12">
            <ContentHeader
              title="Bài viết liên quan"
              level="h2"
              className="mb-6 text-center text-[#0053A3]"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedArticles.map((relArticle) => (
                <Link
                  key={relArticle.id}
                  to={`/pet-care/${relArticle.id}`}
                  className="block transform transition-transform hover:scale-[1.02]"
                >
                  <div className="p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="h-40 mb-4 overflow-hidden rounded-lg">
                      <img
                        src={relArticle.thumbnail || "/petcarebg.png"}
                        alt={relArticle.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="font-bold text-lg mb-2 text-[#0053A3] hover:text-[#FF99C0] transition-colors">
                      {relArticle.title}
                    </h3>
                    <div className="flex items-center  text-sm mt-auto pt-4">
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
        )}
      </div>
    </div>
  );
}
