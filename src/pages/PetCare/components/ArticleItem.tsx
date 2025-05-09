import { Link } from "react-router-dom"

interface Author {
  name: string
  avatar: string
  date: string
}

interface ArticleItemProps {
  id: number
  title: string
  excerpt: string
  author: Author
  likes: number
}

export default function ArticleItem({ id, title, excerpt, author, likes }: ArticleItemProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <Link to={`/pet-care/${id}`} className="block">
        <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors mb-2">{title}</h2>
        <p className="text-gray-600 mb-4">{excerpt}</p>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={author.avatar || "/placeholder.svg"}
              alt={author.name}
              className="w-10 h-10 rounded-full mr-3 object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.src = "https://via.placeholder.com/40?text=User"
              }}
            />
            <div>
              <p className="font-medium text-gray-900">{author.name}</p>
              <p className="text-sm text-gray-500">{author.date}</p>
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-sm text-gray-500 mr-1">{likes}</span>
            <span className="text-gray-500">thích</span>
          </div>
        </div>
      </Link>
    </div>
  )
}
