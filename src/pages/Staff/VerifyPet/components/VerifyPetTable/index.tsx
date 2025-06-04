import React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, CheckCircle, X } from 'lucide-react'
import { DataTable } from '@/components/DataTable'
import { formatDate } from '@/utils/helper'

// Define the Pet type for verification
interface VerifyPet {
    petId: number
    petName: string
    petImageUrls: string
    categoryName: string
    breed: string
    ownerName: string
    ownerEmail: string
    ownerPhone: string
    createdDate: string
    verificationStatus: string
    isVerified: boolean
    slug: string
    [key: string]: any
}

interface VerifyPetTableProps {
    pets: VerifyPet[]
    onViewDetails: (slug: string) => void
    onVerifyPet: (id: number, isApproved: boolean) => void
}

const columns: ColumnDef<VerifyPet>[] = [
    {
        accessorKey: 'petInfo',
        header: 'Thông tin thú cưng',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12 rounded-xl">
                        <AvatarImage
                            src={pet.petImageUrls || "/placeholder.svg"}
                            alt={pet.petName}
                            className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                        />
                        <AvatarFallback className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200">
                            {pet.petName.charAt(0)}
                        </AvatarFallback>
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
        accessorKey: 'categoryName',
        header: 'Loại',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {pet.categoryName}
                </Badge>
            )
        }
    },
    {
        accessorKey: 'ownerInfo',
        header: 'Người đăng',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <div>
                    <p className="font-medium text-gray-900">{pet.ownerName}</p>
                    <p className="text-sm text-gray-600">{pet.ownerEmail}</p>
                </div>
            )
        }
    },
    {
        accessorKey: 'createdDate',
        header: 'Ngày đăng',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <span className="text-sm text-gray-600">
                    {formatDate(pet.createdDate)}
                </span>
            )
        }
    },
    {
        accessorKey: 'verificationStatus',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const pet = row.original
            return (
                <Badge
                    variant="outline"
                    className="bg-amber-50 text-amber-700 border-amber-200"
                >
                    Chờ xác minh
                </Badge>
            )
        }
    },
    {
        accessorKey: 'actions',
        header: 'Thao tác',
        cell: ({ row, table }) => {
            const pet = row.original
            // Get functions from parent component context
            const { onViewDetails, onVerifyPet } = table.options.meta as any

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onViewDetails(pet.slug)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onVerifyPet(pet.petId, true)}
                            className="text-green-600 focus:text-green-600"
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Phê duyệt
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => onVerifyPet(pet.petId, false)}
                            className="text-red-600 focus:text-red-600"
                        >
                            <X className="h-4 w-4 mr-2" />
                            Từ chối
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

export function VerifyPetTable({ pets, onViewDetails, onVerifyPet }: VerifyPetTableProps) {
    return (
        <div className="px-6">
            <DataTable
                columns={columns}
                data={pets}
                meta={{
                    onViewDetails,
                    onVerifyPet
                }}
            />
        </div>
    )
}

export default VerifyPetTable