"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/DataTable"
import { Eye, Phone, Mail, MapPin, Calendar, PawPrint } from "lucide-react"

export interface AdoptionApplication {
    id: string
    userId: string
    fullName: string
    email: string
    phoneNumber: string
    petId: string
    petName: string
    dateOfBirth: string
    address: string
    applicationStatus: string
    createdDate: string
    livingArrangement: string
    hasOtherPets: string
    hasPreviousPets: string
    previousExperience?: string
    petCareKnowledge?: string
    additionalInfo?: string
}

interface AdoptionApplicationTableProps {
    data: AdoptionApplication[]
    onViewDetail?: (application: AdoptionApplication) => void
    onUpdateStatus?: (id: string, status: string) => void
}

const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return "default"
        case "pending":
            return "secondary"
        case "rejected":
            return "destructive"
        case "adopted":
            return "outline"
        default:
            return "secondary"
    }
}

const getStatusDisplayText = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return "Đã duyệt"
        case "pending":
            return "Đang xử lý"
        case "rejected":
            return "Đã từ chối"
        case "adopted":
            return "Đã nhận nuôi"
        default:
            return status
    }
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    })
}

export default function AdoptionApplicationTable({
    data,
    onViewDetail,
    onUpdateStatus
}: AdoptionApplicationTableProps) {
    const columns: ColumnDef<AdoptionApplication>[] = [
        {
            accessorKey: "fullName",
            header: "Người nộp đơn",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="flex flex-col space-y-1">
                        <span className="font-medium">{application.fullName}</span>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" />
                            {application.email}
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                            <Phone className="w-3 h-3 mr-1" />
                            {application.phoneNumber}
                        </div>
                    </div>
                )
            },
        },
        {
            accessorKey: "petName",
            header: "Thú cưng",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <PawPrint className="w-4 h-4 text-orange-500" />
                        <span className="font-medium">{application.petName}</span>
                    </div>
                )
            },
        },
        {
            accessorKey: "address",
            header: "Địa chỉ",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="flex items-center text-sm">
                        <MapPin className="w-3 h-3 mr-1 text-muted-foreground" />
                        {application.address}
                    </div>
                )
            },
        },
        {
            accessorKey: "createdDate",
            header: "Ngày nộp",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="flex items-center text-sm">
                        <Calendar className="w-3 h-3 mr-1 text-muted-foreground" />
                        {formatDate(application.createdDate)}
                    </div>
                )
            },
        },
        {
            accessorKey: "applicationStatus",
            header: "Trạng thái",
            cell: ({ row }) => {
                const status = row.getValue("applicationStatus") as string
                return (
                    <Badge variant={getStatusBadgeVariant(status)}>
                        {getStatusDisplayText(status)}
                    </Badge>
                )
            },
        },
        {
            accessorKey: "livingArrangement",
            header: "Điều kiện sống",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="text-sm">
                        <div>{application.livingArrangement}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                            Pet khác: {application.hasOtherPets}
                        </div>
                    </div>
                )
            },
        },
        {
            id: "actions",
            header: "Hành động",
            cell: ({ row }) => {
                const application = row.original
                return (
                    <div className="flex items-center space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewDetail?.(application)}
                        >
                            <Eye className="w-4 h-4 mr-1" />
                            Xem chi tiết
                        </Button>
                        {application.applicationStatus === "pending" && (
                            <>
                                <Button
                                    variant="default"
                                    size="sm"
                                    onClick={() => onUpdateStatus?.(application.id, "approved")}
                                >
                                    Duyệt
                                </Button>
                                <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => onUpdateStatus?.(application.id, "rejected")}
                                >
                                    Từ chối
                                </Button>
                            </>
                        )}
                    </div>
                )
            },
        },
    ]

    return <DataTable columns={columns} data={data} />
}