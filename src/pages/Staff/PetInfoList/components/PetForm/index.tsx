import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'

// Define the form schema with zod
const petFormSchema = z.object({
  name: z.string().min(1, 'Tên thú cưng là bắt buộc'),
  image: z.string().optional(),
  gender: z.string().min(1, 'Giới tính là bắt buộc'),
  age: z.string().min(1, 'Độ tuổi là bắt buộc'),
  location: z.string().min(1, 'Địa điểm là bắt buộc'),
  breed: z.string().min(1, 'Giống là bắt buộc'),
  type: z.string().min(1, 'Loại thú cưng là bắt buộc'),
  description: z.string().optional(),
})

export type PetFormValues = z.infer<typeof petFormSchema>

interface PetFormProps {
  defaultValues?: Partial<PetFormValues>
  onSubmit: (values: PetFormValues) => void
  isSubmitting?: boolean
}

export function PetForm({ defaultValues, onSubmit, isSubmitting = false }: PetFormProps) {
  const form = useForm<PetFormValues>({
    resolver: zodResolver(petFormSchema),
    defaultValues: {
      name: '',
      image: '',
      gender: '',
      age: '',
      location: '',
      breed: '',
      type: '',
      description: '',
      ...defaultValues,
    },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hình ảnh URL</FormLabel>
              <FormControl>
                <Input placeholder="Nhập URL hình ảnh" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Loại thú cưng</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại thú cưng" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="dog">Chó</SelectItem>
                    <SelectItem value="cat">Mèo</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="breed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Giống</FormLabel>
                <FormControl>
                  <Input placeholder="Nhập giống thú cưng" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn độ tuổi" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Sơ sinh">Sơ sinh</SelectItem>
                    <SelectItem value="Nhỏ">Nhỏ</SelectItem>
                    <SelectItem value="Trưởng thành">Trưởng thành</SelectItem>
                    <SelectItem value="Già">Già</SelectItem>
                  </SelectContent>
                </Select>
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
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Đang xử lý...' : 'Lưu'}
          </Button>
        </div>
      </form>
    </Form>
  )
}