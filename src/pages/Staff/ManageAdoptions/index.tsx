import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Badge } from '@/components/ui/badge'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from '@/components/ui/table'
import { Eye, Search, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { petService } from '@/services/petService'
import { formatDate } from '@/utils/helper'

interface AdoptionApplication {
    id?: string;
    userId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    petId: string;
    petName: string;
    dateOfBirth: string;
    address: string;
    applicationStatus: string;
    createdDate: string;
    livingArrangement: string;
    hasOtherPets: string;
    hasPreviousPets: string;
    previousExperience?: string;
    petCareKnowledge?: string;
    additionalInfo?: string;
}

export default function ManageAdoptions() {
    const navigate = useNavigate()
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)

    // State for applications and filters
    const [applications, setApplications] = useState<AdoptionApplication[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('')
    const [petFilter, setPetFilter] = useState('')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await petService.getAllAdoptionApplications()
                setApplications([
                    {
                        id: '1',
                        userId: 'user1',
                        fullName: 'Nguyễn Văn A',
                        email: 'nguyenvana@gmail.com',
                        phoneNumber: '0901234567',
                        petId: 'pet1',
                        petName: 'Buddy',
                        dateOfBirth: '1990-01-15',
                        address: 'Quận 1, TP HCM',
                        applicationStatus: 'pending',
                        createdDate: '2023-05-10T08:30:00Z',
                        livingArrangement: 'Chung cư',
                        hasOtherPets: 'Có',
                        hasPreviousPets: 'Rồi',
                        previousExperience: 'Từng nuôi chó 2 năm',
                        petCareKnowledge: 'Có kiến thức cơ bản về chăm sóc chó',
                        additionalInfo: 'Muốn một người bạn đồng hành'
                    },
                    {
                        id: '2',
                        userId: 'user2',
                        fullName: 'Trần Thị B',
                        email: 'tranthib@gmail.com',
                        phoneNumber: '0912345678',
                        petId: 'pet2',
                        petName: 'Luna',
                        dateOfBirth: '1995-03-20',
                        address: 'Quận 7, TP HCM',
                        applicationStatus: 'approved',
                        createdDate: '2023-06-15T10:15:00Z',
                        livingArrangement: 'Nhà riêng',
                        hasOtherPets: 'Không',
                        hasPreviousPets: 'Chưa',
                        previousExperience: '',
                        petCareKnowledge: 'Đã tìm hiểu trên internet',
                        additionalInfo: 'Muốn nuôi một chú mèo làm bạn'
                    },
                    {
                        id: '3',
                        userId: 'user3',
                        fullName: 'Lê Văn C',
                        email: 'levanc@gmail.com',
                        phoneNumber: '0923456789',
                        petId: 'pet3',
                        petName: 'Max',
                        dateOfBirth: '1988-06-10',
                        address: 'Quận 2, TP HCM',
                        applicationStatus: 'rejected',
                        createdDate: '2023-07-20T14:45:00Z',
                        livingArrangement: 'Chung cư',
                        hasOtherPets: 'Có',
                        hasPreviousPets: 'Rồi',
                        previousExperience: 'Đang nuôi 1 chú mèo',
                        petCareKnowledge: 'Có kinh nghiệm 5 năm nuôi thú cưng',
                        additionalInfo: 'Muốn nhận nuôi thêm một chú chó'
                    },
                    {
                        id: '4',
                        userId: 'user4',
                        fullName: 'Phạm Thị D',
                        email: 'phamthid@gmail.com',
                        phoneNumber: '0934567890',
                        petId: 'pet4',
                        petName: 'Charlie',
                        dateOfBirth: '1992-11-05',
                        address: 'Quận 3, TP HCM',
                        applicationStatus: 'adopted',
                        createdDate: '2023-08-05T09:30:00Z',
                        livingArrangement: 'Biệt thự',
                        hasOtherPets: 'Không',
                        hasPreviousPets: 'Rồi',
                        previousExperience: 'Từng nuôi chó 3 năm',
                        petCareKnowledge: 'Có kiến thức về dinh dưỡng và chăm sóc sức khỏe cho chó',
                        additionalInfo: 'Gia đình có điều kiện chăm sóc tốt cho thú cưng'
                    },
                    {
                        id: '5',
                        userId: 'user5',
                        fullName: 'Võ Minh E',
                        email: 'vominhe@gmail.com',
                        phoneNumber: '0945678901',
                        petId: 'pet5',
                        petName: 'Kitty',
                        dateOfBirth: '1997-08-12',
                        address: 'Quận 5, TP HCM',
                        applicationStatus: 'pending',
                        createdDate: '2023-09-10T16:00:00Z',
                        livingArrangement: 'Nhà riêng',
                        hasOtherPets: 'Không',
                        hasPreviousPets: 'Chưa',
                        previousExperience: '',
                        petCareKnowledge: 'Đã tham gia khóa học về chăm sóc mèo',
                        additionalInfo: 'Sống một mình và muốn có bạn đồng hành'
                    }
                ])
            } catch (error) {
                console.error('Error fetching adoption applications:', error)
            }
        }
        fetchData()
    }, [])

    // Reset page when filters change
    useEffect(() => {
        setCurrentPage(1)
    }, [searchTerm, statusFilter, petFilter])

    // Filter data based on search and filters
    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            // Filter by search term
            const searchMatch =
                searchTerm === '' ||
                application.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                application.phoneNumber.includes(searchTerm) ||
                application.petName.toLowerCase().includes(searchTerm.toLowerCase());

            // Filter by status
            const statusMatch =
                statusFilter === '' ||
                application.applicationStatus.toLowerCase() === statusFilter.toLowerCase();

            // Filter by pet name
            const petMatch =
                petFilter === '' ||
                application.petName.toLowerCase() === petFilter.toLowerCase();

            return searchMatch && statusMatch && petMatch;
        });
    }, [applications, searchTerm, statusFilter, petFilter]);

    // Update pagination with filtered data
    const totalPages = Math.ceil(filteredApplications.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, filteredApplications.length)
    const currentApplications = filteredApplications.slice(startIndex, endIndex)

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
            case 'approved':
                return 'outline'
            case 'pending':
                return 'secondary'
            case 'rejected':
                return 'destructive'
            case 'adopted':
                return 'default'
            default:
                return 'default'
        }
    }

    // Get status display text
    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'Đã duyệt'
            case 'pending':
                return 'Đang xử lý'
            case 'rejected':
                return 'Đã từ chối'
            case 'adopted':
                return 'Đã nhận nuôi'
            default:
                return status
        }
    }    // Function to view application details
    const handleViewApplication = (id: string) => {
        // Navigate to application detail page
        console.log(`View application with ID: ${id}`)
        navigate(`/staff/adoptions/${id}`)
    }

    // Function to get unique pet names for filtering
    const getUniquePets = () => {
        const uniquePets = new Set(applications.map(app => app.petName.toLowerCase()))
        return Array.from(uniquePets)
    }

    return (
        <div className='px-6'>
            <div className="mb-4 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Danh sách đơn đăng ký nhận nuôi thú cưng</h2>
            </div>
            <div className='rounded-md border bg-white'>
                <div className="p-4">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Search bar */}
                        <div className="relative w-full md:w-96">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên, email, số điện thoại, thú cưng..."
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

                        {/* Filters */}
                        <div className="flex items-center gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    <SelectItem value="pending">Đang xử lý</SelectItem>
                                    <SelectItem value="approved">Đã duyệt</SelectItem>
                                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                                    <SelectItem value="adopted">Đã nhận nuôi</SelectItem>
                                </SelectContent>
                            </Select>

                            <Select value={petFilter} onValueChange={setPetFilter}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Thú cưng" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả</SelectItem>
                                    {getUniquePets().map((pet, index) => (
                                        <SelectItem key={index} value={pet}>
                                            {pet.charAt(0).toUpperCase() + pet.slice(1)}
                                        </SelectItem>
                                    ))}
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
                                <TableHead>Thú cưng</TableHead>
                                <TableHead>Ngày đăng ký</TableHead>
                                <TableHead>Trạng thái</TableHead>
                                <TableHead className="text-right">Chi tiết</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentApplications.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                        Không có dữ liệu đơn nhận nuôi
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentApplications.map((application) => (
                                    <TableRow key={application.id || `${application.userId}-${application.petId}`}>
                                        <TableCell className="font-medium">
                                            {application.fullName}
                                        </TableCell>
                                        <TableCell>{application.email}</TableCell>
                                        <TableCell>{application.phoneNumber}</TableCell>
                                        <TableCell>{application.petName}</TableCell>
                                        <TableCell>{formatDate(application.createdDate)}</TableCell>
                                        <TableCell>
                                            <Badge variant={getStatusBadgeVariant(application.applicationStatus)}>
                                                {getStatusDisplayText(application.applicationStatus.toLowerCase())}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <button
                                                onClick={() => handleViewApplication(application.id || '')}
                                                className="inline-flex items-center justify-center text-sm font-medium hover:text-blue-600"
                                            >
                                                <Eye className="h-4 w-4" />
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                    {/* Pagination */}
                    <div className="flex items-center justify-between py-4">
                        <div className="text-sm text-muted-foreground w-full">
                            Hiển thị {currentApplications.length} trên {filteredApplications.length} kết quả
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
