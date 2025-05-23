import { useState, useEffect } from 'react'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb'
import { PetForm, PetFormValues } from '../PetInfoList/components/PetForm'
import { useSelector, useDispatch } from 'react-redux'
import { selectorGlobal } from '@/store/modules/global/selector'
import ROUTES from '@/constants/routes'

export default function EditPetPage() {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const listPet = useSelector(selectorGlobal.listPet)

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [pet, setPet] = useState<any>(null)

    useEffect(() => {
        if (id && listPet.length > 0) {
            const foundPet = listPet.find(pet => pet.petId.toString() === id)
            if (foundPet) {
                setPet(foundPet)
            } else {
                // If pet not found, fetch it or redirect
                navigate(ROUTES.STAFF.MANAGE_PETS)
            }
        } else {
            dispatch({ type: 'GET_ALL_PETS' })
        }
    }, [id, listPet, dispatch, navigate])

    const handleSubmit = async (values: PetFormValues) => {
        setIsSubmitting(true)
        try {
            // In a real app, you would make an API call here
            // For now, we'll simulate a delay
            await new Promise(resolve => setTimeout(resolve, 1000))

            const updatedPet = {
                ...pet,
                petName: values.name,
                petImageUrls: values.image,
                gender: values.gender,
                age: values.age,
                location: values.location,
                breed: values.breed,
                categoryName: values.type === 'dog' ? 'Chó' : values.type === 'cat' ? 'Mèo' : 'Khác',
                description: values.description || ''
            }

            // Update pet in store/API
            dispatch({
                type: 'UPDATE_PET',
                payload: { id: pet.petId, data: updatedPet },
                callback: (isSuccess: boolean) => {
                    if (isSuccess) {
                        navigate(ROUTES.STAFF.MANAGE_PETS, {
                            state: {
                                notification: {
                                    type: 'success',
                                    message: 'Cập nhật thú cưng thành công'
                                }
                            }
                        })
                    }
                }
            })
        } catch (error) {
            console.error('Failed to update pet:', error)
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!pet) {
        return (
            <div className="container mx-auto p-6">
                <div className="flex items-center justify-center h-64">
                    <p>Đang tải thông tin thú cưng...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="container mx-auto p-6">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff">Trang chủ</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbLink href="/staff/manage-pets">Quản lý thú cưng</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>Chỉnh sửa thú cưng</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

            <div className="flex items-center justify-between mb-6">
                <Button variant="outline" onClick={() => navigate(-1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Quay lại
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Chỉnh sửa thông tin thú cưng</CardTitle>
                    <CardDescription>Cập nhật thông tin chi tiết về thú cưng.</CardDescription>
                </CardHeader>
                <CardContent>
                    <PetForm
                        defaultValues={{
                            name: pet.petName,
                            image: pet.petImageUrls,
                            gender: pet.gender,
                            age: pet.age,
                            location: pet.location,
                            breed: pet.breed,
                            type: pet.categoryName?.toLowerCase() === 'chó' ? 'dog' :
                                pet.categoryName?.toLowerCase() === 'mèo' ? 'cat' : 'other',
                            description: pet.description || '',
                        }}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
