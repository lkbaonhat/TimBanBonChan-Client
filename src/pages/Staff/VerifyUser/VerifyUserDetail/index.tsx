import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Briefcase,
    DollarSign,
    Home,
    Heart,
    Calendar,
    FileText,
    CheckCircle,
    XCircle,
    ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ROUTES from '@/constants/routes';

interface ApplicationData {
    applicationId: number;
    userId: number;
    fullName: string;
    email: string;
    phoneNumber: string;
    address: string;
    city: string;
    district: string;
    idCardNumber: string;
    occupation: string;
    income: string;
    livingConditions: string;
    housingType: string;
    hasExperience: boolean;
    previousExperience: string;
    otherPets: string;
    familySupport: string;
    workSchedule: string;
    reasonForAdoption: string;
    preferredPetTypes: string;
    applicationStatus: string;
    reviewedByUserId: number | null;
    reviewedByUserName: string | null;
    reviewNotes: string | null;
    createdDate: string;
    modifiedDate: string;
    idCardFrontImageUrl: string;
    idCardBackImageUrl: string;
}

const ApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [application, setApplication] = useState<ApplicationData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isActionLoading, setIsActionLoading] = useState(false);

    useEffect(() => {
        if (id) {
            fetchApplicationDetail(parseInt(id));
        }
    }, [id]);

    const fetchApplicationDetail = async (applicationId: number) => {
        try {
            setIsLoading(true);
            // Replace with your actual API endpoint
            const response = await userService.getAdopterApplicationById(applicationId)

            if (response.status === 200) {
                setApplication(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching application:', error);
            toast.error("Không thể tải thông tin đơn xin nhận nuôi");
            navigate('/applications'); // Navigate back to applications list
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!application) return;

        setIsActionLoading(true);
        try {
            const response = await fetch(`/api/applications/${application.applicationId}/approve`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewedByUserName: 'lkbaonhat', // Current user
                    reviewNotes: 'Đơn được phê duyệt'
                })
            });

            if (response.ok) {
                toast.success("Đơn xin nhận nuôi đã được phê duyệt");
                // Refresh the application data
                await fetchApplicationDetail(application.applicationId);
            } else {
                throw new Error('Failed to approve application');
            }
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error("Có lỗi xảy ra khi phê duyệt đơn xin nhận nuôi");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!application) return;

        setIsActionLoading(true);
        try {
            const response = await fetch(`/api/applications/${application.applicationId}/reject`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reviewedByUserName: 'lkbaonhat', // Current user
                    reviewNotes: 'Đơn bị từ chối'
                })
            });

            if (response.ok) {
                toast.success("Đơn xin nhận nuôi đã bị từ chối");
                // Refresh the application data
                await fetchApplicationDetail(application.applicationId);
            } else {
                throw new Error('Failed to reject application');
            }
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error("Có lỗi xảy ra khi từ chối đơn xin nhận nuôi")
        } finally {
            setIsActionLoading(false);
        }
    };

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

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const openImageInNewTab = (imageUrl: string) => {
        window.open(imageUrl, '_blank');
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="flex items-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Đang tải thông tin đơn xin nhận nuôi...</span>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Không tìm thấy đơn xin nhận nuôi</h2>
                    <Button onClick={() => navigate('/applications')}>
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Quay về danh sách
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <Link to={ROUTES.STAFF.VERIFY_USER}>
                                Đơn đăng ký
                            </Link>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage className='font-medium'>{application.fullName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                <User className="h-6 w-6" />
                                Đơn xin xác nhận người dùng #{application.applicationId}
                            </CardTitle>
                            <p className="text-muted-foreground mt-1">
                                Nộp ngày: {formatDate(application.createdDate)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                Cập nhật lần cuối: {formatDate(application.modifiedDate)}
                            </p>
                        </div>
                        {getStatusBadge(application.applicationStatus)}
                    </div>
                </CardHeader>
            </Card>

            {/* Personal Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Thông tin cá nhân
                    </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Họ và tên:</span>
                            <span>{application.fullName}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Email:</span>
                            <span className="break-all">{application.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Số điện thoại:</span>
                            <span>{application.phoneNumber}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">CCCD:</span>
                            <span>{application.idCardNumber}</span>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                            <div>
                                <span className="font-medium">Địa chỉ:</span>
                                <p className="text-sm">{application.address}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Quận/Huyện:</span>
                            <span>{application.district}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Thành phố:</span>
                            <span>{application.city}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Briefcase className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Nghề nghiệp:</span>
                            <span>{application.occupation}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Housing & Financial Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Thông tin nhà ở & Tài chính
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2">
                            <Home className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Loại nhà ở:</span>
                            <span className="capitalize">{application.housingType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Thu nhập:</span>
                            <span>{application.income}</span>
                        </div>
                    </div>
                    <div>
                        <span className="font-medium">Điều kiện sống:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.livingConditions}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Pet Experience & Family */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5" />
                        Kinh nghiệm & Gia đình
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-start gap-2">
                        <span className="font-medium">Có kinh nghiệm nuôi thú cưng:</span>
                        <Badge variant={application.hasExperience ? "default" : "secondary"}>
                            {application.hasExperience ? "Có" : "Không"}
                        </Badge>
                    </div>

                    {application.hasExperience && application.previousExperience && (
                        <div>
                            <span className="font-medium">Kinh nghiệm trước đây:</span>
                            <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                {application.previousExperience}
                            </p>
                        </div>
                    )}

                    <div>
                        <span className="font-medium">Thú cưng khác trong nhà:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.otherPets}
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">Sự hỗ trợ từ gia đình:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.familySupport}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Adoption Details */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        Chi tiết nhận nuôi
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <span className="font-medium">Lịch làm việc:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.workSchedule}
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">Lý do muốn nhận nuôi:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.reasonForAdoption}
                        </p>
                    </div>

                    <div>
                        <span className="font-medium">Loại thú cưng mong muốn:</span>
                        <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                            {application.preferredPetTypes}
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* ID Card Images */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Hình ảnh CCCD
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="font-medium mb-2">Mặt trước</p>
                            <div className="relative group">
                                <img
                                    src={application.idCardFrontImageUrl}
                                    alt="CCCD mặt trước"
                                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => openImageInNewTab(application.idCardFrontImageUrl)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                    <ExternalLink className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                        <div>
                            <p className="font-medium mb-2">Mặt sau</p>
                            <div className="relative group">
                                <img
                                    src={application.idCardBackImageUrl}
                                    alt="CCCD mặt sau"
                                    className="w-full h-48 object-cover rounded-lg border cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => openImageInNewTab(application.idCardBackImageUrl)}
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-lg">
                                    <ExternalLink className="h-6 w-6 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Review Information */}
            {(application.reviewedByUserName || application.reviewNotes) && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Thông tin xét duyệt
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {application.reviewedByUserName && (
                            <div className="flex items-center gap-2">
                                <span className="font-medium">Người xét duyệt:</span>
                                <span>{application.reviewedByUserName}</span>
                            </div>
                        )}
                        {application.reviewNotes && (
                            <div>
                                <span className="font-medium">Ghi chú:</span>
                                <p className="mt-1 text-sm text-muted-foreground bg-muted p-3 rounded-md">
                                    {application.reviewNotes}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Action Buttons */}
            {application.applicationStatus === 'Pending' && (
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex gap-4 justify-center">
                            <Button
                                onClick={handleApprove}
                                disabled={isActionLoading}
                                className="bg-green-600 hover:bg-green-700 text-white px-8 py-2"
                                size="lg"
                            >
                                {isActionLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                Phê duyệt
                            </Button>
                            <Button
                                onClick={handleReject}
                                disabled={isActionLoading}
                                variant="destructive"
                                className="px-8 py-2"
                                size="lg"
                            >
                                {isActionLoading ? (
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <XCircle className="h-4 w-4 mr-2" />
                                )}
                                Từ chối
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default ApplicationDetailPage;