import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Heart, RefreshCw, UserCheck, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ContentHeader from "@/components/ContentHeader/ContentHeader";
import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
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

interface AdoptionApplication {
    id: number;
    userId: number;
    petId: number;
    petName: string;
    petImage?: string;
    applicantName: string;
    email: string;
    phoneNumber: string;
    applicationStatus: string;
    submittedDate: string;
    reviewedDate?: string;
}

interface VerificationApplication {
    id: number;
    userId: number;
    documentType: string;
    documentImages: string[];
    verificationStatus: string;
    submittedDate: string;
    reviewedDate?: string;
    notes?: string;
}

export default function MyApplicationsPage() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("volunteer");
    const [volunteerApplications, setVolunteerApplications] = useState<VolunteerApplication[]>([]);
    const [adoptionApplications, setAdoptionApplications] = useState<AdoptionApplication[]>([]);
    const [verificationApplications, setVerificationApplications] = useState<VerificationApplication[]>([]);
    const [loading, setLoading] = useState({
        volunteer: true,
        adoption: true,
        verification: true
    });
    const [error, setError] = useState<string | null>(null);
    const userInfo: IRedux.UserInfo = useSelector(selectorAuth.userInfo);

    const fetchVolunteerApplications = async () => {
        try {
            setLoading(prev => ({ ...prev, volunteer: true }));
            setError(null);

            if (userInfo) {
                // @ts-ignore
                const response = await volunteerServices.getMyVolunteerApplications(userInfo.userId);
                if (response.status === 200) {
                    setVolunteerApplications(response.data.data);
                }
            }
        } catch (err: any) {
            console.error("Failed to fetch volunteer applications:", err);
            setError("Không thể tải danh sách đơn đăng ký tình nguyện viên. Vui lòng thử lại.");
        } finally {
            setLoading(prev => ({ ...prev, volunteer: false }));
        }
    };

    const fetchAdoptionApplications = async () => {
        try {
            setLoading(prev => ({ ...prev, adoption: true }));
            setError(null);

            if (userInfo) {
                // TODO: Replace with actual adoption service call
                // const response = await adoptionServices.getMyAdoptionApplications(userInfo.userId);
                // if (response.status === 200) {
                //     setAdoptionApplications(response.data.data);
                // }

                // Mock data for now
                setTimeout(() => {
                    setAdoptionApplications([]);
                    setLoading(prev => ({ ...prev, adoption: false }));
                }, 1000);
            }
        } catch (err: any) {
            console.error("Failed to fetch adoption applications:", err);
            setError("Không thể tải danh sách đơn nhận nuôi. Vui lòng thử lại.");
            setLoading(prev => ({ ...prev, adoption: false }));
        }
    };

    const fetchVerificationApplications = async () => {
        try {
            setLoading(prev => ({ ...prev, verification: true }));
            setError(null);

            if (userInfo) {
                // TODO: Replace with actual verification service call
                // const response = await verificationServices.getMyVerificationApplications(userInfo.userId);
                // if (response.status === 200) {
                //     setVerificationApplications(response.data.data);
                // }

                // Mock data for now
                setTimeout(() => {
                    setVerificationApplications([]);
                    setLoading(prev => ({ ...prev, verification: false }));
                }, 1000);
            }
        } catch (err: any) {
            console.error("Failed to fetch verification applications:", err);
            setError("Không thể tải danh sách đơn xác thực. Vui lòng thử lại.");
            setLoading(prev => ({ ...prev, verification: false }));
        }
    };

    const handleViewDetails = (type: string, applicationId: number) => {
        switch (type) {
            case 'volunteer':
                navigate(`/volunteer/applications/${applicationId}`);
                break;
            case 'adoption':
                navigate(`/adoption/applications/${applicationId}`);
                break;
            case 'verification':
                navigate(`/verification/applications/${applicationId}`);
                break;
        }
    };

    const handleRefresh = () => {
        switch (activeTab) {
            case 'volunteer':
                fetchVolunteerApplications();
                break;
            case 'adoption':
                fetchAdoptionApplications();
                break;
            case 'verification':
                fetchVerificationApplications();
                break;
        }
    };

    const handleNewApplication = () => {
        switch (activeTab) {
            case 'volunteer':
                navigate('/volunteer/register');
                break;
            case 'adoption':
                navigate('/pets'); // Navigate to pets page to find pets to adopt
                break;
            case 'verification':
                navigate('/profile/verification');
                break;
        }
    };

    useEffect(() => {
        fetchVolunteerApplications();
        fetchAdoptionApplications();
        fetchVerificationApplications();
    }, []);

    const breadcrumbItems = [
        { label: "Trang chủ", path: "/" },
        { label: "Đơn của tôi" },
    ];

    const getTabContent = (tabType: string) => {
        const isLoading = loading[tabType as keyof typeof loading];
        let applications: any[] = [];
        let emptyMessage = "";
        let emptyDescription = "";
        let buttonText = "";
        let buttonIcon = <Heart className="h-4 w-4 mr-2" />;

        switch (tabType) {
            case 'volunteer':
                applications = volunteerApplications;
                emptyMessage = "Chưa có đơn đăng ký tình nguyện viên nào";
                emptyDescription = "Bạn chưa có đơn đăng ký tình nguyện viên nào. Hãy đăng ký để tham gia các hoạt động ý nghĩa!";
                buttonText = "Đăng ký tình nguyện viên";
                buttonIcon = <Heart className="h-4 w-4 mr-2" />;
                break;
            case 'adoption':
                applications = adoptionApplications;
                emptyMessage = "Chưa có đơn nhận nuôi nào";
                emptyDescription = "Bạn chưa có đơn nhận nuôi thú cưng nào. Hãy tìm kiếm những bé cưng đang cần một mái ấm!";
                buttonText = "Tìm thú cưng để nhận nuôi";
                buttonIcon = <Heart className="h-4 w-4 mr-2" />;
                break;
            case 'verification':
                applications = verificationApplications;
                emptyMessage = "Chưa có đơn xác thực nào";
                emptyDescription = "Bạn chưa có đơn xác thực tài khoản nào. Xác thực tài khoản để tăng độ tin cậy!";
                buttonText = "Xác thực tài khoản";
                buttonIcon = <Shield className="h-4 w-4 mr-2" />;
                break;
        }

        if (isLoading) {
            return (
                <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-2">
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        <span>Đang tải...</span>
                    </div>
                </div>
            );
        }

        if (applications.length === 0) {
            return (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Heart className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">{emptyMessage}</h3>
                        <p className="text-muted-foreground text-center mb-4 max-w-md">
                            {emptyDescription}
                        </p>
                        <Button onClick={handleNewApplication} variant='blue'>
                            {buttonIcon}
                            {buttonText}
                        </Button>
                    </CardContent>
                </Card>
            );
        }

        return (
            <div className="space-y-6">
                <div className="text-sm text-muted-foreground">
                    Tìm thấy {applications.length} đơn đăng ký
                </div>

                {applications.map((application) => (
                    <ApplicationItem
                        key={application.id}
                        application={application}
                        onViewDetails={(id) => handleViewDetails(tabType, id)}
                        type={tabType}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen pb-10">
            <Breadcrumb items={breadcrumbItems} />
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <ContentHeader title="Đơn đăng ký của tôi" level="h1" />
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={handleRefresh}
                            disabled={loading[activeTab as keyof typeof loading]}
                        >
                            <RefreshCw className={`h-4 w-4 mr-2 ${loading[activeTab as keyof typeof loading] ? 'animate-spin' : ''}`} />
                            Làm mới
                        </Button>
                        <Button
                            variant='blue'
                            onClick={handleNewApplication}
                        >
                            {activeTab === 'volunteer' && <Heart className="h-4 w-4 mr-2" />}
                            {activeTab === 'adoption' && <Heart className="h-4 w-4 mr-2" />}
                            {activeTab === 'verification' && <Shield className="h-4 w-4 mr-2" />}
                            {activeTab === 'volunteer' && 'Đăng ký mới'}
                            {activeTab === 'adoption' && 'Tìm thú cưng'}
                            {activeTab === 'verification' && 'Xác thực tài khoản'}
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert className="mb-6">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Tabs
                    value={activeTab}
                    onValueChange={setActiveTab}
                    className="w-full"
                >
                    <TabsList className="flex w-full mb-8 bg-transparent">
                        <TabsTrigger
                            value="volunteer"
                            className={`p-4 text-sm font-medium rounded-none border-0 ${activeTab === "volunteer"
                                ? "border-b-1 border-black text-black"
                                : ""
                                }`}
                        >
                            <Heart className="h-4 w-4" />
                            Tình nguyện viên
                        </TabsTrigger>
                        <TabsTrigger
                            value="adoption"
                            className={`p-4 text-sm font-medium rounded-none border-0 ${activeTab === "adoption"
                                ? "border-b-1 border-black text-black"
                                : ""
                                }`}
                        >
                            <UserCheck className="h-4 w-4" />
                            Nhận nuôi thú cưng
                        </TabsTrigger>
                        <TabsTrigger
                            value="verification"
                            className={`p-4 text-sm font-medium rounded-none border-0 ${activeTab === "verification"
                                ? "border-b-1 border-black text-black"
                                : ""
                                }`}
                        >
                            <Shield className="h-4 w-4" />
                            Xác thực tài khoản
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="volunteer" className="space-y-6">
                        {getTabContent('volunteer')}
                    </TabsContent>

                    <TabsContent value="adoption" className="space-y-6">
                        {getTabContent('adoption')}
                    </TabsContent>

                    <TabsContent value="verification" className="space-y-6">
                        {getTabContent('verification')}
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}