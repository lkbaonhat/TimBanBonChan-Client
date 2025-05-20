import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Save, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { CloudinaryUpload } from '@/components/CloudinaryUpload'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import ROUTES from '@/constants/routes'
import { useSelector } from 'react-redux'
import { selectorGlobal } from '@/store/modules/global/selector'

// Define the form schema with zod
const petFormSchema = z.object({
    petName: z.string().min(1, 'Tên thú cưng là bắt buộc'),
    categoryId: z.number().min(0, 'Loại thú cưng là bắt buộc'),
    breedId: z.number().min(0, 'Giống là bắt buộc'),
    age: z.number().min(0, 'Độ tuổi là bắt buộc'),
    ageUnit: z.string().min(1, 'Đơn vị tuổi là bắt buộc'),
    gender: z.string().min(1, 'Giới tính là bắt buộc'),
    size: z.string().min(1, 'Kích thước là bắt buộc'),
    color: z.string().min(1, 'Màu sắc là bắt buộc'),
    weight: z.number().min(0, 'Cân nặng là bắt buộc'),
    location: z.string().min(1, 'Địa điểm là bắt buộc'),
    isVaccinated: z.boolean().default(false),
    isNeutered: z.boolean().default(false),
    isTrained: z.boolean().default(false),
    healthStatus: z.string().min(1, 'Tình trạng sức khỏe là bắt buộc'),
    personality: z.string().optional(),
    adoptionStatus: z.string().min(1, 'Trạng thái nhận nuôi là bắt buộc'),
    foodPreferences: z.string().optional(),
    toyPreferences: z.string().optional(),
    compatibleWith: z.string().optional(),
    notCompatibleWith: z.string().optional(),
    description: z.string().optional(), avatarImage: z.object({
        imageUrl: z.string().min(1, 'Ảnh đại diện là bắt buộc'),
    }),
    otherImages: z.array(
        z.object({
            imageUrl: z.string().min(1, 'Đường dẫn hình ảnh là bắt buộc'),
        })
    ).optional().default([]),
    createdByUserId: z.number().optional()
})

// Define the form values type from the zod schema
export type PetFormValues = z.infer<typeof petFormSchema>

