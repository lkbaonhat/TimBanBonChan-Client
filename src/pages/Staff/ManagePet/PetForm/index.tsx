import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CloudinaryUpload } from '@/components/CloudinaryUpload'
import { Badge } from '@/components/ui/badge'
import {
  Heart,
  MapPin,
  Camera,
  Save,
  PawPrint,
  Info,
  Image as ImageIcon
} from 'lucide-react'

const petFormSchema = z.object({
  petName: z.string().min(1, "Tên thú cưng là bắt buộc"),
  categoryId: z.number().min(1, "Loại thú cưng là bắt buộc"),
  age: z.string().min(1, "Độ tuổi là bắt buộc"),
  gender: z.string().min(1, "Giới tính là bắt buộc"),
  size: z.string().min(1, "Kích thước là bắt buộc"),
  color: z.string().min(1, "Màu sắc là bắt buộc"),
  weight: z.number().optional(),
  location: z.string().min(1, "Địa điểm là bắt buộc"),
  healthStatus: z.string().min(1, "Tình trạng sức khỏe là bắt buộc"),
  isVaccinated: z.boolean().default(false),
  isNeutered: z.boolean().default(false),
  primaryImageUrl: z.string().min(1, "Ảnh đại diện là bắt buộc"),
  additionalImageUrls: z.array(z.string()).optional(),
  personality: z.string().optional(),
  description: z.string().optional(),
  breedId: z.number().default(1),
  adoptionStatus: z.string().default("Có thể nhận nuôi"),
  isTrained: z.boolean().default(false),
  createdByUserId: z.number().optional(),
})

export type PetFormValues = z.infer<typeof petFormSchema>

interface PetFormProps {
  defaultValues?: Partial<PetFormValues>
  onSubmit: (values: PetFormValues) => void
  isSubmitting?: boolean
  mode?: 'create' | 'edit'
}

const petCategories = [
  { categoryId: 1, categoryName: "Chó", icon: "🐕" },
  { categoryId: 2, categoryName: "Mèo", icon: "🐱" },
  { categoryId: 3, categoryName: "Thỏ", icon: "🐰" },
  { categoryId: 4, categoryName: "Chim", icon: "🐦" },
]

