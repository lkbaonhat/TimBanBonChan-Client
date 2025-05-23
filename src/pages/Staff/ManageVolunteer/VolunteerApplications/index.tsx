import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Eye, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { volunteerServices } from '@/services/volunteerService'
import { formatDate } from '@/utils/helper'
import ROUTES from '@/constants/routes'
import { Button } from '@/components/ui/button'

interface Volunteer {
    applicationId: string;
    userId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    applicationStatus: string;
    createdDate: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    address?: string;
    // Các trường mới từ API
    birthDate?: string;
    occupation?: string;
    facebookLink?: string;
    preferredRole?: string;
    previousExperience?: string;
    motivation?: string;
    availableDays?: string;
    availableHours?: string;
}

// Giả lập dữ liệu danh sách đơn đăng ký
const getMockApplicationsData = (): Volunteer[] => {
    return [
        {
            applicationId: 'app-001',
            userId: 'user-123',
            fullName: 'Vuu Thanhh Ann',
            email: 'vuthanhan3547@gmail.com',
            phoneNumber: '0123654758',
            gender: 'male',
            applicationStatus: 'pending',
            createdDate: '2023-05-15T08:30:00',
            address: 'Quận 9, Thành phố Hồ Chí Minh',
            skills: ['Chăm sóc thú cưng', 'Tư vấn', 'Nhiếp ảnh'],
            experience: 'Từng tham gia các hoạt động tình nguyện về động vật tại trường đại học.',
            availability: 'Các ngày trong tuần sau 18h, cả ngày cuối tuần',
            // Các trường mới từ API
            birthDate: '2000-01-05',
            occupation: 'Sinh Viên',
            facebookLink: 'https://facebook.com/vuthanhan',
            preferredRole: 'Tình nguyện viên chăm sóc thú cưng',
            previousExperience: 'Đã từng tham gia nhiều hoạt động tình nguyện tại trường đại học',
            motivation: 'Yêu thích động vật và muốn đóng góp cho cộng đồng',
            availableDays: 'Thứ 2-6 sau 17h, Thứ 7-CN cả ngày',
            availableHours: '17:00-21:00 các ngày trong tuần, 08:00-17:00 cuối tuần'
        },
        {
            applicationId: 'app-002',
            userId: 'user-124',
            fullName: 'Nguyễn Thị Bình',
            email: 'binhnguyen@gmail.com',
            phoneNumber: '0987654321',
            gender: 'female',
            applicationStatus: 'approved',
            createdDate: '2023-05-10T09:15:00',
            address: 'Quận 1, Thành phố Hồ Chí Minh',
            skills: ['Tư vấn', 'Quản lý sự kiện'],
            experience: 'Đã từng làm việc tại các tổ chức phi lợi nhuận.',
            availability: 'Thứ 7, Chủ nhật',
            birthDate: '1995-06-15',
            occupation: 'Nhân viên văn phòng',
            facebookLink: 'https://facebook.com/binhnguyen',
            preferredRole: 'Tình nguyện viên tổ chức sự kiện',
            previousExperience: 'Đã tổ chức nhiều sự kiện từ thiện',
            motivation: 'Muốn lan tỏa tình yêu thương đến cộng đồng',
            availableDays: 'Thứ 7-CN',
            availableHours: '09:00-17:00'
        },
        {
            applicationId: 'app-003',
            userId: 'user-125',
            fullName: 'Trần Văn Công',
            email: 'congtran@gmail.com',
            phoneNumber: '0909123456',
            gender: 'male',
            applicationStatus: 'rejected',
            createdDate: '2023-05-08T14:20:00',
            address: 'Quận 7, Thành phố Hồ Chí Minh',
            skills: ['Chăm sóc thú cưng'],
            experience: 'Chưa có kinh nghiệm tình nguyện trước đây.',
            availability: 'Linh hoạt',
            birthDate: '1998-10-20',
            occupation: 'Nhân viên bán hàng',
            facebookLink: 'https://facebook.com/congtran',
            preferredRole: 'Tình nguyện viên hỗ trợ',
            previousExperience: 'Chưa có kinh nghiệm',
            motivation: 'Thích động vật và muốn giúp đỡ',
            availableDays: 'Linh hoạt',
            availableHours: 'Linh hoạt'
        },
        {
            applicationId: 'app-004',
            userId: 'user-126',
            fullName: 'Lê Thị Dung',
            email: 'dungle@gmail.com',
            phoneNumber: '0978123456',
            gender: 'female',
            applicationStatus: 'active',
            createdDate: '2023-05-05T10:00:00',
            address: 'Quận 3, Thành phố Hồ Chí Minh',
            skills: ['Chăm sóc thú cưng', 'Truyền thông'],
            experience: 'Đã nuôi nhiều loại thú cưng trong nhiều năm.',
            availability: 'Cuối tuần',
            birthDate: '1997-03-12',
            occupation: 'Nhân viên truyền thông',
            facebookLink: 'https://facebook.com/dungle',
            preferredRole: 'Tình nguyện viên truyền thông',
            previousExperience: 'Đã làm việc trong lĩnh vực truyền thông 3 năm',
            motivation: 'Muốn sử dụng kỹ năng truyền thông để giúp đỡ động vật',
            availableDays: 'Thứ 7-CN',
            availableHours: '09:00-16:00'
        },
        {
            applicationId: 'app-005',
            userId: 'user-127',
            fullName: 'Hoàng Văn Ân',
            email: 'anhoang@gmail.com',
            phoneNumber: '0967891234',
            gender: 'male',
            applicationStatus: 'pending',
            createdDate: '2023-05-18T16:45:00',
            address: 'Quận Tân Bình, Thành phố Hồ Chí Minh',
            skills: ['Vận chuyển', 'Hỗ trợ sự kiện'],
            experience: 'Đã tham gia nhiều hoạt động tình nguyện tại địa phương.',
            availability: 'Thứ 2 - Thứ 6 sau 17h',
            birthDate: '1992-12-25',
            occupation: 'Tài xế',
            facebookLink: 'https://facebook.com/anhoang',
            preferredRole: 'Tình nguyện viên vận chuyển',
            previousExperience: 'Có bằng lái xe và kinh nghiệm lái xe 5 năm',
            motivation: 'Muốn hỗ trợ vận chuyển thú cưng đến nơi an toàn',
            availableDays: 'Thứ 2-6 sau 17h',
            availableHours: '17:00-21:00'
        }
    ];
};

