import React from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ArticleFormProps {
  title: string;
  excerpt: string;
  onTitleChange: (title: string) => void;
  onExcerptChange: (excerpt: string) => void;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  title,
  excerpt,
  onTitleChange,
  onExcerptChange,
}) => {
  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Tiêu đề
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
          placeholder="Nhập tiêu đề bài viết"
          required
        />
      </div>

      <div>
        <label
          htmlFor="excerpt"
          className="block mb-2 text-lg font-medium text-gray-900"
        >
          Tóm tắt
        </label>
        <Textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => onExcerptChange(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
          placeholder="Nhập tóm tắt bài viết"
          rows={3}
          required
        />
      </div>
    </div>
  );
};

export default ArticleForm;
