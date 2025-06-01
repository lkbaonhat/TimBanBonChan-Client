import { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Search, Eye, MoreHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Volunteer {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    status: string;
    joinDate: string;
    avatar?: string;
    skills?: string[];
}

// Fake data for volunteers
const fakeVolunteers: Volunteer[] = [
    {
        id: '1',
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phoneNumber: '0901234567',
        gender: 'male',
        status: 'active',
        joinDate: '2023-01-15',
        avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
        skills: ['Chăm sóc thú', 'Vận chuyển']
    },
    {
        id: '2',
        fullName: 'Trần Thị B',
        email: 'tranthib@gmail.com',
        phoneNumber: '0912345678',
        gender: 'female',
        status: 'active',
        joinDate: '2023-02-20',
        avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
        skills: ['Tư vấn', 'Chăm sóc thú']
    },
    {
        id: '3',
        fullName: 'Lê Văn C',
        email: 'levanc@gmail.com',
        phoneNumber: '0923456789',
        gender: 'male',
        status: 'inactive',
        joinDate: '2023-03-10',
        avatar: 'https://randomuser.me/api/portraits/men/3.jpg',
        skills: ['Vận chuyển']
    },
    {
        id: '4',
        fullName: 'Phạm Thị D',
        email: 'phamthid@gmail.com',
        phoneNumber: '0934567890',
        gender: 'female',
        status: 'active',
        joinDate: '2023-04-05',
        avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
        skills: ['Tư vấn', 'Chụp ảnh']
    },
    {
        id: '5',
        fullName: 'Hoàng Văn E',
        email: 'hoangvane@gmail.com',
        phoneNumber: '0945678901',
        gender: 'male',
        status: 'active',
        joinDate: '2023-05-12',
        avatar: 'https://randomuser.me/api/portraits/men/5.jpg',
        skills: ['Chăm sóc thú', 'Vận chuyển', 'Tư vấn']
    },
    {
        id: '6',
        fullName: 'Đỗ Thị F',
        email: 'dothif@gmail.com',
        phoneNumber: '0956789012',
        gender: 'female',
        status: 'inactive',
        joinDate: '2023-06-18',
        avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
        skills: ['Chụp ảnh']
    },
    {
        id: '7',
        fullName: 'Vũ Văn G',
        email: 'vuvang@gmail.com',
        phoneNumber: '0967890123',
        gender: 'male',
        status: 'active',
        joinDate: '2023-07-22',
        avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
        skills: ['Vận chuyển', 'Chăm sóc thú']
    }
];

function ActiveVolunteers() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filterStatus, setFilterStatus] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)
    const navigate = useNavigate()

    // Filter volunteers based on search term and status
    const filteredVolunteers = useMemo(() => {
        return fakeVolunteers.filter(volunteer => {
            // Filter by search term
            const matchesSearch =
                searchTerm === '' ||
                volunteer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                volunteer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                volunteer.phoneNumber.includes(searchTerm);

            // Filter by status
            const matchesStatus =
                filterStatus === 'all' ||
                volunteer.status === filterStatus;

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, filterStatus]);

    // Calculate pagination
    const totalPages = Math.ceil(filteredVolunteers.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, filteredVolunteers.length)
    const currentVolunteers = filteredVolunteers.slice(startIndex, endIndex)

    // Reset to first page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, filterStatus])

    // Format date to local format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('vi-VN')
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

    return (
        <div>
            <div className="mb-6">
                <h1 className='text-2xl font-bold'>Quản lý tình nguyện viên</h1>
                <p className='text-sm text-muted-foreground'>Quản lý và theo dõi tất cả tình nguyện viên</p>
            </div>

            <div className='rounded-md border bg-white'>
                <div className="flex flex-col md:flex-row gap-4 p-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                            className="pl-8 h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang hoạt động</SelectItem>
                            <SelectItem value="inactive">Tạm dừng</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                {/* Filtered and paginated volunteer table */}
                <div className='px-6 py-2'>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Tình nguyện viên</TableHead>
                                <TableHead>Số điện thoại</TableHead>
                                <TableHead>Giới tính</TableHead>
                                <TableHead>Ngày tham gia</TableHead>
                                <TableHead>Trạng thái</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>                            {filteredVolunteers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                    Không có dữ liệu tình nguyện viên
                                </TableCell>
                            </TableRow>
                        ) : (
                            currentVolunteers.map((volunteer) => (<TableRow key={volunteer.id}>
                                <TableCell>
                                    <div className='flex items-center gap-2'>
                                        <Avatar className="h-10 w-10">
                                            <AvatarImage src={volunteer.avatar || "/placeholder.svg"} alt={volunteer.fullName} />
                                            <AvatarFallback>{volunteer.fullName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className='text-sm font-medium'>{volunteer.fullName}</p>
                                            <p className='text-muted-foreground'>{volunteer.email}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>{volunteer.phoneNumber}</TableCell>
                                <TableCell>{volunteer.gender === 'male' ? 'Nam' : 'Nữ'}</TableCell>
                                <TableCell>{formatDate(volunteer.joinDate)}</TableCell>
                                <TableCell>
                                    <Badge variant={volunteer.status === 'active' ? 'default' : 'outline'}>
                                        {volunteer.status === 'active' ? 'Đang hoạt động' : 'Tạm dừng'}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => navigate(`/staff/volunteer/${volunteer.id}`)}>
                                                <Eye className="mr-2 h-4 w-4" />
                                                <span>Xem chi tiết</span>
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                            ))
                        )}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground w-full">
                            Hiển thị {currentVolunteers.length} trên {filteredVolunteers.length} kết quả
                        </div>
                        {filteredVolunteers.length > 0 && (
                            <Pagination className='justify-end'>
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
                                                    onClick={() => setCurrentPage(page as number)}
                                                    className='bg-white'
                                                >
                                                    {page}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} hover:cursor-pointer`}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActiveVolunteers
