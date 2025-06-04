import { Button } from '@/components/ui/button'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import ROUTES from '@/constants/routes'

interface EditPetDialogProps {
  pet: any
  onPetUpdated: (id: number, updatedPet: any) => void
  trigger?: React.ReactNode
}

export function EditPetDialog({ pet, trigger }: EditPetDialogProps) {
  const navigate = useNavigate()

  const handleEdit = () => {
    // Navigate to the edit page with the pet ID
    navigate(`/staff/manage-pets/${pet.petId}/edit`)
  }

  return (
    <>
      {trigger ? (
        <div onClick={handleEdit}>
          {trigger}
        </div>
      ) : (
        <Button variant="outline" onClick={handleEdit}>Chỉnh sửa</Button>
      )}
    </>
  )
}