function VolunteerApplication() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)
    const [totalPages, setTotalPages] = useState(0)
    const [totalCount, setTotalCount] = useState(0)
    const navigate = useNavigate()

    // Sử dụng dữ liệu từ props nếu có, ngược lại sử dụng dữ liệu giả
    const [applications, setApplications] = useState<Volunteer[]>([])
    // Thêm state cho filter và search
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [genderFilter, setGenderFilter] = useState('')

    const fetchData = async () => {
        // DEVELOPMENT: Sử dụng dữ liệu giả lập
        const useMockData = true; // Đặt thành false khi sẵn sàng sử dụng API thật

        if (useMockData) {
            // Giả lập độ trễ để kiểm tra trạng thái loading nếu cần
            const mockData = getMockApplicationsData();
            setApplications(mockData);
            setTotalPages(Math.ceil(mockData.length / pageSize));
            setTotalCount(mockData.length);
            return;
        }

        try {
            const response = await volunteerServices.getAllVolunteerApplications(currentPage, pageSize)
            setApplications(response.data.data.items)
            setTotalPages(response.data.data.totalCount / pageSize)
            setTotalCount(response.data.data.totalCount)
        } catch (error) {
            console.error('Error fetching volunteer applications:', error)
        }
    }

    useEffect(() => {
        fetchData()
    }, [currentPage])

    // Reset trang khi thay đổi bộ lọc
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, genderFilter])

    // Lọc dữ liệu dựa trên tìm kiếm và bộ lọc
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const filteredApplications = useMemo(() => {
        return applications.filter((volunteer) => {
            // Lọc theo từ khóa tìm kiếm
            const searchMatch =
                searchTerm === '' ||
                volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                volunteer.phoneNumber.includes(searchTerm);

            // Lọc theo trạng thái
            const statusMatch =
                statusFilter === '' ||
                volunteer.applicationStatus.toLowerCase() === statusFilter.toLowerCase();

            // Lọc theo giới tính
            const genderMatch =
                genderFilter === '' ||
                volunteer.gender.toLowerCase() === genderFilter.toLowerCase();

            return searchMatch && statusMatch && genderMatch;
        });
    }, [applications, searchTerm, statusFilter, genderFilter]);

    // Cập nhật phân trang với dữ liệu đã lọc
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const startIndex = (currentPage - 1) * pageSize;
    // endIndex không được sử dụng trực tiếp ở đây nhưng có thể cần cho việc hiển thị khoảng dữ liệu

    // Handle page change
    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    // Generate page numbers for pagination
    const getPageNumbers = () => {
        const pages = []
        const maxPagesToShow = 5

        if (totalPages <= maxPagesToShow) {
            // Show all pages if total pages is less than or equal to maxPagesToShow
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            // Always show first page
            pages.push(1)

            // Calculate start and end of middle pages
            let startPage = Math.max(2, currentPage - 1)
            let endPage = Math.min(totalPages - 1, currentPage + 1)

            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = 4
            }

            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = totalPages - 3
            }

            // Add ellipsis after first page if needed
            if (startPage > 2) {
                pages.push('ellipsis1')
            }

            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pages.push(i)
            }

            // Add ellipsis before last page if needed
            if (endPage < totalPages - 1) {
                pages.push('ellipsis2')
            }

            // Always show last page
            pages.push(totalPages)
        }

        return pages
    }

    // Get status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'approved':
                return 'outline'
            case 'rejected':
                return 'destructive'
            default:
                return 'default'
        }
    }

    // Get status display text
    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'Đang hoạt động'
            case 'pending':
                return 'Đang xử lý'
            case 'approved':
                return 'Đã duyệt'
            case 'rejected':
                return 'Đã từ chối'
            default:
                return status
        }
    }

    return (
        <div className='px-6'>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Danh sách đơn đăng ký tình nguyện viên</h2>
            </div>
            <div className='rounded-md border bg-white'>
                <div className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Thanh tìm kiếm */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-2.5"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        {/* Bộ lọc */}
                        <div className="flex items-center gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="pending">Đang xử lý</SelectItem>
                                    <SelectItem value="approved">Đã duyệt</SelectItem>
                                    <SelectItem value="active">Đang hoạt động</SelectItem>
                                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={genderFilter} onValueChange={setGenderFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="male">Nam</SelectItem>
                                    <SelectItem value="female">Nữ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <div className='p-6'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Họ và tên</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Giới tính</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {applications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        Không có dữ liệu tình nguyện viên
                                    </TableCell>
                                </TableRow>
                            ) : (
                                applications.map((volunteer: Volunteer) => (
                                    <TableRow key={volunteer.applicationId}>
                                        <TableCell className="font-medium">
                                            {volunteer.fullName}
                                        </TableCell>
                                        <TableCell>{volunteer.email}</TableCell>
                                        <TableCell>{volunteer.phoneNumber}</TableCell>
                                        <TableCell>{volunteer.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                                        <TableCell>{formatDate(volunteer.createdDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(volunteer.applicationStatus)}>
                                                {getStatusDisplayText(volunteer.applicationStatus.toLowerCase())}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                onClick={() => navigate(ROUTES.STAFF.VOLUNTEER_APPLICATION_DETAIL.replace(':id', volunteer.applicationId))}
                                                size='icon'
                                            >
                                                <Eye />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {/* Pagination */}
                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground w-full">
                            Hiển thị {applications.length} trên {totalCount} kết quả
                        </div>
                        <Pagination className='justify-end'>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                        className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} hover:cursor-pointer`}
                                    />
                                </PaginationItem>

                                {getPageNumbers().map((page, index) => (
                                    <PaginationItem key={index} className='hover:cursor-pointer'>
                                        {page === 'ellipsis1' || page === 'ellipsis2' ? (
                                            <PaginationEllipsis />
                                        ) : (
                                            <PaginationLink
                                                isActive={currentPage === page}
                                                onClick={() => handlePageChange(page as number)}
                                                className='bg-white'
                                            >
                                                {page}
                                            </PaginationLink>
                                        )}
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                                        className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} hover:cursor-pointer`}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VolunteerApplication