import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FieldValues } from "react-hook-form"
import * as z from "zod"
import { Save, X, Heart, MapPin, Calendar, Weight, Palette, Ruler, Shield, Award, Users, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { CloudinaryUpload } from "@/components/CloudinaryUpload"
import { useSelector } from "react-redux"
import { selectorAuth } from "@/store/modules/auth/selector"
import { toast } from "sonner"
import { petService } from "@/services/petService"
import ROUTES from "@/constants/routes"
import { Link } from "react-router-dom"

const petFormSchema = z.object({
    petName: z.string().min(1, "Tên thú cưng là bắt buộc"),
    categoryId: z.number().min(0, "Loại thú cưng là bắt buộc"),
    breedId: z.number().optional(),
    age: z.string().min(1, "Độ tuổi là bắt buộc"),
    gender: z.string().min(1, "Giới tính là bắt buộc"),
    size: z.string().min(1, "Kích thước là bắt buộc"),
    weight: z.number().optional(),
    location: z.string().min(1, "Địa điểm là bắt buộc"),
    isVaccinated: z.boolean().default(false),
    isNeutered: z.boolean().default(false),
    isTrained: z.boolean().default(false),
    healthStatus: z.string().min(1, "Tình trạng sức khỏe là bắt buộc"),
    personality: z.string().optional(),
    adoptionStatus: z.string().min(1, "Trạng thái nhận nuôi là bắt buộc"),
    foodPreferences: z.string().optional(),
    toyPreferences: z.string().optional(),
    compatibleWith: z.string().optional(),
    notCompatibleWith: z.string().optional(),
    description: z.string().optional(),
    primaryImageUrl: z.string().min(1, "Ảnh đại diện là bắt buộc"),
    additionalImageUrls: z.array(z.string()).optional(),
    createdByUserId: z.number().optional(),
})

export type PetFormValues = z.infer<typeof petFormSchema>

const mockPetCategories = [
    { categoryId: 1, categoryName: "Chó" },
    { categoryId: 2, categoryName: "Mèo" },
    { categoryId: 3, categoryName: "Thỏ" },
    { categoryId: 4, categoryName: "Chim" },
]

export default function AddPetPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const userInfo = useSelector(selectorAuth.userInfo);
    const [resetKey, setResetKey] = useState(0)

    const form = useForm<z.infer<typeof petFormSchema>>({
        resolver: zodResolver(petFormSchema),
        defaultValues: {
            petName: "",
            categoryId: 0,
            breedId: 1,
            gender: "",
            age: "",
            size: "",
            weight: 0,
            location: "",
            isVaccinated: false,
            isNeutered: false,
            isTrained: false,
            healthStatus: "",
            personality: "",
            adoptionStatus: "",
            foodPreferences: "",
            toyPreferences: "",
            compatibleWith: "",
            notCompatibleWith: "",
            description: "",
            primaryImageUrl: "",
            additionalImageUrls: [],
            createdByUserId: 0,
        },
    })

    const handleSubmit = async (values: PetFormValues) => {
        setIsSubmitting(true)
        try {
            const { createdByUserId, ...restValues } = values

            const payload = {
                ...restValues,
                categoryId: Number(values.categoryId),
                breedId: 1,
                age: values.age,
                weight: Number(values.weight),
                primaryImageUrl: values.primaryImageUrl,
                additionalImageUrls: values.additionalImageUrls || [],
                createdByUserId: userInfo.userId,
            }


            // Call the actual API service
            const response = await petService.createPet(payload)

            console.log("Pet created successfully:", response)

            // Show success notification
            toast.success("Thú cưng đã được tạo thành công!")

            // Reset form after successful creation
            form.reset()
            setResetKey(prev => prev + 1)

            // Optional: Navigate to pet list or pet detail page
            // navigate('/pets') // if using react-router

        } catch (error) {
            console.error("Failed to add pet:", error)

            // Show error notification
            toast.error(error?.response?.data?.message || "Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.")

            form.setError("root", {
                message: error?.response?.data?.message || "Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen">
            <div className="">
                {/* Header Section */}
                <div className="mb-8">
                    <Breadcrumb className="mb-6">
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link to={ROUTES.STAFF.MANAGE_PETS} className="text-blue-600 hover:text-blue-800">
                                    Thú cưng
                                </Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage className="text-gray-600">Thêm thú cưng mới</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>

                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                            <Heart className="h-8 w-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">Thêm thú cưng mới</h1>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Điền thông tin chi tiết về thú cưng để giúp chúng tìm được gia đình yêu thương
                        </p>
                    </div>
                </div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                        {/* Image Upload Section */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Award className="h-6 w-6" />
                                    Hình ảnh thú cưng
                                </CardTitle>
                                <CardDescription className="text-blue-100">Thêm ảnh đẹp để thu hút người nhận nuôi</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="lg:col-span-1">
                                        <FormField
                                            control={form.control}
                                            name="primaryImageUrl"
                                            render={({ field }) => (<FormItem>
                                                <FormLabel className="text-lg font-semibold text-gray-700">Ảnh đại diện</FormLabel>
                                                <FormDescription className="text-gray-500 mb-4">
                                                    Ảnh chính sẽ hiển thị đầu tiên trong danh sách
                                                </FormDescription>
                                                <FormControl>
                                                    <CloudinaryUpload
                                                        onImageUploaded={(url) => {
                                                            if (url && url.trim() !== "") {
                                                                field.onChange(url);
                                                            }
                                                        }}
                                                        defaultImage={field.value || ""}
                                                        isPrimary={true}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                            )}
                                        />
                                    </div>
                                    <div className="lg:col-span-2">
                                        <FormField
                                            control={form.control}
                                            name="additionalImageUrls"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-lg font-semibold text-gray-700">Ảnh bổ sung</FormLabel>
                                                    <FormDescription className="text-gray-500 mb-4">
                                                        Add more images to show details about the pet
                                                    </FormDescription>
                                                    <FormControl>
                                                        <div className="space-y-6">
                                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                                                {/* Upload button always visible in first column */}
                                                                <div className="md:col-span-2">
                                                                    <CloudinaryUpload
                                                                        key={`additional-${resetKey}`}
                                                                        onImageUploaded={(url) => {
                                                                            if (url && url.trim() !== "") {
                                                                                const newUrls = Array.isArray(field.value) ? [...field.value] : []
                                                                                newUrls.push(url)
                                                                                field.onChange(newUrls)
                                                                            }
                                                                        }}
                                                                    />
                                                                </div>

                                                                {/* Grid of uploaded images */}
                                                                {Array.isArray(field.value) && field.value.length > 0 && (
                                                                    <div className="md:col-span-2">
                                                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                                                            <div className="flex items-center justify-between mb-3">
                                                                                <h4 className="font-medium text-gray-700">
                                                                                    Ảnh đã tải lên ({field.value.length})
                                                                                </h4>
                                                                            </div>
                                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                                                                {field.value.map((url, index) => (
                                                                                    <div key={index} className="relative group">                                                                                    <img
                                                                                        src={url}
                                                                                        alt={`Pet image ${index + 1}`}
                                                                                        className="w-full h-24 object-cover rounded-lg border-2 border-gray-200 group-hover:border-blue-400 transition-colors"
                                                                                        onError={(e) => {
                                                                                            // Fallback if the image URL is invalid
                                                                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                                                        }}
                                                                                    />
                                                                                        <Button
                                                                                            type="button"
                                                                                            variant="destructive"
                                                                                            size="icon"
                                                                                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                                                            onClick={() => {
                                                                                                const newUrls = field.value?.filter((_, i) => i !== index)
                                                                                                field.onChange(newUrls)
                                                                                            }}
                                                                                        >
                                                                                            <X className="h-3 w-3" />
                                                                                        </Button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {Array.isArray(field.value) && field.value.length > 0 && (
                                                                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                                                                    <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            width="16"
                                                                            height="16"
                                                                            viewBox="0 0 24 24"
                                                                            fill="none"
                                                                            stroke="currentColor"
                                                                            strokeWidth="2"
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            className="lucide lucide-check-circle"
                                                                        >
                                                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                                                                            <polyline points="22 4 12 14.01 9 11.01" />
                                                                        </svg>
                                                                        Uploaded {field.value.length} additional images
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Basic Information */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Heart className="h-6 w-6" />
                                    Thông tin cơ bản
                                </CardTitle>
                                <CardDescription className="text-green-100">Thông tin chính về thú cưng</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <FormField
                                            control={form.control}
                                            name="petName"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                        <Heart className="h-4 w-4 text-red-500" />
                                                        Tên thú cưng
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nhập tên thú cưng"
                                                            className="h-12 text-base border-2 focus:border-blue-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="categoryId"
                                                render={({ field }) => (
                                                    <FormItem className="w-full">
                                                        <FormLabel className="text-base font-semibold">Loại thú cưng</FormLabel>
                                                        <Select
                                                            onValueChange={(value) => field.onChange(Number.parseInt(value))}
                                                            defaultValue={field.value.toString()}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn loại" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {mockPetCategories.map((category) => (
                                                                    <SelectItem key={category.categoryId} value={category.categoryId.toString()}>
                                                                        {category.categoryName}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="age"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Calendar className="h-4 w-4 text-indigo-500" />
                                                            Độ tuổi
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn độ tuổi" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Chưa trưởng thành">Chưa trưởng thành</SelectItem>
                                                                <SelectItem value="Trưởng thành">Trưởng thành</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="gender"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-base font-semibold">Giới tính</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn giới tính" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Đực">Đực</SelectItem>
                                                                <SelectItem value="Cái">Cái</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="weight"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Weight className="h-4 w-4 text-purple-500" />
                                                            Cân nặng (kg)
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                placeholder="Nhập cân nặng"
                                                                className="h-12 border-2 focus:border-blue-400"
                                                                {...field}
                                                                onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="size"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Ruler className="h-4 w-4 text-orange-500" />
                                                            Kích thước
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn kích thước" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Nhỏ">Nhỏ</SelectItem>
                                                                <SelectItem value="Trung bình">Trung bình</SelectItem>
                                                                <SelectItem value="Lớn">Lớn</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="color"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Palette className="h-4 w-4 text-pink-500" />
                                                            Màu sắc
                                                        </FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                placeholder="Nhập màu sắc"
                                                                className="h-12 border-2 focus:border-blue-400"
                                                                {...field}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                        <MapPin className="h-4 w-4 text-red-500" />
                                                        Địa điểm
                                                    </FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nhập địa điểm"
                                                            className="h-12 border-2 focus:border-blue-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid grid-cols-2 gap-4">

                                            <FormField
                                                control={form.control}
                                                name="healthStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Shield className="h-4 w-4 text-green-500" />
                                                            Tình trạng sức khỏe
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn tình trạng" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Tốt">Tốt</SelectItem>
                                                                <SelectItem value="Bình thường">Bình thường</SelectItem>
                                                                <SelectItem value="Cần chăm sóc đặc biệt">Cần chăm sóc đặc biệt</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="adoptionStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="flex items-center gap-2 text-base font-semibold">
                                                            <Home className="h-4 w-4 text-blue-500" />
                                                            Trạng thái nhận nuôi
                                                        </FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger className="h-12 border-2 focus:border-blue-400">
                                                                    <SelectValue placeholder="Chọn trạng thái" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Có thể nhận nuôi">Có thể nhận nuôi</SelectItem>
                                                                <SelectItem value="Đang xử lý">Đang xử lý</SelectItem>
                                                                <SelectItem value="Đã nhận nuôi">Đã nhận nuôi</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>

                                        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                                            <h3 className="font-semibold text-gray-700 mb-4">Tình trạng chăm sóc</h3>
                                            <div className="grid grid-cols-1 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="isVaccinated"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" />
                                                            </FormControl>
                                                            <FormLabel className="text-base font-medium">✅ Đã tiêm vaccine</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="isNeutered"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" />
                                                            </FormControl>
                                                            <FormLabel className="text-base font-medium">✂️ Đã triệt sản</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={form.control}
                                                    name="isTrained"
                                                    render={({ field }) => (
                                                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                                                            <FormControl>
                                                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-5 w-5" />
                                                            </FormControl>
                                                            <FormLabel className="text-base font-medium">🎓 Đã huấn luyện</FormLabel>
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <FormField
                                            control={form.control}
                                            name="personality"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Tính cách</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            placeholder="Nhập tính cách thú cưng"
                                                            className="h-12 border-2 focus:border-blue-400"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-semibold">Mô tả</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Nhập mô tả về thú cưng"
                                                            className="resize-none border-2 focus:border-blue-400"
                                                            rows={4}
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormDescription>Mô tả chi tiết về thú cưng và các thông tin khác</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Preferences Section */}
                        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                            <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-t-lg">
                                <CardTitle className="flex items-center gap-2 text-xl">
                                    <Users className="h-6 w-6" />
                                    Sở thích & Tương thích
                                </CardTitle>
                                <CardDescription className="text-purple-100">
                                    Thông tin về sở thích và khả năng tương thích
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="foodPreferences"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">Sở thích ăn uống</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập sở thích ăn uống"
                                                        className="h-12 border-2 focus:border-blue-400"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="toyPreferences"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">Sở thích đồ chơi</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập sở thích đồ chơi"
                                                        className="h-12 border-2 focus:border-blue-400"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="compatibleWith"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">Tương thích với</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Trẻ em, người lớn tuổi, thú cưng khác..."
                                                        className="h-12 border-2 focus:border-blue-400"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>Ví dụ: trẻ em, người lớn tuổi, thú cưng khác...</FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="notCompatibleWith"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-semibold">Không tương thích với</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Nhập những đối tượng không tương thích"
                                                        className="h-12 border-2 focus:border-blue-400"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error Display */}
                        {form.formState.errors.root && (
                            <div className="rounded-xl bg-red-50 border-2 border-red-200 p-4">
                                <div className="flex items-center gap-2 text-red-700">
                                    <X className="h-5 w-5" />
                                    <span className="font-medium">{form.formState.errors.root.message}</span>
                                </div>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex justify-center gap-4 pt-8">
                            <Button
                                type="button"
                                variant="outline"
                                size="lg"
                                className="px-8 py-3 text-base border-2 hover:bg-gray-50"
                                onClick={() => window.history.back()}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                disabled={isSubmitting}
                                size="lg"
                                className="px-8 py-3 text-base bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-200"
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center gap-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                        Đang lưu...
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Save className="h-5 w-5" />
                                        Lưu thú cưng
                                    </div>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
