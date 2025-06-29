import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Eye, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatDate } from '@/utils/helper'
import { DataTable } from '@/components/DataTable'
import { ColumnDef } from '@tanstack/react-table'
import ROUTES from '@/constants/routes'

// Define the Pet type
interface VolunteerApplication {
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

interface VolunteerApplicationTableProps {
    applications: VolunteerApplication[]
}

// Get status badge variant
const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case 'active':
            return 'default'
        case 'pending':
            return 'pending'
        case 'approved':
            return 'success'
        case 'rejected':
            return 'reject'
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

const columns: ColumnDef<VolunteerApplication>[] = [
    {
        accessorKey: 'user',
        header: 'Người đăng ký',
        cell: ({ row }) => {
            const application = row.original
            return (
                <div className='flex items-center gap-4'>
                    <Avatar className="w-14 h-14 rounded-xl">
                        <AvatarImage src={application.petImageUrls || "/placeholder.svg"} alt={application.fullName} />
                        <AvatarFallback className='w-14 h-14 rounded-xl object-cover border-2 border-gray-200'>{application.fullName.split(" ").pop()?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-semibold text-gray-900">{application.fullName}</h3>
                        <p className="text-sm text-gray-600">{application.email}</p>
                    </div>
                </div>

            )
        }
    },
    {
        accessorKey: 'phoneNumber',
        header: 'Số điện thoại',
        cell: ({ row }) => {
            const application = row.original
            return application.phoneNumber
        }
    },
    {
        accessorKey: 'gender',
        header: 'Giới tính',
        cell: ({ row }) => {
            return row.original.gender
        }
    },
    {
        accessorKey: 'createdDate',
        header: 'Ngày đăng ký',
        cell: ({ row }) => {
            return formatDate(row.original.createdDate)
        }
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const application = row.original
            return <Badge variant={getStatusBadgeVariant(application.applicationStatus)}>
                {getStatusDisplayText(application.applicationStatus)}
            </Badge>
        }
    },
    {
        accessorKey: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
            const application = row.original
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                            <Link to={`${ROUTES.STAFF.VOLUNTEER_APPLICATIONS}/${application.applicationId}`}>
                                <button className='flex w-full items-center px-2 py-1.5 text-sm'>
                                    <Eye size={16} strokeWidth={1.5} />
                                    <span className='ml-2'>Xem chi tiết</span>
                                </button>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    },

]

export function VolunteerApplicationTable({ applications }: VolunteerApplicationTableProps) {
    return (
        <div className='px-6'>
            <DataTable
                columns={columns}
                data={applications}
            />
        </div>
    )
}