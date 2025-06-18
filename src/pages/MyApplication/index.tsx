import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import { toast } from "sonner";
import ApplicationItem from "./components/ApplicationItem";
import { useSelector } from "react-redux";
import { selectorAuth } from "@/store/modules/auth/selector";
import { volunteerServices } from "@/services/volunteerService";

interface VolunteerApplication {
    id: number;
    userId: number;
    email: string;
    fullName: string;
    phoneNumber: string;
    address: string;
    birthDate: string;
    gender: string;
    occupation: string;
    facebookLink?: string;
    preferredRole: string;
    previousExperience?: string;
    skills?: string;
    motivation: string;
    availableDays: string;
    availableHours: string;
    applicationStatus: string;
    createdDate: string;
    modifiedDate: string;
}

export default function MyVolunteerApplicationsPage() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<VolunteerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userInfo: IREDUX.UserInfo = useSelector(selectorAuth.userInfo);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            setError(null);

            if (userInfo) {
                // @ts-ignore
                const response = await volunteerServices.getMyVolunteerApplications(userInfo.userId);
                if (response.status === 200) {
                    setApplications(response.data.data);
                }
            }
        } catch (err: any) {
            console.error("Failed to fetch applications:", err);
            setError("Không thể tải danh sách đơn đăng ký. Vui lòng thử lại.");
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetails = (applicationId: number) => {
        navigate(`/volunteer/applications/${applicationId}`);
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Đơn của tôi" },
    ];

    if (loading) {
        return (
            <div className="min-h-screen pb-10">
                <Breadcrumb items={breadcrumbItems} />
                <div className="container mx-auto px-4">
                    <ContentHeader title="Đơn đăng ký của tôi" level="h1" />
                    <div className="flex items-center justify-center py-12">
                        <div className="flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            <span>Đang tải...</span>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-10">
            <Breadcrumb items={breadcrumbItems} />
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <ContentHeader title="Đơn đăng ký tình nguyện viên của tôi" level="h1" />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={fetchApplications}
                            disabled={loading}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button
                            variant='blue'
                            onClick={() => navigate('/volunteer/register')}
                        >
                            <Heart className="h-4 w-4 mr-2" />
                            Đăng ký mới
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {applications.length === 0 ? (
                    <Card>
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-medium mb-2">Chưa có đơn đăng ký nào</h3>
                            <p className="text-muted-foreground text-center mb-4">
                                Bạn chưa có đơn đăng ký tình nguyện viên nào. Hãy đăng ký để tham gia các hoạt động ý nghĩa!
                            </p>
                            <Button onClick={() => navigate('/volunteer/register')}>
                                <Heart className="h-4 w-4 mr-2" />
                                Đăng ký ngay
                            </Button>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="text-sm text-muted-foreground">
                            Tìm thấy {applications.length} đơn đăng ký
                        </div>

                        {applications.map((application) => (
                            <ApplicationItem
                                key={application.id}
                                application={application}
                                onViewDetails={handleViewDetails}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}