"use client";

import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ChevronLeft, Heart } from "lucide-react";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import { Button } from "@/components/ui/button";

// Sample article data (in a real app, this would come from an API)
const articles = {
  "1": {
    id: 1,
    title: "Chăm sóc bé cưng nhà bạn vào mùa hè",
    content: `
      <p>Mùa hè nắng nóng, các bé thú cưng của nhà bạn cần những quan tâm đặc biệt để luôn khỏe mạnh và thoải mái.</p>
      
      <h3>1. Giữ cho thú cưng luôn mát mẻ</h3>
      <p>Nhiệt độ cao có thể gây nguy hiểm cho thú cưng. Hãy đảm bảo rằng chúng luôn có chỗ mát mẻ để nghỉ ngơi và có đủ nước uống. Tránh để thú cưng ở ngoài trời nắng trong thời gian dài, đặc biệt là vào giữa trưa khi nhiệt độ cao nhất.</p>
      
      <h3>2. Chú ý đến dấu hiệu say nắng</h3>
      <p>Các dấu hiệu say nắng ở thú cưng bao gồm thở gấp, nướu răng và lưỡi đỏ tươi, yếu ớt, nôn mửa hoặc thậm chí bất tỉnh. Nếu bạn nghi ngờ thú cưng của mình bị say nắng, hãy đưa chúng vào nơi mát mẻ ngay lập tức, làm mát cơ thể chúng bằng khăn ướt mát và đưa đến bác sĩ thú y càng sớm càng tốt.</p>
      
      <h3>3. Bảo vệ chân của thú cưng</h3>
      <p>Mặt đường nóng có thể gây bỏng cho bàn chân của thú cưng. Hãy đi dạo vào sáng sớm hoặc tối muộn khi mặt đường đã nguội, hoặc sử dụng giày bảo vệ cho thú cưng.</p>
      
      <h3>4. Chế độ ăn uống phù hợp</h3>
      <p>Trong mùa hè, thú cưng có thể ăn ít hơn do nhiệt độ cao. Hãy đảm bảo cung cấp đủ nước và thức ăn có độ ẩm cao. Bạn cũng có thể làm đá viên từ nước hoặc nước dùng không muối để giúp thú cưng giải nhiệt.</p>
      
      <h3>5. Chăm sóc lông</h3>
      <p>Chải lông thường xuyên giúp loại bỏ lông rụng và giữ cho thú cưng mát mẻ hơn. Tuy nhiên, không nên cắt lông quá ngắn vì lông cũng có tác dụng bảo vệ da khỏi ánh nắng mặt trời.</p>
    `,
    author: {
      name: "Siriana Pham",
      avatar: "/avatars/siriana.jpg",
      date: "24/07/2023",
    },
    likes: 4,
    tags: ["mùa hè", "chăm sóc thú cưng", "sức khỏe"],
  },
  "2": {
    id: 2,
    title: "Thực đơn khỏe mạnh ở nhà cho mèo",
    content: `
      <p>Chế độ ăn theo từng độ tuổi của mèo, những thực phẩm tốt và những thực phẩm cần tránh.</p>
      
      <h3>1. Chế độ ăn cho mèo con (dưới 1 tuổi)</h3>
      <p>Mèo con cần nhiều protein và calories hơn mèo trưởng thành để hỗ trợ sự phát triển. Thức ăn dành riêng cho mèo con thường có hàm lượng dinh dưỡng cao hơn. Mèo con nên được cho ăn 3-4 lần mỗi ngày.</p>
      
      <h3>2. Chế độ ăn cho mèo trưởng thành (1-7 tuổi)</h3>
      <p>Mèo trưởng thành cần một chế độ ăn cân bằng với đủ protein, chất béo, carbohydrate, vitamin và khoáng chất. Mèo trưởng thành thường được cho ăn 2 lần mỗi ngày.</p>
      
      <h3>3. Chế độ ăn cho mèo già (trên 7 tuổi)</h3>
      <p>Mèo già có thể cần ít calories hơn nhưng vẫn cần đủ protein chất lượng cao. Thức ăn dành cho mèo già thường có ít natri và phosphorus hơn để hỗ trợ sức khỏe thận.</p>
      
      <h3>4. Thực phẩm tốt cho mèo</h3>
      <p>Protein động vật chất lượng cao như thịt gà, thịt bò, cá. Mèo là động vật ăn thịt bắt buộc, vì vậy protein động vật là rất quan trọng trong chế độ ăn của chúng.</p>
      
      <h3>5. Thực phẩm cần tránh</h3>
      <p>Sữa và các sản phẩm từ sữa (nhiều mèo không dung nạp được lactose), chocolate, hành, tỏi, nho, nho khô, caffeine, rượu, thức ăn có nhiều muối.</p>
    `,
    author: {
      name: "Quang Pham",
      avatar: "/avatars/quang.jpg",
      date: "18/06/2023",
    },
    likes: 0,
    tags: ["dinh dưỡng", "mèo", "thực đơn"],
  },
};

export default function ArticleDetail() {
  const { id } = useParams();
  const [liked, setLiked] = useState(false);

  // Get article data
  const article = articles[id];

  // Handle if article not found
  // if (!article) {
  //   return (
  //     <div className="container mx-auto px-4 py-12 text-center">
  //       <h1 className="text-2xl font-bold mb-4">Bài viết không tồn tại</h1>
  //       <Link
  //         to="/pet-care"
  //         className="text-blue-600 hover:underline flex items-center justify-center"
  //       >
  //         <ChevronLeft size={16} className="mr-1" />
  //         Quay lại sổ tay chăm sóc
  //       </Link>
  //     </div>
  //   );
  // }

  const breadcrumbItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Sổ tay chăm sóc thú cưng", path: "/pet-care" },
    { label: article.title },
  ];

  const handleLike = () => {
    setLiked(!liked);
  };

  const likeCount = liked ? article.likes + 1 : article.likes;

  return (
    <div className="bg-[#FFEDFA] min-h-screen pb-12">
      {/* Breadcrumb */}
      <Breadcrumb items={breadcrumbItems} />

      {/* Article Content */}
      <div className="container mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm">
          {/* Back button */}
          <Button asChild variant="blue" shape="pill">
            <Link to="/pet-care">Quay lại danh sách</Link>
          </Button>

          {/* Article title */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2 mb-6">
            {article.title}
          </h1>

          {/* Author info */}
          <div className="flex items-center mb-6">
            <img
              src={article.author.avatar || "/placeholder.svg"}
              alt={article.author.name}
              className="w-12 h-12 rounded-full mr-4 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/48?text=User";
              }}
            />
            <div>
              <p className="font-medium text-gray-900">{article.author.name}</p>
              <p className="text-sm text-gray-500">{article.author.date}</p>
            </div>
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
              {liked ? <Heart className="text-red-500" /> : <Heart />}
              <span>{likeCount}</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
