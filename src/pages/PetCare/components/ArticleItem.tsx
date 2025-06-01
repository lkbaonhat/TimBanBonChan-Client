import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface Author {
  name: string;
  avatar: string;
  initials: string;
  date: string;
}

interface ArticleItemProps {
  id: number;
  title: string;
  summary: string;
  author: Author;
  likes: number;
  thumbnail: string;
  tags: string[];
  saved: boolean;
  onToggleSaved?: (id: number) => void;
}

export default function ArticleItem({
  id,
  title,
  summary,
  author,
  likes,
  thumbnail,
  tags,
  saved,
  onToggleSaved,
}: ArticleItemProps) {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onToggleSaved) {
      onToggleSaved(id);
    }
  };

  return (
    <div className="rounded-xl p-6  hover:shadow-md transition-shadow">
      <Link to={`/pet-care/${id}`} className="block">
        <div className="flex gap-4">
          <div className="flex-shrink-0">
            <img
              src={thumbnail || "/petcarebg.png"}
              alt={title}
              className="w-27 h-27 rounded-md object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/petcarebg.png";
              }}
            />
          </div>

          <div className="flex-grow">
            <h2 className="text-xl font-semibold text-gray-900  transition-colors mb-2">
              {title}
            </h2>
            <p className="text-gray-600 mb-2 line-clamp-2">{summary}</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={author.avatar} alt={author.name} />
                  <AvatarFallback>{author.initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-gray-900">{author.name}</p>
                  <p className="text-sm text-gray-500">{author.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">{likes} thích</span>
                <button
                  onClick={handleSaveClick}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Bookmark
                    className={saved ? "fill-current text-[#0053A3]" : ""}
                    size={18}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
