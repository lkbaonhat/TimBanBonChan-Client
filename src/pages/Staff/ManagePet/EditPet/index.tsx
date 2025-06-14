import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ROUTES from '@/constants/routes'
import { petService } from '@/services/petService'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { PetForm, PetFormValues } from '../PetForm'
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'


export default function EditPetPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()

  const [pet, setPet] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchPet = async () => {
      if (!slug) {
        setError('Không tìm thấy slug của thú cưng')
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const response = await petService.getPetBySlug(slug)

        if (response.status === 200) {
          let petData
          if (response.data && response.data.data) {
            petData = response.data.data
          } else if (response.data && typeof response.data === 'object' && 'petId' in response.data) {
            petData = response.data
          } else {
            throw new Error('Invalid response format from server')
          }

          if (!petData || !petData.petId) {
            throw new Error('Invalid pet data received')
          }

          setPet(petData)
        } else {
          throw new Error('Failed to fetch pet data')
        }
      } catch (error: any) {
        console.error('Failed to fetch pet:', error)
        setError(error.message || 'Không thể tải thông tin thú cưng')
      } finally {
        setIsLoading(false)
      }
    }

    fetchPet()
  }, [slug])

  const handleSubmit = async (values: PetFormValues) => {
    if (!pet) return

    setIsSubmitting(true)
    try {
      const response = await petService.updatePet(pet.petId, values)

      if (response.status === 200) {
        navigate(ROUTES.STAFF.MANAGE_PETS, {
          state: {
            notification: {
              type: 'success',
              message: '✅ Cập nhật thú cưng thành công!'
            }
          }
        })
      } else {
        throw new Error('Failed to update pet')
      }
    } catch (error: any) {
      console.error('Failed to update pet:', error)
      setError(error.message || 'Không thể cập nhật thú cưng')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Đang tải dữ liệu</h3>
            <p className="text-gray-600 text-center">Vui lòng đợi trong giây lát...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !pet) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <Card className="w-96">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <span className="text-2xl">😞</span>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Không tìm thấy thú cưng</h3>
            <p className="text-gray-600 text-center mb-6">{error || 'Thú cưng không tồn tại hoặc đã bị xóa'}</p>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.STAFF.MANAGE_PETS)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại danh sách
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const defaultValues: Partial<PetFormValues> = {
    petName: pet.petName || '',
    categoryId: pet.categoryId || 0,
    age: pet.age || '',
    gender: pet.gender || '',
    size: pet.size || '',
    color: pet.color || '',
    weight: pet.weight || 0,
    location: pet.location || '',
    healthStatus: pet.healthStatus || '',
    isVaccinated: pet.isVaccinated || false,
    isNeutered: pet.isNeutered || false,
    primaryImageUrl: pet.petImageUrls || '',
    additionalImageUrls: pet.additionalImageUrls || [],
    personality: pet.personality || '',
    description: pet.description || '',
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
            <BreadcrumbPage className="font-medium">{pet.petName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <PetForm
        mode="edit"
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </>
  )
}