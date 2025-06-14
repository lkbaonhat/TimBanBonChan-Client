import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import ROUTES from '@/constants/routes'
import { Home, ArrowLeft, Search } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl shadow-xl border-0">
        <CardContent className="p-12 text-center">
          {/* 404 Animation */}
          <div className="mb-8">
            <div className="text-8xl md:text-9xl font-bold text-transparent bg-gradient-to-r from-[#0053A3] to-[#FF99C0] bg-clip-text animate-pulse">
              404
            </div>
          </div>

          {/* Pet illustration */}
          <div className="mb-8">
            <div className="relative inline-block">
              <div className="w-32 h-32 mx-auto bg-gradient-to-br from-[#FF99C0] to-[#0053A3] rounded-full flex items-center justify-center shadow-lg">
                <span className="text-6xl">🐾</span>
              </div>
              {/* Decorative circles */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-[#C5E2F0] rounded-full animate-bounce"></div>
              <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-[#FFEDFA] rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Error message */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Ôi không! Trang không tìm thấy
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Có vẻ như bạn đã đi lạc rồi. Trang bạn tìm kiếm không tồn tại.
            </p>
            <p className="text-base text-gray-500">
              Có thể liên kết đã bị hỏng hoặc trang đã được di chuyển.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              variant="blue"
              size="lg"
              shape="pill"
              className="w-full sm:w-auto px-8 py-3"
            >
              <Link to={ROUTES.PUBLIC.HOME}>
                <Home className="mr-2 h-5 w-5" />
                Về trang chủ
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              shape="pill"
              className="w-full sm:w-auto px-8 py-3"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Quay lại
            </Button>

            <Button
              asChild
              variant="pink"
              size="lg"
              shape="pill"
              className="w-full sm:w-auto px-8 py-3"
            >
              <Link to="/pets">
                <Search className="mr-2 h-5 w-5" />
                Tìm thú cưng
              </Link>
            </Button>
          </div>

          {/* Helpful links */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Có thể bạn đang tìm kiếm:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/pets"
                className="text-[#0053A3] hover:text-[#004080] hover:underline transition-colors"
              >
                Nhận nuôi thú cưng
              </Link>
              <Link
                to="/find-new-home"
                className="text-[#0053A3] hover:text-[#004080] hover:underline transition-colors"
              >
                Tìm nhà cho bé yêu
              </Link>
              <Link
                to="/community"
                className="text-[#0053A3] hover:text-[#004080] hover:underline transition-colors"
              >
                Cộng đồng
              </Link>
              <Link
                to="/pet-care"
                className="text-[#0053A3] hover:text-[#004080] hover:underline transition-colors"
              >
                Sổ tay chăm sóc
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}