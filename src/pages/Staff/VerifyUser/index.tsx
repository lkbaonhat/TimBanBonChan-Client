import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Users, FileCheck, FileX, Clock } from 'lucide-react'
import VerifyUserTable from './components/VerifyUserTable'

// Define interface here or export from VerifyUserTable
interface VerifyUser {
    id: string
    fullName: string
    email: string
    phone: string
    avatar?: string
    submittedAt: string
    status: 'pending' | 'approved' | 'rejected'
    documentType: string
    reason?: string
}

// Mock data for demonstration
const mockData: VerifyUser[] = [
    {
        id: '1',
        fullName: 'Nguyễn Văn An',
        email: 'nguyenvanan@email.com',
        phone: '0123456789',
        avatar: 'https://via.placeholder.com/40',
        submittedAt: '2024-12-01T10:30:00Z',
        status: 'pending',
        documentType: 'CCCD'
    },
    {
        id: '2',
        fullName: 'Trần Thị Bình',
        email: 'tranthibinh@email.com',
        phone: '0987654321',
        submittedAt: '2024-12-02T14:15:00Z',
        status: 'approved',
        documentType: 'Hộ chiếu'
    },
    {
        id: '3',
        fullName: 'Lê Minh Cường',
        email: 'leminhcuong@email.com',
        phone: '0369852147',
        submittedAt: '2024-12-03T09:45:00Z',
        status: 'rejected',
        documentType: 'GPLX',
        reason: 'Hình ảnh không rõ ràng'
    },
    {
        id: '4',
        fullName: 'Phạm Thị Diệu',
        email: 'phamthidieu@email.com',
        phone: '0456789123',
        submittedAt: '2024-12-04T16:20:00Z',
        status: 'pending',
        documentType: 'CCCD'
    },
    {
        id: '5',
        fullName: 'Hoàng Văn Em',
        email: 'hoangvanem@email.com',
        phone: '0789123456',
        submittedAt: '2024-12-05T08:30:00Z',
        status: 'approved',
        documentType: 'CMND'
    },
    {
        id: '6',
        fullName: 'Vũ Thị Phương',
        email: 'vuthiphuong@email.com',
        phone: '0147258369',
        submittedAt: '2024-12-06T11:45:00Z',
        status: 'pending',
        documentType: 'Hộ chiếu'
    },
    {
        id: '7',
        fullName: 'Đặng Minh Quân',
        email: 'dangminhquan@email.com',
        phone: '0258741369',
        submittedAt: '2024-12-07T13:20:00Z',
        status: 'approved',
        documentType: 'GPLX'
    },
    {
        id: '8',
        fullName: 'Bùi Thị Hoa',
        email: 'buithihoa@email.com',
        phone: '0963852741',
        submittedAt: '2024-12-08T15:10:00Z',
        status: 'rejected',
        documentType: 'CCCD',
        reason: 'Tài liệu hết hạn'
    },
    {
        id: '9',
        fullName: 'Ngô Văn Sinh',
        email: 'ngovanhsinh@email.com',
        phone: '0741852963',
        submittedAt: '2024-12-09T09:30:00Z',
        status: 'pending',
        documentType: 'CMND'
    },
    {
        id: '10',
        fullName: 'Lý Thị Kim',
        email: 'lythikim@email.com',
        phone: '0852963741',
        submittedAt: '2024-12-10T14:50:00Z',
        status: 'approved',
        documentType: 'Hộ chiếu'
    },
    {
        id: '11',
        fullName: 'Cao Văn Tuấn',
        email: 'caovantuan@email.com',
        phone: '0159753486',
        submittedAt: '2024-12-11T10:15:00Z',
        status: 'pending',
        documentType: 'GPLX'
    },
    {
        id: '12',
        fullName: 'Đinh Thị Lan',
        email: 'dinhthilan@email.com',
        phone: '0753159486',
        submittedAt: '2024-12-12T12:40:00Z',
        status: 'approved',
        documentType: 'CCCD'
    }
]

export default function VerifyUser() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [documentTypeFilter, setDocumentTypeFilter] = useState('all')

    return (
        <div className="">
            {/* Header */}
            <div className='mb-4'>
                <p className="text-2xl font-bold">Xác minh hồ sơ người dùng</p>
                <p className="text-sm text-muted-foreground">
                    Quản lý và xác minh các yêu cầu xác thực hồ sơ từ người dùng
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-100 text-sm font-medium">Tổng yêu cầu</p>
                                <p className="text-3xl font-bold">24</p>
                            </div>
                            <Users className="h-10 w-10 text-blue-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-amber-100 text-sm font-medium">Chờ duyệt</p>
                                <p className="text-3xl font-bold">8</p>
                            </div>
                            <Clock className="h-10 w-10 text-amber-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-100 text-sm font-medium">Đã duyệt</p>
                                <p className="text-3xl font-bold">12</p>
                            </div>
                            <FileCheck className="h-10 w-10 text-green-200" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-red-100 text-sm font-medium">Từ chối</p>
                                <p className="text-3xl font-bold">4</p>
                            </div>
                            <FileX className="h-10 w-10 text-red-200" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Table Section */}
            <Card className="rounded-md border bg-white">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            className="pl-8 h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select value={documentTypeFilter} onValueChange={setDocumentTypeFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Loại tài liệu" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại tài liệu</SelectItem>
                            <SelectItem value="CCCD">Căn cước công dân</SelectItem>
                            <SelectItem value="CMND">Chứng minh nhân dân</SelectItem>
                            <SelectItem value="Hộ chiếu">Hộ chiếu</SelectItem>
                            <SelectItem value="GPLX">Giấy phép lái xe</SelectItem>
                        </SelectContent>
                    </Select>
                </div>                <VerifyUserTable
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    documentTypeFilter={documentTypeFilter}
                    userList={mockData}
                />
            </Card>
        </div >
    )
}
