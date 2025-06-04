import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { volunteerServices } from '@/services/volunteerService';
import { formatDate } from '@/utils/helper';
import { ArrowLeft, CalendarIcon, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ROUTES from '@/constants/routes';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Volunteer {
    applicationId: string;
    userId?: string;
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: string;
    applicationStatus: string;
    createdDate: string;
    skills?: string[];
    experience?: string;
    availability?: string;
    address?: string;
    reason?: string;
    // Các trường mới từ API
    birthDate?: string;
    occupation?: string;
    facebookLink?: string;
    preferredRole?: string;
    previousExperience?: string;
    motivation?: string;
    availableDays?: string;
    availableHours?: string;
}

function VolunteerApplicationDetail() {
    const { id } = useParams<{ id: string }>();
    const [application, setApplication] = useState<Volunteer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetail = async () => {
            if (!id) return;

            try {
                setLoading(true);
                const response = await volunteerServices.getVolunteerApplicationById(id);
                setApplication(response.data.data);
                console.log(application)
            } catch (error) {
                console.error('Error fetching volunteer application details:', error);
                toast.error('Không thể tải thông tin đơn đăng ký');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetail();
    }, [id]);

    const handleStatusUpdate = async (newStatus: string) => {
        if (!id) return;

        // DEVELOPMENT: Sử dụng dữ liệu giả lập
        const useMockData = true; // Đặt thành false khi sẵn sàng sử dụng API thật

        setUpdating(true);

        if (useMockData) {
            // Giả lập độ trễ khi cập nhật
            setTimeout(() => {
                // Cập nhật trạng thái trong state
                setApplication(prev => prev ? { ...prev, applicationStatus: newStatus } : null);

                // Hiển thị thông báo thành công
                toast.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đơn đăng ký thành công`);
                setUpdating(false);
            }, 1000);
            return;
        }

        try {
            await volunteerServices.updateVolunteerApplicationStatus(id, newStatus);

            // Cập nhật trạng thái trong state
            setApplication(prev => prev ? { ...prev, applicationStatus: newStatus } : null);

            toast.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đơn đăng ký thành công`);
        } catch (error) {
            console.error('Error updating volunteer application status:', error);
            toast.error('Không thể cập nhật trạng thái đơn đăng ký');
        } finally {
            setUpdating(false);
        }
    };

    // Get status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'default';
            case 'pending':
                return 'pending';
            case 'approved':
                return 'success';
            case 'rejected':
                return 'destructive';
            default:
                return 'default';
        }
    };

    // Get status display text
    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'Đang hoạt động';
            case 'pending':
                return 'Đang xử lý';
            case 'approved':
                return 'Đã duyệt';
            case 'rejected':
                return 'Đã từ chối';
            default:
                return status;
        }
    };

    const goBack = () => {
        navigate(-1);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-lg">Đang tải thông tin...</p>
                </div>
            </div>
        );
    }

    if (!application) {
        return (
            <div className="flex flex-col items-center justify-center h-96">
                <h2 className="text-2xl font-bold mb-4">Không tìm thấy thông tin</h2>
                <p className="text-gray-500 mb-6">Đơn đăng ký không tồn tại hoặc đã bị xóa</p>
                <Button onClick={goBack}>Quay lại</Button>
            </div>
        );
    }

    return (
        <div className="px-6 py-4">
            <div className="mb-6">
                <Breadcrumb>
                    <BreadcrumbList>
                        <BreadcrumbItem>
                            <BreadcrumbLink asChild>
                                <Link to={ROUTES.STAFF.VOLUNTEER_APPLICATIONS}>
                                    Đơn đăng ký
                                </Link>
                            </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                            <BreadcrumbPage>{application.fullName}</BreadcrumbPage>
                        </BreadcrumbItem>
                    </BreadcrumbList>
                </Breadcrumb>
            </div>

            {application.applicationStatus.toLowerCase() === 'pending' && (
                <div className="flex justify-end">
                    <div className='flex space-y-2 gap-2'>
                        <Button
                            onClick={() => handleStatusUpdate('approved')}
                            variant="success"
                            size="sm"
                            disabled={updating}
                        >
                            <Check className="mr-2 h-4 w-4" />
                            Duyệt
                        </Button>
                        <Button
                            onClick={() => handleStatusUpdate('rejected')}
                            variant="destructive"
                            size='sm'
                            disabled={updating}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Từ chối
                        </Button>
                    </div>
                </div>
            )}


            {/* Thông tin chính */}
            <Card className="col-span-2">
                <CardHeader className='flex justify-between'>
                    <div>
                        <CardTitle className="text-xl">Thông tin ứng viên</CardTitle>
                        <CardDescription>Thông tin chi tiết về ứng viên tình nguyện viên</CardDescription>
                    </div>
                    <div>
                        <Badge variant={getStatusBadgeVariant(application.applicationStatus)} className="text-sm py-1 px-3 h- w-20">
                            {getStatusDisplayText(application.applicationStatus.toLowerCase())}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="bg-gradient-to-r from-[#5B7CCB] to-[#0052A3] p-6 text-white">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20 border-4 border-white">
                                <AvatarImage
                                    src={application.fullName || "/placeholder.svg"}
                                    alt={application.fullName}
                                />
                                <AvatarFallback className="bg-[#FFBDEF] text-[#0052A3]">
                                    {application.fullName.split(" ").pop()?.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-2xl font-bold">{application.fullName}</h2>
                                <div className="mt-2 flex items-center gap-2">
                                    <CalendarIcon className="h-4 w-4" />
                                    <span className="text-sm">Ngày nộp đơn: {formatDate(application.createdDate)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Họ và tên</h3>
                            <p className="text-base mt-1">{application.fullName}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Email</h3>
                            <p className="text-base mt-1">{application.email}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                            <p className="text-base mt-1">{application.phoneNumber}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Giới tính</h3>
                            <p className="text-base mt-1">{application.gender === 'male' ? 'Nam' : 'Nữ'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Ngày sinh</h3>
                            <p className="text-base mt-1">{application.birthDate ? formatDate(application.birthDate) : 'Chưa cung cấp'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Nghề nghiệp</h3>
                            <p className="text-base mt-1">{application.occupation || 'Chưa cung cấp'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Địa chỉ</h3>
                            <p className="text-base mt-1">{application.address || 'Chưa cung cấp'}</p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Ngày đăng ký</h3>
                            <p className="text-base mt-1">{formatDate(application.createdDate)}</p>
                        </div>
                        {application.facebookLink && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Facebook</h3>
                                <p className="text-base mt-1">
                                    <a
                                        href={application.facebookLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        {application.facebookLink}
                                    </a>
                                </p>
                            </div>
                        )}
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Kỹ năng</h3>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="outline">
                                    {application.skills}
                                </Badge>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Vai trò mong muốn</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.preferredRole || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Kinh nghiệm</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.experience || application.previousExperience || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Ngày có thể tham gia</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.availableDays || application.availability || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Giờ có thể tham gia</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.availableHours || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Lý do tham gia</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.reason || application.motivation || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default VolunteerApplicationDetail;
