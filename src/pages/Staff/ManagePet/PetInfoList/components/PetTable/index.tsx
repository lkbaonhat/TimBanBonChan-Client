import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { DeletePetDialog } from '../DeletePetDialog'
import { Link } from 'react-router-dom'
import { formatDate } from '@/utils/helper'
import { DataTable } from '@/components/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import ROUTES from '@/constants/routes'

// Define the Pet type
interface Pet {
    petId: number
    petName: string
    petImageUrls: string
    gender: string
    age: number
    location: string
    breed: string
    categoryName: string
    adoptionStatus: string,
    createdDate: string,
    slug: string
    [key: string]: any; // Allow for additional properties
}

interface PetsTableProps {
    pets: Pet[]
}

const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
        case 'pending':
            return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Đang xử lý</Badge>;
        case 'available':
            return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Có thể nhận nuôi</Badge>;
        case 'adopted':
            return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Đã nhận nuôi</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

const columns: ColumnDef<Pet>[] = [
    {
        accessorKey: 'pet',
        header: 'Thú cưng',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <div className='flex items-center gap-4'>
                    <Avatar className="w-14 h-14 rounded-xl">
                        <AvatarImage src={pet.petImageUrls || "/placeholder.svg"} alt={pet.petName} className="w-14 h-14 rounded-xl object-cover border-2 border-gray-200" />
                        <AvatarFallback className='w-14 h-14 rounded-xl object-cover border-2 border-gray-200'>{pet.petName}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900">{pet.petName}</h3>
                        <p className="text-sm text-gray-600">{pet.breed}</p>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: 'type',
        header: 'Loại',
        cell: ({ row }) => {
            const pet = row.original
            return pet.categoryName
        }
    },
    {
        accessorKey: 'createdDate',
        header: 'Ngày tạo',
        cell: ({ row }) => {
            return formatDate(row.original.createdDate)
        }
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const pet = row.original
            return getStatusBadge(pet.adoptionStatus)
        }
    },
    {
        accessorKey: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Link to={`${ROUTES.STAFF.MANAGE_PETS}/${pet.slug}`}>
                                    <button className='flex w-full items-center px-2 py-1.5 text-sm'>
                                        <Eye size={16} strokeWidth={1.5} />
                                        <span className='ml-2'>Xem chi tiết</span>
                                    </button>
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                                <Link to={`${ROUTES.STAFF.MANAGE_PETS}/${pet.slug}/edit`}>
                                    <button className="flex w-full items-center px-2 py-1.5 text-sm">
                                        <Pencil size={16} strokeWidth={1.5} />
                                        <span className='ml-2'>Chỉnh sửa</span>
                                    </button>
                                </Link>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            )
        }
    },

]

export function PetsTable({ pets }: PetsTableProps) {
    return (
        <div className='px-6'>
            <DataTable
                columns={columns}
                data={pets}
            />
        </div>
    )
}