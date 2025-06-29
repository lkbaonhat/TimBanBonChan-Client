import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, MapPin, User, Heart, Shield, Stethoscope, Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { petService } from '@/services/petService';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import ROUTES from '@/constants/routes';

interface ApplicationDetail {
    applicationId: number;
    postId: number;
    postTitle: string;
    applicantUserId: number;
    applicantFullName: string;
    applicationStatus: string;
    livingConditions: string;
    experienceWithPets: string;
    reasonForAdoption: string;
    otherPets: string;
    workSchedule: string;
    familyMembers: string;
    reviewNotes: string | null;
    reviewedByUserId: number | null;
    completionDate: string | null;
    createdDate: string;
    modifiedDate: string;
    petId: number;
    petName: string;
    petImagePrimaryUrl: string | null;
    petImageUrls: string[];
    gender: string;
    color: string;
    description: string;
    foodPreferences: string;
    toyPreferences: string;
    compatibleWith: string;
    notCompatibleWith: string;
    location: string;
    categoryName: string;
    breed: string;
    age: string;
    size: string;
    weight: number;
    isVaccinated: boolean;
    isNeutered: boolean;
    isTrained: boolean;
    healthStatus: string;
    personality: string;
    adoptionStatus: string;
    slug: string;
    purpose: string;
}

interface ApiResponse {
    statusCode: number;
    success: boolean;
    message: string;
    data: ApplicationDetail;
    detailErrors: any;
}

const ApplicationDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [applicationData, setApplicationData] = useState<ApplicationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchApplicationData = async () => {
            if (!id) {
                setError('Application ID is required');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);

                const response = await petService.getAdoptionApplicationById(id);
                const result: ApiResponse = response.data;

                if (result.success && result.statusCode === 200) {
                    setApplicationData(result.data);
                } else {
                    setError(result.message || 'Failed to load application data');
                }
            } catch (err: any) {
                console.error('Error fetching application data:', err);
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    'An unexpected error occurred while loading the application'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchApplicationData();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-200';
            case 'approved':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'rejected':
                return 'bg-red-100 text-red-800 border-red-200';
            case 'completed':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <Card key={i} className="h-64">
                                    <CardContent className="p-6">
                                        <div className="space-y-3">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-red-500 text-4xl mb-4">⚠️</div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                Error Loading Application
                            </h3>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <div className="space-x-2">
                                <Button
                                    variant="outline"
                                    onClick={() => navigate(-1)}
                                    className="w-full sm:w-auto"
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Go Back
                                </Button>
                                <Button
                                    onClick={() => window.location.reload()}
                                    className="w-full sm:w-auto mt-2 sm:mt-0"
                                >
                                    Try Again
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!applicationData) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <Card className="w-full max-w-md">
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-gray-400 text-4xl mb-4">📋</div>
                            <h3 className="text-lg font-semibold mb-2 text-gray-900">
                                Application Not Found
                            </h3>
                            <p className="text-gray-600 mb-4">
                                The requested application could not be found.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => navigate(-1)}
                                className="w-full"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Go Back
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen p-6">
            <div className="mx-auto">
                {/* Back Button */}
                <div className="mb-4">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={ROUTES.STAFF.ADOPTIONS}>
                                        Đơn đăng ký
                                    </Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className='font-semibold'>{applicationData.applicantFullName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>

                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-3xl font-bold text-gray-900">
                            Application #{applicationData.applicationId}
                        </h1>
                        <div className='flex flex-col items-end'>
                            <div className='mb-4'>
                                <Badge className={getStatusColor(applicationData.applicationStatus)}>
                                    {applicationData.applicationStatus}
                                </Badge>
                            </div>
                            <div className='flex gap-2'>
                                <Button variant={'success'}>Duyệt</Button>
                                <Button variant={'destructive'}>Từ chối</Button>
                            </div>
                        </div>
                    </div>
                    <p className="text-gray-600">{applicationData.postTitle}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Pet Information */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Heart className="h-5 w-5 text-pink-500" />
                                    Pet Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={applicationData.petImagePrimaryUrl || ''} alt={applicationData.petName} />
                                        <AvatarFallback className="text-lg">
                                            {applicationData.petName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="text-xl font-semibold">{applicationData.petName}</h3>
                                        <p className="text-gray-600">{applicationData.categoryName} • {applicationData.breed}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Age</p>
                                        <p className="text-sm">{applicationData.age}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Gender</p>
                                        <p className="text-sm">{applicationData.gender}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Size</p>
                                        <p className="text-sm">{applicationData.size}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Weight</p>
                                        <p className="text-sm">{applicationData.weight} kg</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Color</p>
                                        <p className="text-sm">{applicationData.color}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Personality</p>
                                        <p className="text-sm">{applicationData.personality}</p>
                                    </div>
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                                    <p className="text-sm">{applicationData.description}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm text-gray-600">{applicationData.location}</span>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Health & Care Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5 text-blue-500" />
                                    Health & Care
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className={`text-lg font-semibold ${applicationData.isVaccinated ? 'text-green-600' : 'text-red-600'}`}>
                                            {applicationData.isVaccinated ? '✓' : '✗'}
                                        </div>
                                        <p className="text-xs text-gray-600">Vaccinated</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className={`text-lg font-semibold ${applicationData.isNeutered ? 'text-green-600' : 'text-red-600'}`}>
                                            {applicationData.isNeutered ? '✓' : '✗'}
                                        </div>
                                        <p className="text-xs text-gray-600">Neutered</p>
                                    </div>
                                    <div className="text-center p-3 rounded-lg bg-gray-50">
                                        <div className={`text-lg font-semibold ${applicationData.isTrained ? 'text-green-600' : 'text-red-600'}`}>
                                            {applicationData.isTrained ? '✓' : '✗'}
                                        </div>
                                        <p className="text-xs text-gray-600">Trained</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Health Status</p>
                                    <p className="text-sm">{applicationData.healthStatus}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Food Preferences</p>
                                        <p className="text-sm">{applicationData.foodPreferences}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Toy Preferences</p>
                                        <p className="text-sm">{applicationData.toyPreferences}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Compatible With</p>
                                        <p className="text-sm">{applicationData.compatibleWith}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Not Compatible With</p>
                                        <p className="text-sm">{applicationData.notCompatibleWith}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Applicant Information */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    Applicant Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="font-semibold">{applicationData.applicantFullName}</p>
                                </div>

                                <Separator />

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Family Members</p>
                                    <p className="text-sm">{applicationData.familyMembers}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Work Schedule</p>
                                    <p className="text-sm">{applicationData.workSchedule}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Other Pets</p>
                                    <p className="text-sm">{applicationData.otherPets}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Home className="h-5 w-5 text-green-500" />
                                    Living Conditions
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Living Conditions</p>
                                    <p className="text-sm">{applicationData.livingConditions}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Experience with Pets</p>
                                    <p className="text-sm">{applicationData.experienceWithPets}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Reason for Adoption</p>
                                    <p className="text-sm">{applicationData.reasonForAdoption}</p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-purple-500" />
                                    Application Timeline
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Created</p>
                                    <p className="text-sm">{formatDate(applicationData.createdDate)}</p>
                                </div>

                                <div>
                                    <p className="text-sm font-medium text-gray-500">Last Modified</p>
                                    <p className="text-sm">{formatDate(applicationData.modifiedDate)}</p>
                                </div>

                                {applicationData.completionDate && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Completed</p>
                                        <p className="text-sm">{formatDate(applicationData.completionDate)}</p>
                                    </div>
                                )}

                                {applicationData.reviewNotes && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Review Notes</p>
                                        <p className="text-sm bg-gray-50 p-3 rounded-lg">{applicationData.reviewNotes}</p>
                                    </div>
                                )}

                                {applicationData.reviewedByUserId && (
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Reviewed By</p>
                                        <p className="text-sm">User ID: {applicationData.reviewedByUserId}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailPage;