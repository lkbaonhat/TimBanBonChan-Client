"use client"

import { useState, useMemo } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Search, Filter, Users, Clock, CheckCircle, XCircle, Heart } from "lucide-react"

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

const mockApplications: AdoptionApplication[] = [
    {
        id: "1",
        userId: "user1",
        fullName: "Nguyễn Văn A",
        email: "nguyenvana@gmail.com",
        phoneNumber: "0901234567",
        petId: "pet1",
        petName: "Buddy",
        dateOfBirth: "1990-01-15",
        address: "Quận 1, TP HCM",
        applicationStatus: "pending",
        createdDate: "2023-05-10T08:30:00Z",
        livingArrangement: "Chung cư",
        hasOtherPets: "Có",
        hasPreviousPets: "Rồi",
        previousExperience: "Từng nuôi chó 2 năm",
        petCareKnowledge: "Có kiến thức cơ bản về chăm sóc chó",
        additionalInfo: "Muốn một người bạn đồng hành",
    },
    {
        id: "2",
        userId: "user2",
        fullName: "Trần Thị B",
        email: "tranthib@gmail.com",
        phoneNumber: "0987654321",
        petId: "pet2",
        petName: "Luna",
        dateOfBirth: "1995-03-20",
        address: "Quận 3, TP HCM",
        applicationStatus: "approved",
        createdDate: "2023-05-08T14:20:00Z",
        livingArrangement: "Nhà riêng",
        hasOtherPets: "Không",
        hasPreviousPets: "Chưa",
        petCareKnowledge: "Đã tìm hiểu online",
        additionalInfo: "Có thời gian chăm sóc tốt",
    },
    {
        id: "3",
        userId: "user3",
        fullName: "Lê Minh C",
        email: "leminhc@gmail.com",
        phoneNumber: "0912345678",
        petId: "pet3",
        petName: "Max",
        dateOfBirth: "1988-07-12",
        address: "Quận 7, TP HCM",
        applicationStatus: "rejected",
        createdDate: "2023-05-05T09:15:00Z",
        livingArrangement: "Chung cư",
        hasOtherPets: "Có",
        hasPreviousPets: "Rồi",
        previousExperience: "Nuôi mèo 5 năm",
        additionalInfo: "Muốn thêm thành viên mới",
    },
]

