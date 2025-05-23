import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { volunteerServices } from '@/services/volunteerService';
import { formatDate } from '@/utils/helper';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ROUTES from '@/constants/routes';

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

// Giả lập dữ liệu để kiểm thử
const getMockApplicationData = (id: string): Volunteer => {
    return {
        applicationId: id,
        userId: 'user-123',
        fullName: 'Vuu Thanhh Ann',
        email: 'vuthanhan3547@gmail.com',
        phoneNumber: '0123654758',
        gender: 'male',
        applicationStatus: 'pending',
        createdDate: '2023-05-15T08:30:00',
        address: 'Quận 9, Thành phố Hồ Chí Minh',
        skills: ['Chăm sóc thú cưng', 'Tư vấn', 'Nhiếp ảnh'],
        experience: 'Từng tham gia các hoạt động tình nguyện về động vật tại trường đại học. Có kinh nghiệm chăm sóc thú cưng tại nhà trong 3 năm.',
        availability: 'Các ngày trong tuần sau 18h, cả ngày cuối tuần',
        reason: 'Tôi yêu thích động vật và muốn đóng góp cho cộng đồng. Tôi tin rằng mỗi thú cưng đều xứng đáng có một mái ấm yêu thương.',
        // Các trường mới từ API
        birthDate: '2000-01-05',
        occupation: 'Sinh Viên',
        facebookLink: 'https://facebook.com/vuthanhan',
        preferredRole: 'Tình nguyện viên chăm sóc thú cưng',
        previousExperience: 'Đã từng tham gia nhiều hoạt động tình nguyện tại trường đại học',
        motivation: 'Yêu thích động vật và muốn đóng góp cho cộng đồng',
        availableDays: 'Thứ 2-6 sau 17h, Thứ 7-CN cả ngày',
        availableHours: '17:00-21:00 các ngày trong tuần, 08:00-17:00 cuối tuần'
    };
};

function VolunteerApplicationDetail() {
    const { id } = useParams<{ id: string }>();
    const [application, setApplication] = useState<Volunteer | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [updating, setUpdating] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchApplicationDetail = async () => {
            if (!id) return;

            // DEVELOPMENT: Sử dụng dữ liệu giả lập
            const useMockData = true; // Đặt thành false khi sẵn sàng sử dụng API thật

            if (useMockData) {
                // Giả lập độ trễ để kiểm tra trạng thái loading
                setTimeout(() => {
                    setApplication(getMockApplicationData(id));
                    setLoading(false);
                }, 1000);
                return;
            }

            try {
                setLoading(true);
                const response = await volunteerServices.getVolunteerApplicationById(id);
                setApplication(response.data.data);
            } catch (error) {
                console.error('Error fetching volunteer application details:', error);
                toast.error('Không thể tải thông tin đơn đăng ký');
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationDetail();
    }, [id]); const handleStatusUpdate = async (newStatus: string) => {
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
                return 'secondary';
            case 'approved':
                return 'outline';
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Thông tin chính */}
                <Card className="col-span-2">
                    <CardHeader>
                        <CardTitle className="text-xl">Thông tin ứng viên</CardTitle>
                        <CardDescription>Thông tin chi tiết về ứng viên tình nguyện viên</CardDescription>
                    </CardHeader>                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        <Separator />

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Kỹ năng</h3>
                            <div className="flex flex-wrap gap-2">
                                {application.skills && application.skills.length > 0 ? (
                                    application.skills.map((skill, index) => (
                                        <Badge key={index} variant="outline">
                                            {skill}
                                        </Badge>
                                    ))
                                ) : (
                                    <p className="text-gray-400">Chưa cung cấp thông tin</p>
                                )}
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

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Lý do tham gia</h3>
                            <p className="text-base whitespace-pre-line">
                                {application.reason || application.motivation || 'Chưa cung cấp thông tin'}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Thông tin trạng thái và hành động */}
                <Card>
                    <CardHeader>
                        <CardTitle className="text-xl">Trạng thái</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Trạng thái hiện tại</h3>
                            <Badge variant={getStatusBadgeVariant(application.applicationStatus)} className="text-base py-1 px-3">
                                {getStatusDisplayText(application.applicationStatus.toLowerCase())}
                            </Badge>
                        </div>

                        <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Mã đơn đăng ký</h3>
                            <p className="text-sm font-mono bg-gray-100 p-2 rounded">{application.applicationId}</p>
                        </div>
                    </CardContent>

                    {application.applicationStatus.toLowerCase() === 'pending' && (
                        <CardFooter className="flex flex-col space-y-2">
                            <Button
                                onClick={() => handleStatusUpdate('approved')}
                                className="w-full"
                                disabled={updating}
                            >
                                <Check className="mr-2 h-4 w-4" />
                                Duyệt đơn đăng ký
                            </Button>
                            <Button
                                onClick={() => handleStatusUpdate('rejected')}
                                variant="destructive"
                                className="w-full"
                                disabled={updating}
                            >
                                <X className="mr-2 h-4 w-4" />
                                Từ chối đơn đăng ký
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            </div>
        </div>
    );
}

export default VolunteerApplicationDetail;
