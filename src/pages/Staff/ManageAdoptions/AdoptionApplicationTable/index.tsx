import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import ROUTES from "@/constants/routes";
import { formatDate } from "@/utils/helper";
import { ColumnDef } from "@tanstack/react-table";
import { Eye, MoreHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import { DataTable } from '@/components/DataTable';

interface AdoptionApplicationTable {
    applications: IEntities.AdoptionApplication[]
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

const columns: ColumnDef<IEntities.AdoptionApplication>[] = [
    {
        accessorKey: 'user',
        header: 'Người đăng ký',
        cell: ({ row }) => {
            const application = row.original
            return application.applicantFullName
        }
    },
    {
        accessorKey: 'pet',
        header: 'Thú cưng',
        cell: ({ row }) => {
            return row.original.petName
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
                            <Link to={`${ROUTES.STAFF.ADOPTIONS}/${application.applicationId}`}>
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

const AdoptionApplicationTable = ({ applications }: AdoptionApplicationTable) => {
    return (
        <div className='px-6'>
            <DataTable
                columns={columns}
                data={applications}
            />
        </div>
    )
}

export default AdoptionApplicationTable