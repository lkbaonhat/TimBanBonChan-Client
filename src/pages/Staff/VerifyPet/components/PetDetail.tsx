import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useDispatch, useSelector } from 'react-redux'
import { selectorGlobal } from '@/store/modules/global/selector'

export default function VerifyPetDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const allPets = useSelector(selectorGlobal.listPet)

    // Tìm thú cưng theo slug
    const pet = allPets.find(pet => pet.slug === slug)

    const [notification, setNotification] = useState<{
        type: 'success' | 'error';
        message: string;
    } | null>(null)

    useEffect(() => {
        if (slug) {
            // Dispatch action để lấy thông tin chi tiết thú cưng nếu cần
            dispatch({ type: 'GET_PET_DETAIL', payload: { slug } })
        }
    }, [slug])

    // Xử lý xác minh thú cưng
    const handleVerifyPet = (isApproved: boolean) => {
        if (!pet) return

        dispatch({
            type: 'VERIFY_PET',
            payload: { id: pet.id, isApproved }
        })

        setNotification({
            type: 'success',
            message: isApproved
                ? 'Thú cưng đã được xác minh và phê duyệt thành công!'
                : 'Thú cưng đã bị từ chối xác minh!'
        })

        // Sau khi xác minh, quay lại trang danh sách sau 2 giây
        setTimeout(() => {
            navigate('/staff/verify-pets')
        }, 2000)
    }

    if (!pet) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <h3 className="text-xl font-medium">Không tìm thấy thông tin thú cưng</h3>
                    <Button
                        variant="link"
                        onClick={() => navigate('/staff/verify-pets')}
                        className="mt-4"
                    >
                        Quay lại danh sách
                    </Button>
                </div>
            </div>
        )
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

            <div className="flex items-center mb-6">
                <Button
                    variant="ghost"
                    className="mr-4"
                    onClick={() => navigate('/staff/verify-pets')}
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Quay lại
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Chi tiết thú cưng cần xác minh</h1>
                    <p className="text-sm text-muted-foreground">
                        Kiểm tra thông tin và xác minh thú cưng
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>Thông tin thú cưng</CardTitle>
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">
                                    Chờ xác minh
                                </Badge>
                            </div>
                            <CardDescription>
                                Thông tin cơ bản về thú cưng cần xác minh
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6">
                                <div className="aspect-video rounded-md overflow-hidden">
                                    {pet.imageUrl ? (
                                        <img
                                            src={pet.imageUrl}
                                            alt={pet.petName}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-muted flex items-center justify-center">
                                            <span className="text-muted-foreground">Không có hình ảnh</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Tên thú cưng</h3>
                                        <p className="text-lg">{pet.petName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Loại</h3>
                                        <p className="text-lg">{pet.categoryName}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Giống</h3>
                                        <p className="text-lg">{pet.breed || 'Không xác định'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Tuổi</h3>
                                        <p className="text-lg">{pet.age || 'Không xác định'} tuổi</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Giới tính</h3>
                                        <p className="text-lg">{pet.gender === 'male' ? 'Đực' : 'Cái'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-sm text-muted-foreground">Màu sắc</h3>
                                        <p className="text-lg">{pet.color || 'Không xác định'}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Mô tả</h3>
                                    <p className="text-base">{pet.description || 'Không có mô tả'}</p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Tình trạng sức khỏe</h3>
                                    <p className="text-base">{pet.healthStatus || 'Không có thông tin'}</p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground mb-2">Lý do cho nhận nuôi</h3>
                                    <p className="text-base">{pet.reasonForAdoption || 'Không có thông tin'}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div>
                    <Card>
                        <CardHeader>
                            <CardTitle>Thông tin người đăng</CardTitle>
                            <CardDescription>
                                Chi tiết về người muốn tìm người nhận nuôi
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Tên người đăng</h3>
                                    <p className="text-lg">{pet.ownerName || 'Không có thông tin'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Email</h3>
                                    <p className="text-lg">{pet.ownerEmail || 'Không có thông tin'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Số điện thoại</h3>
                                    <p className="text-lg">{pet.ownerPhone || 'Không có thông tin'}</p>
                                </div>
                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Địa chỉ</h3>
                                    <p className="text-lg">{pet.ownerAddress || 'Không có thông tin'}</p>
                                </div>

                                <Separator />

                                <div>
                                    <h3 className="font-medium text-sm text-muted-foreground">Ngày đăng</h3>
                                    <p className="text-lg">{new Date(pet.createdAt).toLocaleDateString('vi-VN')}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="mt-6 space-y-4">
                        <Button
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={() => handleVerifyPet(true)}
                        >
                            <ThumbsUp className="h-4 w-4 mr-2" />
                            Phê duyệt thú cưng
                        </Button>
                        <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleVerifyPet(false)}
                        >
                            <ThumbsDown className="h-4 w-4 mr-2" />
                            Từ chối thú cưng
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