export function PetForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  mode = 'create'
}: PetFormProps) {
  const [selectedCategory, setSelectedCategory] = useState<number>(defaultValues?.categoryId || 0)

  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      petName: '',
      categoryId: 0,
      age: '',
      gender: '',
      size: '',
      color: '',
      weight: 0,
      location: '',
      healthStatus: '',
      isVaccinated: false,
      isNeutered: false,
      primaryImageUrl: '',
      additionalImageUrls: [],
      personality: '',
      description: '',
      breedId: 1,
      adoptionStatus: "Có thể nhận nuôi",
      isTrained: false,
      createdByUserId: 0,
      ...defaultValues,
    },
  })

  const handleSubmit = (values: PetFormValues) => {
    onSubmit(values)
  }

  return (
    <div className="min-h-screen py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-blue-100 rounded-full p-3 mr-3">
              <PawPrint className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {mode === 'edit' ? 'Chỉnh sửa thông tin pet' : 'Thêm thú cưng mới'}
            </h1>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">
            Điền thông tin chi tiết để giúp thú cưng tìm được gia đình mới
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">

            {/* Thông tin cơ bản */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Thông tin cơ bản
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="petName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Tên thú cưng <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ví dụ: Buddy, Mimi..."
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          Địa điểm <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ví dụ: Hà Nội, TP.HCM..."
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Loại thú cưng <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {petCategories.map((category) => (
                          <div
                            key={category.categoryId}
                            className={`relative p-4 border-2 rounded-xl cursor-pointer transition-all hover:shadow-md ${field.value === category.categoryId
                                ? 'border-blue-500 bg-blue-50 shadow-md'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                            onClick={() => {
                              field.onChange(category.categoryId)
                              setSelectedCategory(category.categoryId)
                            }}
                          >
                            <div className="text-center">
                              <div className="text-2xl mb-2">{category.icon}</div>
                              <div className="text-sm font-medium text-gray-700">
                                {category.categoryName}
                              </div>
                            </div>
                            {field.value === category.categoryId && (
                              <div className="absolute -top-2 -right-2">
                                <Badge className="bg-blue-500 text-white text-xs px-2 py-1">✓</Badge>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Độ tuổi <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500">
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

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Giới tính <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-11 border-gray-300 focus:border-blue-500">
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
                </div>
              </CardContent>
            </Card>

            {/* Đặc điểm ngoại hình */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <PawPrint className="h-5 w-5 mr-2 text-purple-600" />
                  Đặc điểm ngoại hình
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="size"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Kích thước <span className="text-red-500">*</span>
                      </FormLabel>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'Nhỏ', label: 'Nhỏ', desc: '< 10kg' },
                          { value: 'Trung bình', label: 'Trung bình', desc: '10-25kg' },
                          { value: 'Lớn', label: 'Lớn', desc: '> 25kg' }
                        ].map((size) => (
                          <div
                            key={size.value}
                            className={`p-3 border-2 rounded-lg cursor-pointer text-center transition-all hover:shadow-sm ${field.value === size.value
                                ? 'border-purple-500 bg-purple-50'
                                : 'border-gray-200 hover:border-gray-300'
                              }`}
                            onClick={() => field.onChange(size.value)}
                          >
                            <div className="font-medium text-sm">{size.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{size.desc}</div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="color"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Màu sắc <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Ví dụ: Nâu, Trắng, Đen trắng..."
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-medium text-gray-700">
                          Cân nặng (kg)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            placeholder="15"
                            className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                            onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Sức khỏe */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  Thông tin sức khỏe
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="healthStatus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tình trạng sức khỏe <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ví dụ: Khỏe mạnh, Tốt, Cần chăm sóc đặc biệt..."
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Tình trạng chăm sóc</h4>
                  <div className="space-y-3">
                    <FormField
                      control={form.control}
                      name="isVaccinated"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5"
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                            💉 Đã tiêm vaccine
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="isNeutered"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              className="h-5 w-5"
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                            ✂️ Đã triệt sản
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Hình ảnh */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <Camera className="h-5 w-5 mr-2 text-orange-600" />
                  Hình ảnh thú cưng
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="primaryImageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Ảnh đại diện <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
                          <CloudinaryUpload
                            onImageUploaded={(url) => {
                              if (url && url.trim() !== "") {
                                field.onChange(url);
                              }
                            }}
                            defaultImage={field.value || ""}
                            isPrimary={true}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalImageUrls"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700 flex items-center">
                        <ImageIcon className="h-4 w-4 mr-1" />
                        Ảnh bổ sung (tối đa 3 ảnh)
                      </FormLabel>
                      <FormControl>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-orange-400 transition-colors">
                          <CloudinaryUpload
                            onImageUploaded={(url) => {
                              if (url && url.trim() !== "") {
                                const currentImages = field.value || [];
                                if (currentImages.length < 3) {
                                  field.onChange([...currentImages, url]);
                                }
                              }
                            }}
                            isPrimary={false}
                            multiple={true}
                          />

                          {field.value && field.value.length > 0 && (
                            <div className="mt-4 grid grid-cols-3 gap-2">
                              {field.value.map((url, index) => (
                                <div key={index} className="relative group">
                                  <img
                                    src={url}
                                    alt={`Pet ${index + 1}`}
                                    className="w-full h-24 object-cover rounded-lg border-2 border-gray-200"
                                  />
                                  <button
                                    type="button"
                                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                    onClick={() => {
                                      const newImages = field.value?.filter((_, i) => i !== index) || [];
                                      field.onChange(newImages);
                                    }}
                                  >
                                    ×
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Thông tin bổ sung */}
            <Card className="shadow-sm border-0 bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center text-lg font-semibold text-gray-800">
                  <Info className="h-5 w-5 mr-2 text-indigo-600" />
                  Thông tin bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="personality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Tính cách
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Ví dụ: Thân thiện, hiền lành, năng động..."
                          className="h-11 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
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
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Mô tả chi tiết
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Chia sẻ thêm về thú cưng này để giúp tìm được gia đình phù hợp..."
                          className="resize-none border-gray-300 focus:border-blue-500 focus:ring-blue-500 min-h-[100px]"
                          rows={4}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Submit Button */}
            <div className="flex justify-center pt-4 pb-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {mode === 'edit' ? 'Cập nhật thông tin' : 'Thêm thú cưng'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}