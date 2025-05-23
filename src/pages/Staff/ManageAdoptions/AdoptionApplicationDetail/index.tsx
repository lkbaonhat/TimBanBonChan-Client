import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, AlertCircle, Home } from 'lucide-react'
import { petService } from '@/services/petService'
import { formatDate } from '@/utils/helper'
import { toast } from 'sonner'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ROUTES from '@/constants/routes'


interface AdoptionApplication {
    id?: string;
    userId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    petId: string;
    petName: string;
    dateOfBirth: string;
    address: string;
    applicationStatus: string;
    createdDate: string;
    livingArrangement: string;
    hasOtherPets: string;
    hasPreviousPets: string;
    previousExperience?: string;
    petCareKnowledge?: string;
    additionalInfo?: string;
}

export default function AdoptionApplicationDetail() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [application, setApplication] = useState<AdoptionApplication | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [processing, setProcessing] = useState(false)

    useEffect(() => {
        const fetchApplicationDetail = async () => {
            setLoading(true)
            try {
                if (!id) {
                    throw new Error('ID đơn đăng ký không hợp lệ')
                }

                // Fetch application details from API
                const response = await petService.getAdoptionApplicationById(id)
                setApplication(response.data.data)
                setError(null)
            } catch (err) {
                console.error('Error fetching application details:', err)
                setError('Không thể tải thông tin đơn đăng ký. Vui lòng thử lại sau.')

                // For demo purposes, use mock data if API fails
                if (id === '1') {
                    setApplication({
                        id: '1',
                        userId: 'user1',
                        fullName: 'Nguyễn Văn A',
                        email: 'nguyenvana@gmail.com',
                        phoneNumber: '0901234567',
                        petId: 'pet1',
                        petName: 'Buddy',
                        dateOfBirth: '1990-01-15',
                        address: 'Quận 1, TP HCM',
                        applicationStatus: 'pending',
                        createdDate: '2023-05-10T08:30:00Z',
                        livingArrangement: 'Chung cư',
                        hasOtherPets: 'Có',
                        hasPreviousPets: 'Rồi',
                        previousExperience: 'Từng nuôi chó 2 năm',
                        petCareKnowledge: 'Có kiến thức cơ bản về chăm sóc chó',
                        additionalInfo: 'Muốn một người bạn đồng hành'
                    })
                    setError(null)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchApplicationDetail()
    }, [id])

    const handleApprove = async () => {
        if (!application?.id) return

        setProcessing(true)
        try {
            // Call API to approve application
            await petService.updateAdoptionApplicationStatus(application.id, 'approved')

            // Update local state
            setApplication({
                ...application,
                applicationStatus: 'approved'
            })

            toast("Phê duyệt thành công")
        } catch (err) {
            console.error('Error approving application:', err)
            toast("Phê duyệt thất bại")
        } finally {
            setProcessing(false)
        }
    }

    const handleReject = async () => {
        if (!application?.id) return

        setProcessing(true)
        try {
            // Call API to reject application
            await petService.updateAdoptionApplicationStatus(application.id, 'rejected')

            // Update local state
            setApplication({
                ...application,
                applicationStatus: 'rejected'
            })

            toast("Từ chối thành công")
        } catch (err) {
            console.error('Error rejecting application:', err)
            toast("Từ chối thất bại")
        } finally {
            setProcessing(false)
        }
    }

    // Handle marking as adopted
    const handleMarkAsAdopted = async () => {
        if (!application?.id) return

        setProcessing(true)
        try {
            // Call API to mark as adopted
            await petService.updateAdoptionApplicationStatus(application.id, 'adopted')

            // Update local state
            setApplication({
                ...application,
                applicationStatus: 'adopted'
            })

            toast("Cập nhật thành công")
        } catch (err) {
            console.error('Error marking as adopted:', err)
            toast("Cập nhật thất bại")
        } finally {
            setProcessing(false)
        }
    }

    // Get status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'outline'
            case 'pending':
                return 'secondary'
            case 'rejected':
                return 'destructive'
            case 'adopted':
                return 'default'
            default:
                return 'default'
        }
    }

    // Get status display text
    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'approved':
                return 'Đã duyệt'
            case 'pending':
                return 'Đang xử lý'
            case 'rejected':
                return 'Đã từ chối'
            case 'adopted':
                return 'Đã nhận nuôi'
            default:
                return status
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        )
    } if (error && !application) {
        return (
            <div className="px-6 py-8">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink onClick={() => navigate('/staff/adoptions')}>Danh sách đơn nhận nuôi</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbItem>
                            <BreadcrumbLink>Chi tiết đơn</BreadcrumbLink>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
                <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        )
    }

    if (!application) {
        return null
    } return (
        <div className="px-6 py-4">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink href={ROUTES.STAFF.ADOPTIONS}>Danh sách đơn nhận nuôi</BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{application.fullName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Thông tin người đăng ký */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin người đăng ký</CardTitle>
                        <CardDescription>Thông tin cá nhân của người muốn nhận nuôi thú cưng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Họ và tên</p>
                                <p className="text-base">{application.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ngày sinh</p>
                                <p className="text-base">{formatDate(application.dateOfBirth)}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Email</p>
                                <p className="text-base">{application.email}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Số điện thoại</p>
                                <p className="text-base">{application.phoneNumber}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Địa chỉ</p>
                            <p className="text-base">{application.address}</p>
                        </div>
                    </CardContent>
                </Card>

                {/* Thông tin thú cưng muốn nhận nuôi */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin đơn đăng ký</CardTitle>
                        <CardDescription>Chi tiết về đơn đăng ký nhận nuôi</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Thú cưng</p>
                                <p className="text-base">{application.petName}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Ngày đăng ký</p>
                                <p className="text-base">{formatDate(application.createdDate)}</p>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Trạng thái</p>
                            <Badge variant={getStatusBadgeVariant(application.applicationStatus)} className="mt-1">
                                {getStatusDisplayText(application.applicationStatus)}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                {/* Thông tin về điều kiện sống */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin về điều kiện nuôi thú cưng</CardTitle>
                        <CardDescription>Chi tiết về môi trường sống và kinh nghiệm chăm sóc thú cưng</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Nơi ở</p>
                                <p className="text-base">{application.livingArrangement}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Có thú cưng khác</p>
                                <p className="text-base">{application.hasOtherPets}</p>
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Từng nuôi thú cưng</p>
                                <p className="text-base">{application.hasPreviousPets}</p>
                            </div>
                        </div>
                        {application.previousExperience && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kinh nghiệm nuôi thú cưng</p>
                                <p className="text-base">{application.previousExperience}</p>
                            </div>
                        )}
                        {application.petCareKnowledge && (
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Kiến thức chăm sóc thú cưng</p>
                                <p className="text-base">{application.petCareKnowledge}</p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Thông tin bổ sung */}
                <Card>
                    <CardHeader>
                        <CardTitle>Thông tin bổ sung</CardTitle>
                        <CardDescription>Các thông tin khác người đăng ký cung cấp</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-base">{application.additionalInfo || 'Không có thông tin bổ sung'}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Action buttons */}
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Xử lý đơn đăng ký</CardTitle>
                    <CardDescription>Thay đổi trạng thái đơn đăng ký nhận nuôi</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col space-y-2">
                        <p className="text-sm text-muted-foreground mb-2">Trạng thái hiện tại:
                            <Badge variant={getStatusBadgeVariant(application.applicationStatus)} className="ml-2">
                                {getStatusDisplayText(application.applicationStatus)}
                            </Badge>
                        </p>
                        <Separator className="my-2" />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                    {application.applicationStatus === 'pending' && (
                        <>
                            <div className="flex space-x-2">
                                <Button
                                    variant="default"
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={handleApprove}
                                    disabled={processing}
                                >
                                    <CheckCircle className="mr-2 h-4 w-4" /> Phê duyệt đơn
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={handleReject}
                                    disabled={processing}
                                >
                                    <XCircle className="mr-2 h-4 w-4" /> Từ chối
                                </Button>
                            </div>
                        </>
                    )}

                    {application.applicationStatus === 'approved' && (
                        <Button
                            variant="default"
                            onClick={handleMarkAsAdopted}
                            disabled={processing}
                        >
                            <CheckCircle className="mr-2 h-4 w-4" /> Đánh dấu đã nhận nuôi
                        </Button>
                    )}

                    {application.applicationStatus === 'rejected' && (
                        <p className="text-sm text-muted-foreground italic">
                            Đơn đăng ký đã bị từ chối. Không thể thực hiện thêm hành động.
                        </p>
                    )}

                    {application.applicationStatus === 'adopted' && (
                        <p className="text-sm text-muted-foreground italic">
                            Thú cưng đã được nhận nuôi. Không thể thực hiện thêm hành động.
                        </p>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
