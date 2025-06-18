import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { selectorAuth } from '@/store/modules/auth/selector'
import { toast } from 'sonner'
import { petService } from '@/services/petService'
import ROUTES from '@/constants/routes'
import { PetForm, PetFormValues } from '../PetForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


export default function AddPetPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const userInfo: IREDUX.UserInfo = useSelector(selectorAuth.userInfo)
  const navigate = useNavigate()

  const handleSubmit = async (values: PetFormValues) => {
    setIsSubmitting(true)
    try {
      const payload = {
        ...values,
        categoryId: Number(values.categoryId),
        breedId: 1,
        weight: Number(values.weight) || 0,
        primaryImageUrl: values.primaryImageUrl,
        additionalImageUrls: values.additionalImageUrls || [],
        createdByUserId: userInfo.userId,
      }

      const response = await petService.createPet(payload)
      if (response.status === 201) {
        toast.success("🎉 Thú cưng đã được tạo thành công!")
      }

      // Navigate to manage pets page
      navigate(ROUTES.STAFF.MANAGE_PETS)

    } catch (error: any) {
      console.error("Failed to add pet:", error)
      toast.error(error?.response?.data?.message || "❌ Có lỗi xảy ra khi tạo thú cưng. Vui lòng thử lại.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <Link to={ROUTES.STAFF.MANAGE_PETS}>Thú cưng</Link>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-medium">Thêm thú cưng mới</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PetForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  )
}