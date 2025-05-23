import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, AlertCircle, Search, ThumbsUp, ThumbsDown, Eye } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import ROUTES from '@/constants/routes'
import { useDispatch, useSelector } from 'react-redux'
import { selectorGlobal } from '@/store/modules/global/selector'

export default function VerifyPetsPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    // Giả định rằng danh sách thú cưng cần xác minh sẽ được lấy từ Redux store
    // Trong thực tế, bạn có thể cần một action riêng để lấy danh sách thú cưng cần xác minh
    const allPets = useSelector(selectorGlobal.listPet)

    // Lọc thú cưng cần xác minh (giả định rằng những thú cưng có trạng thái 'pending_verification')
    const petsNeedingVerification = allPets.filter(pet => pet.verificationStatus === 'pending_verification' || !pet.isVerified)

    const [searchTerm, setSearchTerm] = useState('')
    const [filterType, setFilterType] = useState('all')
    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null)

    useEffect(() => {
        // Dispatch action để lấy danh sách thú cưng cần xác minh
        dispatch({ type: 'GET_PETS_NEEDING_VERIFICATION' })
    }, [])

    // Lọc thú cưng dựa trên từ khóa tìm kiếm và bộ lọc
    const filteredPets = petsNeedingVerification.filter(pet => {
        const matchesSearch =
            pet.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            pet.ownerName?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesType = filterType === 'all' || pet.categoryName === filterType

        return matchesSearch && matchesType
    })

    // Xử lý xác minh thú cưng
    const handleVerifyPet = (id: number, isApproved: boolean) => {
        dispatch({
            type: 'VERIFY_PET',
            payload: { id, isApproved }
        })

        setNotification({
            type: 'success',
            message: isApproved
                ? 'Thú cưng đã được xác minh và phê duyệt thành công!'
                : 'Thú cưng đã bị từ chối xác minh!'
        })
    }

    // Xử lý xem chi tiết thú cưng
    const handleViewPetDetails = (slug: string) => {
        navigate(`/staff/verify-pets/${slug}`)
    }

    return (
        <div>
            {notification && (
                <Alert
                    variant={notification.type === 'success' ? 'default' : 'destructive'}
                    className="mb-6"
                >
                    {notification.type === 'success' ? (
                        <CheckCircle className="h-4 w-4" />
                    ) : (
                        <AlertCircle className="h-4 w-4" />
                    )}
                    <AlertTitle>
                        {notification.type === 'success' ? 'Thành công' : 'Lỗi'}
                    </AlertTitle>
                    <AlertDescription>
                        {notification.message}
                    </AlertDescription>
                </Alert>
            )}

            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Xác minh thú cưng</h1>
                    <p className="text-sm text-muted-foreground">
                        Xác minh thông tin thú cưng mà người dùng đã đăng để tìm người nhận nuôi.
                    </p>
                </div>
            </div>

            <div className="rounded-md border bg-white">
                <div className="flex flex-col md:flex-row gap-4 p-6">
                    <div className="relative flex-1">
                        <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            placeholder="Tìm kiếm theo tên thú cưng, tên người đăng..."
                            className="pl-8 h-full"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Loại thú cưng" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="dog">Chó</SelectItem>
                            <SelectItem value="cat">Mèo</SelectItem>
                            <SelectItem value="other">Khác</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tên thú cưng</TableHead>
                            <TableHead>Loại</TableHead>
                            <TableHead>Người đăng</TableHead>
                            <TableHead>Ngày đăng</TableHead>
                            <TableHead>Trạng thái</TableHead>
                            <TableHead className="text-right">Thao tác</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-6">
                                    Không có thú cưng nào cần xác minh
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPets.map((pet) => (
                                <TableRow key={pet.id}>
                                    <TableCell className="font-medium">{pet.petName}</TableCell>
                                    <TableCell>{pet.categoryName}</TableCell>
                                    <TableCell>{pet.ownerName || 'Không có thông tin'}</TableCell>
                                    <TableCell>{new Date(pet.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                            Chờ xác minh
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => handleViewPetDetails(pet.slug)}
                                            >
                                                <Eye className="h-4 w-4 mr-1" />
                                                Xem
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
