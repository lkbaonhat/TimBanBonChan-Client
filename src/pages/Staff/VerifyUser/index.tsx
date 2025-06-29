import { useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search } from 'lucide-react'
import VerifyUserTable from './components/VerifyUserTable'
import { useQuery } from '@tanstack/react-query'
import { adopterApplicationsQuery } from '@/features/admin/adopter-applications/services/queries'

// Define interface here or export from VerifyUserTable
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

export default function VerifyUser() {
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const { data } = useQuery(adopterApplicationsQuery.getAdopterApplications())

    const adopterApplication = data || [];

    return (
        <div className="">
            {/* Header */}
            <div className='mb-4'>
                <p className="text-2xl font-bold">Xác minh hồ sơ người dùng</p>
                <p className="text-sm text-muted-foreground">
                    Quản lý và xác minh các yêu cầu xác thực hồ sơ từ người dùng
                </p>
            </div>

            {/* Table Section */}
            <Card className="rounded-md border bg-white">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên hoặc email..."
                            className="pl-8 h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    {/* Status Filter */}
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Trạng thái" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="pending">Chờ duyệt</SelectItem>
                            <SelectItem value="approved">Đã duyệt</SelectItem>
                            <SelectItem value="rejected">Từ chối</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <VerifyUserTable
                    searchTerm={searchTerm}
                    statusFilter={statusFilter}
                    userList={adopterApplication}
                />
            </Card>
        </div >
    )
}
