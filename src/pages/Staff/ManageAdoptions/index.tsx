import { useState, useMemo, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import AdoptionApplicationTable from "./AdoptionApplicationTable"
import { petService } from "@/services/petService"

export default function ManageAdoptions() {
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize] = useState(5)
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("all")
    const [applications, setApplications] = useState([]);

    const getAdoptionApplications = async () => {
        const response = await petService.getAllAdoptionApplications()

        if (response.status !== 200) {
            throw Error("Failed fetch");
        }

        setApplications(response.data.data.items);
    }

    useEffect(() => {
        getAdoptionApplications();
    }, [])

    const filteredApplications = useMemo(() => {
        return applications.filter((application) => {
            const searchMatch =
                application.petName.toLowerCase().includes(searchTerm.toLowerCase())

            const statusMatch =
                statusFilter === "all" ||
                application.applicationStatus.toLowerCase() === statusFilter.toLowerCase()
            
            return searchMatch && statusMatch
        })
    }, [applications, searchTerm, statusFilter])

    const totalPages = Math.ceil(filteredApplications.length / pageSize)
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = Math.min(startIndex + pageSize, filteredApplications.length)
    const currentApplications = filteredApplications.slice(startIndex, endIndex)

    return (
        <div className="px-6">
            {/* Header Section */}
            <div className="mb-4">
                <h2 className="text-2xl font-bold">Đơn đăng ký nhận nuôi thú cưng</h2>
                <p className="text-sm text-muted-foreground">
                    Quản lý và theo dõi tất cả đơn xin nhận nuôi thú cưng tại đây.
                </p>
            </div>

            <div className='rounded-md border bg-white'>
                <div className="p-6">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        {/* Thanh tìm kiếm */}
                        <div className="relative w-full">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Tìm kiếm theo tên..."
                                className="pl-8 w-full"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-2 top-2.5 hover:cursor-pointer"
                                >
                                    <X className="h-4 w-4 text-muted-foreground" />
                                </button>
                            )}
                        </div>

                        {/* Bộ lọc */}
                        <div className="flex items-center gap-3">
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-primary-400 rounded-xl">
                                    <SelectValue placeholder="Trạng thái" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                    <SelectItem value="pending">Đang xử lý</SelectItem>
                                    <SelectItem value="approved">Đã duyệt</SelectItem>
                                    <SelectItem value="rejected">Đã từ chối</SelectItem>
                                    <SelectItem value="adopted">Đã nhận nuôi</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <AdoptionApplicationTable
                    applications={filteredApplications}
                />
            </div>
        </div>
    )
}