export function AddPetPage() {
    const navigate = useNavigate()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const petCategories = useSelector(selectorGlobal.petCategories)

    // Type-safe form definition with generic parameter
    const form = useForm<PetFormValues>({
        resolver: zodResolver(petFormSchema) as any, // Cast to any to resolve typing issues
        defaultValues: {
            petName: '',
            categoryId: 0,
            breedId: 0,
            gender: '',
            age: 0,
            ageUnit: '',
            size: '',
            color: '',
            weight: 0,
            location: '',
            isVaccinated: false,
            isNeutered: false,
            isTrained: false,
            healthStatus: '',
            personality: '',
            adoptionStatus: '',
            foodPreferences: '',
            toyPreferences: '',
            compatibleWith: '',
            notCompatibleWith: '',
            description: '', avatarImage: { imageUrl: '' },
            otherImages: [],
            createdByUserId: 0
        }
    })

    const handleSubmit = async (values: z.infer<typeof petFormSchema>) => {
        setIsSubmitting(true)
        try {
            // In a real app, you would make an API call here
            // Format values according to the API payload structure

            // Ensure we have proper numeric values
            const payload = {
                ...values,
                // Ensure these are proper numbers
                categoryId: Number(values.categoryId),
                breedId: Number(values.breedId),
                age: Number(values.age),
                weight: Number(values.weight),                // Kết hợp ảnh đại diện và các ảnh khác thành một mảng, với ảnh đại diện là isPrimary
                images: [
                    { ...values.avatarImage, isPrimary: true },
                    ...values.otherImages.map(img => ({ ...img, isPrimary: false }))
                ],
                createdByUserId: 0 // This would typically come from authentication context
            }

            // Simulate API call with a delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            console.log('Submitted pet data:', payload)

            // Navigate back to the pets list
            navigate(ROUTES.STAFF.MANAGE_PETS, {
                state: {
                    notification: {
                        type: 'success',
                        message: 'Thú cưng đã được tạo thành công!'
                    }
                }
            })
        } catch (error) {
            console.error('Failed to add pet:', error)
            form.setError('root', {
                message: 'Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.'
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div>
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to={ROUTES.STAFF.MANAGE_PETS}>Thú cưng</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Thêm thú cưng mới</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <Card>
                <CardHeader>
                    <CardTitle>Thông tin thú cưng</CardTitle>
                    <CardDescription>
                        Điền thông tin chi tiết về thú cưng cần được nhận nuôi.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleSubmit as any)} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-6">
                                    <FormField
                                        control={form.control}
                                        name="petName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tên thú cưng</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập tên thú cưng" {...field} />
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
                                                <FormItem>
                                                    <FormLabel>Loại thú cưng</FormLabel>
                                                    <Select
                                                        onValueChange={(value) => field.onChange(parseInt(value))}
                                                        defaultValue={field.value.toString()}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn loại thú cưng" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {petCategories.map((category) => (
                                                                <SelectItem
                                                                    key={category.categoryId}
                                                                    value={category.categoryId.toString()}
                                                                >
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
                                            name="breedId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giống</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Chọn giống thú cưng"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                                            name="gender"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Giới tính</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
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
                                            name="age"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Độ tuổi</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Nhập tuổi"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
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
                                            name="ageUnit"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Đơn vị tuổi</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Chọn đơn vị" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            <SelectItem value="Ngày">Ngày</SelectItem>
                                                            <SelectItem value="Tháng">Tháng</SelectItem>
                                                            <SelectItem value="Năm">Năm</SelectItem>
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
                                                    <FormLabel>Cân nặng (kg)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            placeholder="Nhập cân nặng"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
                                                    <FormLabel>Kích thước</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
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
                                                    <FormLabel>Màu sắc</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Nhập màu sắc" {...field} />
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
                                                <FormLabel>Địa điểm</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập địa điểm" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid grid-cols-3 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="isVaccinated"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="h-4 w-4"
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Đã tiêm vaccine</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="isNeutered"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="h-4 w-4"
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Đã triệt sản</FormLabel>
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="isTrained"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                    <FormControl>
                                                        <input
                                                            type="checkbox"
                                                            checked={field.value}
                                                            onChange={field.onChange}
                                                            className="h-4 w-4"
                                                        />
                                                    </FormControl>
                                                    <FormLabel>Đã huấn luyện</FormLabel>
                                                </FormItem>
                                            )}
                                        />
                                    </div>                                    <FormField
                                        control={form.control}
                                        name="personality"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tính cách</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập tính cách thú cưng" {...field} />
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
                                                <FormLabel>Mô tả</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Nhập mô tả về thú cưng"
                                                        className="resize-none"
                                                        rows={4}
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>
                                                    Mô tả chi tiết về thú cưng và các thông tin khác.
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>                                <div className="space-y-6">

                                    <FormField
                                        control={form.control}
                                        name="healthStatus"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Tình trạng sức khỏe</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Chọn tình trạng sức khỏe" />
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
                                                <FormLabel>Trạng thái nhận nuôi</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
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

                                    <FormField
                                        control={form.control}
                                        name="foodPreferences"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Sở thích ăn uống</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập sở thích ăn uống" {...field} />
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
                                                <FormLabel>Sở thích đồ chơi</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập sở thích đồ chơi" {...field} />
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
                                                <FormLabel>Tương thích với</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập những đối tượng tương thích" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    Ví dụ: trẻ em, người lớn tuổi, thú cưng khác...
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="notCompatibleWith"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Không tương thích với</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Nhập những đối tượng không tương thích" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormField
                                    control={form.control}
                                    name="avatarImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Ảnh đại diện</FormLabel>
                                            <FormControl>
                                                <CloudinaryUpload
                                                    onImageUploaded={(url) => {
                                                        field.onChange({ imageUrl: url });
                                                    }}
                                                    defaultImage={field.value?.imageUrl || ''}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Ảnh đại diện sẽ được hiển thị chính trên trang thú cưng.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="otherImages"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Các ảnh khác</FormLabel>
                                            <FormControl>
                                                <div className="space-y-4">
                                                    <CloudinaryUpload
                                                        onImageUploaded={(url) => {
                                                            const newImages = [...field.value];
                                                            newImages.push({ imageUrl: url });
                                                            field.onChange(newImages);
                                                        }}
                                                    />

                                                    {field.value && field.value.length > 0 && (
                                                        <div className="grid grid-cols-3 gap-2 mt-2">
                                                            {field.value.map((image, index) => (
                                                                <div key={index} className="relative">
                                                                    <img
                                                                        src={image.imageUrl}
                                                                        alt={`Pet image ${index + 1}`}
                                                                        className="w-full h-24 object-cover rounded-md"
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        className="absolute top-0 left-0 h-5 w-5"
                                                                        onClick={() => {
                                                                            const newImages = field.value.filter((_, i) => i !== index);
                                                                            field.onChange(newImages);
                                                                        }}
                                                                    >
                                                                        <X className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </FormControl>
                                            <FormDescription>
                                                Thêm các ảnh khác để hiển thị rõ hơn về thú cưng.
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {form.formState.errors.root && (
                                <div className="rounded-md bg-destructive/10 p-3 text-destructive text-sm">
                                    {form.formState.errors.root.message}
                                </div>
                            )}

                            <div className="flex justify-end gap-2">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className='bg-white'
                                    onClick={() => navigate(ROUTES.STAFF.MANAGE_PETS)}
                                >
                                    Hủy
                                </Button>
                                <Button type="submit" disabled={isSubmitting} className="gap-2">
                                    {isSubmitting ? 'Đang lưu...' : (
                                        <>
                                            <Save className="h-4 w-4" />
                                            Lưu thú cưng
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}