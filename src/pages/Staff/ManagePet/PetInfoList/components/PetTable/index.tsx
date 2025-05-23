import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { EditPetDialog } from '../EditPetDialog'
import { DeletePetDialog } from '../DeletePetDialog'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import { useNavigate } from 'react-router-dom'
import { formatDate } from '@/utils/helper'

// Define the Pet type
interface Pet {
    petId: number
    petName: string
    petImageUrls: string
    gender: string
    age: string
    location: string
    breed: string
    categoryName: string
    adoptionStatus: string,
    createdDate?: string,
    slug: string
    [key: string]: any; // Allow for additional properties
}

interface PetsTableProps {
    pets: Pet[]
    onViewDetails: (slug: string) => void
    onEdit: (id: number, updatedPet: Pet) => void
    onDelete: (id: number) => void
}

export function PetsTable({ pets, onViewDetails, onEdit, onDelete }: PetsTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(5)
    const navigate = useNavigate()


    // Calculate pagination
    const totalPages = Math.ceil(pets.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, pets.length)
    const currentPets = pets.slice(startIndex, endIndex)

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
        switch (status) {
            case 'available':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'adopted':
                return 'outline'
            default:
                return 'default'
        }
    }

    // Get status display text
    const getStatusDisplayText = (status: string) => {
        switch (status) {
            case 'available':
                return 'Có sẵn'
            case 'pending':
                return 'Đang xử lý'
            case 'adopted':
                return 'Đã nhận nuôi'
            default:
                return status
        }
    }

    return (
        <div className='px-6'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>
                            Tên thú cưng
                        </TableHead>
                        <TableHead>Loại</TableHead>
                        <TableHead>Ngày tạo</TableHead>
                        <TableHead>
                            Trạng thái
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentPets.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center h-24 text-muted-foreground">
                                Không có dữ liệu thú cưng
                            </TableCell>
                        </TableRow>
                    ) : (
                        currentPets.map((pet) => (
                            <TableRow key={pet.petId}>
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage src={pet.petImageUrls || "/placeholder.svg"} alt={pet.petName} />
                                        <AvatarFallback>{pet.petName}</AvatarFallback>
                                    </Avatar>                                    {pet.petName}
                                </TableCell>
                                <TableCell>{pet.categoryName}</TableCell>
                                <TableCell>{pet.createdDate ? formatDate(pet.createdDate) : 'N/A'}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusBadgeVariant(pet.adoptionStatus)}>
                                        {getStatusDisplayText(pet.adoptionStatus.toLocaleLowerCase())}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => onViewDetails(pet.slug)}>
                                                <Eye />
                                                <span>Xem chi tiết</span>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <EditPetDialog
                                                    pet={pet}
                                                    onPetUpdated={onEdit}
                                                    trigger={
                                                        <button className="flex w-full items-center px-2 py-1.5 text-sm">
                                                            <Pencil size={16} strokeWidth={1.5} />
                                                            <span className='ml-2'>Chỉnh sửa</span>
                                                        </button>
                                                    }
                                                />
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                                                <DeletePetDialog
                                                    petId={pet.petId}
                                                    petName={pet.petName}
                                                    onPetDeleted={onDelete}
                                                    trigger={
                                                        <button className="flex w-full items-center px-2 py-1.5 text-sm">
                                                            <Trash2 size={16} strokeWidth={1.5} className='text-red-500' />
                                                            <span className='ml-2 text-red-500'>Xóa</span>
                                                        </button>
                                                    }
                                                />
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>            {/* Pagination */}
            <div className="flex items-center justify-between py-4">
                <div className="text-sm text-muted-foreground w-full">
                    Hiển thị {currentPets.length} trên {pets.length} kết quả
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
    )
}