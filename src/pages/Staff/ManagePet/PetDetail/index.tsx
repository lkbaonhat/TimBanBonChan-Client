import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Heart, Edit, Trash2, MapPin, Calendar, Weight, Ruler, CheckCircle, XCircle, Syringe, Scissors, Dumbbell, Bone, Gamepad2, Dog, Cat, Users, UserX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { DeletePetDialog } from '../PetInfoList/components/DeletePetDialog'
import ROUTES from '@/constants/routes'
import { petService } from '@/services/petService'

export default function PetDetailsPage() {
    const { slug } = useParams<{ slug: string }>()
    const navigate = useNavigate()
    const [pet, setPet] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('overview')

    // Format age to display in months or years
    const formatAge = (ageInMonths: number) => {
        if (ageInMonths < 12) {
            return `${ageInMonths} tháng`
        } else {
            const years = Math.floor(ageInMonths / 12)
            const months = ageInMonths % 12
            return months > 0
                ? `${years} năm ${months} tháng`
                : `${years} năm`
        }
    }

    // Get adoption status badge variant
    const getStatusBadgeVariant = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'default'
            case 'pending':
                return 'secondary'
            case 'adopted':
                return 'outline'
            default:
                return 'default'
        }
    }

    // Get adoption status display text
    const getStatusDisplayText = (status: string) => {
        switch (status.toLowerCase()) {
            case 'available':
                return 'Có sẵn'
            case 'pending':
                return 'Đang xử lý'
            case 'adopted':
                return 'Đã nhận nuôi'
            default:
                return status
        }
    }

    // Format compatibility text into bullet points
    const formatCompatibilityText = (text: string | null) => {
        if (!text) return []
        return text.split('.').filter(item => item.trim().length > 0)
    }

    // Fetch pet data
    useEffect(() => {
        const fetchPet = async () => {
            setIsLoading(true)
            try {
                const response = await petService.getPetBySlug(slug as string)
                if (response.status === 200) {
                    setPet(response.data.data)
                } else {
                    throw new Error('Failed to fetch pet data')
                }
            } catch (error) {
                console.error('Failed to fetch pet:', error)
                // Navigate back to the list if pet not found
                navigate('/staff/manage-pets', {
                    state: {
                        notification: {
                            type: 'error',
                            message: 'Không tìm thấy thú cưng!'
                        }
                    }
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchPet()
    }, [slug, navigate])

    // Handle delete pet
    const handleDeletePet = () => {
        navigate('/staff/pets', {
            state: {
                notification: {
                    type: 'success',
                    message: 'Thú cưng đã được xóa thành công!'
                }
            }
        })
    }

    if (isLoading) {
        return (<div>
            <div className="flex flex-col gap-2 mb-6">
                <Skeleton className="h-5 w-60" />
                <Skeleton className="h-8 w-48" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-1">
                    <Skeleton className="h-[400px] w-full rounded-lg" />
                </div>
                <div className="md:col-span-2 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-32 w-full" />
                    <div className="grid grid-cols-2 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
            </div>
        </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div className="flex flex-col gap-2">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbLink asChild>
                                    <Link to={ROUTES.STAFF.MANAGE_PETS}>Thú cưng</Link>
                                </BreadcrumbLink>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>{pet.petName}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => navigate(`/staff/manage-pets/${pet.petId}/edit`)}
                    >
                        <Edit className="h-4 w-4" />
                        Chỉnh sửa
                    </Button>
                    <DeletePetDialog
                        petId={pet.petId}
                        petName={pet.petName}
                        onPetDeleted={handleDeletePet}
                        trigger={
                            <Button variant="destructive" className="gap-2">
                                <Trash2 className="h-4 w-4" />
                                Xóa
                            </Button>
                        }
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left column - Image and basic info */}
                <div className="md:col-span-1">
                    <Card>
                        <div className="relative">
                            <img
                                src={pet.petImageUrls || "/placeholder.svg"}
                                alt={pet.petName}
                                className="w-full h-[300px] object-cover rounded-t-lg"
                            />
                            <Badge
                                variant={getStatusBadgeVariant(pet.adoptionStatus)}
                                className="absolute top-4 right-4 text-sm px-3 py-1"
                            >
                                {getStatusDisplayText(pet.adoptionStatus)}
                            </Badge>
                        </div>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-bold">{pet.petName}</h2>
                                        <p className="text-muted-foreground">{pet.breed}</p>
                                    </div>
                                    <Button variant="outline" size="icon" className="rounded-full">
                                        <Heart className="h-5 w-5 text-rose-500" />
                                    </Button>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-center gap-2">
                                        <Dog className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Loại</p>
                                            <p className="font-medium">{pet.categoryName}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tuổi</p>
                                            <p className="font-medium">{formatAge(pet.age)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Weight className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Cân nặng</p>
                                            <p className="font-medium">{pet.weight} kg</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Ruler className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Kích thước</p>
                                            <p className="font-medium">{pet.size}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm text-muted-foreground">Địa điểm</p>
                                            <p className="font-medium">{pet.location || 'Chưa cập nhật'}</p>
                                        </div>
                                    </div>
                                </div>

                                <Separator />

                                <div className="grid grid-cols-2 gap-y-2 gap-x-10">
                                    <div className="flex items-center gap-1">
                                        <Syringe className={`h-5 w-5 ${pet.isVaccinated ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Đã tiêm chủng</span>
                                        {pet.isVaccinated ?
                                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" /> :
                                            <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                        }
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Scissors className={`h-5 w-5 ${pet.isNeutered ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Đã triệt sản</span>
                                        {pet.isNeutered ?
                                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" /> :
                                            <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                        }
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Dumbbell className={`h-5 w-5 ${pet.isTrained ? 'text-green-500' : 'text-muted-foreground'}`} />
                                        <span className="text-sm">Đã huấn luyện</span>
                                        {pet.isTrained ?
                                            <CheckCircle className="h-4 w-4 text-green-500 ml-auto" /> :
                                            <XCircle className="h-4 w-4 text-red-500 ml-auto" />
                                        }
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right column - Detailed information */}
                <div className="md:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="grid grid-cols-3 mb-6">
                            <TabsTrigger value="overview">Tổng quan</TabsTrigger>
                            <TabsTrigger value="compatibility">Tương thích</TabsTrigger>
                            <TabsTrigger value="preferences">Sở thích</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Thông tin chi tiết</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">Giống</p>
                                            <p className="font-medium">{pet.breed}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Giới tính</p>
                                            <p className="font-medium">{pet.gender}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Màu sắc</p>
                                            <p className="font-medium">{pet.color || 'Chưa cập nhật'}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tình trạng sức khỏe</p>
                                            <p className="font-medium">{pet.healthStatus}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">Tính cách</p>
                                            <p className="font-medium">{pet.personality}</p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Mô tả</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed">{pet.description}</p>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="compatibility" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Tương thích với</CardTitle>
                                    <CardDescription>
                                        Những điều kiện và môi trường phù hợp với {pet.petName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {formatCompatibilityText(pet.compatibleWith).length > 0 ? (
                                        <ul className="space-y-2">
                                            {formatCompatibilityText(pet.compatibleWith).map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Users className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                                                    <span className="text-sm">{item.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Chưa có thông tin</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Không tương thích với</CardTitle>
                                    <CardDescription>
                                        Những điều kiện và môi trường không phù hợp với {pet.petName}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {formatCompatibilityText(pet.notCompatibleWith).length > 0 ? (
                                        <ul className="space-y-2">
                                            {formatCompatibilityText(pet.notCompatibleWith).map((item, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <UserX className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                                                    <span className="text-sm">{item.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Chưa có thông tin</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="preferences" className="space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Sở thích thức ăn</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pet.foodPreferences ? (
                                        <div className="flex items-start gap-2">
                                            <Bone className="h-5 w-5 text-amber-500 mt-0.5" />
                                            <span className="text-sm">{pet.foodPreferences}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Chưa có thông tin về sở thích thức ăn</p>
                                    )}
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>Sở thích đồ chơi</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {pet.toyPreferences ? (
                                        <div className="flex items-start gap-2">
                                            <Gamepad2 className="h-5 w-5 text-indigo-500 mt-0.5" />
                                            <span className="text-sm">{pet.toyPreferences}</span>
                                        </div>
                                    ) : (
                                        <p className="text-sm text-muted-foreground">Chưa có thông tin về sở thích đồ chơi</p>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}