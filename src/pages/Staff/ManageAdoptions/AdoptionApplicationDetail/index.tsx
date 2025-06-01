import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
    CheckCircle,
    XCircle,
    AlertCircle,
    Home,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Heart,
    PawPrint,
    Shield,
} from "lucide-react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

interface AdoptionApplication {
    id: string
    userId: string
    fullName: string
    email: string
    phoneNumber: string
    petId: string
    petName: string
    dateOfBirth: string
    address: string
    applicationStatus: string
    createdDate: string
    livingArrangement: string
    hasOtherPets: string
    hasPreviousPets: string
    previousExperience?: string
    petCareKnowledge?: string
    additionalInfo?: string
}

export default function AdoptionApplicationDetail() {
    const [application, setApplication] = useState<AdoptionApplication>({
        id: "1",
        userId: "user1",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phoneNumber: "0901234567",
        petId: "pet1",
        petName: "Buddy",
        dateOfBirth: "1990-01-15",
        address: "Số 123, Đường ABC, Quận 1, TP HCM",
        applicationStatus: "pending",
        createdDate: "2023-05-10T08:30:00Z",
        livingArrangement: "Chung cư cao cấp có ban công rộng",
        hasOtherPets: "Có - 1 con mèo",
        hasPreviousPets: "Có",
        previousExperience: "Đã từng nuôi chó Golden Retriever trong 3 năm và hiện tại đang nuôi 1 con mèo Anh lông ngắn",
        petCareKnowledge: "Có kiến thức cơ bản về chăm sóc chó, đã tham gia khóa học huấn luyện thú cưng cơ bản",
        additionalInfo:
            "Tôi muốn tìm một người bạn đồng hành trung thành cho gia đình. Có thời gian linh hoạt để chăm sóc và sẵn sàng đầu tư cho việc chăm sóc sức khỏe định kỳ.",
    })

    const [loading] = useState(false)
    const [processing, setProcessing] = useState(false)

    const handleApprove = async () => {
        setProcessing(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setApplication((prev) => ({ ...prev, applicationStatus: "approved" }))
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async () => {
        setProcessing(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setApplication((prev) => ({ ...prev, applicationStatus: "rejected" }))
        } finally {
            setProcessing(false)
        }
    }

    const handleMarkAsAdopted = async () => {
        setProcessing(true)
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            setApplication((prev) => ({ ...prev, applicationStatus: "adopted" }))
        } finally {
            setProcessing(false)
        }
    }

    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "default"
            case "pending":
                return "secondary"
            case "rejected":
                return "destructive"
            case "adopted":
                return "outline"
            default:
                return "secondary"
        }
    }

    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "Đã duyệt"
            case "pending":
                return "Đang xử lý"
            case "rejected":
                return "Đã từ chối"
            case "adopted":
                return "Đã nhận nuôi"
            default:
                return status
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return <CheckCircle className="h-5 w-5 text-green-600" />
            case "pending":
                return <AlertCircle className="h-5 w-5 text-yellow-600" />
            case "rejected":
                return <XCircle className="h-5 w-5 text-red-600" />
            case "adopted":
                return <Heart className="h-5 w-5 text-pink-600" />
            default:
                return <AlertCircle className="h-5 w-5 text-gray-600" />
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-lightBlue-50 via-white to-lightPurple-50 p-6">
            <div className="max-w-6xl mx-auto space-y-8 animate-fadeIn">
                {/* Header */}
                <div className="space-y-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink href="/adoptions" className="text-primary-600 hover:text-primary-800">
                                    Danh sách đơn nhận nuôi
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gray-600">{application.fullName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="text-center space-y-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
                            <PawPrint className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900 mb-2">Chi tiết đơn nhận nuôi</h1>
                            <p className="text-lg text-gray-600">Thông tin chi tiết về đơn đăng ký nhận nuôi thú cưng</p>
                        </div>
                    </div>
                </div>

                {/* Status Alert */}
                <Alert
                    className={`border-2 ${application.applicationStatus === "approved"
                        ? "border-green-200 bg-green-50"
                        : application.applicationStatus === "rejected"
                            ? "border-red-200 bg-red-50"
                            : application.applicationStatus === "adopted"
                                ? "border-pink-200 bg-pink-50"
                                : "border-yellow-200 bg-yellow-50"
                        }`}
                >
                    <div className="flex items-center gap-3">
                        {getStatusIcon(application.applicationStatus)}
                        <div>
                            <h4 className="font-semibold">
                                Trạng thái hiện tại: {getStatusDisplayText(application.applicationStatus)}
                            </h4>
                            <AlertDescription className="mt-1">
                                {application.applicationStatus === "pending" && "Đơn đăng ký đang chờ được xem xét và phê duyệt."}
                                {application.applicationStatus === "approved" &&
                                    "Đơn đăng ký đã được phê duyệt. Có thể tiến hành giao thú cưng."}
                                {application.applicationStatus === "rejected" &&
                                    "Đơn đăng ký đã bị từ chối do không đáp ứng đủ điều kiện."}
                                {application.applicationStatus === "adopted" && "Thú cưng đã được giao thành công cho người nhận nuôi."}
                            </AlertDescription>
                        </div>
                    </div>
                </Alert>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Personal Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Personal Information */}
                        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-t-2xl">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <User className="h-6 w-6" />
                                    Thông tin người đăng ký
                                </CardTitle>
                                <CardDescription className="text-primary-100">
                                    Thông tin cá nhân của người muốn nhận nuôi thú cưng
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <User className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Họ và tên</p>
                                                <p className="text-lg font-semibold text-gray-900">{application.fullName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                                                <Mail className="h-5 w-5 text-secondary-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Email</p>
                                                <p className="text-lg font-semibold text-gray-900">{application.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-accent-100 rounded-xl flex items-center justify-center">
                                                <Phone className="h-5 w-5 text-accent-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Số điện thoại</p>
                                                <p className="text-lg font-semibold text-gray-900">{application.phoneNumber}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Ngày sinh</p>
                                                <p className="text-lg font-semibold text-gray-900">{formatDate(application.dateOfBirth)}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 bg-lightBlue-200 rounded-xl flex items-center justify-center mt-1">
                                                <MapPin className="h-5 w-5 text-lightBlue-700" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Địa chỉ</p>
                                                <p className="text-lg font-semibold text-gray-900 leading-relaxed">{application.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Pet & Application Info */}
                        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-accent-500 to-pink-500 text-white rounded-t-2xl">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <PawPrint className="h-6 w-6" />
                                    Thông tin đơn đăng ký
                                </CardTitle>
                                <CardDescription className="text-accent-100">Chi tiết về đơn đăng ký nhận nuôi</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-pink-100 rounded-xl flex items-center justify-center">
                                                <Heart className="h-5 w-5 text-pink-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Thú cưng muốn nhận nuôi</p>
                                                <p className="text-lg font-semibold text-gray-900">{application.petName}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
                                                <Calendar className="h-5 w-5 text-primary-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Ngày đăng ký</p>
                                                <p className="text-lg font-semibold text-gray-900">{formatDate(application.createdDate)}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant={getStatusBadgeVariant(application.applicationStatus)}
                                                className="flex items-center gap-2 px-4 py-2 text-sm font-medium"
                                            >
                                                {getStatusIcon(application.applicationStatus)}
                                                {getStatusDisplayText(application.applicationStatus)}
                                            </Badge>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Living Conditions */}
                        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-lightBlue-400 to-lightPurple-400 text-white rounded-t-2xl">
                                <CardTitle className="flex items-center gap-3 text-xl">
                                    <Home className="h-6 w-6" />
                                    Điều kiện nuôi thú cưng
                                </CardTitle>
                                <CardDescription className="text-lightBlue-100">
                                    Thông tin về môi trường sống và kinh nghiệm chăm sóc
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-gradient-to-br from-primary-50 to-primary-100 p-4 rounded-xl border border-primary-200">
                                        <p className="text-sm font-medium text-primary-600 mb-1">Nơi ở hiện tại</p>
                                        <p className="font-semibold text-primary-800">{application.livingArrangement}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 p-4 rounded-xl border border-secondary-200">
                                        <p className="text-sm font-medium text-secondary-600 mb-1">Có thú cưng khác</p>
                                        <p className="font-semibold text-secondary-800">{application.hasOtherPets}</p>
                                    </div>

                                    <div className="bg-gradient-to-br from-accent-50 to-accent-100 p-4 rounded-xl border border-accent-200">
                                        <p className="text-sm font-medium text-accent-600 mb-1">Đã từng nuôi thú cưng</p>
                                        <p className="font-semibold text-accent-800">{application.hasPreviousPets}</p>
                                    </div>
                                </div>

                                {application.previousExperience && (
                                    <div className="bg-gradient-to-br from-lightBlue-50 to-lightPurple-50 p-6 rounded-xl border border-lightBlue-200">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <Shield className="h-5 w-5 text-primary-600" />
                                            Kinh nghiệm nuôi thú cưng
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed">{application.previousExperience}</p>
                                    </div>
                                )}

                                {application.petCareKnowledge && (
                                    <div className="bg-gradient-to-br from-pink-50 to-lightPurple-50 p-6 rounded-xl border border-pink-200">
                                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                                            <PawPrint className="h-5 w-5 text-pink-600" />
                                            Kiến thức chăm sóc thú cưng
                                        </h4>
                                        <p className="text-gray-700 leading-relaxed">{application.petCareKnowledge}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Additional Information */}
                        {application.additionalInfo && (
                            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                                <CardHeader className="bg-gradient-to-r from-lightPurple-400 to-pink-400 text-white rounded-t-2xl">
                                    <CardTitle className="text-xl">Thông tin bổ sung</CardTitle>
                                    <CardDescription className="text-lightPurple-100">
                                        Các thông tin khác người đăng ký muốn chia sẻ
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-8">
                                    <div className="bg-gradient-to-br from-lightBlue-50 to-lightPurple-50 p-6 rounded-xl border border-lightBlue-200">
                                        <p className="text-gray-700 leading-relaxed text-lg">{application.additionalInfo}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1">
                        <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm sticky top-6">
                            <CardHeader className="bg-gradient-to-r from-secondary-500 to-primary-500 text-white rounded-t-2xl">
                                <CardTitle className="text-xl">Xử lý đơn đăng ký</CardTitle>
                                <CardDescription className="text-secondary-100">
                                    Thay đổi trạng thái đơn đăng ký nhận nuôi
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-lightBlue-50 to-lightPurple-50 rounded-xl border border-lightBlue-200">
                                        {getStatusIcon(application.applicationStatus)}
                                        <div>
                                            <p className="text-sm text-gray-600">Trạng thái hiện tại</p>
                                            <p className="font-semibold text-gray-900">
                                                {getStatusDisplayText(application.applicationStatus)}
                                            </p>
                                        </div>
                                    </div>
                                    <Separator />
                                </div>
                            </CardContent>
                            <CardFooter className="p-6 pt-0">
                                <div className="w-full space-y-3">
                                    {application.applicationStatus === "pending" && (
                                        <>
                                            <Button
                                                className="w-full h-12 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                                onClick={handleApprove}
                                                disabled={processing}
                                            >
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                {processing ? "Đang xử lý..." : "Phê duyệt đơn"}
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transition-all duration-200"
                                                onClick={handleReject}
                                                disabled={processing}
                                            >
                                                <XCircle className="mr-2 h-5 w-5" />
                                                {processing ? "Đang xử lý..." : "Từ chối đơn"}
                                            </Button>
                                        </>
                                    )}

                                    {application.applicationStatus === "approved" && (
                                        <Button
                                            className="w-full h-12 bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                                            onClick={handleMarkAsAdopted}
                                            disabled={processing}
                                        >
                                            <Heart className="mr-2 h-5 w-5" />
                                            {processing ? "Đang xử lý..." : "Đánh dấu đã nhận nuôi"}
                                        </Button>
                                    )}

                                    {application.applicationStatus === "rejected" && (
                                        <div className="text-center p-4 bg-red-50 border border-red-200 rounded-xl">
                                            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                                            <p className="text-sm text-red-700 font-medium">Đơn đăng ký đã bị từ chối</p>
                                            <p className="text-xs text-red-600 mt-1">Không thể thực hiện thêm hành động</p>
                                        </div>
                                    )}

                                    {application.applicationStatus === "adopted" && (
                                        <div className="text-center p-4 bg-pink-50 border border-pink-200 rounded-xl">
                                            <Heart className="h-8 w-8 text-pink-500 mx-auto mb-2" />
                                            <p className="text-sm text-pink-700 font-medium">Thú cưng đã được nhận nuôi</p>
                                            <p className="text-xs text-pink-600 mt-1">Quá trình nhận nuôi đã hoàn tất</p>
                                        </div>
                                    )}
                                </div>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    )
}
