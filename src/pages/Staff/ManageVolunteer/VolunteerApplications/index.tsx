import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { volunteerServices } from '@/services/volunteerService'
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