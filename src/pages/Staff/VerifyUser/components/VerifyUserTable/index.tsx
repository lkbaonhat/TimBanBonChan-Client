import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '@/components/DataTable'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Eye, Check, X, MoreHorizontal } from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

interface VerifyUser {
    id: string
    fullName: string
    email: string
    phone: string
    avatar?: string
    submittedAt: string
    status: 'pending' | 'approved' | 'rejected'
    documentType: string
    reason?: string
}

interface VerifyUserTableProps {
    searchTerm?: string
    statusFilter?: string
    documentTypeFilter?: string
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
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={user.fullName} />
                        <AvatarFallback>
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
            <span className="text-sm">{row.getValue('phone')}</span>
        )
    },
    {
        accessorKey: 'documentType',
        header: 'Loại tài liệu',
        cell: ({ row }) => (
            <Badge variant="outline" className="text-xs">
                {row.getValue('documentType')}
            </Badge>
        )
    },
    {
        accessorKey: 'submittedAt',
        header: 'Ngày gửi',
        cell: ({ row }) => {
            const date = new Date(row.getValue('submittedAt'))
            return (
                <span className="text-sm">
                    {date.toLocaleDateString('vi-VN')}
                </span>
            )
        }
    },
    {
        accessorKey: 'status',
        header: 'Trạng thái',
        cell: ({ row }) => {
            const status = row.getValue('status') as string
            const statusConfig = {
                pending: { label: 'Chờ duyệt', variant: 'secondary' as const },
                approved: { label: 'Đã duyệt', variant: 'success' as const },
                rejected: { label: 'Từ chối', variant: 'destructive' as const }
            }

            const config = statusConfig[status as keyof typeof statusConfig]
            return (
                <Badge variant={config.variant}>
                    {config.label}
                </Badge>
            )
        }
    },
    {
        id: 'actions',
        header: 'Thao tác',
        cell: ({ row }) => {
            const user = row.original

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <MoreHorizontal className="h-4 w-4 hover:cursor-pointer" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewDetails(user.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Xem chi tiết
                        </DropdownMenuItem>
                        {user.status === 'pending' && (
                            <>
                                <DropdownMenuItem onClick={() => handleApprove(user.id)}>
                                    <Check className="mr-2 h-4 w-4 text-green-600" />
                                    Duyệt
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReject(user.id)}>
                                    <X className="mr-2 h-4 w-4 text-red-600" />
                                    Từ chối
                                </DropdownMenuItem>
                            </>
                        )}
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        }
    }
]

// Handler functions
const handleViewDetails = (userId: string) => {
    console.log('View details for user:', userId)
    // Implement view details logic here
}

const handleApprove = (userId: string) => {
    console.log('Approve user:', userId)
    // Implement approve logic here
}

const handleReject = (userId: string) => {
    console.log('Reject user:', userId)
    // Implement reject logic here
}

export default function VerifyUserTable({
    searchTerm = '',
    statusFilter = 'all',
    documentTypeFilter = 'all',
    userList
}: VerifyUserTableProps) {
    // Filter data based on props
    const filteredData = userList.filter(user => {
        const matchesSearch =
            user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || user.status === statusFilter

        const matchesDocumentType =
            documentTypeFilter === 'all' || user.documentType === documentTypeFilter

        return matchesSearch && matchesStatus && matchesDocumentType
    })

    return (
        <div className='px-6'>
            <DataTable columns={columns} data={filteredData} />
        </div>
    )
}
