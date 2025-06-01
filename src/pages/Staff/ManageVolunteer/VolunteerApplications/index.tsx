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
import { VolunteerApplicationTable } from './components/VolunteerApplicationTable'

interface Volunteer {
    applicationId: number
    fullName: string
    email: string
    phoneNumber: string
    gender: string
    createdDate: string
    location: string
    breed: string
    categoryName: string
    applicationStatus: string,
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
    const [statusFilter, setStatusFilter] = useState('all')
    const [genderFilter, setGenderFilter] = useState('all')

    const fetchData = async () => {
        // DEVELOPMENT: Sử dụng dữ liệu giả lập
        const useMockData = false; // Đặt thành false khi sẵn sàng sử dụng API thật

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
                statusFilter === 'all' ||
                volunteer.applicationStatus.toLowerCase() === statusFilter.toLowerCase();

            // Lọc theo giới tính
            const genderMatch =
                genderFilter === 'all' ||
                volunteer.gender.toLowerCase() === genderFilter.toLowerCase();

            return searchMatch && statusMatch && genderMatch;
        });
    }, [applications, searchTerm, statusFilter, genderFilter]);


    return (
        <div className='px-6'>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Danh sách đơn đăng ký tình nguyện viên</h2>
            </div>
            <div className='rounded-md border bg-white'>
                <div className="p-6">
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
                                    className="absolute right-2 top-2.5 hover:cursor-pointer"
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
                <VolunteerApplicationTable
                    applications={filteredApplications}
                />
            </div>
        </div>
    )
}

export default VolunteerApplication