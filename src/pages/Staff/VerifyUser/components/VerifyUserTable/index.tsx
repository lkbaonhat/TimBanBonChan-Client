import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Eye } from 'lucide-react'
import { formatDate } from '@/utils/helper'
import { Link } from 'react-router-dom'

interface VerifyUser {
    applicationId: string
    fullName: string
    email: string
    phoneNumber: string
    avatar?: string
    submittedAt: string
    applicationStatus: 'Pending' | 'Approved' | 'Rejected'
    createdDate: string
    reason?: string
}

interface VerifyUserTableProps {
    searchTerm?: string
    statusFilter?: string
    userList: VerifyUser[]
}

const columns: ColumnDef<VerifyUser>[] = [
    {
        accessorKey: 'user',
        header: 'Người dùng',
        cell: ({ row }) => {
            const user = row.original
            return (
                <div className="flex items-center space-x-3">
                    <Avatar className="w-14 h-14 rounded-xl">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback className='w-14 h-14 rounded-xl object-cover border-2 border-gray-200'>
                            {user.fullName.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                </div>
            )
        }
    },
    {
        accessorKey: 'phone',
        header: 'Số điện thoại',
        cell: ({ row }) => (
            <span className="text-sm">{row.original.phoneNumber}</span>
        )
    },
    {
        accessorKey: 'submittedAt',
        header: 'Ngày gửi',
        cell: ({ row }) => {
            const date = row.original.createdDate
            return (
                <span className="text-sm">
                    {formatDate(date)}
                </span>
            )
        }
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.original.applicationStatus
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

            return getStatusBadge(status)
        }
    },
    {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
            const user = row.original

            return (
                <div className='pl-4'>
                    <Link to={`/staff/verify-users/${user.applicationId}`}>
                        <Eye className="mr-2 h-4 w-4" />
                    </Link>
                </div>

            )
        }
    }
]

export default function VerifyUserTable({
    searchTerm = '',
    statusFilter = 'all',
    userList
}: VerifyUserTableProps) {
    // Filter data based on props
    const filteredData = userList.filter(user => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || user.applicationStatus.toLowerCase() === statusFilter

        return matchesSearch && matchesStatus
    })

    return (
        <div className='px-6'>
            <DataTable columns={columns} data={filteredData} />
        </div>
    )
}