export default function ManageAdoptions() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)
    const [applications, setApplications] = useState<AdoptionApplication[]>(mockApplications)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("")
    const [petFilter, setPetFilter] = useState("")

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            const searchMatch =
                searchTerm === "" ||
                application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.phoneNumber.includes(searchTerm) ||
                application.petName.toLowerCase().includes(searchTerm.toLowerCase())

            const statusMatch =
                statusFilter === "" ||
                statusFilter === "all" ||
                application.applicationStatus.toLowerCase() === statusFilter.toLowerCase()

            const petMatch =
                petFilter === "" || petFilter === "all" || application.petName.toLowerCase() === petFilter.toLowerCase()

            return searchMatch && statusMatch && petMatch
        })
    }, [applications, searchTerm, statusFilter, petFilter])

    const totalPages = Math.ceil(filteredApplications.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, filteredApplications.length)
    const currentApplications = filteredApplications.slice(startIndex, endIndex)

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
                return <CheckCircle className="h-4 w-4 text-green-600" />
            case "pending":
                return <Clock className="h-4 w-4 text-yellow-600" />
            case "rejected":
                return <XCircle className="h-4 w-4 text-red-600" />
            case "adopted":
                return <Heart className="h-4 w-4 text-pink-600" />
            default:
                return <Clock className="h-4 w-4 text-gray-600" />
        }
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
        })
    }

    const getUniquePets = () => {
        const uniquePets = new Set(applications.map((app) => app.petName.toLowerCase()))
        return Array.from(uniquePets)
    }

    const statusCounts = useMemo(() => {
        return applications.reduce(
            (acc, app) => {
                acc[app.applicationStatus] = (acc[app.applicationStatus] || 0) + 1
                return acc
            },
            {} as Record<string, number>,
        )
    }, [applications])

    return (
        <div className="min-h-screen bg-gradient-to-br from-lightBlue-50 via-white to-lightPurple-50 p-6">
            <div className="max-w-7xl mx-auto space-y-8 animate-fadeIn">
                {/* Header Section */}
                <div className="text-center space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Quản lý đơn nhận nuôi</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Theo dõi và xử lý các đơn đăng ký nhận nuôi thú cưng
                        </p>
                    </div>
                </div>

                {/* Statistics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card className="bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-primary-600 text-sm font-medium">Tổng đơn</p>
                                    <p className="text-2xl font-bold text-primary-700">{applications.length}</p>
                                </div>
                                <div className="w-12 h-12 bg-primary-500 rounded-xl flex items-center justify-center">
                                    <Users className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-yellow-600 text-sm font-medium">Đang xử lý</p>
                                    <p className="text-2xl font-bold text-yellow-700">{statusCounts.pending || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-yellow-500 rounded-xl flex items-center justify-center">
                                    <Clock className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-600 text-sm font-medium">Đã duyệt</p>
                                    <p className="text-2xl font-bold text-green-700">{statusCounts.approved || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                    <CheckCircle className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-300">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-red-600 text-sm font-medium">Đã từ chối</p>
                                    <p className="text-2xl font-bold text-red-700">{statusCounts.rejected || 0}</p>
                                </div>
                                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center">
                                    <XCircle className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filter Section */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
                    <CardHeader className="bg-gradient-to-r from-secondary-500 to-primary-600 text-white rounded-t-2xl">
                        <CardTitle className="flex items-center gap-3 text-xl">
                            <Filter className="h-6 w-6" />
                            Bộ lọc tìm kiếm
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                            <div className="lg:col-span-2">
                                <div className="relative">
                                    <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                                    <Input
                                        placeholder="Tìm kiếm theo tên, email, số điện thoại, thú cưng..."
                                        className="pl-12 h-12 text-base border-2 border-gray-200 focus:border-primary-400 rounded-xl"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-primary-400 rounded-xl">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="pending">Đang xử lý</SelectItem>
                                    <SelectItem value="approved">Đã duyệt</SelectItem>
                                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                                    <SelectItem value="adopted">Đã nhận nuôi</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={petFilter} onValueChange={setPetFilter}>
                                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-primary-400 rounded-xl">
                                    <SelectValue placeholder="Thú cưng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả thú cưng</SelectItem>
                                    {getUniquePets().map((pet, index) => (
                                        <SelectItem key={index} value={pet}>
                                            {pet.charAt(0).toUpperCase() + pet.slice(1)}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader className="bg-gradient-to-r from-lightBlue-200 to-lightPurple-200">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="font-semibold text-gray-700 py-4">Họ và tên</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Email</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Số điện thoại</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Thú cưng</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Ngày đăng ký</TableHead>
                                    <TableHead className="font-semibold text-gray-700">Trạng thái</TableHead>
                                    <TableHead className="font-semibold text-gray-700 text-center">Hành động</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {currentApplications.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="text-center h-32">
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                                                    <Users className="h-8 w-8 text-gray-400" />
                                                </div>
                                                <p className="text-gray-500 font-medium">Không có dữ liệu đơn nhận nuôi</p>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    currentApplications.map((application, index) => (
                                        <TableRow
                                            key={application.id}
                                            className="hover:bg-gradient-to-r hover:from-lightBlue-25 hover:to-lightPurple-25 transition-all duration-200"
                                            style={{ animationDelay: `${index * 0.1}s` }}
                                        >
                                            <TableCell className="font-medium py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                        {application.fullName.charAt(0)}
                                                    </div>
                                                    <span>{application.fullName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{application.email}</TableCell>
                                            <TableCell className="text-gray-600">{application.phoneNumber}</TableCell>
                                            <TableCell>
                                                <span className="inline-flex items-center gap-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm font-medium">
                                                    <Heart className="h-3 w-3" />
                                                    {application.petName}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-600">{formatDate(application.createdDate)}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={getStatusBadgeVariant(application.applicationStatus)}
                                                    className="flex items-center gap-1 w-fit"
                                                >
                                                    {getStatusIcon(application.applicationStatus)}
                                                    {getStatusDisplayText(application.applicationStatus)}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="hover:bg-primary-50 hover:border-primary-300 hover:text-primary-600 transition-all duration-200"
                                                    onClick={() => console.log(`View application ${application.id}`)}
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    Xem chi tiết
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {filteredApplications.length > 0 && (
                        <div className="flex items-center justify-between p-6 bg-gradient-to-r from-lightBlue-50 to-lightPurple-50 border-t">
                            <div className="text-sm text-gray-600">
                                Hiển thị {startIndex + 1}-{endIndex} trên {filteredApplications.length} kết quả
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                    disabled={currentPage === 1}
                                    className="hover:bg-primary-50"
                                >
                                    Trước
                                </Button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                    <Button
                                        key={page}
                                        variant={currentPage === page ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(page)}
                                        className={currentPage === page ? "bg-primary-500 hover:bg-primary-600" : "hover:bg-primary-50"}
                                    >
                                        {page}
                                    </Button>
                                ))}

                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                    disabled={currentPage === totalPages}
                                    className="hover:bg-primary-50"
                                >
                                    Sau
                                </Button>
                            </div>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    )
}
